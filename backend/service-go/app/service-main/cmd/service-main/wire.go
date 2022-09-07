//go:build wireinject
// +build wireinject

// The build tag makes sure the stub is not built in the final build.

package main

import (
	"toucan-leaderboard/app/service-main/internal/biz"
	"toucan-leaderboard/app/service-main/internal/conf"
	"toucan-leaderboard/app/service-main/internal/data"
	"toucan-leaderboard/app/service-main/internal/server"
	"toucan-leaderboard/app/service-main/internal/service"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/wire"
)

// initApp init kratos application.
func initApp(*conf.Server, *conf.Data, log.Logger) (*kratos.App, func(), error) {
	panic(wire.Build(server.ProviderSet, data.ProviderSet, biz.ProviderSet, service.ProviderSet, newApp))
}
