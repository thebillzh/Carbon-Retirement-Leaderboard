package main

import (
	"flag"
	"github.com/joho/godotenv"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"math/rand"
	"os"
	"time"
	"toucan-leaderboard/common/library/log"

	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/config"
	"github.com/go-kratos/kratos/v2/config/file"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"
	"toucan-leaderboard/app/service-main/internal/conf"

	tracesdk "go.opentelemetry.io/otel/sdk/trace"
)

// go build -ldflags "-X main.Version=x.y.z"
var (
	// Name is the name of the compiled software.
	Name string
	// Version is the version of the compiled software.
	Version string
	// flagconf is the config flag.
	flagconf string

	id, _ = os.Hostname()
)

func init() {
	flag.StringVar(&flagconf, "conf", "../../configs", "config path, eg: -conf config.yaml")
}

// set trace provider
func setTracerProvider(url string) error {
	// Create the Jaeger exporter
	exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(url)))
	if err != nil {
		return err
	}
	tp := tracesdk.NewTracerProvider(
		// Set the sampling rate based on the parent span to 100%
		//tracesdk.WithSampler(tracesdk.ParentBased(tracesdk.TraceIDRatioBased(1.0))),
		tracesdk.WithSampler(tracesdk.NeverSample()),
		// Always be sure to batch in production.
		tracesdk.WithBatcher(exp),
		// Record information about this application in an Resource.
		tracesdk.WithResource(
			resource.NewSchemaless(
				semconv.ServiceNameKey.String(Name),
				attribute.String("env", "dev"),
			),
		),
	)
	otel.SetTracerProvider(tp)

	return nil
}

func newApp(hs *http.Server, gs *grpc.Server) *kratos.App {
	return kratos.New(
		kratos.ID(id),
		kratos.Name(Name),
		kratos.Version(Version),
		kratos.Metadata(map[string]string{}),
		kratos.Logger(log.Logger),
		kratos.Server(
			hs,
			gs,
		),
		//kratos.Registrar(r),
	)
}

func main() {
	var err error
	flag.Parse()
	rand.Seed(time.Now().Unix())

	// init local env file
	if err = godotenv.Load(".env.local"); err != nil {
		panic(err)
	}

	// init log
	log.Init(id, Name, Version)
	c := config.New(
		config.WithSource(
			file.NewSource(flagconf),
		),
	)
	if err = c.Load(); err != nil {
		panic(err)
	}

	var bc conf.Bootstrap
	if err := c.Scan(&bc); err != nil {
		panic(err)
	}

	// init trace id
	url := os.Getenv("jaeger_url")
	if url == "" {
		url = "https://jaeger:14268/api/traces"
	}
	err = setTracerProvider(url)
	if err != nil {
		log.Error("[main] setTracerProvider error: %+v", err)
	}

	app, cleanup, err := initApp(bc.Server, bc.Data, log.Logger)
	if err != nil {
		panic(err)
	}
	defer cleanup()

	// start and wait for stop signal
	if err := app.Run(); err != nil {
		panic(err)
	}
}
