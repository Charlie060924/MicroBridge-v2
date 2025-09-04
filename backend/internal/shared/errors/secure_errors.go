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
    ErrSecureUnauthorized       = &SecureError{Code: http.StatusUnauthorized, Message: "Authentication required"}
    ErrSecureForbidden          = &SecureError{Code: http.StatusForbidden, Message: "Access denied"}
    ErrSecureNotFound           = &SecureError{Code: http.StatusNotFound, Message: "Resource not found"}
    ErrSecureBadRequest         = &SecureError{Code: http.StatusBadRequest, Message: "Invalid request"}
    ErrSecureValidationFailed   = &SecureError{Code: http.StatusBadRequest, Message: "Validation failed"}
    ErrSecureConflict           = &SecureError{Code: http.StatusConflict, Message: "Resource already exists"}
    ErrSecureInternalServer     = &SecureError{Code: http.StatusInternalServerError, Message: "Internal server error"}
    ErrSecureServiceUnavailable = &SecureError{Code: http.StatusServiceUnavailable, Message: "Service temporarily unavailable"}
)
