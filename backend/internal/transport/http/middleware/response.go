package middleware

import (
	"fmt"
	"net/http"
	"time"

	"microbridge/backend/internal/dto"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/gin-gonic/gin"
)

// ResponseMiddleware provides standardized response handling
func ResponseMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Next()
	})
}

// HandleError standardizes error responses
func HandleError(c *gin.Context, err error) {
	if appErr, ok := err.(*apperrors.AppError); ok {
		c.JSON(appErr.Code, dto.APIResponse{
			Success: false,
			Message: appErr.Message,
			Errors:  []string{appErr.Message},
		})
		return
	}

	c.JSON(http.StatusInternalServerError, dto.APIResponse{
		Success: false,
		Message: "Internal server error",
		Errors:  []string{err.Error()},
	})
}

// HandleSuccess standardizes success responses
func HandleSuccess(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    data,
		Message: message,
	})
}

// HandleCreated standardizes created responses
func HandleCreated(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Data:    data,
		Message: message,
	})
}

// HandleNoContent standardizes no content responses
func HandleNoContent(c *gin.Context, message string) {
	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: message,
	})
}

// HandleUnauthorized standardizes unauthorized responses
func HandleUnauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "Unauthorized"
	}
	c.JSON(http.StatusUnauthorized, dto.APIResponse{
		Success: false,
		Message: message,
	})
}

// HandleForbidden standardizes forbidden responses
func HandleForbidden(c *gin.Context, message string) {
	if message == "" {
		message = "Forbidden"
	}
	c.JSON(http.StatusForbidden, dto.APIResponse{
		Success: false,
		Message: message,
	})
}

// HandleNotFound standardizes not found responses
func HandleNotFound(c *gin.Context, message string) {
	if message == "" {
		message = "Resource not found"
	}
	c.JSON(http.StatusNotFound, dto.APIResponse{
		Success: false,
		Message: message,
	})
}

// HandleBadRequest standardizes bad request responses
func HandleBadRequest(c *gin.Context, message string, errors ...string) {
	if message == "" {
		message = "Bad request"
	}
	c.JSON(http.StatusBadRequest, dto.APIResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}

// HandleConflict standardizes conflict responses
func HandleConflict(c *gin.Context, message string) {
	if message == "" {
		message = "Conflict"
	}
	c.JSON(http.StatusConflict, dto.APIResponse{
		Success: false,
		Message: message,
	})
}

// HandlePaginatedList standardizes paginated list responses
func HandlePaginatedList(c *gin.Context, data interface{}, pagination dto.PaginationResponse, message string) {
	c.JSON(http.StatusOK, dto.PaginatedResponse{
		Success: true,
		Data:    data,
		Message: message,
		Pagination: dto.Pagination{
			Page:    pagination.Page,
			Limit:   pagination.Limit,
			Total:   int(pagination.Total),
			HasMore: pagination.HasMore,
		},
	})
}


// CORS middleware for handling cross-origin requests
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Request-ID")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// RequestID middleware adds a unique request ID to each request
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}
		
		c.Header("X-Request-ID", requestID)
		c.Set("requestID", requestID)
		c.Next()
	}
}


// Helper function to generate request ID
func generateRequestID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}