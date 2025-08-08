package handlers

import (
"net/http"
"strconv"

"github.com/gin-gonic/gin"
"microbridge/backend/internal/services/matching"
"microbridge/backend/internal/models"
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

// GetRecommendations returns personalized job recommendations
func (h *MatchingHandler) GetRecommendations(c *gin.Context) {
userID := c.Param("userId")
if userID == "" {
c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
return
}

limitStr := c.DefaultQuery("limit", "10")
limit, err := strconv.Atoi(limitStr)
if err != nil {
limit = 10
}

recommendations, err := h.recommender.GetRecommendations(userID, limit)
if err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}

c.JSON(http.StatusOK, gin.H{
"success": true,
"data":    recommendations,
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

// calculateAnalytics calculates matching analytics
func (h *MatchingHandler) calculateAnalytics(applications []models.Application) map[string]interface{} {
if len(applications) == 0 {
return map[string]interface{}{
"total_applications": 0,
"average_match_score": 0.0,
"applications_by_status": map[string]int{},
"top_skills": []string{},
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

return map[string]interface{}{
"total_applications":     totalApplications,
"average_match_score":    averageScore,
"applications_by_status": statusCount,
"top_skills":            topSkills,
}
}
