package handlers

import (
	"net/http"
	"strconv"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/services"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	jobService services.JobService
}

func NewJobHandler(jobService services.JobService) *JobHandler {
	return &JobHandler{
		jobService: jobService,
	}
}

// CreateJob creates a new job posting
func (h *JobHandler) CreateJob(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var req dto.CreateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	job, err := h.jobService.CreateJob(c.Request.Context(), userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Data:    job,
		Message: "Job created successfully",
	})
}

// GetJob retrieves a job by ID
func (h *JobHandler) GetJob(c *gin.Context) {
	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Job ID is required",
		})
		return
	}

	job, err := h.jobService.GetJob(c.Request.Context(), jobID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    job,
		Message: "Job retrieved successfully",
	})
}

// UpdateJob updates a job posting
func (h *JobHandler) UpdateJob(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Job ID is required",
		})
		return
	}

	var req dto.UpdateJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	job, err := h.jobService.UpdateJob(c.Request.Context(), jobID, userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    job,
		Message: "Job updated successfully",
	})
}

// DeleteJob deletes a job posting
func (h *JobHandler) DeleteJob(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	jobID := c.Param("id")
	if jobID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Job ID is required",
		})
		return
	}

	err := h.jobService.DeleteJob(c.Request.Context(), jobID, userID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Job deleted successfully",
	})
}

// ListJobs lists jobs with filtering and pagination
func (h *JobHandler) ListJobs(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	// Parse filters
	filters := dto.JobFilters{
		Category:        c.Query("category"),
		Location:        c.Query("location"),
		ExperienceLevel: c.Query("experience_level"),
		Status:          c.DefaultQuery("status", "posted"), // Only show posted jobs by default
		JobType:         c.Query("job_type"),
		EmployerID:      c.Query("employer_id"),
	}

	// Parse is_remote filter
	if isRemoteStr := c.Query("is_remote"); isRemoteStr != "" {
		if isRemote, err := strconv.ParseBool(isRemoteStr); err == nil {
			filters.IsRemote = &isRemote
		}
	}

	// Parse skills filter
	if skillsStr := c.Query("skills"); skillsStr != "" {
		// Assuming comma-separated skills
		// This could be enhanced to parse JSON array
		filters.Skills = []string{skillsStr}
	}

	jobs, err := h.jobService.ListJobs(c.Request.Context(), filters, page, limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    jobs,
		Message: "Jobs retrieved successfully",
	})
}

// GetJobsByEmployer gets jobs posted by a specific employer
func (h *JobHandler) GetJobsByEmployer(c *gin.Context) {
	employerID := c.Param("id")
	if employerID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Employer ID is required",
		})
		return
	}

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	jobs, err := h.jobService.GetJobsByEmployer(c.Request.Context(), employerID, page, limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    jobs,
		Message: "Jobs retrieved successfully",
	})
}

// SearchJobs searches for jobs based on query and filters
func (h *JobHandler) SearchJobs(c *gin.Context) {
	query := c.Query("q")

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	// Parse filters
	filters := dto.JobFilters{
		Category:        c.Query("category"),
		Location:        c.Query("location"),
		ExperienceLevel: c.Query("experience_level"),
		Status:          c.DefaultQuery("status", "posted"),
		JobType:         c.Query("job_type"),
	}

	// Parse is_remote filter
	if isRemoteStr := c.Query("is_remote"); isRemoteStr != "" {
		if isRemote, err := strconv.ParseBool(isRemoteStr); err == nil {
			filters.IsRemote = &isRemote
		}
	}

	// Parse skills filter
	if skillsStr := c.Query("skills"); skillsStr != "" {
		filters.Skills = []string{skillsStr}
	}

	jobs, err := h.jobService.SearchJobs(c.Request.Context(), query, filters, page, limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    jobs,
		Message: "Jobs searched successfully",
	})
}

// Helper methods

func (h *JobHandler) handleError(c *gin.Context, err error) {
	if appErr, ok := err.(*apperrors.AppError); ok {
		c.JSON(appErr.Code, dto.APIResponse{
			Success: false,
			Message: appErr.Message,
			Errors:  []string{appErr.Message},
		})
		return
	}

	c.JSON(http.StatusInternalServerError, dto.APIResponse{
		Success: false,
		Message: "Internal server error",
		Errors:  []string{err.Error()},
	})
}