package repository

import (
	"context"
	"errors"
	"time"
	"microbridge/backend/internal/models"
	apperrors "microbridge/backend/internal/shared/errors"

	"gorm.io/gorm"
)

type jobRepository struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) JobRepository {
	return &jobRepository{db: db}
}

func (r *jobRepository) Create(ctx context.Context, job *models.Job) error {
	if err := r.db.WithContext(ctx).Create(job).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to create job", err)
	}
	return nil
}

func (r *jobRepository) GetByID(ctx context.Context, id string) (*models.Job, error) {
	var job models.Job
	if err := r.db.WithContext(ctx).First(&job, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrJobNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get job", err)
	}
	return &job, nil
}

func (r *jobRepository) Update(ctx context.Context, job *models.Job) error {
	job.UpdatedAt = time.Now()
	if err := r.db.WithContext(ctx).Save(job).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to update job", err)
	}
	return nil
}

func (r *jobRepository) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Delete(&models.Job{}, "id = ?", id).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to delete job", err)
	}
	return nil
}

func (r *jobRepository) List(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*models.Job, int64, error) {
	var jobs []*models.Job
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Job{})

	// Apply filters
	for key, value := range filters {
		switch key {
		case "status":
			query = query.Where("status = ?", value)
		case "location":
			query = query.Where("location ILIKE ?", "%"+value.(string)+"%")
		case "experience_level":
			query = query.Where("experience_level = ?", value)
		case "is_remote":
			query = query.Where("is_remote = ?", value)
		case "employer_id":
			query = query.Where("employer_id = ?", value)
		}
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count jobs", err)
	}

	// Get paginated results
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&jobs).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get jobs", err)
	}

	return jobs, total, nil
}

func (r *jobRepository) GetByEmployerID(ctx context.Context, employerID string, limit, offset int) ([]*models.Job, int64, error) {
	return r.List(ctx, map[string]interface{}{"employer_id": employerID}, limit, offset)
}

func (r *jobRepository) Search(ctx context.Context, query string, filters map[string]interface{}, limit, offset int) ([]*models.Job, int64, error) {
	var jobs []*models.Job
	var total int64

	dbQuery := r.db.WithContext(ctx).Model(&models.Job{})

	// Add search query
	if query != "" {
		dbQuery = dbQuery.Where(
			"title ILIKE ? OR description ILIKE ? OR location ILIKE ?",
			"%"+query+"%", "%"+query+"%", "%"+query+"%",
		)
	}

	// Apply additional filters
	for key, value := range filters {
		switch key {
		case "status":
			dbQuery = dbQuery.Where("status = ?", value)
		case "location":
			dbQuery = dbQuery.Where("location ILIKE ?", "%"+value.(string)+"%")
		case "experience_level":
			dbQuery = dbQuery.Where("experience_level = ?", value)
		case "is_remote":
			dbQuery = dbQuery.Where("is_remote = ?", value)
		case "employer_id":
			dbQuery = dbQuery.Where("employer_id = ?", value)
		}
	}

	// Get total count
	if err := dbQuery.Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count jobs", err)
	}

	// Get paginated results
	if err := dbQuery.Offset(offset).Limit(limit).Order("created_at DESC").Find(&jobs).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to search jobs", err)
	}

	return jobs, total, nil
}

// GetActiveJobs returns active jobs for matching algorithm
func (r *jobRepository) GetActiveJobs(ctx context.Context, jobs *[]models.Job, limit int) error {
	return r.db.WithContext(ctx).
		Where("status = ?", "active").
		Limit(limit).
		Order("created_at DESC").
		Find(jobs).Error
}

// GetJobs returns jobs with pagination and filtering for the handler
func (r *jobRepository) GetJobs(ctx context.Context, jobs *[]models.Job, page, limit int, location string, skills []string) (int64, error) {
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Job{}).Where("status = ?", "active")

	// Apply location filter
	if location != "" {
		query = query.Where("location ILIKE ?", "%"+location+"%")
	}

	// Apply skills filter
	if len(skills) > 0 {
		for _, skill := range skills {
			query = query.Where("skills_required::text ILIKE ?", "%"+skill+"%")
		}
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return 0, err
	}

	// Get paginated results
	offset := (page - 1) * limit
	return total, query.Offset(offset).Limit(limit).Order("created_at DESC").Find(jobs).Error
}
