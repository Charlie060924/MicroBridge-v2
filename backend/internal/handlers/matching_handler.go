package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"microbridge/backend/internal/services/matching"
)

type MatchingHandler struct {
	matchingService *matching.OptimizedMatchingService
}

func NewMatchingHandler(matchingService *matching.OptimizedMatchingService) *MatchingHandler {
	return &MatchingHandler{
		matchingService: matchingService,
	}
}

// GetRecommendedJobs returns job recommendations for the authenticated user
func (h *MatchingHandler) GetRecommendedJobs(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	// Get limit from query params
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 10
	}

	// Get matches using optimized service
	matches, err := h.matchingService.FindMatches(c.Request.Context(), userID.(string), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get job recommendations",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": matches,
		"meta": gin.H{
			"total": len(matches),
			"limit": limit,
		},
	})
}
