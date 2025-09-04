package monitoring

import (
	"time"
	
	"github.com/gin-gonic/gin"
	"strconv"
)

// Global metrics instance
var globalMetrics *Metrics

// InitMetrics initializes the global metrics instance
func InitMetrics() {
	globalMetrics = NewMetrics()
}

// RecordHTTPRequest records HTTP request using global metrics
func RecordHTTPRequest(method, endpoint, statusCode string, duration time.Duration) {
	if globalMetrics != nil {
		globalMetrics.RecordHTTPRequest(method, endpoint, statusCode, "unknown", duration)
	}
}

// RecordDatabaseQuery records database query using global metrics
func RecordDatabaseQuery(queryType, table string, duration time.Duration) {
	if globalMetrics != nil {
		globalMetrics.RecordDatabaseQueryDuration(queryType, table, duration)
	}
}

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		
		c.Next()
		
		duration := time.Since(start)
		status := strconv.Itoa(c.Writer.Status())
		
		RecordHTTPRequest(
			c.Request.Method,
			c.FullPath(),
			status,
			duration,
		)
	}
}

func DatabaseMetricsMiddleware(queryType, table string) func() {
	start := time.Now()
	return func() {
		RecordDatabaseQuery(queryType, table, time.Since(start))
	}
}
