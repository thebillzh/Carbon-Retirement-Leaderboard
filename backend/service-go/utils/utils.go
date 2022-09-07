package utils

import (
	"context"
	"crypto/md5"
	"fmt"
	"github.com/go-kratos/kratos/v2/middleware/auth/jwt"
	jwtV4 "github.com/golang-jwt/jwt/v4"
	"toucan-leaderboard/common/component/device"
)

func GetMD5OfString(value string) string {
	return fmt.Sprintf("%x", md5.Sum([]byte(value)))
}

//func WithTx(ctx context.Context, client *ent.Client, fn func(tx *ent.Tx) error) error {
//	tx, err := client.Tx(ctx)
//	if err != nil {
//		return err
//	}
//	defer func() {
//		if v := recover(); v != nil {
//			_ = tx.Rollback()
//			panic(v)
//		}
//	}()
//	if err := fn(tx); err != nil {
//		if rErr := tx.Rollback(); rErr != nil {
//			err = errors.Wrapf(err, "rolling back transaction: %v", rErr)
//		}
//		return err
//	}
//	if err := tx.Commit(); err != nil {
//		return errors.Wrapf(err, "committing transaction: %v", err)
//	}
//	return nil
//}

type CommonParams struct {
	RemoteIP string

	Mid      int64
	Username string
	Role     int64
}

func GetCommonParams(ctx context.Context) (commonParams *CommonParams) {
	commonParams = &CommonParams{}
	d, ok := device.FromContext(ctx)
	if ok {
		commonParams.RemoteIP = d.RemoteIP
	}

	token, ok := jwt.FromContext(ctx)
	if !ok {
		return
	}

	mapClaims, ok := token.(jwtV4.MapClaims)
	if !ok {
		return
	}

	if midI, ok := mapClaims[_jwtV4Mid]; ok {
		if mid, ok := midI.(float64); ok {
			commonParams.Mid = int64(mid)
		}
	}

	if usernameI, ok := mapClaims[_jwtV4Username]; ok {
		if username, ok := usernameI.(string); ok {
			commonParams.Username = username
		}
	}

	if roleI, ok := mapClaims[_jwtV4Role]; ok {
		if role, ok := roleI.(float64); ok {
			commonParams.Role = int64(role)
		}
	}
	return
}
