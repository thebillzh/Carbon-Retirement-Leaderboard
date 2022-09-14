// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.0
// 	protoc        v3.19.3
// source: api/main/v1/main.proto

package v1

import (
	_ "github.com/envoyproxy/protoc-gen-validate/validate"
	_ "google.golang.org/genproto/googleapis/api/annotations"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type PingReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Msg string `protobuf:"bytes,1,opt,name=msg,proto3" json:"msg,omitempty"`
}

func (x *PingReq) Reset() {
	*x = PingReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PingReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PingReq) ProtoMessage() {}

func (x *PingReq) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PingReq.ProtoReflect.Descriptor instead.
func (*PingReq) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{0}
}

func (x *PingReq) GetMsg() string {
	if x != nil {
		return x.Msg
	}
	return ""
}

type PingResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Res string `protobuf:"bytes,1,opt,name=res,proto3" json:"res,omitempty"`
}

func (x *PingResp) Reset() {
	*x = PingResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PingResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PingResp) ProtoMessage() {}

func (x *PingResp) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PingResp.ProtoReflect.Descriptor instead.
func (*PingResp) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{1}
}

func (x *PingResp) GetRes() string {
	if x != nil {
		return x.Res
	}
	return ""
}

type GetLeaderboardReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	First     int64  `protobuf:"varint,1,opt,name=first,proto3" json:"first,omitempty"`
	Type      string `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
	StartTime string `protobuf:"bytes,3,opt,name=start_time,json=startTime,proto3" json:"start_time,omitempty"`
	EndTime   string `protobuf:"bytes,4,opt,name=end_time,json=endTime,proto3" json:"end_time,omitempty"`
}

func (x *GetLeaderboardReq) Reset() {
	*x = GetLeaderboardReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetLeaderboardReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetLeaderboardReq) ProtoMessage() {}

func (x *GetLeaderboardReq) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetLeaderboardReq.ProtoReflect.Descriptor instead.
func (*GetLeaderboardReq) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{2}
}

func (x *GetLeaderboardReq) GetFirst() int64 {
	if x != nil {
		return x.First
	}
	return 0
}

func (x *GetLeaderboardReq) GetType() string {
	if x != nil {
		return x.Type
	}
	return ""
}

func (x *GetLeaderboardReq) GetStartTime() string {
	if x != nil {
		return x.StartTime
	}
	return ""
}

func (x *GetLeaderboardReq) GetEndTime() string {
	if x != nil {
		return x.EndTime
	}
	return ""
}

type LeaderboardItem struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	WalletPub     string `protobuf:"bytes,1,opt,name=wallet_pub,proto3" json:"wallet_pub,omitempty"`
	Uname         string `protobuf:"bytes,2,opt,name=uname,proto3" json:"uname,omitempty"`
	RetiredAmount string `protobuf:"bytes,3,opt,name=retired_amount,proto3" json:"retired_amount,omitempty"`
	Ens           string `protobuf:"bytes,4,opt,name=ens,proto3" json:"ens,omitempty"`
	Twitter       string `protobuf:"bytes,5,opt,name=twitter,proto3" json:"twitter,omitempty"`
	IsContract    bool   `protobuf:"varint,6,opt,name=is_contract,proto3" json:"is_contract,omitempty"`
}

func (x *LeaderboardItem) Reset() {
	*x = LeaderboardItem{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *LeaderboardItem) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*LeaderboardItem) ProtoMessage() {}

func (x *LeaderboardItem) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use LeaderboardItem.ProtoReflect.Descriptor instead.
func (*LeaderboardItem) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{3}
}

func (x *LeaderboardItem) GetWalletPub() string {
	if x != nil {
		return x.WalletPub
	}
	return ""
}

func (x *LeaderboardItem) GetUname() string {
	if x != nil {
		return x.Uname
	}
	return ""
}

func (x *LeaderboardItem) GetRetiredAmount() string {
	if x != nil {
		return x.RetiredAmount
	}
	return ""
}

func (x *LeaderboardItem) GetEns() string {
	if x != nil {
		return x.Ens
	}
	return ""
}

func (x *LeaderboardItem) GetTwitter() string {
	if x != nil {
		return x.Twitter
	}
	return ""
}

func (x *LeaderboardItem) GetIsContract() bool {
	if x != nil {
		return x.IsContract
	}
	return false
}

type GetLeaderboardResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	List []*LeaderboardItem `protobuf:"bytes,1,rep,name=list,proto3" json:"list,omitempty"`
	Type string             `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
}

func (x *GetLeaderboardResp) Reset() {
	*x = GetLeaderboardResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetLeaderboardResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetLeaderboardResp) ProtoMessage() {}

func (x *GetLeaderboardResp) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetLeaderboardResp.ProtoReflect.Descriptor instead.
func (*GetLeaderboardResp) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{4}
}

func (x *GetLeaderboardResp) GetList() []*LeaderboardItem {
	if x != nil {
		return x.List
	}
	return nil
}

func (x *GetLeaderboardResp) GetType() string {
	if x != nil {
		return x.Type
	}
	return ""
}

type GetAvailableNFTListReq struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	WalletPub string `protobuf:"bytes,1,opt,name=wallet_pub,json=walletPub,proto3" json:"wallet_pub,omitempty"`
}

func (x *GetAvailableNFTListReq) Reset() {
	*x = GetAvailableNFTListReq{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAvailableNFTListReq) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAvailableNFTListReq) ProtoMessage() {}

func (x *GetAvailableNFTListReq) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAvailableNFTListReq.ProtoReflect.Descriptor instead.
func (*GetAvailableNFTListReq) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{5}
}

func (x *GetAvailableNFTListReq) GetWalletPub() string {
	if x != nil {
		return x.WalletPub
	}
	return ""
}

type AvailableNFT struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	RankType   int64 `protobuf:"varint,1,opt,name=rank_type,proto3" json:"rank_type,omitempty"`
	RankYear   int64 `protobuf:"varint,2,opt,name=rank_year,proto3" json:"rank_year,omitempty"`
	RankSeason int64 `protobuf:"varint,3,opt,name=rank_season,proto3" json:"rank_season,omitempty"`
	Rank       int64 `protobuf:"varint,4,opt,name=rank,proto3" json:"rank,omitempty"`
}

func (x *AvailableNFT) Reset() {
	*x = AvailableNFT{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AvailableNFT) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AvailableNFT) ProtoMessage() {}

func (x *AvailableNFT) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AvailableNFT.ProtoReflect.Descriptor instead.
func (*AvailableNFT) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{6}
}

func (x *AvailableNFT) GetRankType() int64 {
	if x != nil {
		return x.RankType
	}
	return 0
}

func (x *AvailableNFT) GetRankYear() int64 {
	if x != nil {
		return x.RankYear
	}
	return 0
}

func (x *AvailableNFT) GetRankSeason() int64 {
	if x != nil {
		return x.RankSeason
	}
	return 0
}

func (x *AvailableNFT) GetRank() int64 {
	if x != nil {
		return x.Rank
	}
	return 0
}

type GetAvailableNFTListResp struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	List []*AvailableNFT `protobuf:"bytes,1,rep,name=list,proto3" json:"list,omitempty"`
}

func (x *GetAvailableNFTListResp) Reset() {
	*x = GetAvailableNFTListResp{}
	if protoimpl.UnsafeEnabled {
		mi := &file_api_main_v1_main_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAvailableNFTListResp) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAvailableNFTListResp) ProtoMessage() {}

func (x *GetAvailableNFTListResp) ProtoReflect() protoreflect.Message {
	mi := &file_api_main_v1_main_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAvailableNFTListResp.ProtoReflect.Descriptor instead.
func (*GetAvailableNFTListResp) Descriptor() ([]byte, []int) {
	return file_api_main_v1_main_proto_rawDescGZIP(), []int{7}
}

func (x *GetAvailableNFTListResp) GetList() []*AvailableNFT {
	if x != nil {
		return x.List
	}
	return nil
}

var File_api_main_v1_main_proto protoreflect.FileDescriptor

var file_api_main_v1_main_proto_rawDesc = []byte{
	0x0a, 0x16, 0x61, 0x70, 0x69, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x76, 0x31, 0x2f, 0x6d, 0x61,
	0x69, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x07, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76,
	0x31, 0x1a, 0x1c, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x61, 0x6e,
	0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a,
	0x17, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x61, 0x74, 0x65, 0x2f, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x61,
	0x74, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x1b, 0x0a, 0x07, 0x50, 0x69, 0x6e, 0x67,
	0x52, 0x65, 0x71, 0x12, 0x10, 0x0a, 0x03, 0x6d, 0x73, 0x67, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x03, 0x6d, 0x73, 0x67, 0x22, 0x1c, 0x0a, 0x08, 0x50, 0x69, 0x6e, 0x67, 0x52, 0x65, 0x73,
	0x70, 0x12, 0x10, 0x0a, 0x03, 0x72, 0x65, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03,
	0x72, 0x65, 0x73, 0x22, 0xa6, 0x01, 0x0a, 0x11, 0x47, 0x65, 0x74, 0x4c, 0x65, 0x61, 0x64, 0x65,
	0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x52, 0x65, 0x71, 0x12, 0x20, 0x0a, 0x05, 0x66, 0x69, 0x72,
	0x73, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x42, 0x0a, 0xfa, 0x42, 0x07, 0x22, 0x05, 0x18,
	0xe8, 0x07, 0x28, 0x00, 0x52, 0x05, 0x66, 0x69, 0x72, 0x73, 0x74, 0x12, 0x21, 0x0a, 0x04, 0x74,
	0x79, 0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x42, 0x0d, 0xfa, 0x42, 0x0a, 0x72, 0x08,
	0x52, 0x03, 0x6e, 0x63, 0x74, 0xd0, 0x01, 0x01, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12, 0x27,
	0x0a, 0x0a, 0x73, 0x74, 0x61, 0x72, 0x74, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x42, 0x08, 0xfa, 0x42, 0x05, 0x72, 0x03, 0xd0, 0x01, 0x01, 0x52, 0x09, 0x73, 0x74,
	0x61, 0x72, 0x74, 0x54, 0x69, 0x6d, 0x65, 0x12, 0x23, 0x0a, 0x08, 0x65, 0x6e, 0x64, 0x5f, 0x74,
	0x69, 0x6d, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x42, 0x08, 0xfa, 0x42, 0x05, 0x72, 0x03,
	0xd0, 0x01, 0x01, 0x52, 0x07, 0x65, 0x6e, 0x64, 0x54, 0x69, 0x6d, 0x65, 0x22, 0xbd, 0x01, 0x0a,
	0x0f, 0x4c, 0x65, 0x61, 0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x49, 0x74, 0x65, 0x6d,
	0x12, 0x1e, 0x0a, 0x0a, 0x77, 0x61, 0x6c, 0x6c, 0x65, 0x74, 0x5f, 0x70, 0x75, 0x62, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x77, 0x61, 0x6c, 0x6c, 0x65, 0x74, 0x5f, 0x70, 0x75, 0x62,
	0x12, 0x14, 0x0a, 0x05, 0x75, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x05, 0x75, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x26, 0x0a, 0x0e, 0x72, 0x65, 0x74, 0x69, 0x72, 0x65,
	0x64, 0x5f, 0x61, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0e,
	0x72, 0x65, 0x74, 0x69, 0x72, 0x65, 0x64, 0x5f, 0x61, 0x6d, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x10,
	0x0a, 0x03, 0x65, 0x6e, 0x73, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x65, 0x6e, 0x73,
	0x12, 0x18, 0x0a, 0x07, 0x74, 0x77, 0x69, 0x74, 0x74, 0x65, 0x72, 0x18, 0x05, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x07, 0x74, 0x77, 0x69, 0x74, 0x74, 0x65, 0x72, 0x12, 0x20, 0x0a, 0x0b, 0x69, 0x73,
	0x5f, 0x63, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x18, 0x06, 0x20, 0x01, 0x28, 0x08, 0x52,
	0x0b, 0x69, 0x73, 0x5f, 0x63, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x22, 0x56, 0x0a, 0x12,
	0x47, 0x65, 0x74, 0x4c, 0x65, 0x61, 0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x52, 0x65,
	0x73, 0x70, 0x12, 0x2c, 0x0a, 0x04, 0x6c, 0x69, 0x73, 0x74, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b,
	0x32, 0x18, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x4c, 0x65, 0x61, 0x64, 0x65,
	0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x49, 0x74, 0x65, 0x6d, 0x52, 0x04, 0x6c, 0x69, 0x73, 0x74,
	0x12, 0x12, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04,
	0x74, 0x79, 0x70, 0x65, 0x22, 0x40, 0x0a, 0x16, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c,
	0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65, 0x71, 0x12, 0x26,
	0x0a, 0x0a, 0x77, 0x61, 0x6c, 0x6c, 0x65, 0x74, 0x5f, 0x70, 0x75, 0x62, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x42, 0x07, 0xfa, 0x42, 0x04, 0x72, 0x02, 0x10, 0x01, 0x52, 0x09, 0x77, 0x61, 0x6c,
	0x6c, 0x65, 0x74, 0x50, 0x75, 0x62, 0x22, 0x80, 0x01, 0x0a, 0x0c, 0x41, 0x76, 0x61, 0x69, 0x6c,
	0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x12, 0x1c, 0x0a, 0x09, 0x72, 0x61, 0x6e, 0x6b, 0x5f,
	0x74, 0x79, 0x70, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x09, 0x72, 0x61, 0x6e, 0x6b,
	0x5f, 0x74, 0x79, 0x70, 0x65, 0x12, 0x1c, 0x0a, 0x09, 0x72, 0x61, 0x6e, 0x6b, 0x5f, 0x79, 0x65,
	0x61, 0x72, 0x18, 0x02, 0x20, 0x01, 0x28, 0x03, 0x52, 0x09, 0x72, 0x61, 0x6e, 0x6b, 0x5f, 0x79,
	0x65, 0x61, 0x72, 0x12, 0x20, 0x0a, 0x0b, 0x72, 0x61, 0x6e, 0x6b, 0x5f, 0x73, 0x65, 0x61, 0x73,
	0x6f, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x03, 0x52, 0x0b, 0x72, 0x61, 0x6e, 0x6b, 0x5f, 0x73,
	0x65, 0x61, 0x73, 0x6f, 0x6e, 0x12, 0x12, 0x0a, 0x04, 0x72, 0x61, 0x6e, 0x6b, 0x18, 0x04, 0x20,
	0x01, 0x28, 0x03, 0x52, 0x04, 0x72, 0x61, 0x6e, 0x6b, 0x22, 0x44, 0x0a, 0x17, 0x47, 0x65, 0x74,
	0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73, 0x74,
	0x52, 0x65, 0x73, 0x70, 0x12, 0x29, 0x0a, 0x04, 0x6c, 0x69, 0x73, 0x74, 0x18, 0x01, 0x20, 0x03,
	0x28, 0x0b, 0x32, 0x15, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x41, 0x76, 0x61,
	0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x52, 0x04, 0x6c, 0x69, 0x73, 0x74, 0x32,
	0xcf, 0x02, 0x0a, 0x04, 0x4d, 0x61, 0x69, 0x6e, 0x12, 0x4a, 0x0a, 0x04, 0x50, 0x69, 0x6e, 0x67,
	0x12, 0x10, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x50, 0x69, 0x6e, 0x67, 0x52,
	0x65, 0x71, 0x1a, 0x11, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x50, 0x69, 0x6e,
	0x67, 0x52, 0x65, 0x73, 0x70, 0x22, 0x1d, 0x82, 0xd3, 0xe4, 0x93, 0x02, 0x17, 0x12, 0x15, 0x2f,
	0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x76, 0x31, 0x2f,
	0x70, 0x69, 0x6e, 0x67, 0x12, 0x72, 0x0a, 0x0e, 0x47, 0x65, 0x74, 0x4c, 0x65, 0x61, 0x64, 0x65,
	0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x12, 0x1a, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31,
	0x2e, 0x47, 0x65, 0x74, 0x4c, 0x65, 0x61, 0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x52,
	0x65, 0x71, 0x1a, 0x1b, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74,
	0x4c, 0x65, 0x61, 0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x52, 0x65, 0x73, 0x70, 0x22,
	0x27, 0x82, 0xd3, 0xe4, 0x93, 0x02, 0x21, 0x12, 0x1f, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63,
	0x65, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x76, 0x31, 0x2f, 0x67, 0x65, 0x74, 0x4c, 0x65, 0x61,
	0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x12, 0x86, 0x01, 0x0a, 0x13, 0x47, 0x65, 0x74,
	0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73, 0x74,
	0x12, 0x1f, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x76,
	0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73, 0x74, 0x52, 0x65,
	0x71, 0x1a, 0x20, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41,
	0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73, 0x74, 0x52,
	0x65, 0x73, 0x70, 0x22, 0x2c, 0x82, 0xd3, 0xe4, 0x93, 0x02, 0x26, 0x12, 0x24, 0x2f, 0x73, 0x65,
	0x72, 0x76, 0x69, 0x63, 0x65, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x76, 0x31, 0x2f, 0x67, 0x65,
	0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x4e, 0x46, 0x54, 0x4c, 0x69, 0x73,
	0x74, 0x42, 0x5b, 0x0a, 0x16, 0x64, 0x65, 0x76, 0x2e, 0x6b, 0x72, 0x61, 0x74, 0x6f, 0x73, 0x2e,
	0x61, 0x70, 0x69, 0x2e, 0x6d, 0x61, 0x69, 0x6e, 0x2e, 0x76, 0x31, 0x42, 0x0b, 0x4d, 0x61, 0x69,
	0x6e, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x56, 0x31, 0x50, 0x01, 0x5a, 0x32, 0x74, 0x6f, 0x75, 0x63,
	0x61, 0x6e, 0x2d, 0x6c, 0x65, 0x61, 0x64, 0x65, 0x72, 0x62, 0x6f, 0x61, 0x72, 0x64, 0x2f, 0x61,
	0x70, 0x70, 0x2f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2d, 0x6d, 0x61, 0x69, 0x6e, 0x2f,
	0x61, 0x70, 0x69, 0x2f, 0x6d, 0x61, 0x69, 0x6e, 0x2f, 0x76, 0x31, 0x3b, 0x76, 0x31, 0x62, 0x06,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_api_main_v1_main_proto_rawDescOnce sync.Once
	file_api_main_v1_main_proto_rawDescData = file_api_main_v1_main_proto_rawDesc
)

func file_api_main_v1_main_proto_rawDescGZIP() []byte {
	file_api_main_v1_main_proto_rawDescOnce.Do(func() {
		file_api_main_v1_main_proto_rawDescData = protoimpl.X.CompressGZIP(file_api_main_v1_main_proto_rawDescData)
	})
	return file_api_main_v1_main_proto_rawDescData
}

var file_api_main_v1_main_proto_msgTypes = make([]protoimpl.MessageInfo, 8)
var file_api_main_v1_main_proto_goTypes = []interface{}{
	(*PingReq)(nil),                 // 0: main.v1.PingReq
	(*PingResp)(nil),                // 1: main.v1.PingResp
	(*GetLeaderboardReq)(nil),       // 2: main.v1.GetLeaderboardReq
	(*LeaderboardItem)(nil),         // 3: main.v1.LeaderboardItem
	(*GetLeaderboardResp)(nil),      // 4: main.v1.GetLeaderboardResp
	(*GetAvailableNFTListReq)(nil),  // 5: main.v1.GetAvailableNFTListReq
	(*AvailableNFT)(nil),            // 6: main.v1.AvailableNFT
	(*GetAvailableNFTListResp)(nil), // 7: main.v1.GetAvailableNFTListResp
}
var file_api_main_v1_main_proto_depIdxs = []int32{
	3, // 0: main.v1.GetLeaderboardResp.list:type_name -> main.v1.LeaderboardItem
	6, // 1: main.v1.GetAvailableNFTListResp.list:type_name -> main.v1.AvailableNFT
	0, // 2: main.v1.Main.Ping:input_type -> main.v1.PingReq
	2, // 3: main.v1.Main.GetLeaderboard:input_type -> main.v1.GetLeaderboardReq
	5, // 4: main.v1.Main.GetAvailableNFTList:input_type -> main.v1.GetAvailableNFTListReq
	1, // 5: main.v1.Main.Ping:output_type -> main.v1.PingResp
	4, // 6: main.v1.Main.GetLeaderboard:output_type -> main.v1.GetLeaderboardResp
	7, // 7: main.v1.Main.GetAvailableNFTList:output_type -> main.v1.GetAvailableNFTListResp
	5, // [5:8] is the sub-list for method output_type
	2, // [2:5] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_api_main_v1_main_proto_init() }
func file_api_main_v1_main_proto_init() {
	if File_api_main_v1_main_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_api_main_v1_main_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PingReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PingResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetLeaderboardReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*LeaderboardItem); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetLeaderboardResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAvailableNFTListReq); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AvailableNFT); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_api_main_v1_main_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAvailableNFTListResp); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_api_main_v1_main_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   8,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_api_main_v1_main_proto_goTypes,
		DependencyIndexes: file_api_main_v1_main_proto_depIdxs,
		MessageInfos:      file_api_main_v1_main_proto_msgTypes,
	}.Build()
	File_api_main_v1_main_proto = out.File
	file_api_main_v1_main_proto_rawDesc = nil
	file_api_main_v1_main_proto_goTypes = nil
	file_api_main_v1_main_proto_depIdxs = nil
}
