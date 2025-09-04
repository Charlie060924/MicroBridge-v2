package services

import (
	"context"
	"fmt"
	"time"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/google/uuid"
)

type ApplicationService interface {
	SubmitApplication(ctx context.Context, userID string, req dto.CreateApplicationRequest) (*dto.ApplicationResponse, error)
	GetApplication(ctx context.Context, id string) (*dto.ApplicationResponse, error)
	UpdateApplication(ctx context.Context, applicationID string, req dto.UpdateApplicationRequest) (*dto.ApplicationResponse, error)
	WithdrawApplication(ctx context.Context, applicationID, userID string, req dto.ApplicationWithdrawalRequest) error
	GetUserApplications(ctx context.Context, userID string, page, limit int) (*dto.PaginatedApplicationResponse, error)
	GetJobApplications(ctx context.Context, jobID string, employerID string, page, limit int) (*dto.PaginatedApplicationResponse, error)
	GetApplicationDetails(ctx context.Context, applicationID string, requesterID string) (*dto.ApplicationResponse, error)
	UpdateApplicationStatus(ctx context.Context, applicationID, employerID string, req dto.ApplicationStatusUpdateRequest) (*dto.ApplicationResponse, error)
}

type applicationService struct {
	applicationRepo repository.ApplicationRepository
	jobRepo         repository.JobRepository
	userRepo        repository.UserRepository
}

func NewApplicationService(
	applicationRepo repository.ApplicationRepository,
	jobRepo repository.JobRepository,
	userRepo repository.UserRepository,
) ApplicationService {
	return &applicationService{
		applicationRepo: applicationRepo,
		jobRepo:         jobRepo,
		userRepo:        userRepo,
	}
}

func (s *applicationService) SubmitApplication(ctx context.Context, userID string, req dto.CreateApplicationRequest) (*dto.ApplicationResponse, error) {
	// Validate the request
	if err := s.validateCreateApplicationRequest(req); err != nil {
		return nil, err
	}

	// Check if job exists and is active
	job, err := s.jobRepo.GetByID(ctx, req.JobID)
	if err != nil {
		return nil, err
	}

	if job.Status != "posted" {
		return nil, apperrors.NewAppError(400, "Job is not accepting applications", nil)
	}

	// Check if user already applied for this job
	existingApplication, err := s.applicationRepo.GetByUserAndJob(ctx, userID, req.JobID)
	if err != nil && !apperrors.IsNotFoundError(err) {
		return nil, err
	}
	if existingApplication != nil {
		return nil, apperrors.NewAppError(409, "You have already applied for this job", nil)
	}

	// Get user profile for matching
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Create application
	application := &models.Application{
		ID:           uuid.New().String(),
		UserID:       userID,
		JobID:        req.JobID,
		Status:       "submitted",
		CoverLetter:  req.CoverLetter,
		CustomResume: req.CustomResume,
		MatchScore:   s.calculateMatchScore(user, job), // Simplified for now
		AppliedAt:    time.Now(),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.applicationRepo.Create(ctx, application); err != nil {
		return nil, err
	}

	// Update job application count
	job.Applications++
	if err := s.jobRepo.Update(ctx, job); err != nil {
		// Log error but don't fail the application creation
	}

	return s.applicationToResponse(application, job, user), nil
}

func (s *applicationService) GetApplication(ctx context.Context, id string) (*dto.ApplicationResponse, error) {
	application, err := s.applicationRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Get job and user details
	job, err := s.jobRepo.GetByID(ctx, application.JobID)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByID(ctx, application.UserID)
	if err != nil {
		return nil, err
	}

	return s.applicationToResponse(application, job, user), nil
}

func (s *applicationService) UpdateApplication(ctx context.Context, applicationID string, req dto.UpdateApplicationRequest) (*dto.ApplicationResponse, error) {
	application, err := s.applicationRepo.GetByID(ctx, applicationID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.Status != "" {
		application.Status = req.Status
	}
	if req.CoverLetter != "" {
		application.CoverLetter = req.CoverLetter
	}
	if req.CustomResume != "" {
		application.CustomResume = req.CustomResume
	}
	if req.EmployerFeedback != "" {
		application.EmployerFeedback = req.EmployerFeedback
	}
	if req.CandidateFeedback != "" {
		application.CandidateFeedback = req.CandidateFeedback
	}
	if req.InternalNotes != "" {
		application.InternalNotes = req.InternalNotes
	}

	application.UpdatedAt = time.Now()

	if err := s.applicationRepo.Update(ctx, application); err != nil {
		return nil, err
	}

	// Get job and user details
	job, err := s.jobRepo.GetByID(ctx, application.JobID)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByID(ctx, application.UserID)
	if err != nil {
		return nil, err
	}

	return s.applicationToResponse(application, job, user), nil
}

func (s *applicationService) WithdrawApplication(ctx context.Context, applicationID, userID string, req dto.ApplicationWithdrawalRequest) error {
	application, err := s.applicationRepo.GetByID(ctx, applicationID)
	if err != nil {
		return err
	}

	// Check if the user owns this application
	if application.UserID != userID {
		return apperrors.NewAppError(403, "You don't have permission to withdraw this application", nil)
	}

	// Check if application can be withdrawn
	if application.Status == "accepted" || application.Status == "rejected" {
		return apperrors.NewAppError(400, "Cannot withdraw application that has been finalized", nil)
	}

	// Update application status
	application.Status = "withdrawn"
	application.CandidateFeedback = req.Reason
	application.UpdatedAt = time.Now()

	return s.applicationRepo.Update(ctx, application)
}

func (s *applicationService) GetUserApplications(ctx context.Context, userID string, page, limit int) (*dto.PaginatedApplicationResponse, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	applications, total, err := s.applicationRepo.GetByUserID(ctx, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	applicationResponses := make([]*dto.ApplicationResponse, len(applications))
	for i, app := range applications {
		// Get job details
		job, err := s.jobRepo.GetByID(ctx, app.JobID)
		if err != nil {
			// If job is deleted, show minimal info
			job = &models.Job{
				ID:       app.JobID,
				Title:    "Job No Longer Available",
				Company:  "Unknown",
				Location: "Unknown",
				Status:   "archived",
			}
		}

		user, err := s.userRepo.GetByID(ctx, app.UserID)
		if err != nil {
			continue // Skip if user not found
		}

		applicationResponses[i] = s.applicationToResponse(app, job, user)
	}

	return &dto.PaginatedApplicationResponse{
		Applications: applicationResponses,
		Pagination: dto.PaginationResponse{
			Page:    page,
			Limit:   limit,
			Total:   total,
			HasMore: int64(page*limit) < total,
		},
	}, nil
}

func (s *applicationService) GetJobApplications(ctx context.Context, jobID string, employerID string, page, limit int) (*dto.PaginatedApplicationResponse, error) {
	// Verify that the employer owns this job
	job, err := s.jobRepo.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if job.EmployerID != employerID {
		return nil, apperrors.NewAppError(403, "You don't have permission to view these applications", nil)
	}

	if page <= 0 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	applications, total, err := s.applicationRepo.GetByJobID(ctx, jobID, limit, offset)
	if err != nil {
		return nil, err
	}

	applicationResponses := make([]*dto.ApplicationResponse, len(applications))
	for i, app := range applications {
		user, err := s.userRepo.GetByID(ctx, app.UserID)
		if err != nil {
			continue // Skip if user not found
		}

		applicationResponses[i] = s.applicationToResponse(app, job, user)
	}

	return &dto.PaginatedApplicationResponse{
		Applications: applicationResponses,
		Pagination: dto.PaginationResponse{
			Page:    page,
			Limit:   limit,
			Total:   total,
			HasMore: int64(page*limit) < total,
		},
	}, nil
}

func (s *applicationService) GetApplicationDetails(ctx context.Context, applicationID string, requesterID string) (*dto.ApplicationResponse, error) {
	application, err := s.applicationRepo.GetByID(ctx, applicationID)
	if err != nil {
		return nil, err
	}

	// Get job and verify permission
	job, err := s.jobRepo.GetByID(ctx, application.JobID)
	if err != nil {
		return nil, err
	}

	// Check if requester has permission (either applicant or job employer)
	if application.UserID != requesterID && job.EmployerID != requesterID {
		return nil, apperrors.NewAppError(403, "You don't have permission to view this application", nil)
	}

	user, err := s.userRepo.GetByID(ctx, application.UserID)
	if err != nil {
		return nil, err
	}

	return s.applicationToResponse(application, job, user), nil
}

func (s *applicationService) UpdateApplicationStatus(ctx context.Context, applicationID, employerID string, req dto.ApplicationStatusUpdateRequest) (*dto.ApplicationResponse, error) {
	application, err := s.applicationRepo.GetByID(ctx, applicationID)
	if err != nil {
		return nil, err
	}

	// Verify that the employer owns this job
	job, err := s.jobRepo.GetByID(ctx, application.JobID)
	if err != nil {
		return nil, err
	}

	if job.EmployerID != employerID {
		return nil, apperrors.NewAppError(403, "You don't have permission to update this application", nil)
	}

	// Update application
	application.Status = req.Status
	application.EmployerFeedback = req.Feedback
	application.InterviewScheduled = req.InterviewScheduled
	application.InterviewNotes = req.InterviewNotes
	application.UpdatedAt = time.Now()

	// Set response timestamp for final decisions
	if req.Status == "accepted" || req.Status == "rejected" {
		now := time.Now()
		application.ResponseAt = &now
	}

	if err := s.applicationRepo.Update(ctx, application); err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByID(ctx, application.UserID)
	if err != nil {
		return nil, err
	}

	return s.applicationToResponse(application, job, user), nil
}

// Helper methods

func (s *applicationService) validateCreateApplicationRequest(req dto.CreateApplicationRequest) error {
	if req.JobID == "" {
		return apperrors.NewAppError(400, "Job ID is required", nil)
	}
	if req.CoverLetter == "" {
		return apperrors.NewAppError(400, "Cover letter is required", nil)
	}
	if len(req.CoverLetter) < 10 {
		return apperrors.NewAppError(400, "Cover letter must be at least 10 characters", nil)
	}

	return nil
}

func (s *applicationService) calculateMatchScore(user *models.User, job *models.Job) float64 {
	// Simplified matching score calculation
	// In a real implementation, this would use a sophisticated matching algorithm
	score := 0.5 // Base score

	// Skill matching (simplified)
	userSkillMap := make(map[string]bool)
	for _, skill := range user.Skills {
		userSkillMap[skill.Name] = true
	}

	matchedSkills := 0
	totalSkills := len(job.Skills)
	for _, reqSkill := range job.Skills {
		if userSkillMap[reqSkill.Name] {
			matchedSkills++
		}
	}

	if totalSkills > 0 {
		skillScore := float64(matchedSkills) / float64(totalSkills)
		score = (score + skillScore) / 2
	}

	// Experience level matching
	if user.ExperienceLevel == job.ExperienceLevel {
		score += 0.1
	}

	// Location matching
	if user.Location == job.Location || job.IsRemote {
		score += 0.1
	}

	// Ensure score is between 0 and 1
	if score > 1.0 {
		score = 1.0
	}
	if score < 0.0 {
		score = 0.0
	}

	return score
}

func (s *applicationService) applicationToResponse(application *models.Application, job *models.Job, user *models.User) *dto.ApplicationResponse {
	response := &dto.ApplicationResponse{
		ID:                 application.ID,
		JobID:              application.JobID,
		UserID:             application.UserID,
		Status:             application.Status,
		CoverLetter:        application.CoverLetter,
		CustomResume:       application.CustomResume,
		MatchScore:         application.MatchScore,
		AppliedAt:          application.AppliedAt,
		ReviewedAt:         application.ReviewedAt,
		ResponseAt:         application.ResponseAt,
		EmployerFeedback:   application.EmployerFeedback,
		CandidateFeedback:  application.CandidateFeedback,
		InternalNotes:      application.InternalNotes,
		InterviewScheduled: application.InterviewScheduled,
		InterviewNotes:     application.InterviewNotes,
		CreatedAt:          application.CreatedAt,
		UpdatedAt:          application.UpdatedAt,
	}

	// Add job summary
	if job != nil {
		salaryStr := ""
		if job.Salary.Min > 0 || job.Salary.Max > 0 {
			if job.Salary.Min == job.Salary.Max {
				salaryStr = fmt.Sprintf("%s %d %s", job.Salary.Currency, job.Salary.Min, job.Salary.Period)
			} else {
				salaryStr = fmt.Sprintf("%s %d-%d %s", job.Salary.Currency, job.Salary.Min, job.Salary.Max, job.Salary.Period)
			}
		}

		response.Job = &dto.JobSummaryResponse{
			ID:       job.ID,
			Title:    job.Title,
			Company:  job.Company,
			Location: job.Location,
			Salary:   salaryStr,
			Duration: fmt.Sprintf("%d weeks", job.Duration),
			Category: job.Category,
			IsRemote: job.IsRemote,
			Status:   job.Status,
		}
	}

	// Add user summary
	if user != nil {
		skillNames := make([]string, len(user.Skills))
		for i, skill := range user.Skills {
			skillNames[i] = skill.Name
		}

		response.Applicant = &dto.UserSummaryResponse{
			ID:              user.ID,
			Name:            user.Name,
			Email:           user.Email,
			UserType:        user.UserType,
			ExperienceLevel: user.ExperienceLevel,
			Location:        user.Location,
			Bio:             user.Bio,
			Skills:          skillNames,
			Level:           user.Level,
			XP:              user.XP,
		}
	}

	return response
}