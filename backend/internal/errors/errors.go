package errors

import (
	"fmt"
	"net/http"
)

type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
	Err     error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// Predefined errors
var (
	ErrUserNotFound      = &AppError{Code: http.StatusNotFound, Message: "User not found"}
	ErrUserAlreadyExists = &AppError{Code: http.StatusConflict, Message: "User already exists"}
	ErrJobNotFound       = &AppError{Code: http.StatusNotFound, Message: "Job not found"}
	ErrJobAlreadyExists  = &AppError{Code: http.StatusConflict, Message: "Job already exists"}
	ErrInvalidRequest    = &AppError{Code: http.StatusBadRequest, Message: "Invalid request"}
	ErrUnauthorized      = &AppError{Code: http.StatusUnauthorized, Message: "Unauthorized"}
	ErrForbidden         = &AppError{Code: http.StatusForbidden, Message: "Forbidden"}
	ErrInternalServer    = &AppError{Code: http.StatusInternalServerError, Message: "Internal server error"}
	ErrValidation        = &AppError{Code: http.StatusBadRequest, Message: "Validation failed"}
	ErrNotificationNotFound = &AppError{Code: http.StatusNotFound, Message: "Notification not found"}
	ErrApplicationNotFound  = &AppError{Code: http.StatusNotFound, Message: "Application not found"}
	ErrProjectNotFound      = &AppError{Code: http.StatusNotFound, Message: "Project not found"}
	ErrEmployerNotFound     = &AppError{Code: http.StatusNotFound, Message: "Employer not found"}
	ErrReviewNotFound       = &AppError{Code: http.StatusNotFound, Message: "Review not found"}
)

// Error constructors
func NewAppError(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

func NewValidationError(details string) *AppError {
	return &AppError{
		Code:    http.StatusBadRequest,
		Message: "Validation failed",
		Details: details,
	}
}

func NewNotFoundError(resource string) *AppError {
	return &AppError{
		Code:    http.StatusNotFound,
		Message: fmt.Sprintf("%s not found", resource),
	}
}

func NewConflictError(resource string) *AppError {
	return &AppError{
		Code:    http.StatusConflict,
		Message: fmt.Sprintf("%s already exists", resource),
	}
}

func NewUnauthorizedError(message string) *AppError {
	if message == "" {
		message = "Unauthorized access"
	}
	return &AppError{
		Code:    http.StatusUnauthorized,
		Message: message,
	}
}

func NewForbiddenError(message string) *AppError {
	if message == "" {
		message = "Access forbidden"
	}
	return &AppError{
		Code:    http.StatusForbidden,
		Message: message,
	}
}

func NewInternalServerError(err error) *AppError {
	return &AppError{
		Code:    http.StatusInternalServerError,
		Message: "Internal server error",
		Err:     err,
	}
}
