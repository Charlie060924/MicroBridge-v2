package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
)

type JobHandler struct {
	jobRepo repository.JobRepository
}

func NewJobHandler(jobRepo repository.JobRepository) *JobHandler {
	return &JobHandler{
		jobRepo: jobRepo,
	}
}

// GetJobs returns a list of jobs with optional filtering
func (h *JobHandler) GetJobs(c *gin.Context) {
	// Get query parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	location := c.Query("location")
	skills := c.QueryArray("skills")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 10
	}

	// Build filters
	filters := make(map[string]interface{})
	if location != "" {
		filters["location"] = location
	}
	if len(skills) > 0 {
		filters["skills"] = skills
	}

	// Get jobs from repository
	jobs, total, err := h.jobRepo.List(c.Request.Context(), filters, limit, (page-1)*limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get jobs",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": jobs,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

// GetJob returns a specific job by ID
func (h *JobHandler) GetJob(c *gin.Context) {
	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Job ID is required",
		})
		return
	}

	job, err := h.jobRepo.GetByID(c.Request.Context(), jobID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Job not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": job,
	})
}

// CreateJob creates a new job
func (h *JobHandler) CreateJob(c *gin.Context) {
	var job models.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid job data",
		})
		return
	}

	// Get employer ID from context (set by auth middleware)
	employerID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	job.EmployerID = employerID.(string)

	if err := h.jobRepo.Create(c.Request.Context(), &job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create job",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": job,
	})
}

// UpdateJob updates an existing job
func (h *JobHandler) UpdateJob(c *gin.Context) {
	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Job ID is required",
		})
		return
	}

	var job models.Job
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid job data",
		})
		return
	}

	job.ID = jobID

	if err := h.jobRepo.Update(c.Request.Context(), &job); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update job",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": job,
	})
}

// DeleteJob deletes a job
func (h *JobHandler) DeleteJob(c *gin.Context) {
	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Job ID is required",
		})
		return
	}

	if err := h.jobRepo.Delete(c.Request.Context(), jobID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete job",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Job deleted successfully",
	})
}
