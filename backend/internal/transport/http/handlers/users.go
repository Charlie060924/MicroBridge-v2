package handlers

import (
	"net/http"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/services"
	apperrors "microbridge/backend/internal/shared/errors"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// Authentication endpoints

func (h *UserHandler) Register(c *gin.Context) {
	var req dto.UserRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	user, err := h.userService.Register(c.Request.Context(), req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Data:    user,
		Message: "User registered successfully. Please check your email to verify your account.",
	})
}

func (h *UserHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	loginResp, err := h.userService.Login(c.Request.Context(), req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    loginResp,
		Message: "Login successful",
	})
}

func (h *UserHandler) RefreshToken(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	tokenResp, err := h.userService.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    tokenResp,
		Message: "Token refreshed successfully",
	})
}

func (h *UserHandler) VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Verification token is required",
		})
		return
	}

	err := h.userService.VerifyEmail(c.Request.Context(), token)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Email verified successfully",
	})
}

func (h *UserHandler) ForgotPassword(c *gin.Context) {
	var req dto.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	err := h.userService.ForgotPassword(c.Request.Context(), req.Email)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "If an account with that email exists, a password reset link has been sent.",
	})
}

func (h *UserHandler) ResetPassword(c *gin.Context) {
	var req dto.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	err := h.userService.ResetPassword(c.Request.Context(), req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Password reset successfully",
	})
}

// Profile endpoints

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    user,
		Message: "Profile retrieved successfully",
	})
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	user, err := h.userService.UpdateProfile(c.Request.Context(), userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    user,
		Message: "Profile updated successfully",
	})
}

func (h *UserHandler) GetUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "User ID is required",
		})
		return
	}

	user, err := h.userService.GetProfile(c.Request.Context(), id)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    user,
		Message: "User retrieved successfully",
	})
}

// Admin endpoints (placeholder for future implementation)

func (h *UserHandler) ListUsers(c *gin.Context) {
	// For now, return not implemented
	c.JSON(http.StatusNotImplemented, dto.APIResponse{
		Success: false,
		Message: "List users endpoint not yet implemented",
	})
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "User ID is required",
		})
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Invalid request format",
			Errors:  []string{err.Error()},
		})
		return
	}

	user, err := h.userService.UpdateProfile(c.Request.Context(), userID, req)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    user,
		Message: "User updated successfully",
	})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "User ID is required",
		})
		return
	}

	err := h.userService.DeleteUser(c.Request.Context(), userID)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "User deleted successfully",
	})
}

// Helper methods

func (h *UserHandler) handleError(c *gin.Context, err error) {
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