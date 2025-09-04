package dto

import (
	"time"
)

type CreateApplicationRequest struct {
	JobID       string `json:"job_id" validate:"required"`
	CoverLetter string `json:"cover_letter" validate:"required,min=10,max=2000"`
	CustomResume string `json:"custom_resume,omitempty"`
}

type UpdateApplicationRequest struct {
	Status            string `json:"status,omitempty" validate:"omitempty,application_status"`
	CoverLetter       string `json:"cover_letter,omitempty" validate:"omitempty,min=10,max=2000"`
	CustomResume      string `json:"custom_resume,omitempty"`
	EmployerFeedback  string `json:"employer_feedback,omitempty"`
	CandidateFeedback string `json:"candidate_feedback,omitempty"`
	InternalNotes     string `json:"internal_notes,omitempty"`
}

type ApplicationResponse struct {
	ID                string     `json:"id"`
	JobID             string     `json:"job_id"`
	UserID            string     `json:"user_id"`
	Status            string     `json:"status"`
	CoverLetter       string     `json:"cover_letter"`
	CustomResume      string     `json:"custom_resume,omitempty"`
	MatchScore        float64    `json:"match_score"`
	AppliedAt         time.Time  `json:"applied_at"`
	ReviewedAt        *time.Time `json:"reviewed_at,omitempty"`
	ResponseAt        *time.Time `json:"response_at,omitempty"`
	EmployerFeedback  string     `json:"employer_feedback,omitempty"`
	CandidateFeedback string     `json:"candidate_feedback,omitempty"`
	InternalNotes     string     `json:"internal_notes,omitempty"`
	InterviewScheduled *time.Time `json:"interview_scheduled,omitempty"`
	InterviewNotes    string     `json:"interview_notes,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
	
	// Related data
	Job               *JobSummaryResponse `json:"job,omitempty"`
	Applicant         *UserSummaryResponse `json:"applicant,omitempty"`
}

type JobSummaryResponse struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Company     string `json:"company"`
	Location    string `json:"location"`
	Salary      string `json:"salary"`
	Duration    string `json:"duration"`
	Category    string `json:"category"`
	IsRemote    bool   `json:"is_remote"`
	Status      string `json:"status"`
}

type UserSummaryResponse struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	UserType        string `json:"user_type"`
	ExperienceLevel string `json:"experience_level"`
	Location        string `json:"location"`
	Bio             string `json:"bio"`
	Skills          []string `json:"skills"`
	Level           int     `json:"level"`
	XP              int     `json:"xp"`
}

type ApplicationListResponse struct {
	Applications []ApplicationResponse `json:"applications"`
	Total        int64                `json:"total"`
	Page         int                  `json:"page"`
	Limit        int                  `json:"limit"`
	TotalPages   int                  `json:"total_pages"`
}

type PaginatedApplicationResponse struct {
	Applications []*ApplicationResponse `json:"applications"`
	Pagination   PaginationResponse     `json:"pagination"`
}

type ApplicationStatusUpdateRequest struct {
	Status string `json:"status" validate:"required,application_status"`
	Feedback string `json:"feedback,omitempty"`
	InterviewScheduled *time.Time `json:"interview_scheduled,omitempty"`
	InterviewNotes string `json:"interview_notes,omitempty"`
}

type ApplicationWithdrawalRequest struct {
	Reason string `json:"reason,omitempty"`
}

type ApplicationFilters struct {
	Status     string `json:"status,omitempty"`
	JobID      string `json:"job_id,omitempty"`
	UserID     string `json:"user_id,omitempty"`
	DateFrom   string `json:"date_from,omitempty"`
	DateTo     string `json:"date_to,omitempty"`
	MinScore   float64 `json:"min_score,omitempty"`
	MaxScore   float64 `json:"max_score,omitempty"`
}
