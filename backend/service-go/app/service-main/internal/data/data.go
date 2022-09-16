package data

import (
	"context"
	"entgo.io/ent/dialect"
	"fmt"
	"github.com/google/wire"
	"os"
	"toucan-leaderboard/app/service-main/internal/conf"
	"toucan-leaderboard/common/library/log"
	"toucan-leaderboard/ent"
	"toucan-leaderboard/ent/tgocache"

	// database driver
	_ "github.com/go-sql-driver/mysql"
)

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(NewData, NewMainRepo)

// Data .
type Data struct {
	DB *ent.Client
}

// NewData .
func NewData(c *conf.Data) (d *Data, cleanup func(), err error) {
	d = &Data{}

	db, err := ent.Open(dialect.MySQL, os.Getenv("mysql://e308mxz8xdfl5e86sooh:pscale_pw_7ZBu1GyLMuRzL7Hg5Z0p9TgjCNbhSvyqaNqli1UV5zR@us-east.connect.psdb.cloud/toucan?sslaccept=strict&connection_limit=5&pool_timeout=0&parseTime=true&loc=Asia%2FShanghai&charset=utf8mb4,utf8"))
	if err != nil {
		log.Fatal("[NewData] ent.Open error:%+v", err)
	}
	d.DB = db

	cleanup = func() {
		log.Info("[NewData] closing the data resources")
		err := db.Close()
		if err != nil {
			log.Error("[NewData] closing db error: %+v", err)
		}
	}
	return d, cleanup, nil
}

func (d *Data) WithTx(ctx context.Context, fn func(tx *ent.Tx) error) error {
	tx, err := d.DB.Tx(ctx)
	if err != nil {
		return err
	}
	defer func() {
		if v := recover(); v != nil {
			if err := tx.Rollback(); err != nil {
				log.Errorc(ctx, "[WithTx] Rollback error:%+v", err)
			}
		}
	}()
	if err := fn(tx); err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("rolling back transaction: %w", rerr)
		}
		return err
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("committing transaction: %w", err)
	}
	return nil
}

// GetCache can get a cached value from db by the given cache key.
// empty string will be returned when key not exist.
func (d *Data) GetCache(ctx context.Context, cacheKey string) (cacheValue string, err error) {
	tGoCache, err := d.DB.TGoCache.Query().Select(tgocache.FieldCacheValue).Where(tgocache.CacheKeyEQ(cacheKey)).Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			err = nil
			return
		}
		err = fmt.Errorf("query error: %+v", err)
		return
	}
	cacheValue = tGoCache.CacheValue
	return
}

// SetCache will create a new keypair when the cache key is not exist,
// or update the cache value when the key is already exist.
func (d *Data) SetCache(ctx context.Context, cacheKey string, cacheValue string) (err error) {
	return d.DB.TGoCache.Create().SetCacheKey(cacheKey).SetCacheValue(cacheValue).OnConflict().UpdateCacheValue().Exec(ctx)
}

// SetCacheInTX will create a new keypair when the cache key is not exist,
// or update the cache value when the key is already exist.
func (d *Data) SetCacheInTX(ctx context.Context, tx *ent.Tx, cacheKey string, cacheValue string) (err error) {
	return tx.TGoCache.Create().SetCacheKey(cacheKey).SetCacheValue(cacheValue).OnConflict().UpdateCacheValue().Exec(ctx)
}
