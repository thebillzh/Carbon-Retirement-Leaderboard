package log

import (
	"context"
	"github.com/go-kratos/kratos/v2/log"
	"github.com/go-kratos/kratos/v2/middleware/tracing"
	"os"
)

var (
	Logger log.Logger
	h      *log.Helper
)

func Init(id, name, version string) {
	Logger = log.With(log.NewStdLogger(os.Stdout),
		"ts", log.DefaultTimestamp,
		"caller", log.DefaultCaller,
		"service.id", id,
		"service.name", name,
		"service.version", version,
		"trace_id", tracing.TraceID(),
		"span_id", tracing.SpanID(),
	)
	h = log.NewHelper(Logger)
}

// Info logs a message at the info log level.
func Info(format string, args ...interface{}) {
	h.Infof(format, args...)
}

// Warn logs a message at the warning log level.
func Warn(format string, args ...interface{}) {
	h.Warnf(format, args...)
}

// Error logs a message at the error log level.
func Error(format string, args ...interface{}) {
	h.Errorf(format, args...)
}

// Fatal logs a message at the fatal log level.
func Fatal(format string, args ...interface{}) {
	h.Fatalf(format, args...)
}

// Infoc logs a message at the info log level.
func Infoc(ctx context.Context, format string, args ...interface{}) {
	h.WithContext(ctx).Infof(format, args...)
}

// Warnc logs a message at the warning log level.
func Warnc(ctx context.Context, format string, args ...interface{}) {
	h.WithContext(ctx).Warnf(format, args...)
}

// Errorc logs a message at the error log level.
func Errorc(ctx context.Context, format string, args ...interface{}) {
	h.WithContext(ctx).Errorf(format, args...)
}

// Infow logs a message with some additional context. The variadic key-value pairs are treated as they are in With.
func Infow(ctx context.Context, args ...interface{}) {
	h.WithContext(ctx).Infow(args...)
}

// Warnw logs a message with some additional context. The variadic key-value pairs are treated as they are in With.
func Warnw(ctx context.Context, args ...interface{}) {
	h.WithContext(ctx).Warnw(args...)
}

// Errorw logs a message with some additional context. The variadic key-value pairs are treated as they are in With.
func Errorw(ctx context.Context, args ...interface{}) {
	h.WithContext(ctx).Errorw(args...)
}
