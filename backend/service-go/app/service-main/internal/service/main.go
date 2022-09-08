package service

import "C"
import (
	"context"
	"github.com/Khan/genqlient/graphql"
	"github.com/ethereum/go-ethereum/ethclient"
	"net/http"
	"os"
	"sync/atomic"
	v1 "toucan-leaderboard/app/service-main/api/main/v1"
	"toucan-leaderboard/app/service-main/internal/biz"
	"toucan-leaderboard/app/service-main/internal/data"
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

	nctRetirementList atomic.Value
	addressToTUserMap atomic.Value
	addressToEnsMap   atomic.Value

	realtimeNCTLeaderboard atomic.Value
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
