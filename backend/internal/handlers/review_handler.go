package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"your-project/internal/service"
	"your-project/internal/middleware"
)

// ReviewHandler handles review-related HTTP requests
type ReviewHandler struct {
	reviewService *service.ReviewService
}

// NewReviewHandler creates a new review handler
func NewReviewHandler(reviewService *service.ReviewService) *ReviewHandler {
	return &ReviewHandler{
		reviewService: reviewService,
	}
}

// CreateReviewRequest represents the request body for creating a review
type CreateReviewRequest struct {
	JobID           string            `json:"job_id" binding:"required"`
	RevieweeID      string            `json:"reviewee_id" binding:"required"`
	Rating          int               `json:"rating" binding:"required,min=1,max=5"`
	Comment         string            `json:"comment" binding:"required,min=10,max=1000"`
	CategoryRatings map[string]int    `json:"category_ratings" binding:"required"`
	Anonymous       bool              `json:"anonymous"`
}

// UpdateReviewRequest represents the request body for updating a review
type UpdateReviewRequest struct {
	Rating          int               `json:"rating" binding:"required,min=1,max=5"`
	Comment         string            `json:"comment" binding:"required,min=10,max=1000"`
	CategoryRatings map[string]int    `json:"category_ratings" binding:"required"`
	Anonymous       bool              `json:"anonymous"`
}

// CreateReview creates a new review
// @Summary Create a new review
// @Description Create a new review for a completed job
// @Tags reviews
// @Accept json
// @Produce json
// @Param review body CreateReviewRequest true "Review data"
// @Success 201 {object} service.ReviewResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 409 {object} ErrorResponse
// @Router /reviews [post]
func (h *ReviewHandler) CreateReview(c *gin.Context) {
	var req CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid request data",
			Message: err.Error(),
		})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Create review data
	reviewData := service.ReviewData{
		JobID:           req.JobID,
		ReviewerID:      userID.(string),
		RevieweeID:      req.RevieweeID,
		Rating:          req.Rating,
		Comment:         req.Comment,
		CategoryRatings: req.CategoryRatings,
		Anonymous:       req.Anonymous,
	}

	// Create the review
	review, err := h.reviewService.CreateReview(c.Request.Context(), reviewData)
	if err != nil {
		status := http.StatusInternalServerError
		message := "Failed to create review"

		// Handle specific errors
		switch err.Error() {
		case "user has already reviewed this job":
			status = http.StatusConflict
			message = "You have already reviewed this job"
		case "job is not in review period":
			status = http.StatusBadRequest
			message = "This job is not in the review period"
		case "reviewer is not involved in this job":
			status = http.StatusForbidden
			message = "You are not involved in this job"
		case "invalid reviewee":
			status = http.StatusBadRequest
			message = "Invalid reviewee specified"
		}

		c.JSON(status, ErrorResponse{
			Error:   "Review creation failed",
			Message: message,
		})
		return
	}

	c.JSON(http.StatusCreated, review)
}

// GetUserReviews gets reviews for a specific user
// @Summary Get user reviews
// @Description Get paginated reviews for a specific user
// @Tags reviews
// @Produce json
// @Param user_id path string true "User ID"
// @Param limit query int false "Number of reviews to return (default: 10, max: 50)"
// @Param offset query int false "Number of reviews to skip (default: 0)"
// @Success 200 {object} service.UserReviewsResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /users/{user_id}/reviews [get]
func (h *ReviewHandler) GetUserReviews(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid user ID",
			Message: "User ID is required",
		})
		return
	}

	// Parse pagination parameters
	limit := 10
	offset := 0

	if limitStr := c.Query("limit"); limitStr != "" {
		if parsed, err := strconv.Atoi(limitStr); err == nil && parsed > 0 && parsed <= 50 {
			limit = parsed
		}
	}

	if offsetStr := c.Query("offset"); offsetStr != "" {
		if parsed, err := strconv.Atoi(offsetStr); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	// Get user reviews
	reviews, err := h.reviewService.GetUserReviews(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Failed to get user reviews",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

// GetJobReviews gets all visible reviews for a job
// @Summary Get job reviews
// @Description Get all visible reviews for a specific job
// @Tags reviews
// @Produce json
// @Param job_id path string true "Job ID"
// @Success 200 {array} service.ReviewResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /jobs/{job_id}/reviews [get]
func (h *ReviewHandler) GetJobReviews(c *gin.Context) {
	jobID := c.Param("job_id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid job ID",
			Message: "Job ID is required",
		})
		return
	}

	// Get job reviews
	reviews, err := h.reviewService.GetJobReviews(c.Request.Context(), jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Failed to get job reviews",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

// CompleteJob marks a job as completed and triggers review period
// @Summary Complete a job
// @Description Mark a job as completed and start the review period
// @Tags jobs
// @Accept json
// @Produce json
// @Param job_id path string true "Job ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /jobs/{job_id}/complete [post]
func (h *ReviewHandler) CompleteJob(c *gin.Context) {
	jobID := c.Param("job_id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid job ID",
			Message: "Job ID is required",
		})
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Complete the job
	err := h.reviewService.CompleteJob(c.Request.Context(), jobID, userID.(string))
	if err != nil {
		status := http.StatusInternalServerError
		message := "Failed to complete job"

		// Handle specific errors
		switch err.Error() {
		case "not authorized to complete this job":
			status = http.StatusForbidden
			message = "You are not authorized to complete this job"
		case "job is not in a completable state":
			status = http.StatusBadRequest
			message = "This job cannot be completed at this time"
		}

		c.JSON(status, ErrorResponse{
			Error:   "Job completion failed",
			Message: message,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Job completed successfully. Review period has started.",
		"job_id":  jobID,
		"status":  "review_pending",
	})
}

// UpdateReview updates an existing review
// @Summary Update a review
// @Description Update a review within the edit window
// @Tags reviews
// @Accept json
// @Produce json
// @Param review_id path string true "Review ID"
// @Param review body UpdateReviewRequest true "Updated review data"
// @Success 200 {object} service.ReviewResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /reviews/{review_id} [put]
func (h *ReviewHandler) UpdateReview(c *gin.Context) {
	reviewID := c.Param("review_id")
	if reviewID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid review ID",
			Message: "Review ID is required",
		})
		return
	}

	var req UpdateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid request data",
			Message: err.Error(),
		})
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Create review data for update
	reviewData := service.ReviewData{
		Rating:          req.Rating,
		Comment:         req.Comment,
		CategoryRatings: req.CategoryRatings,
		Anonymous:       req.Anonymous,
	}

	// Update the review
	review, err := h.reviewService.UpdateReview(c.Request.Context(), reviewID, userID.(string), reviewData)
	if err != nil {
		status := http.StatusInternalServerError
		message := "Failed to update review"

		// Handle specific errors
		switch err.Error() {
		case "not authorized to update this review":
			status = http.StatusForbidden
			message = "You are not authorized to update this review"
		case "cannot update visible review":
			status = http.StatusBadRequest
			message = "Cannot update a review that is already visible"
		case "edit window has expired":
			status = http.StatusBadRequest
			message = "The edit window for this review has expired"
		}

		c.JSON(status, ErrorResponse{
			Error:   "Review update failed",
			Message: message,
		})
		return
	}

	c.JSON(http.StatusOK, review)
}

// DeleteReview deletes a review
// @Summary Delete a review
// @Description Delete a review (only if not visible)
// @Tags reviews
// @Produce json
// @Param review_id path string true "Review ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /reviews/{review_id} [delete]
func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	reviewID := c.Param("review_id")
	if reviewID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid review ID",
			Message: "Review ID is required",
		})
		return
	}

	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Delete the review
	err := h.reviewService.DeleteReview(c.Request.Context(), reviewID, userID.(string))
	if err != nil {
		status := http.StatusInternalServerError
		message := "Failed to delete review"

		// Handle specific errors
		switch err.Error() {
		case "not authorized to delete this review":
			status = http.StatusForbidden
			message = "You are not authorized to delete this review"
		case "cannot delete visible review":
			status = http.StatusBadRequest
			message = "Cannot delete a review that is already visible"
		}

		c.JSON(status, ErrorResponse{
			Error:   "Review deletion failed",
			Message: message,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Review deleted successfully",
	})
}

// GetPendingReviews gets jobs that need reviews from the current user
// @Summary Get pending reviews
// @Description Get jobs that need reviews from the current user
// @Tags reviews
// @Produce json
// @Success 200 {array} models.Job
// @Failure 401 {object} ErrorResponse
// @Router /reviews/pending [get]
func (h *ReviewHandler) GetPendingReviews(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Get pending reviews
	jobs, err := h.reviewService.GetPendingReviews(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Failed to get pending reviews",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// GetUserReviewStats gets review statistics for a user
// @Summary Get user review stats
// @Description Get review statistics for a specific user
// @Tags reviews
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /users/{user_id}/reviews/stats [get]
func (h *ReviewHandler) GetUserReviewStats(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid user ID",
			Message: "User ID is required",
		})
		return
	}

	// Get user review stats
	stats, err := h.reviewService.GetUserReviewStats(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Failed to get user review stats",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// FlagReview flags a review for moderation
// @Summary Flag a review
// @Description Flag a review for moderation
// @Tags reviews
// @Accept json
// @Produce json
// @Param review_id path string true "Review ID"
// @Param flag body map[string]string true "Flag reason"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /reviews/{review_id}/flag [post]
func (h *ReviewHandler) FlagReview(c *gin.Context) {
	reviewID := c.Param("review_id")
	if reviewID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid review ID",
			Message: "Review ID is required",
		})
		return
	}

	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Invalid request data",
			Message: err.Error(),
		})
		return
	}

	reason, exists := req["reason"]
	if !exists || reason == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "Missing reason",
			Message: "Flag reason is required",
		})
		return
	}

	// Flag the review (this would typically create a moderation ticket)
	// For now, we'll just log it
	// In a real implementation, you'd call a moderation service
	c.JSON(http.StatusOK, gin.H{
		"message": "Review flagged for moderation",
		"review_id": reviewID,
		"reason": reason,
	})
}

// ProcessExpiredReviews processes reviews that have passed the 14-day window
// This endpoint is typically called by a scheduled job
// @Summary Process expired reviews
// @Description Process reviews that have passed the 14-day window
// @Tags reviews
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /reviews/process-expired [post]
func (h *ReviewHandler) ProcessExpiredReviews(c *gin.Context) {
	// This endpoint should be protected and only accessible by admin/scheduled jobs
	// For now, we'll add a simple check
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "Unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// In a real implementation, you'd check if the user has admin privileges
	// For now, we'll just process the reviews
	err := h.reviewService.ProcessExpiredReviews(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "Failed to process expired reviews",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Expired reviews processed successfully",
		"processed_by": userID,
		"timestamp": time.Now().UTC(),
	})
}

// RegisterRoutes registers all review routes
func (h *ReviewHandler) RegisterRoutes(r *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	reviews := r.Group("/reviews")
	{
		reviews.POST("", authMiddleware, h.CreateReview)
		reviews.GET("/pending", authMiddleware, h.GetPendingReviews)
		reviews.POST("/process-expired", authMiddleware, h.ProcessExpiredReviews)
		
		review := reviews.Group("/:review_id")
		{
			review.PUT("", authMiddleware, h.UpdateReview)
			review.DELETE("", authMiddleware, h.DeleteReview)
			review.POST("/flag", authMiddleware, h.FlagReview)
		}
	}

	// User review routes
	users := r.Group("/users/:user_id")
	{
		users.GET("/reviews", h.GetUserReviews)
		users.GET("/reviews/stats", h.GetUserReviewStats)
	}

	// Job review routes
	jobs := r.Group("/jobs/:job_id")
	{
		jobs.GET("/reviews", h.GetJobReviews)
		jobs.POST("/complete", authMiddleware, h.CompleteJob)
	}
}
