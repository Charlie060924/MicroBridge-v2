package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/service"
	apperrors "microbridge/backend/internal/errors"
	"microbridge/backend/internal/validation"
	"microbridge/backend/pkg/logger"
)

type ApplicationHandler struct {
	applicationService service.ApplicationService
	validator          *validation.Validator
	logger             *logger.Logger
}

func NewApplicationHandler(applicationService service.ApplicationService, validator *validation.Validator, logger *logger.Logger) *ApplicationHandler {
	return &ApplicationHandler{
		applicationService: applicationService,
		validator:          validator,
		logger:             logger,
	}
}

// CreateApplication creates a new job application
// @Summary Create application
// @Description Create a new job application
// @Tags applications
// @Accept json
// @Produce json
// @Param application body dto.CreateApplicationRequest true "Application data"
// @Success 201 {object} dto.ApplicationResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 409 {object} map[string]interface{}
// @Router /api/v1/applications [post]
func (h *ApplicationHandler) CreateApplication(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID := getUserIDFromContext(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req dto.CreateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.validator.Validate(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	application, err := h.applicationService.CreateApplication(c.Request.Context(), req, userID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	response := h.toApplicationResponse(application)
	c.JSON(http.StatusCreated, response)
}

// GetApplication retrieves an application by ID
// @Summary Get application
// @Description Get application by ID
// @Tags applications
// @Produce json
// @Param id path string true "Application ID"
// @Success 200 {object} dto.ApplicationResponse
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/applications/{id} [get]
func (h *ApplicationHandler) GetApplication(c *gin.Context) {
	id := c.Param("id")
	
	application, err := h.applicationService.GetApplication(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}

	response := h.toApplicationResponse(application)
	c.JSON(http.StatusOK, response)
}

// UpdateApplication updates an application
// @Summary Update application
// @Description Update application information
// @Tags applications
// @Accept json
// @Produce json
// @Param id path string true "Application ID"
// @Param application body dto.UpdateApplicationRequest true "Updated application data"
// @Success 200 {object} dto.ApplicationResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/applications/{id} [put]
func (h *ApplicationHandler) UpdateApplication(c *gin.Context) {
	id := c.Param("id")
	
	var req dto.UpdateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.validator.Validate(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	application, err := h.applicationService.UpdateApplication(c.Request.Context(), id, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	response := h.toApplicationResponse(application)
	c.JSON(http.StatusOK, response)
}

// DeleteApplication deletes an application
// @Summary Delete application
// @Description Delete an application
// @Tags applications
// @Param id path string true "Application ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/applications/{id} [delete]
func (h *ApplicationHandler) DeleteApplication(c *gin.Context) {
	id := c.Param("id")
	
	err := h.applicationService.DeleteApplication(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application deleted successfully"})
}

// GetUserApplications retrieves applications for the authenticated user
// @Summary Get user applications
// @Description Get applications for the authenticated user
// @Tags applications
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Param status query string false "Filter by status"
// @Success 200 {object} dto.ApplicationListResponse
// @Router /api/v1/applications/user [get]
func (h *ApplicationHandler) GetUserApplications(c *gin.Context) {
	userID := getUserIDFromContext(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	applications, total, err := h.applicationService.GetUserApplications(c.Request.Context(), userID, limit, (page-1)*limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	// Filter by status if provided
	if status != "" {
		filtered := make([]*dto.ApplicationResponse, 0)
		for _, app := range applications {
			if app.Status == status {
				filtered = append(filtered, app)
			}
		}
		applications = filtered
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := dto.ApplicationListResponse{
		Applications: applications,
		Total:        total,
		Page:         page,
		Limit:        limit,
		TotalPages:   totalPages,
	}

	c.JSON(http.StatusOK, response)
}

// GetJobApplications retrieves applications for a specific job (employer only)
// @Summary Get job applications
// @Description Get applications for a specific job
// @Tags applications
// @Produce json
// @Param job_id path string true "Job ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Param status query string false "Filter by status"
// @Success 200 {object} dto.ApplicationListResponse
// @Router /api/v1/applications/job/{job_id} [get]
func (h *ApplicationHandler) GetJobApplications(c *gin.Context) {
	jobID := c.Param("job_id")
	
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	applications, total, err := h.applicationService.GetJobApplications(c.Request.Context(), jobID, limit, (page-1)*limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	// Filter by status if provided
	if status != "" {
		filtered := make([]*dto.ApplicationResponse, 0)
		for _, app := range applications {
			if app.Status == status {
				filtered = append(filtered, app)
			}
		}
		applications = filtered
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := dto.ApplicationListResponse{
		Applications: applications,
		Total:        total,
		Page:         page,
		Limit:        limit,
		TotalPages:   totalPages,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateApplicationStatus updates the status of an application (employer only)
// @Summary Update application status
// @Description Update the status of an application
// @Tags applications
// @Accept json
// @Produce json
// @Param id path string true "Application ID"
// @Param status body dto.ApplicationStatusUpdateRequest true "Status update data"
// @Success 200 {object} dto.ApplicationResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/applications/{id}/status [put]
func (h *ApplicationHandler) UpdateApplicationStatus(c *gin.Context) {
	id := c.Param("id")
	
	var req dto.ApplicationStatusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.validator.Validate(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.applicationService.UpdateApplicationStatus(c.Request.Context(), id, req.Status)
	if err != nil {
		h.handleError(c, err)
		return
	}

	// Get updated application
	application, err := h.applicationService.GetApplication(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}

	response := h.toApplicationResponse(application)
	c.JSON(http.StatusOK, response)
}

// WithdrawApplication allows a user to withdraw their application
// @Summary Withdraw application
// @Description Withdraw a job application
// @Tags applications
// @Accept json
// @Produce json
// @Param id path string true "Application ID"
// @Param withdrawal body dto.ApplicationWithdrawalRequest true "Withdrawal data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /api/v1/applications/{id}/withdraw [post]
func (h *ApplicationHandler) WithdrawApplication(c *gin.Context) {
	id := c.Param("id")
	userID := getUserIDFromContext(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req dto.ApplicationWithdrawalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update application status to withdrawn
	err := h.applicationService.UpdateApplicationStatus(c.Request.Context(), id, "withdrawn")
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application withdrawn successfully"})
}

// Helper function to get user ID from context
func getUserIDFromContext(c *gin.Context) string {
	if userID, exists := c.Get("user_id"); exists {
		if id, ok := userID.(string); ok {
			return id
		}
	}
	return ""
}

// Helper function to convert application model to response DTO
func (h *ApplicationHandler) toApplicationResponse(application *dto.ApplicationResponse) *dto.ApplicationResponse {
	return application
}

// Helper function to handle errors
func (h *ApplicationHandler) handleError(c *gin.Context, err error) {
	correlationID := uuid.New().String()
	
	// Log full error with correlation ID
	h.logger.Error().
		Str("correlation_id", correlationID).
		Err(err).
		Str("path", c.Request.URL.Path).
		Str("method", c.Request.Method).
		Msg("Application request error")
	
	// Return safe error to client
	if appErr, ok := err.(*apperrors.AppError); ok {
		c.JSON(appErr.Code, gin.H{
			"error": appErr.Message,
			"correlation_id": correlationID,
		})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
			"correlation_id": correlationID,
		})
	}
}
