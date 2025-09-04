package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"microbridge/backend/pkg/logger"
)

// RequestLogger logs HTTP requests with structured logging
func RequestLogger() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()

		if raw != "" {
			path = path + "?" + raw
		}

		logger.Info().
			Str("client_ip", clientIP).
			Str("method", method).
			Str("path", path).
			Int("status_code", statusCode).
			Dur("latency", latency).
			Str("user_agent", c.Request.UserAgent()).
			Msg("HTTP Request")
	})
}

// SecurityHeaders adds security headers
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

// ErrorHandler handles application errors
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			logger.Error().
				Err(err.Err).
				Str("path", c.Request.URL.Path).
				Str("method", c.Request.Method).
				Msg("Request error")

			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error",
			})
		}
	}
}

// BasicRateLimiter middleware for rate limiting (placeholder implementation)
func BasicRateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: Implement actual rate limiting logic
		// This is a placeholder for future implementation
		c.Next()
	}
}

// RequestTimeout middleware for request timeout
func RequestTimeout(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: Implement request timeout logic
		// This is a placeholder for future implementation
		c.Next()
	}
}
