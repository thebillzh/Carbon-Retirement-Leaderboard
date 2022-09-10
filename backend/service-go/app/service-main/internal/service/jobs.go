package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	cron3 "github.com/robfig/cron/v3"
	"github.com/shopspring/decimal"
	"github.com/wealdtech/go-ens/v3"
	"sort"
	"strconv"
	"strings"
	"time"
	"toucan-leaderboard/app/service-main/graph"
	"toucan-leaderboard/app/service-main/internal/model"
	"toucan-leaderboard/common/library/cron"
	"toucan-leaderboard/common/library/log"
	"toucan-leaderboard/common/library/sync/errgroup"
	"toucan-leaderboard/ent"
)

const (
	_retirementSkipCacheKey  = "retirement_nct_skip"
	_retirementPageSize      = 1000
	_nullAddress             = "0x0000000000000000000000000000000000000000"
	_latestNCTLeaderboardKey = "nct-latest"
)

var (
	d2 = decimal.NewFromInt(1000000000000000000)
)

func checkCronErr(entryId cron3.EntryID, err error) {
	if err != nil {
		log.Fatal("[initJobs] init %s error: %+v", entryId, err)
	}
}

func (s *MainService) initJobs() {
	checkCronErr(s.cronUtil.AddFunc("@every 5s", s.loadRetirementData, "loadRetirementData"))
	checkCronErr(s.cronUtil.AddFunc("@every 1h", s.loadENS, "loadENS"))
	checkCronErr(s.cronUtil.AddFunc("@every 15s", s.loadNCTRetirementList, "loadNCTRetirementList", cron.PreLoad()))
	checkCronErr(s.cronUtil.AddFunc("@every 5s", s.loadAddressToTUserMap, "loadAddressToTUserMap", cron.PreLoad()))
	checkCronErr(s.cronUtil.AddFunc("@every 15s", s.loadAddressToEnsMap, "loadAddressToEnsMap", cron.PreLoad()))
	checkCronErr(s.cronUtil.AddFunc("@every 30s", s.loadRealtimeNCTLeaderboard, "loadRealtimeNCTLeaderboard", cron.PreLoad()))
}

func (s *MainService) getNCTRedeemTokenList(ctx context.Context) (tokenList []string, err error) {
	redeemTokenList, err := graph.GetNCTRedeemTokenList(ctx, s.toucanGraphClient)
	if err != nil {
		err = fmt.Errorf("GetNCTRedeemTokenList error: %+v", err)
		return
	}
	tokenMap := make(map[string]struct{})
	for _, token := range redeemTokenList.GetRedeems() {
		tokenMap[token.Token.GetId()] = struct{}{}
	}
	for k := range tokenMap {
		tokenList = append(tokenList, k)
	}
	return
}

func (s *MainService) isContract(ctx context.Context, addressStr string) (isContract bool, err error) {
	if v, ok := s.addressToIsContractMap.Load(addressStr); ok {
		if isContract, ok = v.(bool); ok {
			return
		}
	}
	address := common.HexToAddress(addressStr)
	byteCode, err := s.polygonClient.CodeAt(ctx, address, nil)
	if err != nil {
		log.Errorc(ctx, "[isContract] CodeAt error: %+v, address: %s", err, addressStr)
		return
	}
	isContract = len(byteCode) > 0
	s.addressToIsContractMap.Store(addressStr, isContract)
	return
}

func (s *MainService) loadRetirementData(ctx context.Context) (err error) {
	// get the checkpoint from the database
	skipStr, err := s.data.GetCache(ctx, _retirementSkipCacheKey)
	if err != nil {
		log.Errorc(ctx, "[loadRetirementData] GetCache error: %+v, cacheKey: %+v", err, _retirementSkipCacheKey)
		return
	}
	var skip int64
	if skipStr != "" {
		skip, err = strconv.ParseInt(skipStr, 10, 64)
		if err != nil {
			log.Errorc(ctx, "[loadRetirementData] ParseInt error: %+v, skipStr: %s", err, skipStr)
			return
		}
	} else {
		// init the skip at first run
		if err = s.data.SetCache(ctx, _retirementSkipCacheKey, "0"); err != nil {
			log.Errorc(ctx, "[loadRetirementData] Init cache key: %+v error: %+v", _retirementSkipCacheKey, err)
			return
		}
	}

	// get token address list of nct
	tokenList, err := s.getNCTRedeemTokenList(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadRetirementData] getNCTRedeemTokenList error: %+v", err)
		return err
	}

	// get all retirements
	retirementList, err := graph.GetRetirementList(ctx, s.toucanGraphClient, tokenList, int(skip), _retirementPageSize)
	if err != nil {
		log.Errorc(ctx, "[loadRetirementData] GetRetirementList error: %+v", err)
		return err
	}

	addressMap := make(map[string]struct{}) // save all unique address for ens and profile check
	for len(retirementList.GetRetirements()) > 0 {
		err = s.data.WithTx(ctx, func(tx *ent.Tx) (err error) {
			var tGoRetirementCreates []*ent.TGoRetirementCreate
			for _, retirement := range retirementList.GetRetirements() {
				// save to address map
				address := retirement.Certificate.Beneficiary.GetId()
				if address == "" || address == _nullAddress {
					address = retirement.Creator.GetId()
				}
				addressMap[address] = struct{}{}

				// save raw data to db
				amount, err := decimal.NewFromString(retirement.GetAmount())
				if err != nil {
					log.Errorc(ctx, "[loadRetirementData] NewFromString error: %+v, raw amount: %+v", err, retirement.GetAmount())
					err = nil
					continue
				}
				amount = amount.Div(d2)
				timestamp, err := strconv.ParseInt(retirement.GetTimestamp(), 10, 64)
				if err != nil {
					log.Errorc(ctx, "[loadRetirementData] ParseInt error: %+v, raw amount: %+v", err, retirement.GetTimestamp())
					err = nil
					continue
				}
				tGoRetirementCreates = append(tGoRetirementCreates, tx.TGoRetirement.Create().
					SetCreationTx(retirement.GetCreationTx()).
					SetCreatorAddress(retirement.Creator.GetId()).
					SetBeneficiaryAddress(retirement.Certificate.Beneficiary.GetId()).
					SetAmount(amount.InexactFloat64()).
					SetTokenAddress(retirement.Token.GetAddress()).
					SetTokenName(retirement.Token.GetName()).
					SetTokenType("nct").
					SetRetirementTime(time.Unix(timestamp, 0)),
				)
			}
			if len(tGoRetirementCreates) > 0 {
				_, err = tx.TGoRetirement.CreateBulk(tGoRetirementCreates...).Save(ctx)
				if err != nil {
					return fmt.Errorf("CreateBulk error: %+v", err)
				}
			}
			skip = skip + int64(len(retirementList.GetRetirements()))
			err = s.data.SetCacheInTX(ctx, tx, _retirementSkipCacheKey, strconv.Itoa(int(skip)))
			if err != nil {
				return fmt.Errorf("SetCacheInTX error: %+v", err)
			}
			return
		})
		if err != nil {
			log.Errorc(ctx, "[loadRetirementData] tx error: %+v", err)
			err = nil
			return
		}
		retirementList, err = graph.GetRetirementList(ctx, s.toucanGraphClient, tokenList, int(skip), _retirementPageSize)
		if err != nil {
			log.Errorc(ctx, "[loadRetirementData] GetRetirementList error: %+v", err)
			err = nil
			return err
		}
	}

	// incrementally update ens
	for address := range addressMap {
		if err = s.checkAndSaveENS(ctx, address); err != nil {
			log.Errorc(ctx, "[loadRetirementData] checkAndSaveENS error: %+v", err)
		}
	}
	return
}

func (s *MainService) checkAndSaveENS(ctx context.Context, addressStr string) (err error) {
	if addressStr == "" || addressStr == _nullAddress {
		return
	}
	isContract, err := s.isContract(ctx, addressStr)
	if err != nil {
		err = fmt.Errorf("get isContract error: %+v", addressStr)
		return
	}
	if !isContract {
		address := common.HexToAddress(addressStr)
		var domain string
		domain, err = ens.ReverseResolve(s.ethereumClient, address)
		if err != nil && err.Error() != "not a resolver" {
			err = fmt.Errorf("ReverseResolve error: %+v, address: %s", err, addressStr)
			return
		}
		if domain != "" {
			if err = s.data.DB.TGoEns.Create().SetWalletPub(addressStr).SetEns(domain).OnConflict().UpdateEns().Exec(ctx); err != nil {
				err = fmt.Errorf("upsert Ens error: %+v, address: %s", err, addressStr)
				return
			}
		}
	}
	return
}

func (s *MainService) loadENS(ctx context.Context) (err error) {
	rawTGoRetirementList := s.nctRetirementList.Load()
	if rawTGoRetirementList == nil {
		err = errors.New("nctRetirementList not ready")
		log.Errorc(ctx, "[loadENS] %+v", err)
		return
	}
	var tGoRetirementList []*ent.TGoRetirement
	var ok bool
	if tGoRetirementList, ok = rawTGoRetirementList.([]*ent.TGoRetirement); !ok {
		err = fmt.Errorf("rawTGoRetirementList type error: %+v", rawTGoRetirementList)
		log.Errorc(ctx, "[loadENS] %+v", err)
		return
	}
	if err != nil {
		log.Errorc(ctx, "[loadENS] Query all retirements error: %+v", err)
		return
	}
	addressMap := make(map[string]struct{})
	for _, tGoRetirement := range tGoRetirementList {
		address := tGoRetirement.BeneficiaryAddress
		if address == "" || address == _nullAddress {
			address = tGoRetirement.CreatorAddress
		}
		addressMap[address] = struct{}{}
	}
	for addressStr := range addressMap {
		if err = s.checkAndSaveENS(ctx, addressStr); err != nil {
			log.Errorc(ctx, "[loadENS] checkAndSaveENS error: %+v", err)
		}
	}
	return
}

func (s *MainService) loadNCTRetirementList(ctx context.Context) (err error) {
	tGoRetirementList, err := s.data.DB.TGoRetirement.Query().All(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadNCTRetirementList] Query all retirements error: %+v", err)
		return
	}
	s.nctRetirementList.Store(tGoRetirementList)
	log.Infoc(ctx, "[loadNCTRetirementList] tGoRetirementList stored, len(%d)", len(tGoRetirementList))
	return
}

func (s *MainService) loadAddressToTUserMap(ctx context.Context) (err error) {
	addressToTUserMap := make(map[string]*ent.TUser)
	tUserList, err := s.data.DB.TUser.Query().All(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadAddressToTUserMap] Query all ens error: %+v", err)
		return
	}
	for _, tUser := range tUserList {
		addressToTUserMap[strings.ToLower(tUser.WalletPub)] = tUser
	}
	s.addressToTUserMap.Store(addressToTUserMap)
	log.Infoc(ctx, "[loadAddressToTUserMap] addressToTUserMap stored, len(%d)", len(addressToTUserMap))
	return
}

func (s *MainService) loadAddressToEnsMap(ctx context.Context) (err error) {
	addressToEnsMap := make(map[string]string)
	tGoEnsList, err := s.data.DB.TGoEns.Query().All(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadAddressToEnsMap] Query all ens error: %+v", err)
		return
	}
	for _, tGoEns := range tGoEnsList {
		addressToEnsMap[tGoEns.WalletPub] = tGoEns.Ens
	}
	s.addressToEnsMap.Store(addressToEnsMap)
	log.Infoc(ctx, "[loadAddressToEnsMap] addressToEnsMap stored, len(%d)", len(addressToEnsMap))
	return
}

func (s *MainService) buildLeaderboard(ctx context.Context, startTime time.Time, endTime time.Time) (leaderboard []*model.User, err error) {
	wg := errgroup.WithContext(ctx)

	// load all retirements from db and sort addressList by amount
	addressToRetiredAmountMap := make(map[string]float64)
	var addressList []string
	wg.Go(func(ctx context.Context) (err error) {
		rawTGoRetirementList := s.nctRetirementList.Load()
		if rawTGoRetirementList == nil {
			err = errors.New("nctRetirementList not ready")
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		var tGoRetirementList []*ent.TGoRetirement
		var ok bool
		if tGoRetirementList, ok = rawTGoRetirementList.([]*ent.TGoRetirement); !ok {
			err = fmt.Errorf("rawTGoRetirementList type error: %+v", rawTGoRetirementList)
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		for _, tGoRetirement := range tGoRetirementList {
			// filter with time
			if startTime.After(tGoRetirement.RetirementTime) || endTime.Before(tGoRetirement.RetirementTime) {
				continue
			}
			address := tGoRetirement.BeneficiaryAddress
			if address == "" || address == _nullAddress {
				address = tGoRetirement.CreatorAddress
			}
			isContract, err := s.isContract(ctx, address)
			if err != nil {
				err = fmt.Errorf("get isContract error: %+v", address)
				log.Errorc(ctx, "[buildLeaderboard] %+v", err)
				continue
			}
			if !isContract {
				newAmount := decimal.NewFromFloat(addressToRetiredAmountMap[address]).
					Add(decimal.NewFromFloat(tGoRetirement.Amount)).
					InexactFloat64()
				addressToRetiredAmountMap[address] = newAmount
			}
		}
		for address := range addressToRetiredAmountMap {
			addressList = append(addressList, address)
		}
		sort.SliceStable(addressList, func(i, j int) bool {
			return addressToRetiredAmountMap[addressList[i]] > addressToRetiredAmountMap[addressList[j]]
		})
		return
	})

	// load all TUser from db
	addressToTUserMap := make(map[string]*ent.TUser)
	wg.Go(func(ctx context.Context) (err error) {
		rawAddressToUserMap := s.addressToTUserMap.Load()
		if rawAddressToUserMap == nil {
			err = errors.New("nctRetirementList not ready")
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		var ok bool
		if addressToTUserMap, ok = rawAddressToUserMap.(map[string]*ent.TUser); !ok {
			err = fmt.Errorf("rawAddressToUserMap type error: %+v", rawAddressToUserMap)
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		return
	})

	// load all ens from db
	addressToEnsMap := make(map[string]string)
	wg.Go(func(ctx context.Context) (err error) {
		rawAddressToEnsMap := s.addressToEnsMap.Load()
		if rawAddressToEnsMap == nil {
			err = errors.New("nctRetirementList not ready")
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		var ok bool
		if addressToEnsMap, ok = rawAddressToEnsMap.(map[string]string); !ok {
			err = fmt.Errorf("rawAddressToEnsMap type error: %+v", rawAddressToEnsMap)
			log.Errorc(ctx, "[buildLeaderboard] %+v", err)
			return
		}
		return
	})
	if err = wg.Wait(); err != nil {
		log.Errorc(ctx, "[buildLeaderboard] wg.Wait error: %+v", err)
		return
	}

	for _, address := range addressList {
		user := &model.User{
			WalletPub:     address,
			RetiredAmount: addressToRetiredAmountMap[address],
		}
		if tUser, ok := addressToTUserMap[strings.ToLower(address)]; ok {
			user.Uname = tUser.Uname
		}
		if e, ok := addressToEnsMap[address]; ok {
			user.ENS = e
		}
		leaderboard = append(leaderboard, user)
	}
	return
}

func (s *MainService) loadRealtimeNCTLeaderboard(ctx context.Context) (err error) {
	realtimeNCTLeaderboard, err := s.buildLeaderboard(ctx, time.Time{}, time.Unix(253402185600, 0))
	if err != nil {
		log.Errorc(ctx, "[loadRealtimeNCTLeaderboard] buildLeaderboard error: %+v", err)
		return
	}
	s.leaderboardMap.Store(_latestNCTLeaderboardKey, realtimeNCTLeaderboard)
	log.Infoc(ctx, "[loadRealtimeNCTLeaderboard] realtimeNCTLeaderboard stored, len(%d)", len(realtimeNCTLeaderboard))
	return
}
