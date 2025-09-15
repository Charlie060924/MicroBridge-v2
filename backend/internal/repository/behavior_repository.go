package repository

import (
	"context"
	"time"
)

// BehaviorRepository handles storage and retrieval of user behavior data
type BehaviorRepository interface {
	// Action tracking
	StoreUserAction(ctx context.Context, action UserAction) error
	GetUserActions(ctx context.Context, userID string, actionType string, limit int, since time.Time) ([]UserAction, error)
	GetUserActionHistory(ctx context.Context, userID string, days int) ([]UserAction, error)
	
	// Behavioral patterns
	StoreUserBehaviorPattern(ctx context.Context, pattern UserBehaviorPattern) error
	GetUserBehaviorPattern(ctx context.Context, userID string) (*UserBehaviorPattern, error)
	UpdateUserBehaviorPattern(ctx context.Context, pattern UserBehaviorPattern) error
	
	// Preference signals
	StorePreferenceSignal(ctx context.Context, signal PreferenceSignal) error
	GetPreferenceSignals(ctx context.Context, userID string) ([]PreferenceSignal, error)
	UpdatePreferenceSignal(ctx context.Context, userID, signalType string, value float64) error
	
	// Engagement metrics
	StoreEngagementMetrics(ctx context.Context, metrics EngagementMetrics) error
	GetEngagementMetrics(ctx context.Context, userID string) (*EngagementMetrics, error)
	UpdateEngagementMetrics(ctx context.Context, userID string, updates EngagementMetrics) error
	
	// Search patterns
	StoreSearchPattern(ctx context.Context, pattern SearchPattern) error
	GetSearchPatterns(ctx context.Context, userID string, limit int) ([]SearchPattern, error)
	
	// Skill interests
	UpdateSkillInterest(ctx context.Context, userID, skillName string, interest float64) error
	GetSkillInterests(ctx context.Context, userID string) (map[string]float64, error)
	
	// Behavioral analytics
	GetUserJourney(ctx context.Context, userID string, days int) ([]UserJourneyPoint, error)
	GetBehaviorTrends(ctx context.Context, userID string, days int) (*BehaviorTrends, error)
	GetCohortBehavior(ctx context.Context, cohortCriteria CohortCriteria) ([]CohortBehaviorData, error)
	
	// Cleanup and maintenance
	CleanupOldBehaviorData(ctx context.Context, olderThan time.Time) error
	ArchiveBehaviorData(ctx context.Context, userID string, archiveDate time.Time) error
}

// Domain models for behavior repository

type UserAction struct {
	ID        string                 `json:"id" bson:"_id"`
	UserID    string                 `json:"user_id" bson:"user_id"`
	ActionType string                `json:"action_type" bson:"action_type"` // "view", "apply", "save", "dismiss", "search", "skill_interest"
	EntityID  string                 `json:"entity_id" bson:"entity_id"`     // JobID, SkillID, etc.
	EntityType string                `json:"entity_type" bson:"entity_type"` // "job", "skill", "company"
	Data      map[string]interface{} `json:"data" bson:"data"`               // Additional action-specific data
	Timestamp time.Time              `json:"timestamp" bson:"timestamp"`
	SessionID string                 `json:"session_id" bson:"session_id"`
	DeviceInfo DeviceInfo            `json:"device_info" bson:"device_info"`
	Location  GeoLocation            `json:"location" bson:"location"`
}

type UserBehaviorPattern struct {
	UserID              string             `json:"user_id" bson:"user_id"`
	ActivityLevel       string             `json:"activity_level" bson:"activity_level"`         // "low", "medium", "high"
	PreferredSkills     []string           `json:"preferred_skills" bson:"preferred_skills"`
	PreferredIndustries []string           `json:"preferred_industries" bson:"preferred_industries"`
	PreferredLocations  []string           `json:"preferred_locations" bson:"preferred_locations"`
	WorkPreferences     WorkPreferences    `json:"work_preferences" bson:"work_preferences"`
	AvgApplicationRate  float64            `json:"avg_application_rate" bson:"avg_application_rate"`
	AvgEngagementTime   time.Duration      `json:"avg_engagement_time" bson:"avg_engagement_time"`
	SearchPatterns      []SearchPattern    `json:"search_patterns" bson:"search_patterns"`
	BehaviorVector      []float64          `json:"behavior_vector" bson:"behavior_vector"`
	SuccessfulMatches   []string           `json:"successful_matches" bson:"successful_matches"`
	RejectedMatches     []string           `json:"rejected_matches" bson:"rejected_matches"`
	JourneyStage        string             `json:"journey_stage" bson:"journey_stage"`           // "explorer", "focused", "decisive"
	LastAnalyzed        time.Time          `json:"last_analyzed" bson:"last_analyzed"`
	CreatedAt          time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at" bson:"updated_at"`
}

type PreferenceSignal struct {
	ID         string    `json:"id" bson:"_id"`
	UserID     string    `json:"user_id" bson:"user_id"`
	SignalType string    `json:"signal_type" bson:"signal_type"` // "remote_preference", "salary_importance", "company_size", etc.
	Value      float64   `json:"value" bson:"value"`             // Normalized value between -1 and 1
	Confidence float64   `json:"confidence" bson:"confidence"`   // How confident we are in this signal (0-1)
	Source     string    `json:"source" bson:"source"`           // "inferred", "explicit", "survey"
	LastUpdated time.Time `json:"last_updated" bson:"last_updated"`
	CreatedAt  time.Time `json:"created_at" bson:"created_at"`
}

type EngagementMetrics struct {
	UserID              string        `json:"user_id" bson:"user_id"`
	TotalViews          int64         `json:"total_views" bson:"total_views"`
	TotalApplications   int64         `json:"total_applications" bson:"total_applications"`
	TotalSearches       int64         `json:"total_searches" bson:"total_searches"`
	TotalSaves          int64         `json:"total_saves" bson:"total_saves"`
	AverageTimePerJob   time.Duration `json:"average_time_per_job" bson:"average_time_per_job"`
	SessionFrequency    float64       `json:"session_frequency" bson:"session_frequency"`     // sessions per week
	ApplicationRate     float64       `json:"application_rate" bson:"application_rate"`       // applications per job view
	SearchToViewRatio   float64       `json:"search_to_view_ratio" bson:"search_to_view_ratio"`
	EngagementTrend     string        `json:"engagement_trend" bson:"engagement_trend"`       // "increasing", "stable", "decreasing"
	LastActiveSession   time.Time     `json:"last_active_session" bson:"last_active_session"`
	TotalSessions       int64         `json:"total_sessions" bson:"total_sessions"`
	WeeklyEngagement    []float64     `json:"weekly_engagement" bson:"weekly_engagement"`     // Last 12 weeks
	LastCalculated      time.Time     `json:"last_calculated" bson:"last_calculated"`
}

type SearchPattern struct {
	ID          string                 `json:"id" bson:"_id"`
	UserID      string                 `json:"user_id" bson:"user_id"`
	Query       string                 `json:"query" bson:"query"`
	Filters     map[string]interface{} `json:"filters" bson:"filters"`
	ResultCount int                    `json:"result_count" bson:"result_count"`
	ClickedJobs []string               `json:"clicked_jobs" bson:"clicked_jobs"`
	SessionID   string                 `json:"session_id" bson:"session_id"`
	Timestamp   time.Time              `json:"timestamp" bson:"timestamp"`
}

type DeviceInfo struct {
	Platform    string `json:"platform" bson:"platform"`       // "web", "mobile", "desktop"
	DeviceType  string `json:"device_type" bson:"device_type"` // "phone", "tablet", "desktop"
	Browser     string `json:"browser" bson:"browser"`
	OS          string `json:"os" bson:"os"`
	UserAgent   string `json:"user_agent" bson:"user_agent"`
	ScreenSize  string `json:"screen_size" bson:"screen_size"`
}

type GeoLocation struct {
	Country     string  `json:"country" bson:"country"`
	Region      string  `json:"region" bson:"region"`
	City        string  `json:"city" bson:"city"`
	Latitude    float64 `json:"latitude" bson:"latitude"`
	Longitude   float64 `json:"longitude" bson:"longitude"`
	Timezone    string  `json:"timezone" bson:"timezone"`
	IPAddress   string  `json:"ip_address" bson:"ip_address"`
}

type WorkPreferences struct {
	RemotePreference    float64 `json:"remote_preference" bson:"remote_preference"`       // -1 (office only) to 1 (remote only)
	SalaryImportance    float64 `json:"salary_importance" bson:"salary_importance"`       // 0 (not important) to 1 (very important)
	CompanySizePrefer   string  `json:"company_size_prefer" bson:"company_size_prefer"`   // "startup", "small", "medium", "large", "any"
	ContractTypePrefer  string  `json:"contract_type_prefer" bson:"contract_type_prefer"` // "full_time", "part_time", "contract", "any"
	IndustryPreferences map[string]float64 `json:"industry_preferences" bson:"industry_preferences"` // industry -> preference score
	LocationPreferences map[string]float64 `json:"location_preferences" bson:"location_preferences"` // location -> preference score
	SkillWeights       map[string]float64 `json:"skill_weights" bson:"skill_weights"`               // skill -> importance weight
}

type UserJourneyPoint struct {
	Timestamp      time.Time              `json:"timestamp" bson:"timestamp"`
	Action         string                 `json:"action" bson:"action"`
	EntityID       string                 `json:"entity_id" bson:"entity_id"`
	EntityType     string                 `json:"entity_type" bson:"entity_type"`
	Context        map[string]interface{} `json:"context" bson:"context"`
	EngagementScore float64               `json:"engagement_score" bson:"engagement_score"`
	SessionID      string                 `json:"session_id" bson:"session_id"`
}

type BehaviorTrends struct {
	UserID              string              `json:"user_id" bson:"user_id"`
	TimeRangeDays       int                 `json:"time_range_days" bson:"time_range_days"`
	ActivityTrend       ActivityTrend       `json:"activity_trend" bson:"activity_trend"`
	SkillInterestChanges []SkillTrendChange  `json:"skill_interest_changes" bson:"skill_interest_changes"`
	PreferenceShifts    []PreferenceShift   `json:"preference_shifts" bson:"preference_shifts"`
	EngagementEvolution []EngagementPoint   `json:"engagement_evolution" bson:"engagement_evolution"`
	JourneyProgression  string              `json:"journey_progression" bson:"journey_progression"` // How user journey stage is evolving
	CalculatedAt        time.Time           `json:"calculated_at" bson:"calculated_at"`
}

type ActivityTrend struct {
	ViewsPerWeek        []float64 `json:"views_per_week" bson:"views_per_week"`
	ApplicationsPerWeek []float64 `json:"applications_per_week" bson:"applications_per_week"`
	SearchesPerWeek     []float64 `json:"searches_per_week" bson:"searches_per_week"`
	TrendDirection      string    `json:"trend_direction" bson:"trend_direction"` // "up", "down", "stable"
	ChangePercentage    float64   `json:"change_percentage" bson:"change_percentage"`
	Seasonality         []float64 `json:"seasonality" bson:"seasonality"` // Day-of-week patterns
}

type SkillTrendChange struct {
	SkillName       string  `json:"skill_name" bson:"skill_name"`
	PreviousScore   float64 `json:"previous_score" bson:"previous_score"`
	CurrentScore    float64 `json:"current_score" bson:"current_score"`
	ChangeDirection string  `json:"change_direction" bson:"change_direction"` // "increasing", "decreasing", "stable"
	ChangeRate      float64 `json:"change_rate" bson:"change_rate"`           // Rate of change per week
	Significance    float64 `json:"significance" bson:"significance"`         // Statistical significance of change
}

type PreferenceShift struct {
	PreferenceName  string  `json:"preference_name" bson:"preference_name"`
	PreviousValue   float64 `json:"previous_value" bson:"previous_value"`
	CurrentValue    float64 `json:"current_value" bson:"current_value"`
	Confidence      float64 `json:"confidence" bson:"confidence"`
	DetectedAt      time.Time `json:"detected_at" bson:"detected_at"`
	Impact          string  `json:"impact" bson:"impact"` // "low", "medium", "high" - how much this affects recommendations
}

type EngagementPoint struct {
	Date              time.Time     `json:"date" bson:"date"`
	EngagementScore   float64       `json:"engagement_score" bson:"engagement_score"`
	SessionDuration   time.Duration `json:"session_duration" bson:"session_duration"`
	ActionsPerSession int           `json:"actions_per_session" bson:"actions_per_session"`
	QualityScore      float64       `json:"quality_score" bson:"quality_score"` // Quality of engagement (depth vs breadth)
}

type CohortCriteria struct {
	UserSegment     string            `json:"user_segment" bson:"user_segment"`         // "new_users", "active_users", "job_seekers", etc.
	TimeRange       TimeRange         `json:"time_range" bson:"time_range"`
	Filters         map[string]interface{} `json:"filters" bson:"filters"`
	MinCohortSize   int               `json:"min_cohort_size" bson:"min_cohort_size"`
}

type TimeRange struct {
	Start time.Time `json:"start" bson:"start"`
	End   time.Time `json:"end" bson:"end"`
}

type CohortBehaviorData struct {
	CohortID        string                 `json:"cohort_id" bson:"cohort_id"`
	CohortSize      int                    `json:"cohort_size" bson:"cohort_size"`
	AvgMetrics      EngagementMetrics      `json:"avg_metrics" bson:"avg_metrics"`
	CommonPatterns  []string               `json:"common_patterns" bson:"common_patterns"`
	BehaviorProfile map[string]interface{} `json:"behavior_profile" bson:"behavior_profile"`
	SuccessRate     float64                `json:"success_rate" bson:"success_rate"` // Job placement success rate
	RetentionRate   float64                `json:"retention_rate" bson:"retention_rate"`
	CalculatedAt    time.Time              `json:"calculated_at" bson:"calculated_at"`
}