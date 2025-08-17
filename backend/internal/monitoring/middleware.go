package monitoring

import (
	"time"
	
	"github.com/gin-gonic/gin"
	"strconv"
)

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
