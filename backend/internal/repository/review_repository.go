package repository

import (
	"context"
	"errors"
	"time"
	"microbridge/backend/internal/models"
	apperrors "microbridge/backend/internal/shared/errors"

	"gorm.io/gorm"
)

type ReviewRepository interface {
	Create(ctx context.Context, review *models.Review) error
	GetByID(ctx context.Context, id string) (*models.Review, error)
	GetByJobID(ctx context.Context, jobID string) ([]*models.Review, error)
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Review, int64, error)
	GetByReviewerAndJob(ctx context.Context, reviewerID, jobID string) (*models.Review, error)
	GetByRevieweeAndJob(ctx context.Context, revieweeID, jobID string) (*models.Review, error)
	Update(ctx context.Context, review *models.Review) error
	Delete(ctx context.Context, id string) error
	GetUserReviewStats(ctx context.Context, userID string) (*UserReviewStats, error)
	UpdateReviewVisibility(ctx context.Context, jobID string) error
	// Missing methods that the service needs
	GetByJobAndReviewer(ctx context.Context, jobID, reviewerID string) (*models.Review, error)
	GetByReviewee(ctx context.Context, revieweeID string, limit, offset int) ([]*models.Review, int64, error)
	GetByJob(ctx context.Context, jobID string) ([]*models.Review, error)
}

type reviewRepository struct {
	db *gorm.DB
}

type UserReviewStats struct {
	UserID          string  `json:"user_id"`
	AverageRating   float64 `json:"average_rating"`
	TotalReviews    int64   `json:"total_reviews"`
	FiveStarCount   int64   `json:"five_star_count"`
	FourStarCount   int64   `json:"four_star_count"`
	ThreeStarCount  int64   `json:"three_star_count"`
	TwoStarCount    int64   `json:"two_star_count"`
	OneStarCount    int64   `json:"one_star_count"`
}

func NewReviewRepository(db *gorm.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(ctx context.Context, review *models.Review) error {
	if err := r.db.WithContext(ctx).Create(review).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to create review", err)
	}
	return nil
}

func (r *reviewRepository) GetByID(ctx context.Context, id string) (*models.Review, error) {
	var review models.Review
	if err := r.db.WithContext(ctx).
		Preload("Reviewer").
		Preload("Reviewee").
		Preload("Job").
		First(&review, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrReviewNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get review", err)
	}
	return &review, nil
}

func (r *reviewRepository) GetByJobID(ctx context.Context, jobID string) ([]*models.Review, error) {
	var reviews []*models.Review
	if err := r.db.WithContext(ctx).
		Preload("Reviewer").
		Preload("Reviewee").
		Preload("Job").
		Where("job_id = ?", jobID).
		Find(&reviews).Error; err != nil {
		return nil, apperrors.NewAppError(500, "Failed to get reviews for job", err)
	}
	return reviews, nil
}

func (r *reviewRepository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Review, int64, error) {
	var reviews []*models.Review
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).
		Model(&models.Review{}).
		Where("reviewee_id = ? AND is_visible = ?", userID, true).
		Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count reviews", err)
	}

	// Get reviews with pagination
	if err := r.db.WithContext(ctx).
		Preload("Reviewer").
		Preload("Reviewee").
		Preload("Job").
		Where("reviewee_id = ? AND is_visible = ?", userID, true).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get user reviews", err)
	}

	return reviews, total, nil
}

func (r *reviewRepository) GetByReviewerAndJob(ctx context.Context, reviewerID, jobID string) (*models.Review, error) {
	var review models.Review
	if err := r.db.WithContext(ctx).
		Preload("Reviewer").
		Preload("Reviewee").
		Preload("Job").
		Where("reviewer_id = ? AND job_id = ?", reviewerID, jobID).
		First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // No review found, not an error
		}
		return nil, apperrors.NewAppError(500, "Failed to get review", err)
	}
	return &review, nil
}

func (r *reviewRepository) GetByRevieweeAndJob(ctx context.Context, revieweeID, jobID string) (*models.Review, error) {
	var review models.Review
	if err := r.db.WithContext(ctx).
		Preload("Reviewer").
		Preload("Reviewee").
		Preload("Job").
		Where("reviewee_id = ? AND job_id = ?", revieweeID, jobID).
		First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // No review found, not an error
		}
		return nil, apperrors.NewAppError(500, "Failed to get review", err)
	}
	return &review, nil
}

func (r *reviewRepository) Update(ctx context.Context, review *models.Review) error {
	review.UpdatedAt = time.Now()
	if err := r.db.WithContext(ctx).Save(review).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to update review", err)
	}
	return nil
}

func (r *reviewRepository) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Delete(&models.Review{}, "id = ?", id).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to delete review", err)
	}
	return nil
}

func (r *reviewRepository) GetUserReviewStats(ctx context.Context, userID string) (*UserReviewStats, error) {
	var stats UserReviewStats
	
	// Get basic stats
	if err := r.db.WithContext(ctx).
		Model(&models.Review{}).
		Select(`
			reviewee_id as user_id,
			COUNT(*) as total_reviews,
			AVG(rating) as average_rating,
			SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star_count,
			SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star_count,
			SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star_count,
			SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star_count,
			SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star_count
		`).
		Where("reviewee_id = ? AND is_visible = ?", userID, true).
		Scan(&stats).Error; err != nil {
		return nil, apperrors.NewAppError(500, "Failed to get user review stats", err)
	}
	
	return &stats, nil
}

func (r *reviewRepository) UpdateReviewVisibility(ctx context.Context, jobID string) error {
	// Get all reviews for this job
	reviews, err := r.GetByJobID(ctx, jobID)
	if err != nil {
		return err
	}
	
	// If we have exactly 2 reviews (both parties), make them visible
	if len(reviews) == 2 {
		now := time.Now()
		for _, review := range reviews {
			review.IsVisible = true
			review.VisibleAt = &now
			if err := r.Update(ctx, review); err != nil {
				return err
			}
		}
	}
	
	// Check for reviews older than 14 days and make them visible
	for _, review := range reviews {
		if !review.IsVisible && time.Since(review.CreatedAt) >= 14*24*time.Hour {
			now := time.Now()
			review.IsVisible = true
			review.VisibleAt = &now
			if err := r.Update(ctx, review); err != nil {
				return err
			}
		}
	}
	
	return nil
}

// GetByJobAndReviewer finds a review by job ID and reviewer ID
func (r *reviewRepository) GetByJobAndReviewer(ctx context.Context, jobID, reviewerID string) (*models.Review, error) {
	var review models.Review
	if err := r.db.WithContext(ctx).
		Where("job_id = ? AND reviewer_id = ?", jobID, reviewerID).
		First(&review).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, apperrors.NewAppError(500, "Failed to get review", err)
	}
	return &review, nil
}

// GetByReviewee finds reviews for a reviewee with pagination
func (r *reviewRepository) GetByReviewee(ctx context.Context, revieweeID string, limit, offset int) ([]*models.Review, int64, error) {
	var reviews []*models.Review
	var total int64
	
	// Get total count
	if err := r.db.WithContext(ctx).Model(&models.Review{}).
		Where("reviewee_id = ?", revieweeID).
		Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count reviews", err)
	}
	
	// Get paginated reviews
	if err := r.db.WithContext(ctx).
		Where("reviewee_id = ?", revieweeID).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&reviews).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to get reviews by reviewee", err)
	}
	
	return reviews, total, nil
}

// GetByJob finds all reviews for a job (alias for GetByJobID for backwards compatibility)
func (r *reviewRepository) GetByJob(ctx context.Context, jobID string) ([]*models.Review, error) {
	return r.GetByJobID(ctx, jobID)
}
