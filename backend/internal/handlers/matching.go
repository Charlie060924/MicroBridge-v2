package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
	"time"

	"github.com/gin-gonic/gin"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/services/matching"
	"gorm.io/gorm"
)

type MatchingHandler struct {
	recommender *matching.Recommender
	db          *gorm.DB
}

func NewMatchingHandler(db *gorm.DB) *MatchingHandler {
    return &MatchingHandler{
		recommender: matching.NewRecommender(db),
		db:          db,
	}
}

// Enhanced GetRecommendations with advanced filtering
func (h *MatchingHandler) GetRecommendations(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Parse query parameters with defaults
	limitStr := c.DefaultQuery("limit", "20")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 20
	}

	minScoreStr := c.DefaultQuery("min_score", "0.3")
	minScore, err := strconv.ParseFloat(minScoreStr, 64)
	if err != nil {
		minScore = 0.3
	}

	category := c.Query("category")
	location := c.Query("location")
	experienceLevel := c.Query("experience_level")
	
	remoteStr := c.Query("remote")
	var remote *bool
	if remoteStr != "" {
		if remoteStr == "true" {
			remote = &[]bool{true}[0]
		} else if remoteStr == "false" {
			remote = &[]bool{false}[0]
		}
	}

	// Get recommendations with basic filtering
	recommendations, err := h.recommender.GetRecommendations(userID, limit)
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Apply additional filters
	var filteredRecommendations []matching.Recommendation
	for _, rec := range recommendations {
		if rec.MatchScore.TotalScore < minScore {
			continue
		}

		// Category filter
		if category != "" && rec.Job.Category != category {
			continue
		}

		// Location filter
		if location != "" && rec.Job.Location != location {
			continue
		}

		// Experience level filter
		if experienceLevel != "" && rec.Job.ExperienceLevel != experienceLevel {
			continue
		}

		// Remote filter
		if remote != nil && rec.Job.IsRemote != *remote {
			continue
		}

		filteredRecommendations = append(filteredRecommendations, rec)
	}

	response := gin.H{
		"success": true,
		"data": gin.H{
			"recommendations": filteredRecommendations,
			"total_count":     len(filteredRecommendations),
			"parameters": gin.H{
				"limit":           limit,
				"min_score":       minScore,
				"category":        category,
				"location":        location,
				"experience_level": experienceLevel,
				"remote":          remote,
			},
			"generated_at": time.Now(),
		},
	}

	c.JSON(http.StatusOK, response)
}

// GetRecommendationsWithFilters - POST endpoint for advanced filtering
func (h *MatchingHandler) GetRecommendationsWithFilters(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
        return
    }
    
	var filters struct {
		Limit            int       `json:"limit"`
		MinScore         float64   `json:"min_score"`
		Categories       []string  `json:"categories"`
		Locations        []string  `json:"locations"`
		Skills           []string  `json:"skills"`
		ExperienceLevels []string  `json:"experience_levels"`
		JobTypes         []string  `json:"job_types"`
		SalaryRange      struct {
			Min int `json:"min"`
			Max int `json:"max"`
		} `json:"salary_range"`
		Remote         *bool      `json:"remote"`
		StartDateAfter *time.Time `json:"start_date_after"`
	}

	if err := c.ShouldBindJSON(&filters); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }
    
	// Set defaults
	if filters.Limit <= 0 || filters.Limit > 100 {
		filters.Limit = 20
	}
	if filters.MinScore <= 0 {
		filters.MinScore = 0.3
	}

	// Get base recommendations
	recommendations, err := h.recommender.GetRecommendations(userID, 100) // Get more to filter
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
	// Apply advanced filters
	var filteredRecommendations []matching.Recommendation
    for _, rec := range recommendations {
		if rec.MatchScore.TotalScore < filters.MinScore {
			continue
		}

		// Categories filter
		if len(filters.Categories) > 0 {
			found := false
			for _, cat := range filters.Categories {
				if rec.Job.Category == cat {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		// Locations filter
		if len(filters.Locations) > 0 {
			found := false
			for _, loc := range filters.Locations {
				if rec.Job.Location == loc {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		// Skills filter
		if len(filters.Skills) > 0 {
			found := false
			for _, skill := range filters.Skills {
				for _, jobSkill := range rec.Job.Skills {
					if jobSkill == skill {
						found = true
						break
					}
				}
				if found {
					break
				}
			}
			if !found {
				continue
			}
		}

		// Experience levels filter
		if len(filters.ExperienceLevels) > 0 {
			found := false
			for _, level := range filters.ExperienceLevels {
				if rec.Job.ExperienceLevel == level {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		// Remote filter
		if filters.Remote != nil && rec.Job.IsRemote != *filters.Remote {
			continue
		}

		filteredRecommendations = append(filteredRecommendations, rec)
	}

	// Limit results
	if len(filteredRecommendations) > filters.Limit {
		filteredRecommendations = filteredRecommendations[:filters.Limit]
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
        "recommendations": filteredRecommendations,
			"filters_applied": filters,
			"generated_at":    time.Now(),
		},
	})
}

// CalculateMatchScore calculates match score for a specific job
func (h *MatchingHandler) CalculateMatchScore(c *gin.Context) {
	userID := c.Param("userId")
	jobID := c.Param("jobId")

	if userID == "" || jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID and Job ID are required"})
		return
	}

	// Get user and job
	var user models.User
	var job models.Job

	if err := h.db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := h.db.Where("id = ?", jobID).First(&job).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	// Calculate match score
	algorithm := matching.NewMatchingAlgorithm()
	matchScore := algorithm.CalculateMatchScore(&user, &job)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    matchScore,
	})
}

// GetSimilarJobs returns jobs similar to a given job
func (h *MatchingHandler) GetSimilarJobs(c *gin.Context) {
	jobID := c.Param("jobId")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Job ID is required"})
		return
	}

	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 5
	}

	recommendations, err := h.recommender.GetSimilarJobs(jobID, limit)
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    recommendations,
	})
}

// GetMatchingAnalytics returns matching analytics for a user
func (h *MatchingHandler) GetMatchingAnalytics(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Get user's applications
	var applications []models.Application
	if err := h.db.Where("student_id = ?", userID).
		Preload("Job").
		Preload("Job.Employer").
		Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Calculate analytics
	analytics := h.calculateAnalytics(applications)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    analytics,
	})
}

// GetUserInsights returns personalized insights for a user
func (h *MatchingHandler) GetUserInsights(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
        return
    }
    
	// Get user
	var user models.User
	if err := h.db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    
	// Get user's applications
	var applications []models.Application
	if err := h.db.Where("student_id = ?", userID).
		Preload("Job").
		Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
	// Generate insights
	insights := h.generateUserInsights(&user, applications)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    insights,
	})
}

// calculateAnalytics calculates matching analytics
func (h *MatchingHandler) calculateAnalytics(applications []models.Application) map[string]interface{} {
	if len(applications) == 0 {
		return map[string]interface{}{
			"total_applications":     0,
			"average_match_score":    0.0,
			"applications_by_status": map[string]int{},
			"top_skills":            []string{},
			"match_score_distribution": map[string]int{},
			"application_trends":     []map[string]interface{}{},
		}
	}

	// Calculate total applications
	totalApplications := len(applications)

	// Calculate average match score
	totalScore := 0.0
	validScores := 0
	for _, app := range applications {
		if app.MatchScore > 0 {
			totalScore += app.MatchScore
			validScores++
		}
	}
	averageScore := 0.0
	if validScores > 0 {
		averageScore = totalScore / float64(validScores)
	}

	// Calculate applications by status
	statusCount := make(map[string]int)
	for _, app := range applications {
		statusCount[app.Status]++
	}

	// Extract top skills from applied jobs
	skillCount := make(map[string]int)
	for _, app := range applications {
		if app.Job != nil {
			for _, skill := range app.Job.Skills {
				skillCount[skill]++
			}
		}
	}

	// Get top 10 skills
	topSkills := make([]string, 0, 10)
	for skill := range skillCount {
		topSkills = append(topSkills, skill)
		if len(topSkills) >= 10 {
			break
		}
	}

	// Calculate match score distribution
	scoreDistribution := map[string]int{
		"excellent": 0, // 0.8-1.0
		"good":      0, // 0.6-0.79
		"fair":      0, // 0.4-0.59
		"poor":      0, // 0.0-0.39
	}

	for _, app := range applications {
		if app.MatchScore >= 0.8 {
			scoreDistribution["excellent"]++
		} else if app.MatchScore >= 0.6 {
			scoreDistribution["good"]++
		} else if app.MatchScore >= 0.4 {
			scoreDistribution["fair"]++
		} else {
			scoreDistribution["poor"]++
		}
	}

	return map[string]interface{}{
		"total_applications":         totalApplications,
		"average_match_score":        averageScore,
		"applications_by_status":     statusCount,
		"top_skills":                 topSkills,
		"match_score_distribution":   scoreDistribution,
		"application_trends":         []map[string]interface{}{}, // TODO: Implement time-based trends
	}
}

// generateUserInsights generates personalized insights for a user
func (h *MatchingHandler) generateUserInsights(user *models.User, applications []models.Application) map[string]interface{} {
	insights := map[string]interface{}{
		"profile_completion":     h.calculateProfileCompletion(user),
		"skill_gaps":            h.identifySkillGaps(user, applications),
		"career_recommendations": h.generateCareerRecommendations(user, applications),
		"market_insights":       h.generateMarketInsights(user, applications),
		"improvement_suggestions": h.generateImprovementSuggestions(user, applications),
	}

	return insights
}

// calculateProfileCompletion calculates how complete the user's profile is
func (h *MatchingHandler) calculateProfileCompletion(user *models.User) map[string]interface{} {
	completion := 0.0
	totalFields := 8.0

	if user.Name != "" {
		completion += 1.0
	}
	if user.Email != "" {
		completion += 1.0
	}
	if len(user.Skills) > 0 {
		completion += 1.0
	}
	if len(user.Interests) > 0 {
		completion += 1.0
	}
	if user.ExperienceLevel != "" {
		completion += 1.0
	}
	if user.Location != "" {
		completion += 1.0
	}
	if user.Availability != "" {
		completion += 1.0
	}
	if user.Bio != "" {
		completion += 1.0
	}

	percentage := (completion / totalFields) * 100

	return map[string]interface{}{
		"percentage": percentage,
		"completed_fields": completion,
		"total_fields": totalFields,
		"missing_fields": h.getMissingFields(user),
	}
}

// identifySkillGaps identifies skills the user should develop
func (h *MatchingHandler) identifySkillGaps(user *models.User, applications []models.Application) []map[string]interface{} {
	// Extract skills from applied jobs
	jobSkills := make(map[string]int)
	for _, app := range applications {
		if app.Job != nil {
			for _, skill := range app.Job.Skills {
				jobSkills[skill]++
			}
		}
	}

	// Find skills user doesn't have
	var skillGaps []map[string]interface{}
	for skill, count := range jobSkills {
		found := false
		for _, userSkill := range user.Skills {
			if userSkill == skill {
				found = true
				break
			}
		}
		if !found {
			skillGaps = append(skillGaps, map[string]interface{}{
				"skill": skill,
				"demand": count,
				"priority": "high" if count > 2 else "medium",
			})
		}
	}

	return skillGaps
}

// generateCareerRecommendations generates career advice
func (h *MatchingHandler) generateCareerRecommendations(user *models.User, applications []models.Application) []string {
	var recommendations []string

	// Profile completion recommendation
	if len(user.Skills) < 3 {
		recommendations = append(recommendations, "Add more skills to your profile to increase your match rate")
	}

	if user.Bio == "" {
		recommendations = append(recommendations, "Add a bio to help employers understand your background better")
	}

	// Application success rate recommendation
	if len(applications) > 0 {
		successfulApps := 0
		for _, app := range applications {
			if app.Status == "Accepted" || app.Status == "Interview" {
				successfulApps++
			}
		}
		successRate := float64(successfulApps) / float64(len(applications))
		
		if successRate < 0.2 {
			recommendations = append(recommendations, "Consider improving your application materials or targeting jobs better suited to your profile")
		}
	}

	return recommendations
}

// generateMarketInsights generates market-related insights
func (h *MatchingHandler) generateMarketInsights(user *models.User, applications []models.Application) map[string]interface{} {
	// Extract job categories and locations from applications
	categories := make(map[string]int)
	locations := make(map[string]int)

	for _, app := range applications {
		if app.Job != nil {
			categories[app.Job.Category]++
			locations[app.Job.Location]++
		}
	}

	return map[string]interface{}{
		"popular_categories": categories,
		"popular_locations":  locations,
		"market_demand":      "high", // TODO: Implement actual market analysis
	}
}

// generateImprovementSuggestions generates specific improvement suggestions
func (h *MatchingHandler) generateImprovementSuggestions(user *models.User, applications []models.Application) []string {
	var suggestions []string

	// Skill-based suggestions
	if len(user.Skills) < 5 {
		suggestions = append(suggestions, "Consider adding more technical skills to increase your job opportunities")
	}

	// Experience-based suggestions
	if user.ExperienceLevel == "Entry" && len(applications) > 10 {
		suggestions = append(suggestions, "You've applied to many jobs. Consider focusing on roles that match your experience level")
	}

	// Location-based suggestions
	if user.Location == "" {
		suggestions = append(suggestions, "Adding your location can help match you with nearby opportunities")
	}

	return suggestions
}

// getMissingFields returns a list of missing profile fields
func (h *MatchingHandler) getMissingFields(user *models.User) []string {
	var missing []string

	if user.Name == "" {
		missing = append(missing, "name")
	}
	if user.Email == "" {
		missing = append(missing, "email")
	}
	if len(user.Skills) == 0 {
		missing = append(missing, "skills")
	}
	if len(user.Interests) == 0 {
		missing = append(missing, "interests")
	}
	if user.ExperienceLevel == "" {
		missing = append(missing, "experience_level")
	}
	if user.Location == "" {
		missing = append(missing, "location")
	}
	if user.Availability == "" {
		missing = append(missing, "availability")
	}
	if user.Bio == "" {
		missing = append(missing, "bio")
	}

	return missing
}