package device

import (
	innerMiddleware "toucan-leaderboard/common/component"
	"context"
	"github.com/go-kratos/kratos/v2/metadata"
	"github.com/go-kratos/kratos/v2/middleware"
	"github.com/go-kratos/kratos/v2/transport"
	"github.com/go-kratos/kratos/v2/transport/http"
	"net"
	"strings"
)

type Device struct {
	RemoteIP string
}

type deviceKey struct{}

var (
	RemoteIPMetaDataKey = innerMiddleware.GlobalKeyPrefix + "remote-ip"
)

// getRemoteIP 尽最大努力实现获取客户端公网 IP 的算法。
// 解析 X-Real-IP 和 X-Forwarded-For 以便于反向代理（nginx 或 haproxy）可以正常工作。
func getRemoteIP(ctx context.Context) string {
	if tr, ok := transport.FromServerContext(ctx); ok {
		if tr.Kind() == transport.KindHTTP {
			if ht, ok := tr.(http.Transporter); ok {
				r := ht.Request()
				var ip string
				for _, ip = range strings.Split(r.Header.Get("X-Forwarded-For"), ",") {
					ip = strings.TrimSpace(ip)
					if ip != "" && !isLocalIP(ip) {
						return ip
					}
				}

				ip = strings.TrimSpace(r.Header.Get("X-Real-Ip"))
				if ip != "" && !isLocalIP(ip) {
					return ip
				}

				if ip, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr)); err == nil {
					if !isLocalIP(ip) {
						return ip
					}
				}
			}
		}
	}
	return ""
}

// isLocalIP 检测 IP 地址字符串是否是内网地址
func isLocalIP(ip string) bool {
	return net.ParseIP(ip).IsLoopback()
}

// Server is a server middleware that get device information.
func Server() middleware.Middleware {
	return func(handler middleware.Handler) middleware.Handler {
		return func(ctx context.Context, req interface{}) (reply interface{}, err error) {
			ip := getRemoteIP(ctx)
			d := Device{
				RemoteIP: ip,
			}
			context.WithValue(ctx, deviceKey{}, d)
			metadata.AppendToClientContext(ctx, RemoteIPMetaDataKey, ip)
			return handler(ctx, req)
		}
	}
}

// FromContext get Device from context
func FromContext(ctx context.Context) (d Device, ok bool) {
	d, ok = ctx.Value(deviceKey{}).(Device)
	return
}
