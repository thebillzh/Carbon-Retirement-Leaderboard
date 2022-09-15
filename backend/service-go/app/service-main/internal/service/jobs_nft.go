package service

import (
	"context"
	"fmt"
	"strings"
	"time"
	"toucan-leaderboard/app/service-main/internal/model"
	"toucan-leaderboard/common/library/log"
	"toucan-leaderboard/ent"
	"toucan-leaderboard/ent/tgonft"
)

func (s *MainService) loadMonthlyNFTs(ctx context.Context) (err error) {
	lastMonth := time.Now().AddDate(0, 0, -1)
	// get start time and end time of the month
	startTime := time.Date(lastMonth.Year(), lastMonth.Month(), 1, 0, 0, 0, 0, time.UTC)
	endDay := startTime.AddDate(0, 1, -1)
	endTime := time.Date(lastMonth.Year(), endDay.Month(), endDay.Day(), 23, 59, 59, 0, time.UTC)
	var leaderboard []*model.User
	leaderboard, err = s.buildLeaderboard(ctx, startTime, endTime)
	if err != nil {
		log.Errorc(ctx, "[loadMonthlyNFTs] buildLeaderboard error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
		return
	}
	var tGoNFTCreates []*ent.TGoNFTCreate
	for rank, user := range leaderboard {
		tGoNFTCreates = append(tGoNFTCreates, s.data.DB.TGoNFT.Create().
			SetWalletPub(strings.ToLower(user.WalletPub)).
			SetRankType(0).
			SetRankYear(lastMonth.Year()).
			SetRankSeason(int(lastMonth.Month())).
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
	log.Infoc(ctx, "[loadMonthlyNFTs] monthly nft saved, len(tGoNFTCreates): %d", len(tGoNFTCreates))
	return
}

func (s *MainService) loadQuarterlyNFTs(ctx context.Context) (err error) {
	now := time.Now()
	quarter, year := int(now.Month())/3, now.Year()
	if int(now.Month()) < 3 {
		quarter = 4
		year -= 1
	}
	// get start time and end time of the quarter
	startTime := time.Date(year, time.Month((quarter-1)*3+1), 1, 0, 0, 0, 0, time.UTC)
	endDay := startTime.AddDate(0, 3, -1)
	endTime := time.Date(year, endDay.Month(), endDay.Day(), 23, 59, 59, 0, time.UTC)
	var leaderboard []*model.User
	leaderboard, err = s.buildLeaderboard(ctx, startTime, endTime)
	if err != nil {
		log.Errorc(ctx, "[loadQuarterlyNFTs] buildLeaderboard error: %+v, startTime: %+v, endTime: %+v", err, startTime, endTime)
		return
	}
	var tGoNFTCreates []*ent.TGoNFTCreate
	for rank, user := range leaderboard {
		tGoNFTCreates = append(tGoNFTCreates, s.data.DB.TGoNFT.Create().
			SetWalletPub(strings.ToLower(user.WalletPub)).
			SetRankType(1).
			SetRankYear(year).
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
	log.Infoc(ctx, "[loadMonthlyNFTs] quarterly nft saved, len(tGoNFTCreates): %d", len(tGoNFTCreates))
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
