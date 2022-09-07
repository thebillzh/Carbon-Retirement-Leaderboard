package service

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/shopspring/decimal"
	"github.com/wealdtech/go-ens/v3"
	"strconv"
	"time"
	"toucan-leaderboard/app/service-main/graph"
	"toucan-leaderboard/common/library/cron"
	"toucan-leaderboard/common/library/log"
	"toucan-leaderboard/ent"
	"toucan-leaderboard/ent/tgoretirement"
)

const (
	_retirementSkipCacheKey = "retirement_nct_skip"
	_retirementPageSize     = 1000
)

var (
	d2 = decimal.NewFromInt(1000000000000000000)
)

func (s *MainService) initJobs() {
	var err error
	_, err = s.cronUtil.AddFunc("@every 1h", s.loadRetirementData, "loadRetirementData")
	if err != nil {
		log.Fatal("[initJobs] init loadRetirementData error: %+v", err)
	}
	_, err = s.cronUtil.AddFunc("@every 1h", s.loadENS, "loadENS", cron.PreLoad())
	if err != nil {
		log.Fatal("[initJobs] init loadENS error: %+v", err)
	}
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

	for len(retirementList.GetRetirements()) > 0 {
		err = s.data.WithTx(ctx, func(tx *ent.Tx) (err error) {
			var tGoRetirementCreates []*ent.TGoRetirementCreate
			for _, retirement := range retirementList.GetRetirements() {
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
	return
}

func (s *MainService) loadENS(ctx context.Context) (err error) {
	tGoRetirements, err := s.data.DB.TGoRetirement.Query().Select(tgoretirement.FieldBeneficiaryAddress).All(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadENS] Query all retirements error: %+v", err)
		return
	}
	addressMap := make(map[string]struct{})
	for _, tGoRetirement := range tGoRetirements {
		addressMap[tGoRetirement.BeneficiaryAddress] = struct{}{}
	}
	for addressStr := range addressMap {
		if addressStr == "" || addressStr == "0x0000000000000000000000000000000000000000" {
			continue
		}
		address := common.HexToAddress(addressStr)
		byteCode, err := s.polygonClient.CodeAt(ctx, address, nil)
		if err != nil {
			log.Errorc(ctx, "[loadENS] CodeAt error: %+v, address: %s", err, addressStr)
			err = nil
			continue
		}
		isContract := len(byteCode) > 0
		if !isContract {
			domain, err := ens.ReverseResolve(s.ethereumClient, address)
			if err != nil && err.Error() != "not a resolver" {
				log.Errorc(ctx, "[loadENS] ReverseResolve error: %+v, address: %s", err, addressStr)
				err = nil
				continue
			}
			if domain != "" {
				if err = s.data.DB.TGoEns.Create().SetWalletPub(addressStr).SetEns(domain).OnConflict().UpdateEns().Exec(ctx); err != nil {
					log.Errorc(ctx, "[loadENS] Upsert Ens error: %+v, address: %s", err, addressStr)
					err = nil
					continue
				}
			}
		}
	}
	return
}
