package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/services"
	"microbridge/backend/internal/shared/response"
	"microbridge/backend/internal/transport/http/middleware"

	"github.com/gorilla/mux"
)

type BehaviorHandler struct {
	behaviorService services.UserBehaviorService
}

func NewBehaviorHandler(behaviorService services.UserBehaviorService) *BehaviorHandler {
	return &BehaviorHandler{
		behaviorService: behaviorService,
	}
}

// RegisterRoutes registers behavior tracking routes
func (h *BehaviorHandler) RegisterRoutes(router *mux.Router, authMiddleware *middleware.AuthMiddleware) {
	// User behavior tracking endpoints
	behaviorRouter := router.PathPrefix("/api/v1/behavior").Subrouter()
	behaviorRouter.Use(authMiddleware.ValidateToken)

	// Action tracking
	behaviorRouter.HandleFunc("/track/view", h.TrackJobView).Methods("POST")
	behaviorRouter.HandleFunc("/track/application", h.TrackJobApplication).Methods("POST")
	behaviorRouter.HandleFunc("/track/save", h.TrackJobSave).Methods("POST")
	behaviorRouter.HandleFunc("/track/dismiss", h.TrackJobDismiss).Methods("POST")
	behaviorRouter.HandleFunc("/track/search", h.TrackSearch).Methods("POST")
	behaviorRouter.HandleFunc("/track/skill-interest", h.TrackSkillInterest).Methods("POST")

	// Behavioral insights
	behaviorRouter.HandleFunc("/context", h.GetRecommendationContext).Methods("GET")
	behaviorRouter.HandleFunc("/pattern", h.GetBehaviorPattern).Methods("GET")
	behaviorRouter.HandleFunc("/trends", h.GetBehaviorTrends).Methods("GET")

	// Preference management
	behaviorRouter.HandleFunc("/preferences", h.UpdatePreferences).Methods("PUT")
	behaviorRouter.HandleFunc("/feedback", h.ProcessFeedback).Methods("POST")

	// Enhanced recommendations
	behaviorRouter.HandleFunc("/recommendations/enhanced", h.GetEnhancedRecommendations).Methods("GET")
}

// TrackJobView handles job view tracking
func (h *BehaviorHandler) TrackJobView(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackJobViewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	timeSpent := time.Duration(req.TimeSpentSeconds) * time.Second
	err := h.behaviorService.TrackJobView(r.Context(), userID, req.JobID, timeSpent)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track job view", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Job view tracked successfully",
	})
}

// TrackJobApplication handles job application tracking
func (h *BehaviorHandler) TrackJobApplication(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackJobActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.TrackJobApplication(r.Context(), userID, req.JobID)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track job application", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Job application tracked successfully",
	})
}

// TrackJobSave handles job save tracking
func (h *BehaviorHandler) TrackJobSave(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackJobActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.TrackJobSave(r.Context(), userID, req.JobID)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track job save", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Job save tracked successfully",
	})
}

// TrackJobDismiss handles job dismissal tracking
func (h *BehaviorHandler) TrackJobDismiss(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackJobActionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.TrackJobDismiss(r.Context(), userID, req.JobID)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track job dismissal", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Job dismissal tracked successfully",
	})
}

// TrackSearch handles search tracking
func (h *BehaviorHandler) TrackSearch(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackSearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.TrackSearchQuery(r.Context(), userID, req.Query, req.Filters)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track search", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Search tracked successfully",
	})
}

// TrackSkillInterest handles skill interest tracking
func (h *BehaviorHandler) TrackSkillInterest(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.TrackSkillInterestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.TrackSkillInterest(r.Context(), userID, req.SkillName, req.InteractionType)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to track skill interest", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Skill interest tracked successfully",
	})
}

// GetRecommendationContext retrieves behavioral context for recommendations
func (h *BehaviorHandler) GetRecommendationContext(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	context, err := h.behaviorService.GetRecommendationContext(r.Context(), userID)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get recommendation context", err)
		return
	}

	response.WriteSuccessResponse(w, context)
}

// GetBehaviorPattern retrieves user behavior pattern
func (h *BehaviorHandler) GetBehaviorPattern(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	pattern, err := h.behaviorService.GetUserBehaviorPattern(r.Context(), userID)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to get behavior pattern", err)
		return
	}

	response.WriteSuccessResponse(w, pattern)
}

// GetBehaviorTrends retrieves behavior trend analysis
func (h *BehaviorHandler) GetBehaviorTrends(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse days parameter
	daysStr := r.URL.Query().Get("days")
	days := 30 // default
	if daysStr != "" {
		if d, err := strconv.Atoi(daysStr); err == nil && d > 0 && d <= 365 {
			days = d
		}
	}

	trends, err := h.behaviorService.AnalyzeBehaviorTrends(r.Context(), userID, days)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to analyze behavior trends", err)
		return
	}

	response.WriteSuccessResponse(w, trends)
}

// UpdatePreferences updates user preferences
func (h *BehaviorHandler) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.UpdatePreferencesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.UpdatePreferences(r.Context(), userID, req.Preferences)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to update preferences", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Preferences updated successfully",
	})
}

// ProcessFeedback handles explicit user feedback
func (h *BehaviorHandler) ProcessFeedback(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.FeedbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	if err := req.Validate(); err != nil {
		response.WriteErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
		return
	}

	err := h.behaviorService.LearnFromFeedback(r.Context(), userID, req.JobID, req.Action, req.Outcome)
	if err != nil {
		response.WriteErrorResponse(w, http.StatusInternalServerError, "Failed to process feedback", err)
		return
	}

	response.WriteSuccessResponse(w, dto.TrackingResponse{
		Success: true,
		Message: "Feedback processed successfully",
	})
}

// GetEnhancedRecommendations retrieves behaviorally enhanced recommendations
func (h *BehaviorHandler) GetEnhancedRecommendations(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r.Context())
	if userID == "" {
		response.WriteErrorResponse(w, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse limit parameter
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // default
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
			limit = l
		}
	}

	// This would integrate with your existing matching service
	// For now, we'll return a placeholder response
	response.WriteSuccessResponse(w, map[string]interface{}{
		"message": "Enhanced recommendations endpoint - to be integrated with matching service",
		"user_id": userID,
		"limit":   limit,
	})
}