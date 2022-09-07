package cron

import (
	"toucan-leaderboard/common/library/log"
	"strings"
)

type cronLogger struct {
}

func NewCronLogger() *cronLogger {
	return &cronLogger{}
}

func (cl cronLogger) Info(msg string, keysAndValues ...interface{}) {
	log.Info(formatString(len(keysAndValues)), append([]interface{}{"[CronUtil][inner]" + msg}, keysAndValues...)...)
}

func (cl cronLogger) Error(err error, msg string, keysAndValues ...interface{}) {
	log.Error(formatString(len(keysAndValues)+2), append([]interface{}{"[CronUtil][inner]" + msg, "error", err}, keysAndValues...)...)
}

func formatString(numKeysAndValues int) string {
	var sb strings.Builder
	sb.WriteString("%s")
	if numKeysAndValues > 0 {
		sb.WriteString(", ")
	}
	for i := 0; i < numKeysAndValues/2; i++ {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString("%v=%v")
	}
	return sb.String()
}
