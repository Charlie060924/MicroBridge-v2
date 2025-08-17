package errors

import (
    "fmt"
    "net/http"

    "github.com/google/uuid"
)

type SecureError struct {
    Code          int    `json:"code"`
    Message       string `json:"message"`
    CorrelationID string `json:"correlation_id,omitempty"`
    Details       string `json:"details,omitempty"`
    InternalErr   error  `json:"-"` // Never expose internal errors
}

func (e *SecureError) Error() string {
    return fmt.Sprintf("[%s] %s", e.CorrelationID, e.Message)
}

// NewSecureError creates a new secure error with correlation ID
func NewSecureError(code int, message string, internalErr error) *SecureError {
    return &SecureError{
        Code:          code,
        Message:       message,
        CorrelationID: uuid.New().String(),
        InternalErr:   internalErr,
    }
}

// Predefined secure errors (no sensitive information)
var (
    ErrUnauthorized       = &SecureError{Code: http.StatusUnauthorized, Message: "Authentication required"}
    ErrForbidden          = &SecureError{Code: http.StatusForbidden, Message: "Access denied"}
    ErrNotFound           = &SecureError{Code: http.StatusNotFound, Message: "Resource not found"}
    ErrBadRequest         = &SecureError{Code: http.StatusBadRequest, Message: "Invalid request"}
    ErrValidationFailed   = &SecureError{Code: http.StatusBadRequest, Message: "Validation failed"}
    ErrConflict           = &SecureError{Code: http.StatusConflict, Message: "Resource already exists"}
    ErrInternalServer     = &SecureError{Code: http.StatusInternalServerError, Message: "Internal server error"}
    ErrServiceUnavailable = &SecureError{Code: http.StatusServiceUnavailable, Message: "Service temporarily unavailable"}
)
