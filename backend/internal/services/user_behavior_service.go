package services

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"time"

	aiModels "microbridge/backend/internal/ai/models"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
	"microbridge/backend/internal/shared/cache"
)

// UserBehaviorService handles tracking and analyzing user behavior for improved recommendations
type UserBehaviorService interface {
	// Behavior tracking methods
	TrackJobView(ctx context.Context, userID, jobID string, timeSpent time.Duration) error
	TrackJobApplication(ctx context.Context, userID, jobID string) error
	TrackJobSave(ctx context.Context, userID, jobID string) error
	TrackJobDismiss(ctx context.Context, userID, jobID string) error
	TrackSearchQuery(ctx context.Context, userID, query string, filters map[string]interface{}) error
	TrackSkillInterest(ctx context.Context, userID, skillName string, interactionType string) error
	
	// Preference learning methods
	UpdatePreferences(ctx context.Context, userID string, preferences map[string]float64) error
	LearnFromFeedback(ctx context.Context, userID, jobID, action string, outcome float64) error
	
	// Behavioral insights methods
	GetUserBehaviorPattern(ctx context.Context, userID string) (*aiModels.UserBehaviorPattern, error)
	GetRecommendationContext(ctx context.Context, userID string) (*RecommendationContext, error)
	AnalyzeBehaviorTrends(ctx context.Context, userID string, days int) (*BehaviorTrends, error)
	
	// Integration with matching service
	EnrichRecommendations(ctx context.Context, userID string, recommendations []*HybridMatchResult) ([]*EnrichedRecommendation, error)
}

// RecommendationContext provides behavioral context for AI recommendation systems
type RecommendationContext struct {
	UserID               string                 `json:"user_id"`
	RecentViews          []string               `json:"recent_views"`           // Last 50 job views
	RecentApplications   []string               `json:"recent_applications"`    // Last 20 applications
	SavedJobs            []string               `json:"saved_jobs"`
	DismissedJobs        []string               `json:"dismissed_jobs"`
	SearchPatterns       []SearchPattern        `json:"search_patterns"`
	SkillInterests       map[string]float64     `json:"skill_interests"`        // skill -> interest score (0-1)
	PreferenceSignals    map[string]float64     `json:"preference_signals"`     // Various preference indicators
	EngagementMetrics    EngagementMetrics      `json:"engagement_metrics"`
	TimestampedActions   []TimestampedAction    `json:"timestamped_actions"`    // Chronological action history
	LastUpdated          time.Time              `json:"last_updated"`
}

// SearchPattern represents user search behavior patterns
type SearchPattern struct {
	Query       string                 `json:"query"`
	Filters     map[string]interface{} `json:"filters"`
	Timestamp   time.Time              `json:"timestamp"`
	ResultCount int                    `json:"result_count"`
	ClickedJobs []string               `json:"clicked_jobs"`
}

// EngagementMetrics tracks user engagement levels
type EngagementMetrics struct {
	AverageTimePerJob    time.Duration     `json:"average_time_per_job"`
	SessionFrequency     float64           `json:"session_frequency"`       // sessions per week
	ApplicationRate      float64           `json:"application_rate"`        // applications per job view
	SearchToViewRatio    float64           `json:"search_to_view_ratio"`    // views per search
	EngagementTrend      string            `json:"engagement_trend"`        // "increasing", "stable", "decreasing"
	LastActiveSession    time.Time         `json:"last_active_session"`
	TotalSessions        int               `json:"total_sessions"`
}

// TimestampedAction represents any user action with context
type TimestampedAction struct {
	Type      string                 `json:"type"`       // "view", "apply", "save", "dismiss", "search"
	JobID     string                 `json:"job_id,omitempty"`
	Data      map[string]interface{} `json:"data,omitempty"`
	Timestamp time.Time              `json:"timestamp"`
}

// BehaviorTrends analyzes behavioral changes over time
type BehaviorTrends struct {
	UserID                string              `json:"user_id"`
	TimeRange             int                 `json:"time_range_days"`
	ActivityTrend         ActivityTrend       `json:"activity_trend"`
	SkillInterestChanges  []SkillTrendChange  `json:"skill_interest_changes"`
	PreferenceShifts      []PreferenceShift   `json:"preference_shifts"`
	EngagementEvolution   []EngagementPoint   `json:"engagement_evolution"`
	RecommendationImpact  RecommendationImpact `json:"recommendation_impact"`
}

type ActivityTrend struct {
	ViewsPerWeek        []float64 `json:"views_per_week"`
	ApplicationsPerWeek []float64 `json:"applications_per_week"`
	SearchesPerWeek     []float64 `json:"searches_per_week"`
	TrendDirection      string    `json:"trend_direction"` // "up", "down", "stable"
	ChangePercentage    float64   `json:"change_percentage"`
}

type SkillTrendChange struct {
	SkillName       string  `json:"skill_name"`
	PreviousScore   float64 `json:"previous_score"`
	CurrentScore    float64 `json:"current_score"`
	ChangeDirection string  `json:"change_direction"` // "increasing", "decreasing", "stable"
}

type PreferenceShift struct {
	PreferenceName  string  `json:"preference_name"`
	PreviousValue   float64 `json:"previous_value"`
	CurrentValue    float64 `json:"current_value"`
	Confidence      float64 `json:"confidence"`
}

type EngagementPoint struct {
	Date             time.Time `json:"date"`
	EngagementScore  float64   `json:"engagement_score"`
	SessionDuration  time.Duration `json:"session_duration"`
	ActionsPerSession int      `json:"actions_per_session"`
}

type RecommendationImpact struct {
	ImprovedMatchRate     float64 `json:"improved_match_rate"`
	UserSatisfactionDelta float64 `json:"user_satisfaction_delta"`
	ModelAccuracyGain     float64 `json:"model_accuracy_gain"`
}

// EnrichedRecommendation extends HybridMatchResult with behavioral insights
type EnrichedRecommendation struct {
	*HybridMatchResult
	BehavioralScore      float64            `json:"behavioral_score"`
	PersonalizationLevel string             `json:"personalization_level"` // "high", "medium", "low"
	ReasoningContext     []string           `json:"reasoning_context"`
	ConfidenceBoosters   []string           `json:"confidence_boosters"`
	UserJourneyStage     string             `json:"user_journey_stage"`    // "explorer", "focused", "decisive"
	PredictedEngagement  PredictedEngagement `json:"predicted_engagement"`
}

type PredictedEngagement struct {
	ViewProbability      float64 `json:"view_probability"`
	ApplicationProbability float64 `json:"application_probability"`
	TimeToAction         time.Duration `json:"time_to_action"`
	EngagementQuality    string  `json:"engagement_quality"` // "high", "medium", "low"
}

// userBehaviorService implements UserBehaviorService
type userBehaviorService struct {
	behaviorRepo     repository.BehaviorRepository // You'll need to create this
	userRepo         repository.UserRepository
	jobRepo          repository.JobRepository
	cacheService     cache.CacheService
	hybridMatcher    *HybridMatchingService // For integration
}

func NewUserBehaviorService(
	behaviorRepo repository.BehaviorRepository,
	userRepo repository.UserRepository,
	jobRepo repository.JobRepository,
	cacheService cache.CacheService,
	hybridMatcher *HybridMatchingService,
) UserBehaviorService {
	return &userBehaviorService{
		behaviorRepo:  behaviorRepo,
		userRepo:      userRepo,
		jobRepo:       jobRepo,
		cacheService:  cacheService,
		hybridMatcher: hybridMatcher,
	}
}

// TrackJobView records when a user views a job posting
func (s *userBehaviorService) TrackJobView(ctx context.Context, userID, jobID string, timeSpent time.Duration) error {
	action := TimestampedAction{
		Type:      "view",
		JobID:     jobID,
		Data:      map[string]interface{}{"time_spent": timeSpent.Seconds()},
		Timestamp: time.Now(),
	}
	
	// Update behavioral context
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return fmt.Errorf("failed to update behavioral context: %w", err)
	}
	
	// Learn from engagement time
	engagementScore := s.calculateEngagementScore(timeSpent)
	if err := s.updateEngagementMetrics(ctx, userID, "view", engagementScore); err != nil {
		return fmt.Errorf("failed to update engagement metrics: %w", err)
	}
	
	// Update skill interests based on job skills
	if err := s.inferSkillInterests(ctx, userID, jobID, "view", engagementScore); err != nil {
		return fmt.Errorf("failed to infer skill interests: %w", err)
	}
	
	return nil
}

// TrackJobApplication records when a user applies to a job
func (s *userBehaviorService) TrackJobApplication(ctx context.Context, userID, jobID string) error {
	action := TimestampedAction{
		Type:      "apply",
		JobID:     jobID,
		Data:      map[string]interface{}{"outcome": "positive"},
		Timestamp: time.Now(),
	}
	
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return err
	}
	
	// Applications are strong positive signals
	if err := s.updateEngagementMetrics(ctx, userID, "application", 1.0); err != nil {
		return err
	}
	
	// Strong signal for skill interests
	if err := s.inferSkillInterests(ctx, userID, jobID, "apply", 1.0); err != nil {
		return err
	}
	
	// Feed into RL system for learning
	if s.hybridMatcher != nil {
		if err := s.hybridMatcher.ProcessUserFeedback(ctx, userID, jobID, "", "applied", 0.9); err != nil {
			// Log error but don't fail the tracking
			fmt.Printf("Failed to process RL feedback: %v\n", err)
		}
	}
	
	return nil
}

// TrackJobSave records when a user saves a job for later
func (s *userBehaviorService) TrackJobSave(ctx context.Context, userID, jobID string) error {
	action := TimestampedAction{
		Type:      "save",
		JobID:     jobID,
		Data:      map[string]interface{}{"outcome": "positive"},
		Timestamp: time.Now(),
	}
	
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return err
	}
	
	// Saves indicate moderate positive interest
	if err := s.updateEngagementMetrics(ctx, userID, "save", 0.6); err != nil {
		return err
	}
	
	if err := s.inferSkillInterests(ctx, userID, jobID, "save", 0.6); err != nil {
		return err
	}
	
	return nil
}

// TrackJobDismiss records when a user explicitly dismisses a recommendation
func (s *userBehaviorService) TrackJobDismiss(ctx context.Context, userID, jobID string) error {
	action := TimestampedAction{
		Type:      "dismiss",
		JobID:     jobID,
		Data:      map[string]interface{}{"outcome": "negative"},
		Timestamp: time.Now(),
	}
	
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return err
	}
	
	// Dismissals are negative signals
	if err := s.updateEngagementMetrics(ctx, userID, "dismiss", -0.3); err != nil {
		return err
	}
	
	// Negative signal for skill interests
	if err := s.inferSkillInterests(ctx, userID, jobID, "dismiss", -0.3); err != nil {
		return err
	}
	
	// Feed negative feedback into RL system
	if s.hybridMatcher != nil {
		if err := s.hybridMatcher.ProcessUserFeedback(ctx, userID, jobID, "", "dismissed", 0.1); err != nil {
			fmt.Printf("Failed to process RL feedback: %v\n", err)
		}
	}
	
	return nil
}

// TrackSearchQuery records user search behavior
func (s *userBehaviorService) TrackSearchQuery(ctx context.Context, userID, query string, filters map[string]interface{}) error {
	action := TimestampedAction{
		Type: "search",
		Data: map[string]interface{}{
			"query":   query,
			"filters": filters,
		},
		Timestamp: time.Now(),
	}
	
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return err
	}
	
	// Learn preferences from search filters
	return s.learnFromSearchBehavior(ctx, userID, query, filters)
}

// TrackSkillInterest records explicit skill interest signals
func (s *userBehaviorService) TrackSkillInterest(ctx context.Context, userID, skillName, interactionType string) error {
	score := s.getInteractionScore(interactionType)
	
	action := TimestampedAction{
		Type: "skill_interest",
		Data: map[string]interface{}{
			"skill":            skillName,
			"interaction_type": interactionType,
			"score":           score,
		},
		Timestamp: time.Now(),
	}
	
	if err := s.updateBehavioralContext(ctx, userID, action); err != nil {
		return err
	}
	
	// Update skill interest scores
	return s.updateSkillInterest(ctx, userID, skillName, score)
}

// GetUserBehaviorPattern returns the behavioral pattern for ML training
func (s *userBehaviorService) GetUserBehaviorPattern(ctx context.Context, userID string) (*aiModels.UserBehaviorPattern, error) {
	context, err := s.GetRecommendationContext(ctx, userID)
	if err != nil {
		return nil, err
	}
	
	// Convert to AI model format
	pattern := &aiModels.UserBehaviorPattern{
		UserID:              userID,
		PreferredSkills:     s.extractTopSkills(context.SkillInterests, 10),
		PreferredIndustries: s.extractPreferredIndustries(context.PreferenceSignals),
		AvgApplicationRate:  context.EngagementMetrics.ApplicationRate,
		BehaviorVector:      s.generateBehaviorVector(context),
		LastAnalyzed:        time.Now(),
	}
	
	// Get successful and rejected matches from history
	pattern.SuccessfulMatches = s.extractMatchHistory(context, "positive")
	pattern.RejectedMatches = s.extractMatchHistory(context, "negative")
	
	return pattern, nil
}

// GetRecommendationContext provides comprehensive behavioral context
func (s *userBehaviorService) GetRecommendationContext(ctx context.Context, userID string) (*RecommendationContext, error) {
	// Try cache first
	cacheKey := fmt.Sprintf("behavior_context:%s", userID)
	if cached, err := s.cacheService.Get(ctx, cacheKey); err == nil {
		var context RecommendationContext
		if err := json.Unmarshal(cached, &context); err == nil {
			// Check if cache is fresh (last 15 minutes)
			if time.Since(context.LastUpdated) < 15*time.Minute {
				return &context, nil
			}
		}
	}
	
	// Build fresh context
	context, err := s.buildRecommendationContext(ctx, userID)
	if err != nil {
		return nil, err
	}
	
	// Cache the result
	if contextBytes, err := json.Marshal(context); err == nil {
		s.cacheService.Set(ctx, cacheKey, contextBytes, 15*time.Minute)
	}
	
	return context, nil
}

// Private helper methods

func (s *userBehaviorService) updateBehavioralContext(ctx context.Context, userID string, action TimestampedAction) error {
	// Implementation would update the user's behavioral context in the database
	// This is a simplified version - in production you'd want to handle this more efficiently
	
	// Invalidate cache
	cacheKey := fmt.Sprintf("behavior_context:%s", userID)
	s.cacheService.Delete(ctx, cacheKey)
	
	// In a real implementation, you would:
	// 1. Store the action in a time-series database or behavioral log
	// 2. Update aggregated behavioral metrics
	// 3. Trigger background processing for pattern recognition
	
	return nil
}

func (s *userBehaviorService) calculateEngagementScore(timeSpent time.Duration) float64 {
	// Convert time spent to engagement score (0-1 scale)
	seconds := timeSpent.Seconds()
	
	// Sigmoid function for engagement scoring
	// 30 seconds = 0.5, 60 seconds = ~0.73, 120 seconds = ~0.88
	score := 2 / (1 + math.Exp(-seconds/30)) - 1
	return math.Max(0, math.Min(1, score))
}

func (s *userBehaviorService) updateEngagementMetrics(ctx context.Context, userID, actionType string, score float64) error {
	// Update engagement metrics based on user action
	// This would involve updating running averages, trend calculations, etc.
	return nil
}

func (s *userBehaviorService) inferSkillInterests(ctx context.Context, userID, jobID, actionType string, engagementScore float64) error {
	// Get job details to extract skills
	// Update skill interest scores based on engagement
	// This would require job repository integration
	return nil
}

func (s *userBehaviorService) learnFromSearchBehavior(ctx context.Context, userID, query string, filters map[string]interface{}) error {
	// Analyze search query and filters to update preferences
	// Extract signals about remote work preference, salary importance, location preference, etc.
	return nil
}

func (s *userBehaviorService) getInteractionScore(interactionType string) float64 {
	switch interactionType {
	case "click", "hover":
		return 0.1
	case "explore", "read_more":
		return 0.3
	case "bookmark", "share":
		return 0.6
	case "apply", "contact":
		return 1.0
	case "dismiss", "hide":
		return -0.2
	default:
		return 0.0
	}
}

func (s *userBehaviorService) updateSkillInterest(ctx context.Context, userID, skillName string, score float64) error {
	// Update skill interest score using exponential moving average
	// This would involve reading current score, applying learning rate, and storing
	return nil
}

func (s *userBehaviorService) buildRecommendationContext(ctx context.Context, userID string) (*RecommendationContext, error) {
	// Build comprehensive behavioral context from database
	// This would involve multiple queries to gather behavioral data
	
	context := &RecommendationContext{
		UserID:             userID,
		RecentViews:        []string{}, // From behavioral logs
		RecentApplications: []string{}, // From application records
		SavedJobs:         []string{}, // From saved jobs
		DismissedJobs:     []string{}, // From dismissal logs
		SearchPatterns:    []SearchPattern{}, // From search logs
		SkillInterests:    make(map[string]float64), // From skill tracking
		PreferenceSignals: make(map[string]float64), // From preference learning
		EngagementMetrics: EngagementMetrics{}, // From engagement tracking
		TimestampedActions: []TimestampedAction{}, // From action logs
		LastUpdated:       time.Now(),
	}
	
	return context, nil
}

func (s *userBehaviorService) extractTopSkills(skillInterests map[string]float64, limit int) []string {
	// Extract top skills by interest score
	skills := make([]string, 0, len(skillInterests))
	for skill, score := range skillInterests {
		if score > 0.5 { // Only include skills with moderate+ interest
			skills = append(skills, skill)
		}
	}
	
	// Sort by score and return top N
	// Implementation would sort by score descending
	if len(skills) > limit {
		return skills[:limit]
	}
	return skills
}

func (s *userBehaviorService) extractPreferredIndustries(preferenceSignals map[string]float64) []string {
	// Extract preferred industries from preference signals
	industries := []string{}
	for key, value := range preferenceSignals {
		if key[:9] == "industry_" && value > 0.6 {
			industries = append(industries, key[9:]) // Remove "industry_" prefix
		}
	}
	return industries
}

func (s *userBehaviorService) generateBehaviorVector(context *RecommendationContext) []float64 {
	// Generate a dense behavior vector for ML models
	// This would encode various behavioral patterns into a numerical vector
	vector := make([]float64, 100) // Example: 100-dimensional behavior vector
	
	// Example encoding (simplified):
	vector[0] = float64(len(context.RecentViews)) / 50.0 // Activity level
	vector[1] = float64(len(context.RecentApplications)) / 20.0 // Application rate
	vector[2] = context.EngagementMetrics.ApplicationRate // Engagement level
	// ... encode more behavioral features
	
	return vector
}

func (s *userBehaviorService) extractMatchHistory(context *RecommendationContext, outcome string) []string {
	// Extract job IDs with specific outcomes (positive/negative) from action history
	matches := []string{}
	for _, action := range context.TimestampedActions {
		if data, ok := action.Data["outcome"]; ok {
			if data == outcome && action.JobID != "" {
				matches = append(matches, action.JobID)
			}
		}
	}
	return matches
}

// Additional methods for trend analysis, preference updates, etc. would be implemented here

func (s *userBehaviorService) UpdatePreferences(ctx context.Context, userID string, preferences map[string]float64) error {
	// Update user preferences with new values using exponential moving average
	for prefName, newValue := range preferences {
		// Get current preference signal
		signals, err := s.behaviorRepo.GetPreferenceSignals(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to get preference signals: %w", err)
		}
		
		// Find existing signal or create new one
		var currentValue float64 = 0.5 // Default neutral value
		var confidence float64 = 0.1   // Low initial confidence
		
		for _, signal := range signals {
			if signal.SignalType == prefName {
				currentValue = signal.Value
				confidence = signal.Confidence
				break
			}
		}
		
		// Apply exponential moving average with learning rate
		learningRate := 0.3
		updatedValue := (1-learningRate)*currentValue + learningRate*newValue
		updatedConfidence := math.Min(1.0, confidence+0.1) // Gradually increase confidence
		
		// Store updated preference signal
		signal := repository.PreferenceSignal{
			UserID:      userID,
			SignalType:  prefName,
			Value:       updatedValue,
			Confidence:  updatedConfidence,
			Source:      "learned",
			LastUpdated: time.Now(),
			CreatedAt:   time.Now(),
		}
		
		if err := s.behaviorRepo.StorePreferenceSignal(ctx, signal); err != nil {
			return fmt.Errorf("failed to store preference signal: %w", err)
		}
	}
	
	// Invalidate cache
	cacheKey := fmt.Sprintf("behavior_context:%s", userID)
	s.cacheService.Delete(ctx, cacheKey)
	
	return nil
}

func (s *userBehaviorService) LearnFromFeedback(ctx context.Context, userID, jobID, action string, outcome float64) error {
	// Extract learning signals from user feedback
	job, err := s.jobRepo.GetByID(ctx, jobID)
	if err != nil {
		return fmt.Errorf("failed to get job details: %w", err)
	}
	
	// Learn from job characteristics
	preferences := make(map[string]float64)
	
	// Remote work preference learning
	if job.IsRemote {
		preferences["remote_preference"] = outcome
	} else {
		preferences["remote_preference"] = -outcome
	}
	
	// Salary importance learning
	if job.SalaryMin > 0 || job.SalaryMax > 0 {
		avgSalary := float64(job.SalaryMin+job.SalaryMax) / 2
		if avgSalary > 75000 { // High salary threshold
			preferences["salary_importance"] = outcome
		}
	}
	
	// Company size preference
	if job.CompanySize != "" {
		preferences[fmt.Sprintf("company_size_%s", job.CompanySize)] = outcome
	}
	
	// Industry preference
	if job.Industry != "" {
		preferences[fmt.Sprintf("industry_%s", job.Industry)] = outcome
	}
	
	// Location preference
	if job.Location != "" {
		preferences[fmt.Sprintf("location_%s", job.Location)] = outcome
	}
	
	// Update preferences based on feedback
	if err := s.UpdatePreferences(ctx, userID, preferences); err != nil {
		return fmt.Errorf("failed to update preferences from feedback: %w", err)
	}
	
	// Store the feedback action
	action := repository.UserAction{
		UserID:     userID,
		ActionType: "feedback",
		EntityID:   jobID,
		EntityType: "job",
		Data: map[string]interface{}{
			"action":  action,
			"outcome": outcome,
			"learned_preferences": preferences,
		},
		Timestamp: time.Now(),
	}
	
	return s.behaviorRepo.StoreUserAction(ctx, action)
}

func (s *userBehaviorService) AnalyzeBehaviorTrends(ctx context.Context, userID string, days int) (*BehaviorTrends, error) {
	// Get user action history
	actions, err := s.behaviorRepo.GetUserActionHistory(ctx, userID, days)
	if err != nil {
		return nil, fmt.Errorf("failed to get user action history: %w", err)
	}
	
	// Analyze activity trends
	activityTrend := s.analyzeActivityTrend(actions, days)
	
	// Analyze skill interest changes
	skillChanges, err := s.analyzeSkillInterestChanges(ctx, userID, days)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze skill interest changes: %w", err)
	}
	
	// Analyze preference shifts
	preferenceShifts, err := s.analyzePreferenceShifts(ctx, userID, days)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze preference shifts: %w", err)
	}
	
	// Analyze engagement evolution
	engagementEvolution := s.analyzeEngagementEvolution(actions, days)
	
	return &BehaviorTrends{
		UserID:               userID,
		TimeRangeDays:        days,
		ActivityTrend:        activityTrend,
		SkillInterestChanges: skillChanges,
		PreferenceShifts:     preferenceShifts,
		EngagementEvolution:  engagementEvolution,
		JourneyProgression:   s.determineJourneyProgression(actions),
	}, nil
}

func (s *userBehaviorService) EnrichRecommendations(ctx context.Context, userID string, recommendations []*HybridMatchResult) ([]*EnrichedRecommendation, error) {
	// Get behavioral context
	context, err := s.GetRecommendationContext(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get recommendation context: %w", err)
	}
	
	enriched := make([]*EnrichedRecommendation, len(recommendations))
	
	for i, rec := range recommendations {
		// Calculate behavioral score based on user patterns
		behavioralScore := s.calculateBehavioralScore(rec, context)
		
		// Determine personalization level
		personalizationLevel := s.determinePersonalizationLevel(context)
		
		// Generate reasoning context
		reasoningContext := s.generateReasoningContext(rec, context)
		
		// Identify confidence boosters
		confidenceBoosters := s.identifyConfidenceBoosters(rec, context)
		
		// Determine user journey stage
		journeyStage := s.determineUserJourneyStage(context)
		
		// Predict engagement
		predictedEngagement := s.predictEngagement(rec, context)
		
		enriched[i] = &EnrichedRecommendation{
			HybridMatchResult:    rec,
			BehavioralScore:      behavioralScore,
			PersonalizationLevel: personalizationLevel,
			ReasoningContext:     reasoningContext,
			ConfidenceBoosters:   confidenceBoosters,
			UserJourneyStage:     journeyStage,
			PredictedEngagement:  predictedEngagement,
		}
	}
	
	return enriched, nil
}

// Helper methods for behavior analysis

func (s *userBehaviorService) analyzeActivityTrend(actions []repository.UserAction, days int) ActivityTrend {
	// Group actions by week
	weeksData := make(map[int]map[string]int)
	weeks := days / 7
	if weeks < 1 {
		weeks = 1
	}
	
	for _, action := range actions {
		weekNum := int(time.Since(action.Timestamp).Hours() / (24 * 7))
		if weekNum >= weeks {
			continue
		}
		
		if weeksData[weekNum] == nil {
			weeksData[weekNum] = make(map[string]int)
		}
		weeksData[weekNum][action.ActionType]++
	}
	
	// Calculate weekly averages
	viewsPerWeek := make([]float64, weeks)
	applicationsPerWeek := make([]float64, weeks)
	searchesPerWeek := make([]float64, weeks)
	
	for week := 0; week < weeks; week++ {
		if data, exists := weeksData[week]; exists {
			viewsPerWeek[week] = float64(data["view"])
			applicationsPerWeek[week] = float64(data["apply"])
			searchesPerWeek[week] = float64(data["search"])
		}
	}
	
	// Determine trend direction
	trendDirection := "stable"
	changePercentage := 0.0
	
	if len(viewsPerWeek) >= 2 {
		recent := (viewsPerWeek[0] + applicationsPerWeek[0]) / 2
		older := (viewsPerWeek[len(viewsPerWeek)-1] + applicationsPerWeek[len(applicationsPerWeek)-1]) / 2
		
		if older > 0 {
			changePercentage = ((recent - older) / older) * 100
			if changePercentage > 15 {
				trendDirection = "up"
			} else if changePercentage < -15 {
				trendDirection = "down"
			}
		}
	}
	
	return ActivityTrend{
		ViewsPerWeek:        viewsPerWeek,
		ApplicationsPerWeek: applicationsPerWeek,
		SearchesPerWeek:     searchesPerWeek,
		TrendDirection:      trendDirection,
		ChangePercentage:    changePercentage,
	}
}

func (s *userBehaviorService) analyzeSkillInterestChanges(ctx context.Context, userID string, days int) ([]SkillTrendChange, error) {
	// This would compare current skill interests with historical data
	// For now, return empty slice - would require historical skill interest tracking
	return []SkillTrendChange{}, nil
}

func (s *userBehaviorService) analyzePreferenceShifts(ctx context.Context, userID string, days int) ([]PreferenceShift, error) {
	// Get current preference signals
	signals, err := s.behaviorRepo.GetPreferenceSignals(ctx, userID)
	if err != nil {
		return nil, err
	}
	
	shifts := []PreferenceShift{}
	
	// For each preference, check if there's been a significant change
	// This would require historical preference tracking
	for _, signal := range signals {
		if time.Since(signal.LastUpdated) <= time.Duration(days)*24*time.Hour {
			// If recently updated, assume it was a shift
			shift := PreferenceShift{
				PreferenceName: signal.SignalType,
				CurrentValue:   signal.Value,
				PreviousValue:  0.5, // Would be retrieved from history
				Confidence:     signal.Confidence,
				DetectedAt:     signal.LastUpdated,
				Impact:         "medium", // Would be calculated based on preference importance
			}
			shifts = append(shifts, shift)
		}
	}
	
	return shifts, nil
}

func (s *userBehaviorService) analyzeEngagementEvolution(actions []repository.UserAction, days int) []EngagementPoint {
	// Group actions by day and calculate engagement scores
	dailyEngagement := make(map[string][]repository.UserAction)
	
	for _, action := range actions {
		day := action.Timestamp.Format("2006-01-02")
		dailyEngagement[day] = append(dailyEngagement[day], action)
	}
	
	points := []EngagementPoint{}
	
	for day, dayActions := range dailyEngagement {
		date, _ := time.Parse("2006-01-02", day)
		
		// Calculate engagement metrics for the day
		totalActions := len(dayActions)
		engagementScore := float64(totalActions) / 10.0 // Normalize to 0-1 scale
		if engagementScore > 1.0 {
			engagementScore = 1.0
		}
		
		// Calculate session duration (simplified)
		var sessionDuration time.Duration
		if len(dayActions) > 0 {
			first := dayActions[0].Timestamp
			last := dayActions[len(dayActions)-1].Timestamp
			sessionDuration = last.Sub(first)
		}
		
		// Calculate quality score based on action types
		qualityScore := 0.0
		for _, action := range dayActions {
			switch action.ActionType {
			case "apply":
				qualityScore += 1.0
			case "save":
				qualityScore += 0.6
			case "view":
				qualityScore += 0.3
			case "search":
				qualityScore += 0.1
			}
		}
		qualityScore = qualityScore / float64(totalActions) // Average quality
		
		points = append(points, EngagementPoint{
			Date:              date,
			EngagementScore:   engagementScore,
			SessionDuration:   sessionDuration,
			ActionsPerSession: totalActions,
			QualityScore:      qualityScore,
		})
	}
	
	return points
}

func (s *userBehaviorService) determineJourneyProgression(actions []repository.UserAction) string {
	// Analyze recent actions to determine journey stage evolution
	recentActions := []repository.UserAction{}
	cutoff := time.Now().AddDate(0, 0, -30) // Last 30 days
	
	for _, action := range actions {
		if action.Timestamp.After(cutoff) {
			recentActions = append(recentActions, action)
		}
	}
	
	if len(recentActions) == 0 {
		return "inactive"
	}
	
	// Count different action types
	actionCounts := make(map[string]int)
	for _, action := range recentActions {
		actionCounts[action.ActionType]++
	}
	
	// Determine progression based on action patterns
	if actionCounts["apply"] > 5 {
		return "decisive"
	} else if actionCounts["save"] > 10 || actionCounts["view"] > 20 {
		return "focused"
	} else {
		return "explorer"
	}
}

func (s *userBehaviorService) calculateBehavioralScore(rec *HybridMatchResult, context *RecommendationContext) float64 {
	score := 0.0
	
	// Check if job matches user's historical interests
	if len(context.RecentViews) > 0 {
		for _, viewedJobID := range context.RecentViews {
			if viewedJobID == rec.JobID {
				score += 0.3 // Previously viewed
				break
			}
		}
	}
	
	// Check skill interests alignment
	// This would require job skill extraction and matching with context.SkillInterests
	
	// Check preference signals alignment
	// This would require job characteristics matching with context.PreferenceSignals
	
	// Apply engagement patterns
	if context.EngagementMetrics.ApplicationRate > 0.1 {
		score += 0.2 // Active user
	}
	
	return math.Min(1.0, score)
}

func (s *userBehaviorService) determinePersonalizationLevel(context *RecommendationContext) string {
	// Determine how much behavioral data we have
	dataPoints := len(context.RecentViews) + len(context.RecentApplications) + len(context.SkillInterests)
	
	if dataPoints > 50 {
		return "high"
	} else if dataPoints > 15 {
		return "medium"
	} else {
		return "low"
	}
}

func (s *userBehaviorService) generateReasoningContext(rec *HybridMatchResult, context *RecommendationContext) []string {
	reasons := []string{}
	
	// Add reasons based on behavioral patterns
	if len(context.RecentViews) > 10 {
		reasons = append(reasons, "Based on your recent job viewing patterns")
	}
	
	if context.EngagementMetrics.ApplicationRate > 0.15 {
		reasons = append(reasons, "You frequently apply to similar positions")
	}
	
	if len(context.SkillInterests) > 5 {
		reasons = append(reasons, "Matches your demonstrated skill interests")
	}
	
	return reasons
}

func (s *userBehaviorService) identifyConfidenceBoosters(rec *HybridMatchResult, context *RecommendationContext) []string {
	boosters := []string{}
	
	if rec.ConfidenceLevel > 0.8 {
		boosters = append(boosters, "High AI confidence match")
	}
	
	if rec.SuccessProbability > 0.7 {
		boosters = append(boosters, "High success probability")
	}
	
	if context.EngagementMetrics.ApplicationRate > 0.2 {
		boosters = append(boosters, "Active job seeker profile")
	}
	
	return boosters
}

func (s *userBehaviorService) determineUserJourneyStage(context *RecommendationContext) string {
	// Determine journey stage based on engagement patterns
	if context.EngagementMetrics.ApplicationRate > 0.15 {
		return "decisive"
	} else if len(context.SavedJobs) > 5 {
		return "focused"
	} else {
		return "explorer"
	}
}

func (s *userBehaviorService) predictEngagement(rec *HybridMatchResult, context *RecommendationContext) PredictedEngagement {
	// Predict engagement based on behavioral patterns and job characteristics
	viewProbability := 0.5 // Base probability
	applicationProbability := 0.1 // Base probability
	
	// Adjust based on user's historical engagement
	if context.EngagementMetrics.ApplicationRate > 0 {
		applicationProbability = context.EngagementMetrics.ApplicationRate
	}
	
	// Adjust based on match score
	viewProbability = math.Min(1.0, viewProbability + rec.FinalScore*0.3)
	applicationProbability = math.Min(1.0, applicationProbability + rec.FinalScore*0.2)
	
	// Estimate time to action based on user patterns
	timeToAction := time.Duration(24) * time.Hour // Default 24 hours
	if context.EngagementMetrics.ApplicationRate > 0.2 {
		timeToAction = time.Duration(4) * time.Hour // Active users respond faster
	}
	
	// Determine engagement quality
	engagementQuality := "medium"
	if rec.FinalScore > 0.8 && applicationProbability > 0.15 {
		engagementQuality = "high"
	} else if rec.FinalScore < 0.5 {
		engagementQuality = "low"
	}
	
	return PredictedEngagement{
		ViewProbability:        viewProbability,
		ApplicationProbability: applicationProbability,
		TimeToAction:          timeToAction,
		EngagementQuality:     engagementQuality,
	}
}