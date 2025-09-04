package dto

import "time"

// PaginationResponse represents pagination metadata (enhanced version)
type PaginationResponse struct {
	Page     int   `json:"page"`
	Limit    int   `json:"limit"`
	Total    int64 `json:"total"`
	HasMore  bool  `json:"has_more"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	Errors  []string `json:"errors"`
}

// SuccessResponse represents a success response without data
type SuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// DataResponse represents a success response with data
type DataResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

// ListResponse represents a paginated list response
type ListResponse struct {
	Success    bool                `json:"success"`
	Data       interface{}         `json:"data"`
	Message    string              `json:"message"`
	Pagination PaginationResponse  `json:"pagination"`
}

// HealthResponse represents a health check response
type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
	Uptime    string    `json:"uptime"`
}

// ValidationErrorResponse represents validation errors
type ValidationErrorResponse struct {
	Success bool                       `json:"success"`
	Message string                     `json:"message"`
	Errors  map[string][]string        `json:"errors"`
}


// Helper functions for creating standardized responses

func NewSuccessResponse(message string) APIResponse {
	return APIResponse{
		Success: true,
		Message: message,
	}
}

func NewDataResponse(data interface{}, message string) APIResponse {
	return APIResponse{
		Success: true,
		Data:    data,
		Message: message,
	}
}

func NewErrorResponse(message string, errors ...string) APIResponse {
	return APIResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	}
}

func NewValidationErrorResponse(message string, errors map[string][]string) ValidationErrorResponse {
	return ValidationErrorResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	}
}

func NewListResponse(data interface{}, pagination PaginationResponse, message string) PaginatedResponse {
	return PaginatedResponse{
		Success: true,
		Data:    data,
		Message: message,
		Pagination: Pagination{
			Page:    pagination.Page,
			Limit:   pagination.Limit,
			Total:   int(pagination.Total),
			HasMore: pagination.HasMore,
		},
	}
}

func NewPaginationResponse(page, limit int, total int64) PaginationResponse {
	return PaginationResponse{
		Page:    page,
		Limit:   limit,
		Total:   total,
		HasMore: int64(page*limit) < total,
	}
}