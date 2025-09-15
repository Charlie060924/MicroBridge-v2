package dto

import (
	"errors"
	"strings"
)

// Behavior tracking request DTOs

type TrackJobViewRequest struct {
	JobID            string `json:"job_id" binding:"required"`
	TimeSpentSeconds int    `json:"time_spent_seconds" binding:"min=0"`
	Source           string `json:"source,omitempty"` // "search", "recommendation", "saved", etc.
	SessionID        string `json:"session_id,omitempty"`
}

func (r *TrackJobViewRequest) Validate() error {
	if strings.TrimSpace(r.JobID) == "" {
		return errors.New("job_id is required")
	}
	if r.TimeSpentSeconds < 0 {
		return errors.New("time_spent_seconds must be non-negative")
	}
	return nil
}

type TrackJobActionRequest struct {
	JobID     string `json:"job_id" binding:"required"`
	Source    string `json:"source,omitempty"`
	SessionID string `json:"session_id,omitempty"`
	Context   map[string]interface{} `json:"context,omitempty"`
}

func (r *TrackJobActionRequest) Validate() error {
	if strings.TrimSpace(r.JobID) == "" {
		return errors.New("job_id is required")
	}
	return nil
}

type TrackSearchRequest struct {
	Query     string                 `json:"query" binding:"required"`
	Filters   map[string]interface{} `json:"filters,omitempty"`
	SessionID string                 `json:"session_id,omitempty"`
	ResultCount int                  `json:"result_count,omitempty"`
	Source    string                 `json:"source,omitempty"` // "header", "advanced", "quick", etc.
}

func (r *TrackSearchRequest) Validate() error {
	if strings.TrimSpace(r.Query) == "" {
		return errors.New("query is required")
	}
	if r.ResultCount < 0 {
		return errors.New("result_count must be non-negative")
	}
	return nil
}

type TrackSkillInterestRequest struct {
	SkillName       string `json:"skill_name" binding:"required"`
	InteractionType string `json:"interaction_type" binding:"required"` // "click", "hover", "explore", "bookmark", etc.
	Context         string `json:"context,omitempty"`                   // "job_view", "profile_edit", "search", etc.
	SessionID       string `json:"session_id,omitempty"`
}

func (r *TrackSkillInterestRequest) Validate() error {
	if strings.TrimSpace(r.SkillName) == "" {
		return errors.New("skill_name is required")
	}
	if strings.TrimSpace(r.InteractionType) == "" {
		return errors.New("interaction_type is required")
	}
	
	// Validate interaction types
	validTypes := []string{"click", "hover", "explore", "bookmark", "share", "apply", "contact", "dismiss", "hide"}
	isValid := false
	for _, validType := range validTypes {
		if r.InteractionType == validType {
			isValid = true
			break
		}
	}
	if !isValid {
		return errors.New("invalid interaction_type")
	}
	
	return nil
}

type UpdatePreferencesRequest struct {
	Preferences map[string]float64 `json:"preferences" binding:"required"`
	Source      string             `json:"source,omitempty"` // "explicit", "survey", "inferred"
}

func (r *UpdatePreferencesRequest) Validate() error {
	if len(r.Preferences) == 0 {
		return errors.New("preferences cannot be empty")
	}
	
	// Validate preference values are in valid ranges
	for key, value := range r.Preferences {
		if strings.TrimSpace(key) == "" {
			return errors.New("preference key cannot be empty")
		}
		if value < -1.0 || value > 1.0 {
			return errors.New("preference values must be between -1.0 and 1.0")
		}
	}
	
	return nil
}

type FeedbackRequest struct {
	JobID     string  `json:"job_id" binding:"required"`
	Action    string  `json:"action" binding:"required"`    // "applied", "hired", "dismissed", "not_interested"
	Outcome   float64 `json:"outcome" binding:"min=0,max=1"` // 0.0 (negative) to 1.0 (positive)
	Context   string  `json:"context,omitempty"`
	SessionID string  `json:"session_id,omitempty"`
	Comments  string  `json:"comments,omitempty"` // Optional user comments
}

func (r *FeedbackRequest) Validate() error {
	if strings.TrimSpace(r.JobID) == "" {
		return errors.New("job_id is required")
	}
	if strings.TrimSpace(r.Action) == "" {
		return errors.New("action is required")
	}
	
	// Validate action types
	validActions := []string{"applied", "hired", "dismissed", "not_interested", "saved", "viewed", "contacted"}
	isValid := false
	for _, validAction := range validActions {
		if r.Action == validAction {
			isValid = true
			break
		}
	}
	if !isValid {
		return errors.New("invalid action type")
	}
	
	if r.Outcome < 0.0 || r.Outcome > 1.0 {
		return errors.New("outcome must be between 0.0 and 1.0")
	}
	
	return nil
}

// Response DTOs

type TrackingResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type BehaviorContextResponse struct {
	UserID               string                    `json:"user_id"`
	RecentViews          []string                  `json:"recent_views"`
	RecentApplications   []string                  `json:"recent_applications"`
	SavedJobs           []string                  `json:"saved_jobs"`
	DismissedJobs       []string                  `json:"dismissed_jobs"`
	SearchPatterns      []SearchPatternResponse   `json:"search_patterns"`
	SkillInterests      map[string]float64        `json:"skill_interests"`
	PreferenceSignals   map[string]float64        `json:"preference_signals"`
	EngagementMetrics   EngagementMetricsResponse `json:"engagement_metrics"`
	JourneyStage        string                    `json:"journey_stage"`        // "explorer", "focused", "decisive"
	PersonalizationLevel string                   `json:"personalization_level"` // "high", "medium", "low"
	LastUpdated         string                    `json:"last_updated"`
}

type SearchPatternResponse struct {
	Query       string                 `json:"query"`
	Filters     map[string]interface{} `json:"filters"`
	Timestamp   string                 `json:"timestamp"`
	ResultCount int                    `json:"result_count"`
	ClickedJobs []string               `json:"clicked_jobs"`
}

type EngagementMetricsResponse struct {
	AverageTimePerJob     float64   `json:"average_time_per_job_seconds"`
	SessionFrequency      float64   `json:"session_frequency"`      // sessions per week
	ApplicationRate       float64   `json:"application_rate"`       // applications per job view
	SearchToViewRatio     float64   `json:"search_to_view_ratio"`   // views per search
	EngagementTrend       string    `json:"engagement_trend"`       // "increasing", "stable", "decreasing"
	LastActiveSession     string    `json:"last_active_session"`
	TotalSessions         int64     `json:"total_sessions"`
	WeeklyEngagement      []float64 `json:"weekly_engagement"`      // Last 12 weeks
	EngagementScore       float64   `json:"engagement_score"`       // Overall engagement score (0-1)
}

type BehaviorPatternResponse struct {
	UserID              string                `json:"user_id"`
	ActivityLevel       string                `json:"activity_level"`         // "low", "medium", "high"
	PreferredSkills     []string              `json:"preferred_skills"`
	PreferredIndustries []string              `json:"preferred_industries"`
	PreferredLocations  []string              `json:"preferred_locations"`
	WorkPreferences     WorkPreferencesResponse `json:"work_preferences"`
	AvgApplicationRate  float64               `json:"avg_application_rate"`
	AvgEngagementTime   float64               `json:"avg_engagement_time_seconds"`
	JourneyStage        string                `json:"journey_stage"`          // "explorer", "focused", "decisive"
	BehaviorVector      []float64             `json:"behavior_vector"`
	LastAnalyzed        string                `json:"last_analyzed"`
	Confidence          float64               `json:"confidence"`             // How confident we are in this pattern
}

type WorkPreferencesResponse struct {
	RemotePreference    float64            `json:"remote_preference"`    // -1 (office only) to 1 (remote only)
	SalaryImportance    float64            `json:"salary_importance"`    // 0 (not important) to 1 (very important)
	CompanySizePrefer   string             `json:"company_size_prefer"`  // "startup", "small", "medium", "large", "any"
	ContractTypePrefer  string             `json:"contract_type_prefer"` // "full_time", "part_time", "contract", "any"
	IndustryPreferences map[string]float64 `json:"industry_preferences"` // industry -> preference score
	LocationPreferences map[string]float64 `json:"location_preferences"` // location -> preference score
	SkillWeights        map[string]float64 `json:"skill_weights"`        // skill -> importance weight
}

type BehaviorTrendsResponse struct {
	UserID              string                        `json:"user_id"`
	TimeRangeDays       int                           `json:"time_range_days"`
	ActivityTrend       ActivityTrendResponse         `json:"activity_trend"`
	SkillInterestChanges []SkillTrendChangeResponse    `json:"skill_interest_changes"`
	PreferenceShifts    []PreferenceShiftResponse     `json:"preference_shifts"`
	EngagementEvolution []EngagementPointResponse     `json:"engagement_evolution"`
	JourneyProgression  string                        `json:"journey_progression"`
	RecommendationImpact RecommendationImpactResponse `json:"recommendation_impact"`
	Insights            []string                      `json:"insights"`           // Human-readable insights
	CalculatedAt        string                        `json:"calculated_at"`
}

type ActivityTrendResponse struct {
	ViewsPerWeek        []float64 `json:"views_per_week"`
	ApplicationsPerWeek []float64 `json:"applications_per_week"`
	SearchesPerWeek     []float64 `json:"searches_per_week"`
	TrendDirection      string    `json:"trend_direction"` // "up", "down", "stable"
	ChangePercentage    float64   `json:"change_percentage"`
	Seasonality         []float64 `json:"seasonality"` // Day-of-week patterns (0=Sunday, 6=Saturday)
}

type SkillTrendChangeResponse struct {
	SkillName       string  `json:"skill_name"`
	PreviousScore   float64 `json:"previous_score"`
	CurrentScore    float64 `json:"current_score"`
	ChangeDirection string  `json:"change_direction"` // "increasing", "decreasing", "stable"
	ChangeRate      float64 `json:"change_rate"`      // Rate of change per week
	Significance    float64 `json:"significance"`     // Statistical significance of change
	Impact          string  `json:"impact"`           // "high", "medium", "low"
}

type PreferenceShiftResponse struct {
	PreferenceName  string  `json:"preference_name"`
	PreviousValue   float64 `json:"previous_value"`
	CurrentValue    float64 `json:"current_value"`
	Confidence      float64 `json:"confidence"`
	DetectedAt      string  `json:"detected_at"`
	Impact          string  `json:"impact"` // "low", "medium", "high"
	Description     string  `json:"description"` // Human-readable description of the shift
}

type EngagementPointResponse struct {
	Date              string  `json:"date"`
	EngagementScore   float64 `json:"engagement_score"`
	SessionDuration   float64 `json:"session_duration_seconds"`
	ActionsPerSession int     `json:"actions_per_session"`
	QualityScore      float64 `json:"quality_score"` // Quality of engagement (depth vs breadth)
}

type RecommendationImpactResponse struct {
	ImprovedMatchRate     float64 `json:"improved_match_rate"`
	UserSatisfactionDelta float64 `json:"user_satisfaction_delta"`
	ModelAccuracyGain     float64 `json:"model_accuracy_gain"`
	PersonalizationLevel  string  `json:"personalization_level"` // "high", "medium", "low"
}

// Enhanced recommendation DTOs

type EnhancedRecommendationResponse struct {
	JobID                string                        `json:"job_id"`
	Title                string                        `json:"title"`
	Company              string                        `json:"company"`
	FinalScore           float64                       `json:"final_score"`
	BehavioralScore      float64                       `json:"behavioral_score"`
	ConfidenceLevel      float64                       `json:"confidence_level"`
	SuccessProbability   float64                       `json:"success_probability"`
	PersonalizationLevel string                        `json:"personalization_level"` // "high", "medium", "low"
	ReasoningContext     []string                      `json:"reasoning_context"`
	ConfidenceBoosters   []string                      `json:"confidence_boosters"`
	UserJourneyStage     string                        `json:"user_journey_stage"`    // "explorer", "focused", "decisive"
	PredictedEngagement  PredictedEngagementResponse   `json:"predicted_engagement"`
	ModelContributions   map[string]float64            `json:"model_contributions"`
	Features             map[string]interface{}        `json:"features"`
	ProcessingTime       float64                       `json:"processing_time_ms"`
	CreatedAt            string                        `json:"created_at"`
}

type PredictedEngagementResponse struct {
	ViewProbability        float64 `json:"view_probability"`
	ApplicationProbability float64 `json:"application_probability"`
	TimeToActionHours      float64 `json:"time_to_action_hours"`
	EngagementQuality      string  `json:"engagement_quality"` // "high", "medium", "low"
	EngagementScore        float64 `json:"engagement_score"`   // 0-1 predicted engagement score
}