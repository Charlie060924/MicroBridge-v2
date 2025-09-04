package handlers

import (
	"net/http"
	"strconv"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/services"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/gin-gonic/gin"
)

type ApplicationHandler struct {
	applicationService services.ApplicationService
}

func NewApplicationHandler(applicationService services.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{
		applicationService: applicationService,
	}
}

// SubmitApplication submits a job application
func (h *ApplicationHandler) SubmitApplication(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var req dto.CreateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	application, err := h.applicationService.SubmitApplication(c.Request.Context(), userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Data:    application,
		Message: "Application submitted successfully",
	})
}

// GetApplication retrieves an application by ID
func (h *ApplicationHandler) GetApplication(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	applicationID := c.Param("id")
	if applicationID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Application ID is required",
		})
		return
	}

	application, err := h.applicationService.GetApplicationDetails(c.Request.Context(), applicationID, userID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    application,
		Message: "Application retrieved successfully",
	})
}

// GetUserApplications retrieves applications for the current user
func (h *ApplicationHandler) GetUserApplications(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	applications, err := h.applicationService.GetUserApplications(c.Request.Context(), userID, page, limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    applications,
		Message: "Applications retrieved successfully",
	})
}

// GetJobApplications retrieves applications for a specific job (employer only)
func (h *ApplicationHandler) GetJobApplications(c *gin.Context) {
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

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	applications, err := h.applicationService.GetJobApplications(c.Request.Context(), jobID, userID, page, limit)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    applications,
		Message: "Job applications retrieved successfully",
	})
}

// UpdateApplicationStatus updates the status of an application (employer only)
func (h *ApplicationHandler) UpdateApplicationStatus(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	applicationID := c.Param("id")
	if applicationID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Application ID is required",
		})
		return
	}

	var req dto.ApplicationStatusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	application, err := h.applicationService.UpdateApplicationStatus(c.Request.Context(), applicationID, userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    application,
		Message: "Application status updated successfully",
	})
}

// WithdrawApplication allows a user to withdraw their application
func (h *ApplicationHandler) WithdrawApplication(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	applicationID := c.Param("id")
	if applicationID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Application ID is required",
		})
		return
	}

	var req dto.ApplicationWithdrawalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	err := h.applicationService.WithdrawApplication(c.Request.Context(), applicationID, userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Application withdrawn successfully",
	})
}

// Helper methods

func (h *ApplicationHandler) handleError(c *gin.Context, err error) {
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