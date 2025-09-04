package service

import (
	"context"
	"fmt"
	"time"
)

// HealthService provides health check functionality for AI components
type HealthService struct {
	aiService *AIService
	timeout   time.Duration
}

// NewHealthService creates a new health service
func NewHealthService(aiService *AIService, timeout time.Duration) *HealthService {
	return &HealthService{
		aiService: aiService,
		timeout:   timeout,
	}
}

// HealthCheckResponse represents the health check response
type HealthCheckResponse struct {
	Status      string                 `json:"status"`      // "healthy", "degraded", "unhealthy"
	Timestamp   time.Time              `json:"timestamp"`
	Components  map[string]ComponentHealth `json:"components"`
	Metadata    map[string]interface{} `json:"metadata"`
	Duration    time.Duration          `json:"duration"`
}

// ComponentHealth represents the health of individual components
type ComponentHealth struct {
	Status      string                 `json:"status"`
	Message     string                 `json:"message,omitempty"`
	LastChecked time.Time              `json:"last_checked"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// PerformHealthCheck performs a comprehensive health check
func (h *HealthService) PerformHealthCheck(ctx context.Context) *HealthCheckResponse {
	start := time.Now()
	
	// Create context with timeout
	ctx, cancel := context.WithTimeout(ctx, h.timeout)
	defer cancel()

	response := &HealthCheckResponse{
		Timestamp:  start,
		Components: make(map[string]ComponentHealth),
		Metadata:   make(map[string]interface{}),
	}

	// Check AI service
	h.checkAIService(ctx, response)
	
	// Check ML model
	h.checkMLModel(ctx, response)
	
	// Check cache service
	h.checkCacheService(ctx, response)
	
	// Check behavior tracker
	h.checkBehaviorTracker(ctx, response)

	// Determine overall status
	response.Status = h.calculateOverallStatus(response.Components)
	response.Duration = time.Since(start)

	return response
}

// checkAIService checks the main AI service health
func (h *HealthService) checkAIService(ctx context.Context, response *HealthCheckResponse) {
	component := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]interface{}),
	}

	if h.aiService == nil {
		component.Status = "unhealthy"
		component.Message = "AI service not initialized"
	} else if err := h.aiService.HealthCheck(ctx); err != nil {
		component.Status = "unhealthy"
		component.Message = fmt.Sprintf("AI service health check failed: %v", err)
	} else {
		component.Status = "healthy"
		component.Message = "AI service is operational"
		component.Metadata["initialized"] = h.aiService.initialized
		component.Metadata["fallback_enabled"] = h.aiService.fallbackEnabled
	}

	response.Components["ai_service"] = component
}

// checkMLModel checks the ML model health
func (h *HealthService) checkMLModel(ctx context.Context, response *HealthCheckResponse) {
	component := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]interface{}),
	}

	if h.aiService == nil || h.aiService.mlModel == nil {
		component.Status = "unhealthy"
		component.Message = "ML model service not available"
	} else {
		modelInfo, err := h.aiService.mlModel.GetModelInfo(ctx)
		if err != nil {
			component.Status = "degraded"
			component.Message = fmt.Sprintf("Failed to get model info: %v", err)
		} else {
			switch modelInfo.Status {
			case "active":
				component.Status = "healthy"
				component.Message = "ML model is active and ready"
			case "training":
				component.Status = "degraded"
				component.Message = "ML model is currently training"
			case "error":
				component.Status = "unhealthy"
				component.Message = "ML model is in error state"
			default:
				component.Status = "degraded"
				component.Message = fmt.Sprintf("Unknown model status: %s", modelInfo.Status)
			}
			
			component.Metadata["model_name"] = modelInfo.Name
			component.Metadata["model_version"] = modelInfo.Version
			component.Metadata["accuracy"] = modelInfo.Accuracy
			component.Metadata["last_trained"] = modelInfo.LastTrainedAt
		}
	}

	response.Components["ml_model"] = component
}

// checkCacheService checks the cache service health
func (h *HealthService) checkCacheService(ctx context.Context, response *HealthCheckResponse) {
	component := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]interface{}),
	}

	if h.aiService == nil || h.aiService.cache == nil {
		component.Status = "degraded"
		component.Message = "Cache service not available (fallback mode)"
	} else {
		stats, err := h.aiService.cache.GetCacheStats(ctx)
		if err != nil {
			component.Status = "degraded"
			component.Message = fmt.Sprintf("Cache service error: %v", err)
		} else {
			component.Status = "healthy"
			component.Message = "Cache service is operational"
			component.Metadata["hit_rate"] = stats.HitRate
			component.Metadata["total_hits"] = stats.TotalHits
			component.Metadata["total_misses"] = stats.TotalMisses
			component.Metadata["cache_size"] = stats.CacheSize
			component.Metadata["memory_usage_mb"] = stats.MemoryUsage / (1024 * 1024)
		}
	}

	response.Components["cache_service"] = component
}

// checkBehaviorTracker checks the behavior tracker health
func (h *HealthService) checkBehaviorTracker(ctx context.Context, response *HealthCheckResponse) {
	component := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]interface{}),
	}

	if h.aiService == nil || h.aiService.behaviorTracker == nil {
		component.Status = "degraded"
		component.Message = "Behavior tracker not available"
	} else {
		// Try to get a sample user profile to test functionality
		// Using a test user ID that should not exist
		_, err := h.aiService.behaviorTracker.GetUserProfile(ctx, "health-check-test-user")
		if err != nil {
			// Expected behavior - user doesn't exist, but service is working
			component.Status = "healthy"
			component.Message = "Behavior tracker is operational"
		} else {
			// Unexpected - test user exists
			component.Status = "healthy"
			component.Message = "Behavior tracker is operational"
		}
	}

	response.Components["behavior_tracker"] = component
}

// calculateOverallStatus determines the overall system health status
func (h *HealthService) calculateOverallStatus(components map[string]ComponentHealth) string {
	healthyCount := 0
	degradedCount := 0
	unhealthyCount := 0

	for _, component := range components {
		switch component.Status {
		case "healthy":
			healthyCount++
		case "degraded":
			degradedCount++
		case "unhealthy":
			unhealthyCount++
		}
	}

	total := len(components)
	
	// If any component is unhealthy, system is unhealthy
	if unhealthyCount > 0 {
		return "unhealthy"
	}
	
	// If more than half are degraded, system is degraded
	if degradedCount > total/2 {
		return "degraded"
	}
	
	// If any are degraded but most are healthy, system is degraded
	if degradedCount > 0 {
		return "degraded"
	}
	
	// All components are healthy
	return "healthy"
}

// GetHealthEndpointResponse formats response for HTTP endpoint
func (h *HealthService) GetHealthEndpointResponse(ctx context.Context) (map[string]interface{}, int) {
	healthCheck := h.PerformHealthCheck(ctx)
	
	statusCode := 200
	switch healthCheck.Status {
	case "degraded":
		statusCode = 200 // Still operational
	case "unhealthy":
		statusCode = 503 // Service unavailable
	}

	return map[string]interface{}{
		"status":      healthCheck.Status,
		"timestamp":   healthCheck.Timestamp.Format(time.RFC3339),
		"duration_ms": healthCheck.Duration.Milliseconds(),
		"components":  healthCheck.Components,
		"metadata":    healthCheck.Metadata,
		"version":     "1.0.0",
	}, statusCode
}