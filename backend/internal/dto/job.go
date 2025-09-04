package dto

import (
	"time"
	"microbridge/backend/internal/models"
)

// CreateJobRequest represents the request to create a new job
type CreateJobRequest struct {
	Title               string                     `json:"title" validate:"required,min=3,max=100"`
	Description         string                     `json:"description" validate:"required,min=10"`
	Company             string                     `json:"company"`
	Skills              []SkillRequest             `json:"skills" validate:"required,min=1"`
	ExperienceLevel     string                     `json:"experience_level" validate:"oneof=entry intermediate advanced senior expert"`
	Location            string                     `json:"location"`
	Duration            int                        `json:"duration"`
	Category            string                     `json:"category" validate:"required"`
	IsRemote            bool                       `json:"is_remote"`
	JobType             string                     `json:"job_type" validate:"required,oneof=full-time part-time contract internship"`
	Salary              models.SalaryRange         `json:"salary"`
	Benefits            models.StringArray         `json:"benefits"`
	Requirements        models.StringArray         `json:"requirements"`
	WorkArrangement     models.WorkArrangement     `json:"work_arrangement"`
	PreferredCandidates models.CandidatePreferences `json:"preferred_candidates"`
	ApplicationDeadline *time.Time                 `json:"application_deadline,omitempty"`
	StartDate           *time.Time                 `json:"start_date,omitempty"`
	EndDate             *time.Time                 `json:"end_date,omitempty"`
}

// UpdateJobRequest represents the request to update a job
type UpdateJobRequest struct {
	Title               *string                     `json:"title,omitempty" validate:"omitempty,min=3,max=100"`
	Description         *string                     `json:"description,omitempty" validate:"omitempty,min=10"`
	Skills              []SkillRequest              `json:"skills,omitempty"`
	ExperienceLevel     *string                     `json:"experience_level,omitempty" validate:"omitempty,oneof=entry intermediate advanced senior expert"`
	Location            *string                     `json:"location,omitempty"`
	Duration            *int                        `json:"duration,omitempty"`
	IsRemote            *bool                       `json:"is_remote,omitempty"`
	JobType             *string                     `json:"job_type,omitempty" validate:"omitempty,oneof=full-time part-time contract internship"`
	Category            *string                     `json:"category,omitempty"`
	Status              *string                     `json:"status,omitempty" validate:"omitempty,oneof=draft posted hired in_progress submitted review_pending completed disputed archived"`
	Salary              *models.SalaryRange         `json:"salary,omitempty"`
	Benefits            models.StringArray          `json:"benefits,omitempty"`
	Requirements        models.StringArray          `json:"requirements,omitempty"`
	WorkArrangement     *models.WorkArrangement     `json:"work_arrangement,omitempty"`
	PreferredCandidates *models.CandidatePreferences `json:"preferred_candidates,omitempty"`
	ApplicationDeadline *time.Time                  `json:"application_deadline,omitempty"`
	StartDate           *time.Time                  `json:"start_date,omitempty"`
	EndDate             *time.Time                  `json:"end_date,omitempty"`
}

// JobFilters represents filters for job queries
type JobFilters struct {
	Category        string   `json:"category"`
	Skills          []string `json:"skills"`
	Location        string   `json:"location"`
	IsRemote        *bool    `json:"is_remote"`
	JobType         string   `json:"job_type"`
	ExperienceLevel string   `json:"experience_level"`
	Status          string   `json:"status"`
	EmployerID      string   `json:"employer_id"`
}

// SkillRequest represents a skill requirement in requests
type SkillRequest struct {
	Name       string  `json:"name" validate:"required"`
	Level      int     `json:"level" validate:"min=1,max=5"`
	IsRequired bool    `json:"is_required"`
	Importance float64 `json:"importance" validate:"min=0,max=1"`
	CanLearn   bool    `json:"can_learn"`
}

// SkillResponse represents a skill in responses
type SkillResponse struct {
	Name       string  `json:"name"`
	Level      int     `json:"level"`
	IsRequired bool    `json:"is_required"`
	Importance float64 `json:"importance"`
	CanLearn   bool    `json:"can_learn"`
}

// JobResponse represents a job in API responses
type JobResponse struct {
	ID                  string                     `json:"id"`
	EmployerID          string                     `json:"employer_id"`
	Title               string                     `json:"title"`
	Description         string                     `json:"description"`
	Company             string                     `json:"company"`
	CompanyID           string                     `json:"company_id"`
	Skills              []SkillResponse            `json:"skills"`
	ExperienceLevel     string                     `json:"experience_level"`
	Location            string                     `json:"location"`
	Duration            int                        `json:"duration"`
	Category            string                     `json:"category"`
	IsRemote            bool                       `json:"is_remote"`
	JobType             string                     `json:"job_type"`
	Salary              models.SalaryRange         `json:"salary"`
	Benefits            models.StringArray         `json:"benefits"`
	Requirements        models.StringArray         `json:"requirements"`
	WorkArrangement     models.WorkArrangement     `json:"work_arrangement"`
	ApplicationDeadline *time.Time                 `json:"application_deadline,omitempty"`
	StartDate           *time.Time                 `json:"start_date,omitempty"`
	EndDate             *time.Time                 `json:"end_date,omitempty"`
	PreferredCandidates models.CandidatePreferences `json:"preferred_candidates"`
	Status              string                     `json:"status"`
	Views               int                        `json:"views"`
	Applications        int                        `json:"applications"`
	ReviewDueDate       *time.Time                 `json:"review_due_date,omitempty"`
	CompletedAt         *time.Time                 `json:"completed_at,omitempty"`
	HiredStudentID      *string                    `json:"hired_student_id,omitempty"`
	CreatedAt           time.Time                  `json:"created_at"`
	UpdatedAt           time.Time                  `json:"updated_at"`
}

// PaginatedJobResponse represents a paginated list of jobs
type PaginatedJobResponse struct {
	Jobs       []*JobResponse      `json:"jobs"`
	Pagination PaginationResponse  `json:"pagination"`
}

// JobRecommendation represents a job recommendation
type JobRecommendation struct {
	JobID       string    `json:"job_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Skills      []string  `json:"skills"`
	Budget      float64   `json:"budget"`
	Location    string    `json:"location"`
	IsRemote    bool      `json:"is_remote"`
	MatchScore  float64   `json:"match_score"`
	Reasons     []string  `json:"reasons"`
	CreatedAt   time.Time `json:"created_at"`
}