package data

import (
	"toucan-leaderboard/app/service-main/internal/biz"
)

type mainRepo struct {
	data *Data
}

func NewMainRepo(data *Data) biz.MainRepo {
	return &mainRepo{
		data: data,
	}
}
