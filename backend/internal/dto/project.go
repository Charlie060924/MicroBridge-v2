package dto

import "time"

// CreateProjectRequest represents the request to create a new project
type CreateProjectRequest struct {
	Title        string    `json:"title" validate:"required,min=3,max=100"`
	Description  string    `json:"description" validate:"required,min=10"`
	JobID        string    `json:"job_id" validate:"required"`
	FreelancerID string    `json:"freelancer_id" validate:"required"`
	Budget       float64   `json:"budget" validate:"min=0"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
}

// UpdateProjectRequest represents the request to update a project
type UpdateProjectRequest struct {
	Title       *string    `json:"title,omitempty" validate:"omitempty,min=3,max=100"`
	Description *string    `json:"description,omitempty" validate:"omitempty,min=10"`
	Budget      *float64   `json:"budget,omitempty" validate:"omitempty,min=0"`
	StartDate   *time.Time `json:"start_date,omitempty"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	Status      *string    `json:"status,omitempty" validate:"omitempty,oneof=active paused completed cancelled"`
}