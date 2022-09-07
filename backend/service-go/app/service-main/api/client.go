package api

import (
	v1 "toucan-leaderboard/app/service-main/api/main/v1"
)

// DiscoveryId for registry
const DiscoveryId = "service-main"

// Client service-main
type Client struct {
	MainClient v1.MainClient
}

// NewClient service-main grpc client
//func NewClient(r *registry.Registry) (client *Client, err error) {
//	conn, err := grpc.DialInsecure(
//		context.Background(),
//		grpc.WithEndpoint("discovery:///"+DiscoveryId),
//		grpc.WithDiscovery(r),
//	)
//	if err != nil {
//		return
//	}
//	client = &Client{
//		MainClient: v1.NewMainClient(conn),
//	}
//	return
//}
