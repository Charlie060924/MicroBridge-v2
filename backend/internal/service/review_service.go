package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
	"your-project/internal/models"
	"your-project/internal/repository"
)

// ReviewService handles all review-related business logic
type ReviewService struct {
	reviewRepo repository.ReviewRepository
	jobRepo    repository.JobRepository
	userRepo   repository.UserRepository
	db         *gorm.DB
}

// NewReviewService creates a new review service instance
func NewReviewService(
	reviewRepo repository.ReviewRepository,
	jobRepo repository.JobRepository,
	userRepo repository.UserRepository,
	db *gorm.DB,
) *ReviewService {
	return &ReviewService{
		reviewRepo: reviewRepo,
		jobRepo:    jobRepo,
		userRepo:   userRepo,
		db:         db,
	}
}

// ReviewData represents the data needed to create a review
type ReviewData struct {
	JobID            string                 `json:"job_id" validate:"required"`
	ReviewerID       string                 `json:"reviewer_id" validate:"required"`
	RevieweeID       string                 `json:"reviewee_id" validate:"required"`
	Rating           int                    `json:"rating" validate:"required,min=1,max=5"`
	Comment          string                 `json:"comment" validate:"required,min=10,max=1000"`
	CategoryRatings  map[string]int         `json:"category_ratings" validate:"required"`
	Anonymous        bool                   `json:"anonymous"`
}

// ReviewResponse represents a review with related data
type ReviewResponse struct {
	ID              string                 `json:"id"`
	JobID           string                 `json:"job_id"`
	ReviewerID      string                 `json:"reviewer_id"`
	RevieweeID      string                 `json:"reviewee_id"`
	Rating          int                    `json:"rating"`
	Comment         string                 `json:"comment"`
	CategoryRatings map[string]int         `json:"category_ratings"`
	Anonymous       bool                   `json:"anonymous"`
	IsVisible       bool                   `json:"is_visible"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
	Reviewer        *models.User           `json:"reviewer,omitempty"`
	Reviewee        *models.User           `json:"reviewee,omitempty"`
	Job             *models.Job            `json:"job,omitempty"`
}

// UserReviewsResponse represents paginated user reviews
type UserReviewsResponse struct {
	Reviews       []ReviewResponse `json:"reviews"`
	Total         int64            `json:"total"`
	AverageRating float64          `json:"average_rating"`
	TotalReviews  int64            `json:"total_reviews"`
}

// CreateReview creates a new review with double-blind logic
func (s *ReviewService) CreateReview(ctx context.Context, data ReviewData) (*ReviewResponse, error) {
	// Validate review data
	if err := s.validateReviewData(ctx, data); err != nil {
		return nil, err
	}

	// Check if user already reviewed this job
	existingReview, err := s.reviewRepo.GetByJobAndReviewer(ctx, data.JobID, data.ReviewerID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to check existing review: %w", err)
	}

	if existingReview != nil {
		return nil, errors.New("user has already reviewed this job")
	}

	// Create the review
	review := &models.Review{
		JobID:           data.JobID,
		ReviewerID:      data.ReviewerID,
		RevieweeID:      data.RevieweeID,
		Rating:          data.Rating,
		Comment:         data.Comment,
		CategoryRatings: data.CategoryRatings,
		Anonymous:       data.Anonymous,
		IsVisible:       false, // Start as hidden for double-blind
	}

	if err := s.reviewRepo.Create(ctx, review); err != nil {
		return nil, fmt.Errorf("failed to create review: %w", err)
	}

	// Check if both parties have reviewed (double-blind logic)
	if err := s.updateReviewVisibility(ctx, data.JobID); err != nil {
		return nil, fmt.Errorf("failed to update review visibility: %w", err)
	}

	// Get the created review with related data
	return s.getReviewWithData(ctx, review.ID)
}

// GetUserReviews gets paginated reviews for a user
func (s *ReviewService) GetUserReviews(ctx context.Context, userID string, limit, offset int) (*UserReviewsResponse, error) {
	// Get reviews
	reviews, total, err := s.reviewRepo.GetByReviewee(ctx, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get user reviews: %w", err)
	}

	// Calculate average rating
	var totalRating int
	visibleReviews := 0
	for _, review := range reviews {
		if review.IsVisible {
			totalRating += review.Rating
			visibleReviews++
		}
	}

	var averageRating float64
	if visibleReviews > 0 {
		averageRating = float64(totalRating) / float64(visibleReviews)
	}

	// Convert to response format
	reviewResponses := make([]ReviewResponse, 0, len(reviews))
	for _, review := range reviews {
		if review.IsVisible {
			response, err := s.getReviewWithData(ctx, review.ID)
			if err != nil {
				continue // Skip reviews with missing data
			}
			reviewResponses = append(reviewResponses, *response)
		}
	}

	return &UserReviewsResponse{
		Reviews:       reviewResponses,
		Total:         total,
		AverageRating: averageRating,
		TotalReviews:  int64(visibleReviews),
	}, nil
}

// GetJobReviews gets all visible reviews for a job
func (s *ReviewService) GetJobReviews(ctx context.Context, jobID string) ([]ReviewResponse, error) {
	reviews, err := s.reviewRepo.GetByJob(ctx, jobID)
	if err != nil {
		return nil, fmt.Errorf("failed to get job reviews: %w", err)
	}

	// Filter visible reviews and convert to response format
	reviewResponses := make([]ReviewResponse, 0)
	for _, review := range reviews {
		if review.IsVisible {
			response, err := s.getReviewWithData(ctx, review.ID)
			if err != nil {
				continue
			}
			reviewResponses = append(reviewResponses, *response)
		}
	}

	return reviewResponses, nil
}

// CompleteJob marks a job as completed and triggers review period
func (s *ReviewService) CompleteJob(ctx context.Context, jobID, userID string) error {
	// Get the job
	job, err := s.jobRepo.GetByID(ctx, jobID)
	if err != nil {
		return fmt.Errorf("failed to get job: %w", err)
	}

	// Check if user is authorized to complete this job
	if job.EmployerID != userID && job.HiredStudentID != userID {
		return errors.New("not authorized to complete this job")
	}

	// Check if job is in a completable state
	if job.Status != "submitted" && job.Status != "in_progress" {
		return errors.New("job is not in a completable state")
	}

	// Update job status
	job.Status = "review_pending"
	job.CompletedAt = sql.NullTime{Time: time.Now(), Valid: true}
	job.ReviewDueDate = sql.NullTime{Time: time.Now().AddDate(0, 0, 14), Valid: true} // 14 days

	if err := s.jobRepo.Update(ctx, job); err != nil {
		return fmt.Errorf("failed to update job: %w", err)
	}

	return nil
}

// UpdateReview updates a review within the edit window
func (s *ReviewService) UpdateReview(ctx context.Context, reviewID, userID string, data ReviewData) (*ReviewResponse, error) {
	// Get the review
	review, err := s.reviewRepo.GetByID(ctx, reviewID)
	if err != nil {
		return nil, fmt.Errorf("failed to get review: %w", err)
	}

	// Check authorization
	if review.ReviewerID != userID {
		return errors.New("not authorized to update this review")
	}

	// Check if review is visible (can't edit visible reviews)
	if review.IsVisible {
		return nil, errors.New("cannot update visible review")
	}

	// Check if within 24-hour edit window
	if time.Since(review.CreatedAt) > 24*time.Hour {
		return nil, errors.New("edit window has expired")
	}

	// Update review
	review.Rating = data.Rating
	review.Comment = data.Comment
	review.CategoryRatings = data.CategoryRatings
	review.Anonymous = data.Anonymous
	review.UpdatedAt = time.Now()

	if err := s.reviewRepo.Update(ctx, review); err != nil {
		return nil, fmt.Errorf("failed to update review: %w", err)
	}

	return s.getReviewWithData(ctx, review.ID)
}

// DeleteReview deletes a review (only if not visible)
func (s *ReviewService) DeleteReview(ctx context.Context, reviewID, userID string) error {
	// Get the review
	review, err := s.reviewRepo.GetByID(ctx, reviewID)
	if err != nil {
		return fmt.Errorf("failed to get review: %w", err)
	}

	// Check authorization
	if review.ReviewerID != userID {
		return errors.New("not authorized to delete this review")
	}

	// Check if review is visible (can't delete visible reviews)
	if review.IsVisible {
		return errors.New("cannot delete visible review")
	}

	// Delete the review
	if err := s.reviewRepo.Delete(ctx, reviewID); err != nil {
		return fmt.Errorf("failed to delete review: %w", err)
	}

	return nil
}

// GetPendingReviews gets jobs that need reviews from a user
func (s *ReviewService) GetPendingReviews(ctx context.Context, userID string) ([]models.Job, error) {
	// Get jobs where user is involved and status is review_pending
	jobs, err := s.jobRepo.GetByUserAndStatus(ctx, userID, "review_pending")
	if err != nil {
		return nil, fmt.Errorf("failed to get pending review jobs: %w", err)
	}

	// Filter out jobs where user has already reviewed
	pendingJobs := make([]models.Job, 0)
	for _, job := range jobs {
		hasReviewed, err := s.reviewRepo.HasUserReviewedJob(ctx, job.ID, userID)
		if err != nil {
			continue
		}
		if !hasReviewed {
			pendingJobs = append(pendingJobs, job)
		}
	}

	return pendingJobs, nil
}

// GetUserReviewStats gets review statistics for a user
func (s *ReviewService) GetUserReviewStats(ctx context.Context, userID string) (map[string]interface{}, error) {
	// Get all visible reviews for the user
	reviews, _, err := s.reviewRepo.GetByReviewee(ctx, userID, 1000, 0) // Get all reviews
	if err != nil {
		return nil, fmt.Errorf("failed to get user reviews: %w", err)
	}

	// Calculate statistics
	var totalRating int
	ratingBreakdown := make(map[int]int)
	visibleReviews := 0

	for _, review := range reviews {
		if review.IsVisible {
			totalRating += review.Rating
			ratingBreakdown[review.Rating]++
			visibleReviews++
		}
	}

	var averageRating float64
	if visibleReviews > 0 {
		averageRating = float64(totalRating) / float64(visibleReviews)
	}

	return map[string]interface{}{
		"average_rating":   averageRating,
		"total_reviews":    visibleReviews,
		"rating_breakdown": ratingBreakdown,
	}, nil
}

// ProcessExpiredReviews processes reviews that have passed the 14-day window
func (s *ReviewService) ProcessExpiredReviews(ctx context.Context) error {
	// Get all jobs in review_pending status
	jobs, err := s.jobRepo.GetByStatus(ctx, "review_pending")
	if err != nil {
		return fmt.Errorf("failed to get pending review jobs: %w", err)
	}

	now := time.Now()
	for _, job := range jobs {
		if job.ReviewDueDate.Valid && now.After(job.ReviewDueDate.Time) {
			// Make all reviews for this job visible
			if err := s.makeJobReviewsVisible(ctx, job.ID); err != nil {
				return fmt.Errorf("failed to make reviews visible for job %s: %w", job.ID, err)
			}

			// Mark job as completed
			job.Status = "completed"
			if err := s.jobRepo.Update(ctx, &job); err != nil {
				return fmt.Errorf("failed to mark job %s as completed: %w", job.ID, err)
			}
		}
	}

	return nil
}

// validateReviewData validates review data before creation
func (s *ReviewService) validateReviewData(ctx context.Context, data ReviewData) error {
	// Validate rating
	if data.Rating < 1 || data.Rating > 5 {
		return errors.New("rating must be between 1 and 5")
	}

	// Validate comment length
	if len(data.Comment) < 10 || len(data.Comment) > 1000 {
		return errors.New("comment must be between 10 and 1000 characters")
	}

	// Validate category ratings
	if len(data.CategoryRatings) == 0 {
		return errors.New("category ratings are required")
	}

	for category, rating := range data.CategoryRatings {
		if rating < 1 || rating > 5 {
			return fmt.Errorf("category rating for %s must be between 1 and 5", category)
		}
	}

	// Check if job exists and is in review_pending status
	job, err := s.jobRepo.GetByID(ctx, data.JobID)
	if err != nil {
		return fmt.Errorf("job not found: %w", err)
	}

	if job.Status != "review_pending" {
		return errors.New("job is not in review period")
	}

	// Validate that reviewer is involved in the job
	if job.EmployerID != data.ReviewerID && job.HiredStudentID != data.ReviewerID {
		return errors.New("reviewer is not involved in this job")
	}

	// Validate that reviewee is the other party
	if job.EmployerID == data.ReviewerID {
		if job.HiredStudentID != data.RevieweeID {
			return errors.New("invalid reviewee")
		}
	} else {
		if job.EmployerID != data.RevieweeID {
			return errors.New("invalid reviewee")
		}
	}

	return nil
}

// updateReviewVisibility updates review visibility based on double-blind rules
func (s *ReviewService) updateReviewVisibility(ctx context.Context, jobID string) error {
	// Get all reviews for this job
	reviews, err := s.reviewRepo.GetByJob(ctx, jobID)
	if err != nil {
		return fmt.Errorf("failed to get job reviews: %w", err)
	}

	// If both parties have reviewed, make reviews visible
	if len(reviews) >= 2 {
		for _, review := range reviews {
			review.IsVisible = true
			review.UpdatedAt = time.Now()
			if err := s.reviewRepo.Update(ctx, &review); err != nil {
				return fmt.Errorf("failed to update review visibility: %w", err)
			}
		}

		// Mark job as completed
		job, err := s.jobRepo.GetByID(ctx, jobID)
		if err != nil {
			return fmt.Errorf("failed to get job: %w", err)
		}

		job.Status = "completed"
		if err := s.jobRepo.Update(ctx, job); err != nil {
			return fmt.Errorf("failed to mark job as completed: %w", err)
		}
	}

	return nil
}

// makeJobReviewsVisible makes all reviews for a job visible
func (s *ReviewService) makeJobReviewsVisible(ctx context.Context, jobID string) error {
	reviews, err := s.reviewRepo.GetByJob(ctx, jobID)
	if err != nil {
		return fmt.Errorf("failed to get job reviews: %w", err)
	}

	for _, review := range reviews {
		review.IsVisible = true
		review.UpdatedAt = time.Now()
		if err := s.reviewRepo.Update(ctx, &review); err != nil {
			return fmt.Errorf("failed to update review visibility: %w", err)
		}
	}

	return nil
}

// getReviewWithData gets a review with related data
func (s *ReviewService) getReviewWithData(ctx context.Context, reviewID string) (*ReviewResponse, error) {
	review, err := s.reviewRepo.GetByID(ctx, reviewID)
	if err != nil {
		return nil, fmt.Errorf("failed to get review: %w", err)
	}

	// Get related data
	reviewer, err := s.userRepo.GetByID(ctx, review.ReviewerID)
	if err != nil {
		return nil, fmt.Errorf("failed to get reviewer: %w", err)
	}

	reviewee, err := s.userRepo.GetByID(ctx, review.RevieweeID)
	if err != nil {
		return nil, fmt.Errorf("failed to get reviewee: %w", err)
	}

	job, err := s.jobRepo.GetByID(ctx, review.JobID)
	if err != nil {
		return nil, fmt.Errorf("failed to get job: %w", err)
	}

	// Handle anonymous reviews
	if review.Anonymous {
		reviewer.Name = "Anonymous"
	}

	return &ReviewResponse{
		ID:              review.ID,
		JobID:           review.JobID,
		ReviewerID:      review.ReviewerID,
		RevieweeID:      review.RevieweeID,
		Rating:          review.Rating,
		Comment:         review.Comment,
		CategoryRatings: review.CategoryRatings,
		Anonymous:       review.Anonymous,
		IsVisible:       review.IsVisible,
		CreatedAt:       review.CreatedAt,
		UpdatedAt:       review.UpdatedAt,
		Reviewer:        reviewer,
		Reviewee:        reviewee,
		Job:             job,
	}, nil
}
