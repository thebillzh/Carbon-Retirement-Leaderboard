package server

import (
	v1 "toucan-leaderboard/app/service-main/api/main/v1"
	"toucan-leaderboard/app/service-main/internal/conf"
	"toucan-leaderboard/app/service-main/internal/service"
	"toucan-leaderboard/utils"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware/auth/jwt"
	"github.com/go-kratos/kratos/v2/middleware/logging"
	"github.com/go-kratos/kratos/v2/middleware/metadata"
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/middleware/selector"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"github.com/go-kratos/kratos/v2/middleware/validate"
	"github.com/go-kratos/kratos/v2/transport/http"
	jwtV4 "github.com/golang-jwt/jwt/v4"
)

// NewHTTPServer new a HTTP server.
func NewHTTPServer(c *conf.Server, main *service.MainService, logger log.Logger) *http.Server {
	var opts = []http.ServerOption{
		http.Middleware(
			recovery.Recovery(),
			tracing.Server(),
			logging.Server(logger),
			validate.Validator(),
			metadata.Server(),
			selector.Server(jwt.Server(func(token *jwtV4.Token) (interface{}, error) {
				return utils.JWTKey, nil
			})).
				Path().
				Build(),
		),
	}
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != nil {
		opts = append(opts, http.Timeout(c.Http.Timeout.AsDuration()))
	}
	srv := http.NewServer(opts...)
	v1.RegisterMainHTTPServer(srv, main)
	return srv
}
