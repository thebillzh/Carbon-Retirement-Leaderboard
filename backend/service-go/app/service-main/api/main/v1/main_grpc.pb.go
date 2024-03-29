// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: api/main/v1/main.proto

package v1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// MainClient is the client API for Main service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MainClient interface {
	Ping(ctx context.Context, in *PingReq, opts ...grpc.CallOption) (*PingResp, error)
	GetLeaderboard(ctx context.Context, in *GetLeaderboardReq, opts ...grpc.CallOption) (*GetLeaderboardResp, error)
	GetAvailableNFTList(ctx context.Context, in *GetAvailableNFTListReq, opts ...grpc.CallOption) (*GetAvailableNFTListResp, error)
}

type mainClient struct {
	cc grpc.ClientConnInterface
}

func NewMainClient(cc grpc.ClientConnInterface) MainClient {
	return &mainClient{cc}
}

func (c *mainClient) Ping(ctx context.Context, in *PingReq, opts ...grpc.CallOption) (*PingResp, error) {
	out := new(PingResp)
	err := c.cc.Invoke(ctx, "/main.v1.Main/Ping", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *mainClient) GetLeaderboard(ctx context.Context, in *GetLeaderboardReq, opts ...grpc.CallOption) (*GetLeaderboardResp, error) {
	out := new(GetLeaderboardResp)
	err := c.cc.Invoke(ctx, "/main.v1.Main/GetLeaderboard", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *mainClient) GetAvailableNFTList(ctx context.Context, in *GetAvailableNFTListReq, opts ...grpc.CallOption) (*GetAvailableNFTListResp, error) {
	out := new(GetAvailableNFTListResp)
	err := c.cc.Invoke(ctx, "/main.v1.Main/GetAvailableNFTList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MainServer is the server API for Main service.
// All implementations must embed UnimplementedMainServer
// for forward compatibility
type MainServer interface {
	Ping(context.Context, *PingReq) (*PingResp, error)
	GetLeaderboard(context.Context, *GetLeaderboardReq) (*GetLeaderboardResp, error)
	GetAvailableNFTList(context.Context, *GetAvailableNFTListReq) (*GetAvailableNFTListResp, error)
	mustEmbedUnimplementedMainServer()
}

// UnimplementedMainServer must be embedded to have forward compatible implementations.
type UnimplementedMainServer struct {
}

func (UnimplementedMainServer) Ping(context.Context, *PingReq) (*PingResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Ping not implemented")
}
func (UnimplementedMainServer) GetLeaderboard(context.Context, *GetLeaderboardReq) (*GetLeaderboardResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetLeaderboard not implemented")
}
func (UnimplementedMainServer) GetAvailableNFTList(context.Context, *GetAvailableNFTListReq) (*GetAvailableNFTListResp, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvailableNFTList not implemented")
}
func (UnimplementedMainServer) mustEmbedUnimplementedMainServer() {}

// UnsafeMainServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MainServer will
// result in compilation errors.
type UnsafeMainServer interface {
	mustEmbedUnimplementedMainServer()
}

func RegisterMainServer(s grpc.ServiceRegistrar, srv MainServer) {
	s.RegisterService(&Main_ServiceDesc, srv)
}

func _Main_Ping_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PingReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MainServer).Ping(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.v1.Main/Ping",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MainServer).Ping(ctx, req.(*PingReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Main_GetLeaderboard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetLeaderboardReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MainServer).GetLeaderboard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.v1.Main/GetLeaderboard",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MainServer).GetLeaderboard(ctx, req.(*GetLeaderboardReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Main_GetAvailableNFTList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAvailableNFTListReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MainServer).GetAvailableNFTList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/main.v1.Main/GetAvailableNFTList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MainServer).GetAvailableNFTList(ctx, req.(*GetAvailableNFTListReq))
	}
	return interceptor(ctx, in, info, handler)
}

// Main_ServiceDesc is the grpc.ServiceDesc for Main service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Main_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "main.v1.Main",
	HandlerType: (*MainServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Ping",
			Handler:    _Main_Ping_Handler,
		},
		{
			MethodName: "GetLeaderboard",
			Handler:    _Main_GetLeaderboard_Handler,
		},
		{
			MethodName: "GetAvailableNFTList",
			Handler:    _Main_GetAvailableNFTList_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/main/v1/main.proto",
}
