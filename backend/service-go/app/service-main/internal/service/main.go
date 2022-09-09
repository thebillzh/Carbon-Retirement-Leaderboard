package service

import "C"
import (
	"context"
	"fmt"
	"github.com/Khan/genqlient/graphql"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/shopspring/decimal"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"
	v1 "toucan-leaderboard/app/service-main/api/main/v1"
	"toucan-leaderboard/app/service-main/internal/biz"
	"toucan-leaderboard/app/service-main/internal/data"
	"toucan-leaderboard/app/service-main/internal/model"
	"toucan-leaderboard/common/library/cron"
	"toucan-leaderboard/common/library/log"
)

type MainService struct {
	v1.UnimplementedMainServer

	uc   *biz.MainUseCase
	data *data.Data

	cronUtil *cron.CronUtil

	ethereumClient    *ethclient.Client
	polygonClient     *ethclient.Client
	toucanGraphClient graphql.Client

	nctRetirementList      atomic.Value
	addressToTUserMap      atomic.Value
	addressToEnsMap        atomic.Value
	addressToIsContractMap sync.Map

	realtimeNCTLeaderboard atomic.Value
	leaderboardMap         sync.Map
}

const (
	toucanSubgraphUrl = "https://api.thegraph.com/subgraphs/name/toucanprotocol/matic" // Toucan Subgraph: https://thegraph.com/hosted-service/subgraph/toucanprotocol/matic
)

func NewMainService(uc *biz.MainUseCase, data *data.Data) (s *MainService) {
	// init ethereum client
	ethereumClient, err := ethclient.Dial(os.Getenv("ETHEREUM_NETWORK"))
	if err != nil {
		log.Fatal("[] Ethereum client dial error: %+v", err)
	}
	// init polygon client
	polygonClient, err := ethclient.Dial(os.Getenv("POLYGON_NETWORK"))
	if err != nil {
		log.Fatal("[] Polygon client dial error: %+v", err)
	}

	s = &MainService{
		uc:                uc,
		data:              data,
		cronUtil:          cron.NewCron(),
		ethereumClient:    ethereumClient,
		polygonClient:     polygonClient,
		toucanGraphClient: graphql.NewClient(toucanSubgraphUrl, http.DefaultClient),
	}

	// init cron jobs
	s.initJobs()
	return
}

func (s *MainService) Ping(ctx context.Context, req *v1.PingReq) (resp *v1.PingResp, err error) {
	log.Infoc(ctx, "[Ping] Ping Received")

	resp = &v1.PingResp{Res: "pong"}
	if req.GetMsg() == "error" {
		err = v1.ErrorBadRequest("bad msg: %s", req.GetMsg())
		return
	}
	return
}

func (s *MainService) GetLeaderboard(ctx context.Context, req *v1.GetLeaderboardReq) (resp *v1.GetLeaderboardResp, err error) {
	resp = &v1.GetLeaderboardResp{Type: "nct"}

	var leaderboard []*model.User
	var leaderboardKey string
	startTime, endTime := time.Time{}, time.Now()
	if req.GetStartTime() == "" && req.GetEndTime() == "" {
		leaderboardKey = _latestNCTLeaderboardKey
	} else {
		if req.GetStartTime() != "" {
			startTime, err = time.Parse("2006-01-02 15:04:05", req.GetStartTime())
			if err != nil {
				err = v1.ErrorBadRequest("invalid start_time: %s", req.GetStartTime())
				return
			}
		}
		if req.GetEndTime() != "" {
			endTime, err = time.Parse("2006-01-02 15:04:05", req.GetEndTime())
			if err != nil {
				err = v1.ErrorBadRequest("invalid end_time: %s", req.GetEndTime())
				return
			}
		}
		leaderboardKey = fmt.Sprintf("nct:%s:%s", startTime.Format("2006-01-02 15:04:05"), endTime.Format("2006-01-02 15:04:05"))
	}
	rawRealtimeNCTLeaderboard, ok := s.leaderboardMap.Load(leaderboardKey)
	if ok {
		leaderboard = rawRealtimeNCTLeaderboard.([]*model.User)
	}
	if leaderboard == nil {
		leaderboard, err = s.buildLeaderboard(ctx, startTime, endTime)
		if err != nil {
			log.Errorc(ctx, "[GetLeaderboard] buildLeaderboard error: %+v", err)
			err = v1.ErrorInternalServerError("error occurred when building leaderboard")
			return
		}
		// TODO: unpredictable memory usage
		s.leaderboardMap.Store(leaderboardKey, leaderboard)
	}

	for _, user := range leaderboard {
		resp.List = append(resp.List, &v1.LeaderboardItem{
			WalletPub:     user.WalletPub,
			Uname:         user.Uname,
			RetiredAmount: decimal.NewFromFloat(user.RetiredAmount).String(),
			Ens:           user.ENS,
		})
	}
	first := int64(100)
	if req.GetFirst() > 0 {
		first = req.GetFirst()
	}
	total := int64(len(resp.GetList()))
	if total > first {
		total = first
	}
	resp.List = resp.List[:total]
	return
}
