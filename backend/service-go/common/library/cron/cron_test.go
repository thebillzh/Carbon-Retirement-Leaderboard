package cron

import (
	"toucan-leaderboard/common/library/log"
	"context"
	"fmt"
	"testing"
	"time"
)

const OneSecondMore = 1*time.Second + 50*time.Millisecond

func TestCron(t *testing.T) {
	log.Init("cron", "cron", "local-dev")
	cronUtil := NewCron()
	defer cronUtil.Stop()

	channel := make(chan string, 2)
	cronUtil.AddFunc("* * * * * *", func(ctx context.Context) error {
		fmt.Println("testScript1 running")
		time.Sleep(10 * time.Millisecond)

		return nil
	}, "testService.testScript1")
	cronUtil.AddFunc("* * * * * *", func(ctx context.Context) error {
		fmt.Println("testScript2 running")
		time.Sleep(10 * time.Millisecond)
		channel <- "testScript2 done"
		return nil
	}, "testService.testScript2")

	select {
	case <-time.After(OneSecondMore):
		t.Errorf("job expected not running")
	case msg := <-channel:
		fmt.Println(msg)
	}
}

func TestCronOptionPreLoad(t *testing.T) {
	log.Init("cron", "cron", "local-dev")
	cronUtil := NewCron()
	defer cronUtil.Stop()

	channel := make(chan string, 1)

	cronUtil.AddFunc("@every 10s", func(ctx context.Context) error {
		fmt.Println("testScript2 running")
		time.Sleep(10 * time.Millisecond)
		channel <- "testScript2 done"
		return nil
	}, "testService.testScript2", PreLoad())

	select {
	case <-time.After(5 * time.Second):
		t.Errorf("job expected not running")
	case msg := <-channel:
		t.Logf(msg)
	}
}
