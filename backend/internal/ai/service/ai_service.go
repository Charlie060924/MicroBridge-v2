package service

import (
	"context"
	"fmt"
	"time"

	"microbridge/backend/internal/ai/interfaces"
	"microbridge/backend/internal/core/matching"
	"microbridge/backend/internal/repository"
)

// AIService implements the AI service following existing patterns
type AIService struct {
	baseMatching    *matching.MatchingService
	userRepo        repository.UserRepository
	jobRepo         repository.JobRepository
	mlModel         interfaces.MLModelService
	cache           interfaces.CacheService
	behaviorTracker interfaces.BehaviorTracker
	config          *AIConfig
	fallbackEnabled bool
	initialized     bool
}

// AIConfig contains AI service configuration
type AIConfig struct {
	ModelPath         string        `json:"model_path"`
	InferenceTimeout  time.Duration `json:"inference_timeout"`
	MemoryLimit       int64         `json:"memory_limit_mb"`
	FallbackEnabled   bool          `json:"fallback_enabled"`
	CacheTTL          time.Duration `json:"cache_ttl"`
	MaxConcurrentInf  int           `json:"max_concurrent_inferences"`
	BatchSize         int           `json:"batch_size"`
}

// NewAIService creates a new AI service following existing constructor patterns
func NewAIService(
	baseMatching *matching.MatchingService,
	userRepo repository.UserRepository,
	jobRepo repository.JobRepository,
	mlModel interfaces.MLModelService,
	cache interfaces.CacheService,
	behaviorTracker interfaces.BehaviorTracker,
	config *AIConfig,
) *AIService {
	return &AIService{
		baseMatching:    baseMatching,
		userRepo:        userRepo,
		jobRepo:         jobRepo,
		mlModel:         mlModel,
		cache:           cache,
		behaviorTracker: behaviorTracker,
		config:          config,
		fallbackEnabled: config.FallbackEnabled,
		initialized:     false,
	}
}

// HealthCheck implements the health check endpoint for monitoring
func (s *AIService) HealthCheck(ctx context.Context) error {
	if !s.initialized {
		return fmt.Errorf("ai service not initialized")
	}

	// Check model status
	modelInfo, err := s.mlModel.GetModelInfo(ctx)
	if err != nil {
		return fmt.Errorf("model health check failed: %w", err)
	}

	if modelInfo.Status != "active" {
		return fmt.Errorf("model status is %s, expected active", modelInfo.Status)
	}

	// Check cache connectivity
	_, err = s.cache.GetCacheStats(ctx)
	if err != nil {
		return fmt.Errorf("cache health check failed: %w", err)
	}

	return nil
}

// Initialize sets up the AI service
func (s *AIService) Initialize(ctx context.Context) error {
	// Load ML models
	if err := s.mlModel.LoadModel(ctx, "user_job_matching_v1"); err != nil {
		return fmt.Errorf("failed to load ML model: %w", err)
	}

	s.initialized = true
	return nil
}

// Shutdown gracefully shuts down the AI service
func (s *AIService) Shutdown(ctx context.Context) error {
	s.initialized = false
	return nil
}

// EnhancedMatching provides AI-enhanced matching with graceful degradation
func (s *AIService) EnhancedMatching(ctx context.Context, userID string, limit int) ([]interfaces.EnhancedMatchResult, error) {
	// Apply timeout for AI operations
	ctx, cancel := context.WithTimeout(ctx, s.config.InferenceTimeout)
	defer cancel()

	// Check if AI service is healthy and initialized
	if !s.initialized || s.HealthCheck(ctx) != nil {
		return s.fallbackToBasicMatching(ctx, userID, limit)
	}

	// Get basic matching results first
	basicResults, err := s.baseMatching.FindJobsForUser(ctx, userID, limit*2) // Get more for AI filtering
	if err != nil {
		return nil, fmt.Errorf("failed to get basic matching results: %w", err)
	}

	// Enhance results with AI scoring
	enhancedResults := make([]interfaces.EnhancedMatchResult, 0, limit)
	for _, basicResult := range basicResults {
		enhanced, err := s.enhanceMatchResult(ctx, userID, &basicResult)
		if err != nil {
			// If AI enhancement fails, fall back to basic result
			enhanced = s.convertBasicToEnhanced(&basicResult)
		}
		enhancedResults = append(enhancedResults, *enhanced)
	}

	// Sort by AI confidence score and return top results
	s.sortByAIScore(enhancedResults)
	if len(enhancedResults) > limit {
		enhancedResults = enhancedResults[:limit]
	}

	return enhancedResults, nil
}

// GetMatchExplanation provides detailed explanation for a match
func (s *AIService) GetMatchExplanation(ctx context.Context, userID, jobID string) (*interfaces.MatchExplanation, error) {
	ctx, cancel := context.WithTimeout(ctx, s.config.InferenceTimeout)
	defer cancel()

	if !s.initialized {
		return nil, fmt.Errorf("ai service not initialized")
	}

	// Get prediction from ML model
	prediction, err := s.mlModel.PredictMatchScore(ctx, userID, jobID)
	if err != nil {
		return nil, fmt.Errorf("failed to get ML prediction: %w", err)
	}

	// Get behavior analysis
	behaviorProfile, err := s.behaviorTracker.GetUserProfile(ctx, userID)
	if err != nil {
		// Continue without behavior analysis if it fails
		behaviorProfile = &interfaces.BehaviorProfile{UserID: userID}
	}

	// Build detailed explanation
	explanation := &interfaces.MatchExplanation{
		JobID:        jobID,
		OverallScore: prediction.Score,
		GeneratedAt:  time.Now(),
	}

	// Add skill factors from prediction features
	explanation.SkillFactors = s.extractSkillFactors(prediction.Features)
	
	// Add experience, location, and behavior factors
	explanation.ExperienceFactor = s.extractExperienceFactor(prediction.Features)
	explanation.LocationFactor = s.extractLocationFactor(prediction.Features)
	explanation.BehaviorFactor = s.extractBehaviorFactor(prediction.Features, behaviorProfile)

	// Generate recommendations
	explanation.Recommendations = s.generateRecommendations(prediction.Features, behaviorProfile)

	return explanation, nil
}

// GetPersonalizedRecommendations provides personalized job recommendations
func (s *AIService) GetPersonalizedRecommendations(ctx context.Context, userID string, limit int) ([]interfaces.PersonalizedRecommendation, error) {
	ctx, cancel := context.WithTimeout(ctx, s.config.InferenceTimeout)
	defer cancel()

	if !s.initialized {
		return s.fallbackRecommendations(ctx, userID, limit)
	}

	// Get user behavior profile
	behaviorProfile, err := s.behaviorTracker.GetUserProfile(ctx, userID)
	if err != nil {
		return s.fallbackRecommendations(ctx, userID, limit)
	}

	// Get enhanced matching results
	matchResults, err := s.EnhancedMatching(ctx, userID, limit*2)
	if err != nil {
		return s.fallbackRecommendations(ctx, userID, limit)
	}

	// Convert to personalized recommendations
	recommendations := make([]interfaces.PersonalizedRecommendation, 0, limit)
	for i, match := range matchResults {
		if i >= limit {
			break
		}

		job, err := s.jobRepo.GetByID(ctx, match.JobID)
		if err != nil {
			continue
		}

		recommendation := interfaces.PersonalizedRecommendation{
			JobID:          match.JobID,
			Job:            job,
			RecommendScore: match.AIConfidenceScore,
			Priority:       s.calculatePriority(match.AIConfidenceScore),
			CreatedAt:      time.Now(),
		}

		// Generate reason based on behavior profile and match details
		recommendation.ReasonCode, recommendation.ReasonText = s.generateRecommendationReason(
			&match, behaviorProfile, job,
		)

		recommendations = append(recommendations, recommendation)
	}

	return recommendations, nil
}

// TrackUserBehavior tracks user actions for learning
func (s *AIService) TrackUserBehavior(ctx context.Context, userID string, action interfaces.UserAction, metadata map[string]interface{}) error {
	if !s.initialized {
		// Still track behavior even if AI service is not fully initialized
		return s.behaviorTracker.RecordAction(ctx, userID, action, metadata)
	}

	// Record the action
	if err := s.behaviorTracker.RecordAction(ctx, userID, action, metadata); err != nil {
		return fmt.Errorf("failed to record user action: %w", err)
	}

	// Invalidate cached predictions for this user
	if err := s.cache.InvalidateUserPredictions(ctx, userID); err != nil {
		// Log error but don't fail the request
		// TODO: Add structured logging here
		_ = err
	}

	return nil
}

// UpdateUserPreferences updates user preferences based on behavior
func (s *AIService) UpdateUserPreferences(ctx context.Context, userID string) error {
	if !s.initialized {
		return fmt.Errorf("ai service not initialized")
	}

	// Analyze current behavior to update preferences
	_, err := s.behaviorTracker.AnalyzePreferences(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to analyze user preferences: %w", err)
	}

	// Invalidate cached predictions
	if err := s.cache.InvalidateUserPredictions(ctx, userID); err != nil {
		// Log error but don't fail
		_ = err
	}

	return nil
}

// UpdateModel updates the ML model
func (s *AIService) UpdateModel(ctx context.Context, modelName string) error {
	if err := s.mlModel.LoadModel(ctx, modelName); err != nil {
		return fmt.Errorf("failed to update model: %w", err)
	}
	return nil
}

// GetModelInfo returns current model information
func (s *AIService) GetModelInfo(ctx context.Context) (*interfaces.ModelInfo, error) {
	return s.mlModel.GetModelInfo(ctx)
}

// Private helper methods

func (s *AIService) fallbackToBasicMatching(ctx context.Context, userID string, limit int) ([]interfaces.EnhancedMatchResult, error) {
	if !s.fallbackEnabled {
		return nil, fmt.Errorf("ai service unavailable and fallback disabled")
	}

	basicResults, err := s.baseMatching.FindJobsForUser(ctx, userID, limit)
	if err != nil {
		return nil, err
	}

	enhancedResults := make([]interfaces.EnhancedMatchResult, len(basicResults))
	for i, basic := range basicResults {
		enhancedResults[i] = *s.convertBasicToEnhanced(&basic)
	}

	return enhancedResults, nil
}

func (s *AIService) convertBasicToEnhanced(basic *matching.MatchResult) *interfaces.EnhancedMatchResult {
	return &interfaces.EnhancedMatchResult{
		JobID:                basic.JobID,
		UserToJobScore:       basic.UserToJobScore,
		JobToUserScore:       basic.JobToUserScore,
		HarmonicMeanScore:    basic.HarmonicMeanScore,
		AIConfidenceScore:    basic.HarmonicMeanScore, // Use basic score as fallback
		SkillMatchDetails:    basic.SkillMatchDetails,
		BehaviorScore:        0.0, // No behavior score in fallback
		CalculatedAt:         basic.CalculatedAt,
		ExplanationAvailable: false,
	}
}

func (s *AIService) enhanceMatchResult(ctx context.Context, userID string, basic *matching.MatchResult) (*interfaces.EnhancedMatchResult, error) {
	// Get AI prediction for this job-user pair
	prediction, err := s.mlModel.PredictMatchScore(ctx, userID, basic.JobID)
	if err != nil {
		return s.convertBasicToEnhanced(basic), err
	}

	// Get behavior score
	behaviorScore := 0.0
	if behaviorProfile, err := s.behaviorTracker.GetUserProfile(ctx, userID); err == nil {
		behaviorScore = behaviorProfile.EngagementScore
	}

	return &interfaces.EnhancedMatchResult{
		JobID:                basic.JobID,
		UserToJobScore:       basic.UserToJobScore,
		JobToUserScore:       basic.JobToUserScore,
		HarmonicMeanScore:    basic.HarmonicMeanScore,
		AIConfidenceScore:    prediction.Score,
		SkillMatchDetails:    basic.SkillMatchDetails,
		BehaviorScore:        behaviorScore,
		CalculatedAt:         basic.CalculatedAt,
		ExplanationAvailable: true,
	}, nil
}

func (s *AIService) sortByAIScore(results []interfaces.EnhancedMatchResult) {
	// Simple bubble sort by AI confidence score (descending)
	for i := 0; i < len(results)-1; i++ {
		for j := i + 1; j < len(results); j++ {
			if results[i].AIConfidenceScore < results[j].AIConfidenceScore {
				results[i], results[j] = results[j], results[i]
			}
		}
	}
}

func (s *AIService) fallbackRecommendations(ctx context.Context, userID string, limit int) ([]interfaces.PersonalizedRecommendation, error) {
	// Fallback to basic matching results
	basicResults, err := s.baseMatching.FindJobsForUser(ctx, userID, limit)
	if err != nil {
		return nil, err
	}

	recommendations := make([]interfaces.PersonalizedRecommendation, 0, len(basicResults))
	for _, result := range basicResults {
		job, err := s.jobRepo.GetByID(ctx, result.JobID)
		if err != nil {
			continue
		}

		recommendations = append(recommendations, interfaces.PersonalizedRecommendation{
			JobID:          result.JobID,
			Job:            job,
			RecommendScore: result.HarmonicMeanScore,
			ReasonCode:     "skill_match",
			ReasonText:     "Based on your skills and experience",
			Priority:       s.calculatePriority(result.HarmonicMeanScore),
			CreatedAt:      time.Now(),
		})
	}

	return recommendations, nil
}

func (s *AIService) calculatePriority(score float64) string {
	switch {
	case score >= 0.8:
		return "high"
	case score >= 0.6:
		return "medium"
	default:
		return "low"
	}
}

// Placeholder implementations for detailed explanation extraction
func (s *AIService) extractSkillFactors(features map[string]float64) []interfaces.SkillFactor {
	// TODO: Implement skill factor extraction from ML model features
	return []interfaces.SkillFactor{}
}

func (s *AIService) extractExperienceFactor(features map[string]float64) interfaces.ExperienceFactor {
	// TODO: Implement experience factor extraction
	return interfaces.ExperienceFactor{}
}

func (s *AIService) extractLocationFactor(features map[string]float64) interfaces.LocationFactor {
	// TODO: Implement location factor extraction
	return interfaces.LocationFactor{}
}

func (s *AIService) extractBehaviorFactor(features map[string]float64, profile *interfaces.BehaviorProfile) interfaces.BehaviorFactor {
	// TODO: Implement behavior factor extraction
	return interfaces.BehaviorFactor{
		EngagementScore: profile.EngagementScore,
	}
}

func (s *AIService) generateRecommendations(features map[string]float64, profile *interfaces.BehaviorProfile) []string {
	// TODO: Implement recommendation generation
	return []string{"Improve skills in high-demand areas", "Consider similar role types"}
}

func (s *AIService) generateRecommendationReason(match *interfaces.EnhancedMatchResult, profile *interfaces.BehaviorProfile, job *interface{}) (string, string) {
	// TODO: Implement reason generation based on match and behavior data
	if match.AIConfidenceScore > 0.8 {
		return "high_match", "Excellent match based on your skills and preferences"
	} else if match.BehaviorScore > 0.7 {
		return "behavior_match", "This aligns with your browsing patterns and interests"
	}
	return "skill_match", "Good match based on your technical skills"
}