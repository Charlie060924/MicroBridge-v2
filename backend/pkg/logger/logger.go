package logger

import (
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type Logger struct {
	logger zerolog.Logger
}

func New(level string, isDevelopment bool) *Logger {
	var l zerolog.Level
	switch level {
	case "debug":
		l = zerolog.DebugLevel
	case "info":
		l = zerolog.InfoLevel
	case "warn":
		l = zerolog.WarnLevel
	case "error":
		l = zerolog.ErrorLevel
	default:
		l = zerolog.InfoLevel
	}

	zerolog.SetGlobalLevel(l)

	var logger zerolog.Logger
	if isDevelopment {
		logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})
	} else {
		logger = zerolog.New(os.Stderr).With().Timestamp().Logger()
	}

	return &Logger{logger: logger}
}

func (l *Logger) Info() *zerolog.Event {
	return l.logger.Info()
}

func (l *Logger) Error() *zerolog.Event {
	return l.logger.Error()
}

func (l *Logger) Debug() *zerolog.Event {
	return l.logger.Debug()
}

func (l *Logger) Warn() *zerolog.Event {
	return l.logger.Warn()
}

func (l *Logger) Fatal() *zerolog.Event {
	return l.logger.Fatal()
}

func (l *Logger) With() zerolog.Context {
	return l.logger.With()
}

// Global logger instance
var globalLogger *Logger

func Init(level string, isDevelopment bool) {
	globalLogger = New(level, isDevelopment)
}

// Global logging functions
func Info() *zerolog.Event {
	if globalLogger == nil {
		return log.Info()
	}
	return globalLogger.Info()
}

func Error() *zerolog.Event {
	if globalLogger == nil {
		return log.Error()
	}
	return globalLogger.Error()
}

func Debug() *zerolog.Event {
	if globalLogger == nil {
		return log.Debug()
	}
	return globalLogger.Debug()
}

func Warn() *zerolog.Event {
	if globalLogger == nil {
		return log.Warn()
	}
	return globalLogger.Warn()
}

func Fatal() *zerolog.Event {
	if globalLogger == nil {
		return log.Fatal()
	}
	return globalLogger.Fatal()
}

func With() zerolog.Context {
	if globalLogger == nil {
		return log.With()
	}
	return globalLogger.With()
}
