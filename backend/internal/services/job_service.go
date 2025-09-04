package services

import (
	"context"
	"time"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/google/uuid"
)

type JobService interface {
	CreateJob(ctx context.Context, employerID string, req dto.CreateJobRequest) (*dto.JobResponse, error)
	GetJob(ctx context.Context, id string) (*dto.JobResponse, error)
	UpdateJob(ctx context.Context, jobID string, employerID string, req dto.UpdateJobRequest) (*dto.JobResponse, error)
	DeleteJob(ctx context.Context, jobID string, employerID string) error
	ListJobs(ctx context.Context, filters dto.JobFilters, page, limit int) (*dto.PaginatedJobResponse, error)
	GetJobsByEmployer(ctx context.Context, employerID string, page, limit int) (*dto.PaginatedJobResponse, error)
	SearchJobs(ctx context.Context, query string, filters dto.JobFilters, page, limit int) (*dto.PaginatedJobResponse, error)
}

type jobService struct {
	jobRepo repository.JobRepository
}

func NewJobService(jobRepo repository.JobRepository) JobService {
	return &jobService{
		jobRepo: jobRepo,
	}
}

func (s *jobService) CreateJob(ctx context.Context, employerID string, req dto.CreateJobRequest) (*dto.JobResponse, error) {
	// Validate the request
	if err := s.validateCreateJobRequest(req); err != nil {
		return nil, err
	}

	// Create job model from request
	job := &models.Job{
		ID:           uuid.New().String(),
		EmployerID:   employerID,
		Title:        req.Title,
		Description:  req.Description,
		Company:      req.Company,
		Location:     req.Location,
		Duration:     req.Duration,
		Category:     req.Category,
		IsRemote:     req.IsRemote,
		JobType:      req.JobType,
		Status:       "draft", // Start as draft
		Skills:       s.convertToRequiredSkills(req.Skills),
		ExperienceLevel: req.ExperienceLevel,
		Salary:       req.Salary,
		Benefits:     req.Benefits,
		Requirements: req.Requirements,
		WorkArrangement: req.WorkArrangement,
		PreferredCandidates: req.PreferredCandidates,
		ApplicationDeadline: req.ApplicationDeadline,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		Views:        0,
		Applications: 0,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := s.jobRepo.Create(ctx, job); err != nil {
		return nil, err
	}

	return s.jobToResponse(job), nil
}

func (s *jobService) GetJob(ctx context.Context, id string) (*dto.JobResponse, error) {
	job, err := s.jobRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.jobToResponse(job), nil
}

func (s *jobService) UpdateJob(ctx context.Context, jobID string, employerID string, req dto.UpdateJobRequest) (*dto.JobResponse, error) {
	job, err := s.jobRepo.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	// Check if the employer owns this job
	if job.EmployerID != employerID {
		return nil, apperrors.NewAppError(403, "You don't have permission to update this job", nil)
	}

	// Update fields if provided
	if req.Title != nil {
		job.Title = *req.Title
	}
	if req.Description != nil {
		job.Description = *req.Description
	}
	if req.Location != nil {
		job.Location = *req.Location
	}
	if req.Category != nil {
		job.Category = *req.Category
	}
	if req.IsRemote != nil {
		job.IsRemote = *req.IsRemote
	}
	if req.JobType != nil {
		job.JobType = *req.JobType
	}
	if req.ExperienceLevel != nil {
		job.ExperienceLevel = *req.ExperienceLevel
	}
	if req.Status != nil {
		job.Status = *req.Status
	}
	if req.Duration != nil {
		job.Duration = *req.Duration
	}
	if req.Skills != nil && len(req.Skills) > 0 {
		job.Skills = s.convertToRequiredSkills(req.Skills)
	}
	if req.Salary != nil {
		job.Salary = *req.Salary
	}
	if req.Benefits != nil {
		job.Benefits = req.Benefits
	}
	if req.Requirements != nil {
		job.Requirements = req.Requirements
	}
	if req.WorkArrangement != nil {
		job.WorkArrangement = *req.WorkArrangement
	}
	if req.PreferredCandidates != nil {
		job.PreferredCandidates = *req.PreferredCandidates
	}
	if req.ApplicationDeadline != nil {
		job.ApplicationDeadline = req.ApplicationDeadline
	}
	if req.StartDate != nil {
		job.StartDate = req.StartDate
	}
	if req.EndDate != nil {
		job.EndDate = req.EndDate
	}

	job.UpdatedAt = time.Now()

	if err := s.jobRepo.Update(ctx, job); err != nil {
		return nil, err
	}

	return s.jobToResponse(job), nil
}

func (s *jobService) DeleteJob(ctx context.Context, jobID string, employerID string) error {
	job, err := s.jobRepo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}

	// Check if the employer owns this job
	if job.EmployerID != employerID {
		return apperrors.NewAppError(403, "You don't have permission to delete this job", nil)
	}

	return s.jobRepo.Delete(ctx, jobID)
}

func (s *jobService) ListJobs(ctx context.Context, filters dto.JobFilters, page, limit int) (*dto.PaginatedJobResponse, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit
	filterMap := s.filtersToMap(filters)

	jobs, total, err := s.jobRepo.List(ctx, filterMap, limit, offset)
	if err != nil {
		return nil, err
	}

	jobResponses := make([]*dto.JobResponse, len(jobs))
	for i, job := range jobs {
		jobResponses[i] = s.jobToResponse(job)
	}

	return &dto.PaginatedJobResponse{
		Jobs: jobResponses,
		Pagination: dto.PaginationResponse{
			Page:     page,
			Limit:    limit,
			Total:    total,
			HasMore:  int64(page*limit) < total,
		},
	}, nil
}

func (s *jobService) GetJobsByEmployer(ctx context.Context, employerID string, page, limit int) (*dto.PaginatedJobResponse, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	jobs, total, err := s.jobRepo.GetByEmployerID(ctx, employerID, limit, offset)
	if err != nil {
		return nil, err
	}

	jobResponses := make([]*dto.JobResponse, len(jobs))
	for i, job := range jobs {
		jobResponses[i] = s.jobToResponse(job)
	}

	return &dto.PaginatedJobResponse{
		Jobs: jobResponses,
		Pagination: dto.PaginationResponse{
			Page:     page,
			Limit:    limit,
			Total:    total,
			HasMore:  int64(page*limit) < total,
		},
	}, nil
}

func (s *jobService) SearchJobs(ctx context.Context, query string, filters dto.JobFilters, page, limit int) (*dto.PaginatedJobResponse, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit
	filterMap := s.filtersToMap(filters)

	jobs, total, err := s.jobRepo.Search(ctx, query, filterMap, limit, offset)
	if err != nil {
		return nil, err
	}

	jobResponses := make([]*dto.JobResponse, len(jobs))
	for i, job := range jobs {
		jobResponses[i] = s.jobToResponse(job)
	}

	return &dto.PaginatedJobResponse{
		Jobs: jobResponses,
		Pagination: dto.PaginationResponse{
			Page:     page,
			Limit:    limit,
			Total:    total,
			HasMore:  int64(page*limit) < total,
		},
	}, nil
}

// Helper methods

func (s *jobService) validateCreateJobRequest(req dto.CreateJobRequest) error {
	if req.Title == "" {
		return apperrors.NewAppError(400, "Job title is required", nil)
	}
	if req.Description == "" {
		return apperrors.NewAppError(400, "Job description is required", nil)
	}
	if req.Category == "" {
		return apperrors.NewAppError(400, "Job category is required", nil)
	}
	if len(req.Skills) == 0 {
		return apperrors.NewAppError(400, "At least one skill is required", nil)
	}

	return nil
}

func (s *jobService) convertToRequiredSkills(skillNames []dto.SkillRequest) models.RequiredSkillsArray {
	skills := make(models.RequiredSkillsArray, len(skillNames))
	for i, skillReq := range skillNames {
		skills[i] = models.RequiredSkill{
			Name:       skillReq.Name,
			Level:      skillReq.Level,
			IsRequired: skillReq.IsRequired,
			Importance: skillReq.Importance,
			CanLearn:   skillReq.CanLearn,
		}
	}
	return skills
}

func (s *jobService) filtersToMap(filters dto.JobFilters) map[string]interface{} {
	filterMap := make(map[string]interface{})

	if filters.Status != "" {
		filterMap["status"] = filters.Status
	}
	if filters.Location != "" {
		filterMap["location"] = filters.Location
	}
	if filters.ExperienceLevel != "" {
		filterMap["experience_level"] = filters.ExperienceLevel
	}
	if filters.IsRemote != nil {
		filterMap["is_remote"] = *filters.IsRemote
	}
	if filters.EmployerID != "" {
		filterMap["employer_id"] = filters.EmployerID
	}
	if filters.Category != "" {
		filterMap["category"] = filters.Category
	}
	if filters.JobType != "" {
		filterMap["job_type"] = filters.JobType
	}

	return filterMap
}

func (s *jobService) jobToResponse(job *models.Job) *dto.JobResponse {
	return &dto.JobResponse{
		ID:              job.ID,
		EmployerID:      job.EmployerID,
		Title:           job.Title,
		Description:     job.Description,
		Company:         job.Company,
		CompanyID:       job.CompanyID,
		Skills:          s.convertFromRequiredSkills(job.Skills),
		ExperienceLevel: job.ExperienceLevel,
		Location:        job.Location,
		Duration:        job.Duration,
		Category:        job.Category,
		IsRemote:        job.IsRemote,
		JobType:         job.JobType,
		Salary:          job.Salary,
		Benefits:        job.Benefits,
		Requirements:    job.Requirements,
		WorkArrangement: job.WorkArrangement,
		ApplicationDeadline: job.ApplicationDeadline,
		StartDate:       job.StartDate,
		EndDate:         job.EndDate,
		PreferredCandidates: job.PreferredCandidates,
		Status:          job.Status,
		Views:           job.Views,
		Applications:    job.Applications,
		ReviewDueDate:   job.ReviewDueDate,
		CompletedAt:     job.CompletedAt,
		HiredStudentID:  job.HiredStudentID,
		CreatedAt:       job.CreatedAt,
		UpdatedAt:       job.UpdatedAt,
	}
}

func (s *jobService) convertFromRequiredSkills(skills models.RequiredSkillsArray) []dto.SkillResponse {
	skillResponses := make([]dto.SkillResponse, len(skills))
	for i, skill := range skills {
		skillResponses[i] = dto.SkillResponse{
			Name:       skill.Name,
			Level:      skill.Level,
			IsRequired: skill.IsRequired,
			Importance: skill.Importance,
			CanLearn:   skill.CanLearn,
		}
	}
	return skillResponses
}