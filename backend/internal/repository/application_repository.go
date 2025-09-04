package repository

import (
	"context"
	"errors"
	"time"
	"microbridge/backend/internal/models"
	apperrors "microbridge/backend/internal/shared/errors"

	"gorm.io/gorm"
)

type applicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) ApplicationRepository {
	return &applicationRepository{db: db}
}

func (r *applicationRepository) Create(ctx context.Context, application *models.Application) error {
	if err := r.db.WithContext(ctx).Create(application).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to create application", err)
	}
	return nil
}

func (r *applicationRepository) GetByID(ctx context.Context, id string) (*models.Application, error) {
	var application models.Application
	if err := r.db.WithContext(ctx).First(&application, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NewAppError(404, "Application not found", nil)
		}
		return nil, apperrors.NewAppError(500, "Failed to get application", err)
	}
	return &application, nil
}

func (r *applicationRepository) Update(ctx context.Context, application *models.Application) error {
	application.UpdatedAt = time.Now()
	if err := r.db.WithContext(ctx).Save(application).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to update application", err)
	}
	return nil
}

func (r *applicationRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Delete(&models.Application{}, "id = ?", id)
	if result.Error != nil {
		return apperrors.NewAppError(500, "Failed to delete application", result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NewAppError(404, "Application not found", nil)
	}
	return nil
}

func (r *applicationRepository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Application, int64, error) {
	var applications []*models.Application
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).Model(&models.Application{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count user applications", err)
	}

	// Get paginated results
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&applications).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get user applications", err)
	}

	return applications, total, nil
}

func (r *applicationRepository) GetByJobID(ctx context.Context, jobID string, limit, offset int) ([]*models.Application, int64, error) {
	var applications []*models.Application
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).Model(&models.Application{}).Where("job_id = ?", jobID).Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count job applications", err)
	}

	// Get paginated results
	if err := r.db.WithContext(ctx).
		Where("job_id = ?", jobID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&applications).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get job applications", err)
	}

	return applications, total, nil
}

func (r *applicationRepository) GetByUserAndJob(ctx context.Context, userID, jobID string) (*models.Application, error) {
	var application models.Application
	if err := r.db.WithContext(ctx).First(&application, "user_id = ? AND job_id = ?", userID, jobID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NewAppError(404, "Application not found", nil)
		}
		return nil, apperrors.NewAppError(500, "Failed to get application", err)
	}
	return &application, nil
}

func (r *applicationRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	result := r.db.WithContext(ctx).
		Model(&models.Application{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		})

	if result.Error != nil {
		return apperrors.NewAppError(500, "Failed to update application status", result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.NewAppError(404, "Application not found", nil)
	}
	return nil
}

func (r *applicationRepository) List(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*models.Application, int64, error) {
	var applications []*models.Application
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Application{})

	// Apply filters
	for key, value := range filters {
		switch key {
		case "status":
			query = query.Where("status = ?", value)
		case "user_id":
			query = query.Where("user_id = ?", value)
		case "job_id":
			query = query.Where("job_id = ?", value)
		case "min_score":
			query = query.Where("match_score >= ?", value)
		case "max_score":
			query = query.Where("match_score <= ?", value)
		case "date_from":
			query = query.Where("applied_at >= ?", value)
		case "date_to":
			query = query.Where("applied_at <= ?", value)
		}
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count applications", err)
	}

	// Get paginated results
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&applications).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get applications", err)
	}

	return applications, total, nil
}

func (r *applicationRepository) GetApplicationsWithDetails(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*models.Application, int64, error) {
	var applications []*models.Application
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Application{}).Preload("Job").Preload("User")

	// Apply filters
	for key, value := range filters {
		switch key {
		case "status":
			query = query.Where("applications.status = ?", value)
		case "user_id":
			query = query.Where("applications.user_id = ?", value)
		case "job_id":
			query = query.Where("applications.job_id = ?", value)
		case "employer_id":
			query = query.Joins("JOIN jobs ON applications.job_id = jobs.id").Where("jobs.employer_id = ?", value)
		}
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count applications with details", err)
	}

	// Get paginated results
	if err := query.Offset(offset).Limit(limit).Order("applications.created_at DESC").Find(&applications).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get applications with details", err)
	}

	return applications, total, nil
}