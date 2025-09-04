package interfaces

import (
	"context"
	"time"
	"microbridge/backend/internal/models"
)

// AIService defines the main AI service interface following existing patterns
type AIService interface {
	// Health and lifecycle management
	HealthCheck(ctx context.Context) error
	Initialize(ctx context.Context) error
	Shutdown(ctx context.Context) error

	// Enhanced matching functionality
	EnhancedMatching(ctx context.Context, userID string, limit int) ([]EnhancedMatchResult, error)
	GetMatchExplanation(ctx context.Context, userID, jobID string) (*MatchExplanation, error)
	GetPersonalizedRecommendations(ctx context.Context, userID string, limit int) ([]PersonalizedRecommendation, error)

	// Behavioral learning
	TrackUserBehavior(ctx context.Context, userID string, action UserAction, metadata map[string]interface{}) error
	UpdateUserPreferences(ctx context.Context, userID string) error
	
	// Model management
	UpdateModel(ctx context.Context, modelName string) error
	GetModelInfo(ctx context.Context) (*ModelInfo, error)
}

// MLModelService handles machine learning model operations
type MLModelService interface {
	LoadModel(ctx context.Context, modelName string) error
	PredictMatchScore(ctx context.Context, userID, jobID string) (*PredictionResult, error)
	TrainModel(ctx context.Context, trainingData []TrainingDataPoint) error
	ValidateModel(ctx context.Context) (*ModelValidation, error)
}

// CacheService handles AI prediction caching
type CacheService interface {
	GetPrediction(ctx context.Context, inputHash string) (*CachedPrediction, error)
	StorePrediction(ctx context.Context, inputHash string, prediction *PredictionResult, ttl time.Duration) error
	InvalidateUserPredictions(ctx context.Context, userID string) error
	GetCacheStats(ctx context.Context) (*CacheStats, error)
}

// BehaviorTracker handles user behavior analysis
type BehaviorTracker interface {
	RecordAction(ctx context.Context, userID string, action UserAction, metadata map[string]interface{}) error
	GetUserProfile(ctx context.Context, userID string) (*BehaviorProfile, error)
	AnalyzePreferences(ctx context.Context, userID string) (*PreferenceAnalysis, error)
	GetSimilarUsers(ctx context.Context, userID string, limit int) ([]string, error)
}

// Data structures for AI operations

type EnhancedMatchResult struct {
	JobID                string                 `json:"job_id"`
	UserToJobScore       float64                `json:"user_to_job_score"`
	JobToUserScore       float64                `json:"job_to_user_score"`
	HarmonicMeanScore    float64                `json:"harmonic_mean_score"`
	AIConfidenceScore    float64                `json:"ai_confidence_score"`
	SkillMatchDetails    map[string]float64     `json:"skill_match_details"`
	BehaviorScore        float64                `json:"behavior_score"`
	CalculatedAt         time.Time              `json:"calculated_at"`
	ExplanationAvailable bool                   `json:"explanation_available"`
}

type MatchExplanation struct {
	JobID             string             `json:"job_id"`
	OverallScore      float64            `json:"overall_score"`
	SkillFactors      []SkillFactor      `json:"skill_factors"`
	ExperienceFactor  ExperienceFactor   `json:"experience_factor"`
	LocationFactor    LocationFactor     `json:"location_factor"`
	BehaviorFactor    BehaviorFactor     `json:"behavior_factor"`
	Recommendations   []string           `json:"recommendations"`
	GeneratedAt       time.Time          `json:"generated_at"`
}

type PersonalizedRecommendation struct {
	JobID           string    `json:"job_id"`
	Job             *models.Job `json:"job"`
	RecommendScore  float64   `json:"recommend_score"`
	ReasonCode      string    `json:"reason_code"`
	ReasonText      string    `json:"reason_text"`
	Priority        string    `json:"priority"` // high, medium, low
	CreatedAt       time.Time `json:"created_at"`
}

type UserAction struct {
	Type        string    `json:"type"`        // "view_job", "apply", "save", "click", "search"
	JobID       *string   `json:"job_id,omitempty"`
	Duration    *int64    `json:"duration,omitempty"` // milliseconds
	SearchQuery *string   `json:"search_query,omitempty"`
	Timestamp   time.Time `json:"timestamp"`
}

type PredictionResult struct {
	Score       float64            `json:"score"`
	Confidence  float64            `json:"confidence"`
	Features    map[string]float64 `json:"features"`
	ModelUsed   string             `json:"model_used"`
	ComputedAt  time.Time          `json:"computed_at"`
}

type ModelInfo struct {
	Name            string    `json:"name"`
	Version         string    `json:"version"`
	Accuracy        float64   `json:"accuracy"`
	LastTrainedAt   time.Time `json:"last_trained_at"`
	TrainingDataSize int      `json:"training_data_size"`
	Status          string    `json:"status"` // "active", "training", "error"
}

type ModelValidation struct {
	Accuracy    float64   `json:"accuracy"`
	Precision   float64   `json:"precision"`
	Recall      float64   `json:"recall"`
	F1Score     float64   `json:"f1_score"`
	ValidatedAt time.Time `json:"validated_at"`
	TestSize    int       `json:"test_size"`
}

type CachedPrediction struct {
	InputHash   string           `json:"input_hash"`
	Prediction  *PredictionResult `json:"prediction"`
	CachedAt    time.Time        `json:"cached_at"`
	ExpiresAt   time.Time        `json:"expires_at"`
}

type CacheStats struct {
	HitRate      float64 `json:"hit_rate"`
	TotalHits    int64   `json:"total_hits"`
	TotalMisses  int64   `json:"total_misses"`
	CacheSize    int64   `json:"cache_size"`
	MemoryUsage  int64   `json:"memory_usage"`
}

type BehaviorProfile struct {
	UserID            string                 `json:"user_id"`
	PreferredJobTypes []string               `json:"preferred_job_types"`
	PreferredSkills   []string               `json:"preferred_skills"`
	EngagementScore   float64                `json:"engagement_score"`
	ActivityLevel     string                 `json:"activity_level"` // "low", "medium", "high"
	LastUpdated       time.Time              `json:"last_updated"`
	Preferences       map[string]interface{} `json:"preferences"`
}

type PreferenceAnalysis struct {
	UserID          string              `json:"user_id"`
	TopSkills       []SkillPreference   `json:"top_skills"`
	JobTypePrefs    []JobTypePreference `json:"job_type_prefs"`
	LocationPrefs   []LocationPreference `json:"location_prefs"`
	SalaryRange     SalaryRange         `json:"salary_range"`
	WorkMode        WorkModePreference  `json:"work_mode"`
	AnalyzedAt      time.Time           `json:"analyzed_at"`
}

type TrainingDataPoint struct {
	UserID      string                 `json:"user_id"`
	JobID       string                 `json:"job_id"`
	Outcome     string                 `json:"outcome"` // "applied", "viewed", "ignored", "saved"
	Features    map[string]float64     `json:"features"`
	Timestamp   time.Time              `json:"timestamp"`
	Metadata    map[string]interface{} `json:"metadata"`
}

// Supporting data structures

type SkillFactor struct {
	Skill      string  `json:"skill"`
	UserLevel  float64 `json:"user_level"`
	JobRequirement float64 `json:"job_requirement"`
	Match      float64 `json:"match"`
	Impact     float64 `json:"impact"`
}

type ExperienceFactor struct {
	UserLevel    string  `json:"user_level"`
	RequiredLevel string  `json:"required_level"`
	Match        float64 `json:"match"`
	Impact       float64 `json:"impact"`
}

type LocationFactor struct {
	UserLocation string  `json:"user_location"`
	JobLocation  string  `json:"job_location"`
	IsRemote     bool    `json:"is_remote"`
	Match        float64 `json:"match"`
	Impact       float64 `json:"impact"`
}

type BehaviorFactor struct {
	SimilarityScore float64 `json:"similarity_score"`
	EngagementScore float64 `json:"engagement_score"`
	PreferenceMatch float64 `json:"preference_match"`
	Impact          float64 `json:"impact"`
}

type SkillPreference struct {
	Skill      string  `json:"skill"`
	Interest   float64 `json:"interest"`
	Frequency  int     `json:"frequency"`
}

type JobTypePreference struct {
	JobType    string  `json:"job_type"`
	Interest   float64 `json:"interest"`
	Frequency  int     `json:"frequency"`
}

type LocationPreference struct {
	Location   string  `json:"location"`
	Interest   float64 `json:"interest"`
	IsRemote   bool    `json:"is_remote"`
}

type SalaryRange struct {
	Min        float64 `json:"min"`
	Max        float64 `json:"max"`
	Preferred  float64 `json:"preferred"`
}

type WorkModePreference struct {
	Remote     float64 `json:"remote"`
	Hybrid     float64 `json:"hybrid"`
	OnSite     float64 `json:"on_site"`
}