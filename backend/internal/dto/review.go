package dto

import (
	"time"
	"microbridge/backend/internal/models"
)

// CreateReviewRequest represents the request to create a new review
type CreateReviewRequest struct {
	JobID           string            `json:"job_id" binding:"required"`
	RevieweeID      string            `json:"reviewee_id" binding:"required"`
	Rating          int               `json:"rating" binding:"required,min=1,max=5"`
	Comment         string            `json:"comment"`
	CategoryRatings CategoryRatings   `json:"category_ratings"`
}

// CategoryRatings DTO for review categories
type CategoryRatings struct {
	// For student reviews (reviewing employers)
	ClearRequirements  int `json:"clear_requirements,omitempty"`  // 1-5
	Professionalism    int `json:"professionalism,omitempty"`      // 1-5
	PaymentReliability int `json:"payment_reliability,omitempty"`  // 1-5
	
	// For employer reviews (reviewing students)
	QualityOfWork      int `json:"quality_of_work,omitempty"`      // 1-5
	Communication      int `json:"communication,omitempty"`        // 1-5
	Timeliness         int `json:"timeliness,omitempty"`           // 1-5
}

// ReviewResponse represents the response for a review
type ReviewResponse struct {
	ID              string            `json:"id"`
	ReviewerID      string            `json:"reviewer_id"`
	RevieweeID      string            `json:"reviewee_id"`
	JobID           string            `json:"job_id"`
	Rating          int               `json:"rating"`
	Comment         string            `json:"comment"`
	CategoryRatings CategoryRatings   `json:"category_ratings"`
	OverallRating   float64           `json:"overall_rating"`
	IsVisible       bool              `json:"is_visible"`
	CreatedAt       time.Time         `json:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at"`
	
	// Related data
	Reviewer        UserSummary       `json:"reviewer"`
	Reviewee        UserSummary       `json:"reviewee"`
	Job             JobSummary        `json:"job"`
}

// UserSummary represents a minimal user info for review responses
type UserSummary struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	UserType string `json:"user_type"`
}

// JobSummary represents minimal job info for review responses
type JobSummary struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

// UserReviewsResponse represents reviews for a specific user
type UserReviewsResponse struct {
	UserID          string           `json:"user_id"`
	UserName        string           `json:"user_name"`
	UserType        string           `json:"user_type"`
	AverageRating   float64          `json:"average_rating"`
	TotalReviews    int              `json:"total_reviews"`
	Reviews         []ReviewResponse `json:"reviews"`
	RatingBreakdown RatingBreakdown  `json:"rating_breakdown"`
	Badges          []string         `json:"badges"`
}

// RatingBreakdown shows distribution of ratings
type RatingBreakdown struct {
	FiveStar   int `json:"five_star"`
	FourStar   int `json:"four_star"`
	ThreeStar  int `json:"three_star"`
	TwoStar    int `json:"two_star"`
	OneStar    int `json:"one_star"`
}

// JobCompletionRequest represents marking a job as completed
type JobCompletionRequest struct {
	JobID string `json:"job_id" binding:"required"`
}

// JobCompletionResponse represents the response after job completion
type JobCompletionResponse struct {
	JobID           string `json:"job_id"`
	Status          string `json:"status"`
	RequiresReview  bool   `json:"requires_review"`
	ReviewDueDate   string `json:"review_due_date,omitempty"`
	Message         string `json:"message"`
}

// ConvertReviewToResponse converts a Review model to ReviewResponse
func ConvertReviewToResponse(review *models.Review) ReviewResponse {
	return ReviewResponse{
		ID:              review.ID,
		ReviewerID:      review.ReviewerID,
		RevieweeID:      review.RevieweeID,
		JobID:           review.JobID,
		Rating:          review.Rating,
		Comment:         review.Comment,
		CategoryRatings: CategoryRatings(review.CategoryRatings),
		OverallRating:   review.CalculateOverallRating(),
		IsVisible:       review.IsVisible,
		CreatedAt:       review.CreatedAt,
		UpdatedAt:       review.UpdatedAt,
		Reviewer: UserSummary{
			ID:       review.Reviewer.ID,
			Name:     review.Reviewer.Name,
			UserType: review.Reviewer.UserType,
		},
		Reviewee: UserSummary{
			ID:       review.Reviewee.ID,
			Name:     review.Reviewee.Name,
			UserType: review.Reviewee.UserType,
		},
		Job: JobSummary{
			ID:    review.Job.ID,
			Title: review.Job.Title,
		},
	}
}
