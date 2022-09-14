package service

import (
	"context"
	"fmt"
	"time"
	"toucan-leaderboard/app/service-main/internal/model"
	"toucan-leaderboard/common/library/log"
	"toucan-leaderboard/ent"
	"toucan-leaderboard/ent/tgonft"
)

func (s *MainService) loadMonthlyNFTs(ctx context.Context) (err error) {
	for month := 1; month < 9; month++ {
		// get start time and end time of the month
		startTime := time.Date(2022, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDay := startTime.AddDate(0, 1, -1)
		endTime := time.Date(2022, endDay.Month(), endDay.Day(), 23, 59, 59, 0, time.UTC)
		var leaderboard []*model.User
		leaderboard, err = s.buildLeaderboard(ctx, startTime, endTime)
		if err != nil {
			log.Errorc(ctx, "[loadMonthlyNFTs] buildLeaderboard error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
			return
		}
		var tGoNFTCreates []*ent.TGoNFTCreate
		for rank, user := range leaderboard {
			tGoNFTCreates = append(tGoNFTCreates, s.data.DB.TGoNFT.Create().
				SetWalletPub(user.WalletPub).
				SetRankType(0).
				SetRankYear(2022).
				SetRankSeason(month).
				SetRank(rank+1),
			)
		}
		_, err = s.data.DB.TGoNFT.CreateBulk(tGoNFTCreates...).Save(ctx)
		if err != nil {
			err = fmt.Errorf("CreateBulk error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
			log.Errorc(ctx, "[loadMonthlyNFTs] %+v", err)
			err = nil
			return
		}
	}
	return
}

func (s *MainService) loadQuarterlyNFTs(ctx context.Context) (err error) {
	for quarter := 1; quarter < 3; quarter++ {
		// get start time and end time of the quarter
		startTime := time.Date(2022, time.Month((quarter-1)*3+1), 1, 0, 0, 0, 0, time.UTC)
		endDay := startTime.AddDate(0, 3, -1)
		endTime := time.Date(2022, endDay.Month(), endDay.Day(), 23, 59, 59, 0, time.UTC)
		var leaderboard []*model.User
		leaderboard, err = s.buildLeaderboard(ctx, startTime, endTime)
		if err != nil {
			log.Errorc(ctx, "[loadQuarterlyNFTs] buildLeaderboard error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
			return
		}
		var tGoNFTCreates []*ent.TGoNFTCreate
		for rank, user := range leaderboard {
			tGoNFTCreates = append(tGoNFTCreates, s.data.DB.TGoNFT.Create().
				SetWalletPub(user.WalletPub).
				SetRankType(1).
				SetRankYear(2022).
				SetRankSeason(quarter).
				SetRank(rank+1),
			)
		}
		_, err = s.data.DB.TGoNFT.CreateBulk(tGoNFTCreates...).Save(ctx)
		if err != nil {
			err = fmt.Errorf("CreateBulk error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
			log.Errorc(ctx, "[loadQuarterlyNFTs] %+v", err)
			err = nil
			return
		}
	}
	return
}

func (s *MainService) loadAddressToAvailableNFTListMap(ctx context.Context) (err error) {
	tGoNFTList, err := s.data.DB.TGoNFT.Query().Where(tgonft.MintTxEQ("")).All(ctx)
	if err != nil {
		log.Errorc(ctx, "[loadAddressToAvailableNFTListMap] get available nft list from db error: %+v", err)
		return
	}
	addressToAvailableNFTListMap := make(map[string][]*ent.TGoNFT)
	for _, tGoNFT := range tGoNFTList {
		address := tGoNFT.WalletPub
		addressToAvailableNFTListMap[address] = append(addressToAvailableNFTListMap[address], tGoNFT)
	}
	s.addressToAvailableNFTListMap.Store(addressToAvailableNFTListMap)
	return
}
