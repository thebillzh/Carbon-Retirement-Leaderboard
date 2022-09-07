package cron

import (
	"context"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"github.com/go-kratos/kratos/v2/transport"
	cron3 "github.com/robfig/cron/v3"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/trace"
	"net/http"
	"sync"
	"time"
	"toucan-leaderboard/common/library/log"
)

/*example:
	cron := cronUtil.NewCron()

	func (s *DemoService) Run(ctx context.Context) error {
		// do some things

		return nil
	}
	_, cErr := cron.AddFunc("0 0 13 * * 4",robot.NewDemoService(dao).Run, "robot.DemoService")
	if cErr != nil {
		//log
	}
	...

	cron.Start()
==========================================================================================
# spec description of two way
# Absolutely,
# ┌─────────────second (0 - 59)
# │	┌───────────── minute (0 - 59)
# │	│ ┌───────────── hour (0 - 23)
# │	│ │ ┌───────────── day of the month (1 - 31)
# │	│ │ │ ┌───────────── month (1 - 12)
# │	│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
# │	│ │ │ │ │                                   7 is also Sunday on some systems)
# │	│ │ │ │ │
# │	│ │ │ │ │
# *	* * * * * <command to execute>

# Relativity,recommended for load balance, refer to https://godoc.org/github.com/robfig/cron
  eg."@every 1h30m10s" would indicate a schedule that activates after 1 hour, 30 minutes, 10 seconds, and then every interval after that.
**/

const (
	_cronUtil = "CronUtil"
)

var (
	_once          sync.Once
	_singletonUtil *CronUtil
)

type CronUtil struct {
	Cron   *cron3.Cron
	tracer *tracing.Tracer
}

type cmdEntryConf struct {
	needPreLoad bool
	registerXXL bool
}

type CmdOption struct {
	f func(*cmdEntryConf)
}

// PreLoad option
func PreLoad() CmdOption {
	return CmdOption{func(c *cmdEntryConf) {
		c.needPreLoad = true
	}}
}

// NewCron
// other wrappers as you need: Recover DelayIfStillRunning SkipIfStillRunning...
func NewCron(wrappers ...cron3.JobWrapper) *CronUtil {
	_once.Do(func() {
		_singletonUtil = newCron(wrappers...)
	})
	return _singletonUtil
}

// newCron
// other wrappers as you need: Recover DelayIfStillRunning SkipIfStillRunning...
func newCron(wrappers ...cron3.JobWrapper) *CronUtil {
	jobWrappers := []cron3.JobWrapper{
		// recover && use the default std log handler
		cron3.Recover(cron3.DefaultLogger),
	}
	jobWrappers = append(jobWrappers, wrappers...)

	c := &CronUtil{
		// support seconds, Recover, custom logger and etc.
		Cron:   cron3.New(cron3.WithSeconds(), cron3.WithChain(jobWrappers...), cron3.WithLogger(NewCronLogger())),
		tracer: tracing.NewTracer(trace.SpanKindServer, tracing.WithPropagator(propagation.NewCompositeTextMapPropagator(propagation.Baggage{}, propagation.TraceContext{}))),
	}
	c.Cron.Start()

	return c
}

// AddFunc adds a func to the Cron to be run on the given schedule.
// uniqueName string eg. xgift.addGiftFree
func (c *CronUtil) AddFunc(spec string, cmd func(ctx context.Context) error, uniqueName string, ops ...CmdOption) (cron3.EntryID, error) {
	if uniqueName == "" || len(uniqueName) > 50 {
		panic("[CronUtil] uniqueName invalid")
	}

	//options
	cmdConf := cmdEntryConf{}
	for _, op := range ops {
		op.f(&cmdConf)
	}

	runFunc := func() (err error) {
		// trace init
		carrier := headerCarrier{}
		ts := &mockTransport{kind: transport.KindHTTP, header: carrier}

		ctx, span := c.tracer.Start(transport.NewServerContext(context.Background(), ts), ts.Operation(), ts.RequestHeader())
		defer c.tracer.End(ctx, span, nil, nil)

		// run
		log.Infoc(ctx, "[CronUtil] %s job start", uniqueName)
		timeStart:=time.Now()
		if err = cmd(ctx); err != nil {
			log.Errorc(ctx, "[CronUtil] %s run error: %+v", uniqueName, err)
		}
		log.Infoc(ctx, "[CronUtil] %s job done, cost: %+v", uniqueName, time.Since(timeStart))

		return err
	}

	trueFunc := func() {
		_ = runFunc()
	}
	if cmdConf.needPreLoad {
		log.Info("[CronUtil] %s pre_load", uniqueName)
		trueFunc()
	}

	entryID, err := c.Cron.AddFunc(spec, trueFunc)

	// log entryID
	log.Info("[CronUtil] %s entryID is %v", uniqueName, entryID)

	return entryID, err
}

// Stop stops the Cron scheduler if it is running; otherwise it does nothing.
// A context is returned so the caller can wait for running jobs to complete.
func (c *CronUtil) Stop() context.Context {
	return c.Cron.Stop()
}

// The following codes are used to create trace id for every run of cron job.
// Maybe these can be simplified...
var _ transport.Transporter = &mockTransport{}

type headerCarrier http.Header

// Get returns the value associated with the passed key.
func (hc headerCarrier) Get(key string) string {
	return http.Header(hc).Get(key)
}

// Set stores the key-value pair.
func (hc headerCarrier) Set(key string, value string) {
	http.Header(hc).Set(key, value)
}

// Keys lists the keys stored in this carrier.
func (hc headerCarrier) Keys() []string {
	keys := make([]string, 0, len(hc))
	for k := range http.Header(hc) {
		keys = append(keys, k)
	}
	return keys
}

type mockTransport struct {
	kind      transport.Kind
	endpoint  string
	operation string
	header    headerCarrier
	request   *http.Request
}

func (tr *mockTransport) Kind() transport.Kind            { return tr.kind }
func (tr *mockTransport) Endpoint() string                { return tr.endpoint }
func (tr *mockTransport) Operation() string               { return tr.operation }
func (tr *mockTransport) RequestHeader() transport.Header { return tr.header }
func (tr *mockTransport) ReplyHeader() transport.Header   { return tr.header }
func (tr *mockTransport) Request() *http.Request {
	if tr.request == nil {
		rq, _ := http.NewRequest(http.MethodGet, "/endpoint", nil)

		return rq
	}

	return tr.request
}
func (tr *mockTransport) PathTemplate() string { return "" }
