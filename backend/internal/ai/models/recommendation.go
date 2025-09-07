package models

import (
	"time"
)

// AIRecommendation represents an AI-generated recommendation
type AIRecommendation struct {
	ID                string             `json:"id" bson:"_id"`
	UserID            string             `json:"user_id" bson:"user_id"`
	JobID             string             `json:"job_id" bson:"job_id"`
	ModelVersion      string             `json:"model_version" bson:"model_version"`
	ConfidenceScore   float64            `json:"confidence_score" bson:"confidence_score"`
	PredictionScore   float64            `json:"prediction_score" bson:"prediction_score"`
	SuccessProbability float64           `json:"success_probability" bson:"success_probability"`
	Features          map[string]float64 `json:"features" bson:"features"`
	CreatedAt         time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt         time.Time          `json:"updated_at" bson:"updated_at"`
}

// NCFEmbedding represents Neural Collaborative Filtering embeddings
type NCFEmbedding struct {
	ID        string    `json:"id" bson:"_id"`
	EntityID  string    `json:"entity_id" bson:"entity_id"`   // User ID or Job ID
	EntityType string   `json:"entity_type" bson:"entity_type"` // "user" or "job"
	Embedding []float64 `json:"embedding" bson:"embedding"`
	Version   string    `json:"version" bson:"version"`
	CreatedAt time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time `json:"updated_at" bson:"updated_at"`
}

// SkillGraphNode represents a node in the skill relationship graph
type SkillGraphNode struct {
	SkillID     string                 `json:"skill_id" bson:"skill_id"`
	SkillName   string                 `json:"skill_name" bson:"skill_name"`
	Category    string                 `json:"category" bson:"category"`
	Embedding   []float64              `json:"embedding" bson:"embedding"`
	Connections map[string]float64     `json:"connections" bson:"connections"` // SkillID -> relationship strength
	Features    map[string]interface{} `json:"features" bson:"features"`
	UpdatedAt   time.Time              `json:"updated_at" bson:"updated_at"`
}

// RLFeedback represents reinforcement learning feedback
type RLFeedback struct {
	ID            string                 `json:"id" bson:"_id"`
	UserID        string                 `json:"user_id" bson:"user_id"`
	JobID         string                 `json:"job_id" bson:"job_id"`
	MatchID       string                 `json:"match_id" bson:"match_id"`
	Action        string                 `json:"action" bson:"action"` // "applied", "viewed", "ignored", "hired"
	Reward        float64                `json:"reward" bson:"reward"`
	State         map[string]interface{} `json:"state" bson:"state"`
	NextState     map[string]interface{} `json:"next_state" bson:"next_state"`
	ModelVersion  string                 `json:"model_version" bson:"model_version"`
	CreatedAt     time.Time              `json:"created_at" bson:"created_at"`
}

// UserBehaviorPattern represents learned user behavior patterns
type UserBehaviorPattern struct {
	UserID              string                 `json:"user_id" bson:"user_id"`
	PreferredSkills     []string               `json:"preferred_skills" bson:"preferred_skills"`
	PreferredIndustries []string               `json:"preferred_industries" bson:"preferred_industries"`
	AvgApplicationRate  float64                `json:"avg_application_rate" bson:"avg_application_rate"`
	SuccessfulMatches   []string               `json:"successful_matches" bson:"successful_matches"`
	RejectedMatches     []string               `json:"rejected_matches" bson:"rejected_matches"`
	BehaviorVector      []float64              `json:"behavior_vector" bson:"behavior_vector"`
	LastAnalyzed        time.Time              `json:"last_analyzed" bson:"last_analyzed"`
}

// JobPopularityMetrics represents job popularity and success metrics
type JobPopularityMetrics struct {
	JobID           string    `json:"job_id" bson:"job_id"`
	ViewCount       int       `json:"view_count" bson:"view_count"`
	ApplicationCount int      `json:"application_count" bson:"application_count"`
	HireCount       int       `json:"hire_count" bson:"hire_count"`
	AvgMatchScore   float64   `json:"avg_match_score" bson:"avg_match_score"`
	ConversionRate  float64   `json:"conversion_rate" bson:"conversion_rate"`
	LastUpdated     time.Time `json:"last_updated" bson:"last_updated"`
}

// ModelPerformanceMetrics tracks AI model performance
type ModelPerformanceMetrics struct {
	ModelID       string                 `json:"model_id" bson:"model_id"`
	ModelType     string                 `json:"model_type" bson:"model_type"` // "ncf", "gnn", "rl"
	Version       string                 `json:"version" bson:"version"`
	Accuracy      float64                `json:"accuracy" bson:"accuracy"`
	Precision     float64                `json:"precision" bson:"precision"`
	Recall        float64                `json:"recall" bson:"recall"`
	F1Score       float64                `json:"f1_score" bson:"f1_score"`
	RMSE          float64                `json:"rmse" bson:"rmse"`
	TrainingTime  time.Duration          `json:"training_time" bson:"training_time"`
	InferenceTime time.Duration          `json:"inference_time" bson:"inference_time"`
	Metadata      map[string]interface{} `json:"metadata" bson:"metadata"`
	CreatedAt     time.Time              `json:"created_at" bson:"created_at"`
}

// InferenceRequest represents an AI inference request
type InferenceRequest struct {
	UserID      string                 `json:"user_id"`
	JobID       string                 `json:"job_id,omitempty"`
	ModelType   string                 `json:"model_type"` // "ncf", "gnn", "hybrid"
	Features    map[string]interface{} `json:"features"`
	Options     map[string]interface{} `json:"options"`
	RequestedAt time.Time              `json:"requested_at"`
}

// InferenceResult represents an AI inference result
type InferenceResult struct {
	RequestID         string                 `json:"request_id"`
	UserID            string                 `json:"user_id"`
	JobID             string                 `json:"job_id,omitempty"`
	Score             float64                `json:"score"`
	ConfidenceLevel   float64                `json:"confidence_level"`
	SuccessProbability float64               `json:"success_probability"`
	ModelUsed         string                 `json:"model_used"`
	Features          map[string]float64     `json:"features"`
	Explanations      []string               `json:"explanations"`
	ProcessingTime    time.Duration          `json:"processing_time"`
	CreatedAt         time.Time              `json:"created_at"`
}

// FeatureVector represents extracted features for ML models
type FeatureVector struct {
	UserFeatures map[string]float64 `json:"user_features"`
	JobFeatures  map[string]float64 `json:"job_features"`
	ContextFeatures map[string]float64 `json:"context_features"`
	Interactions map[string]float64 `json:"interactions"`
}

// TrainingData represents training data for ML models
type TrainingData struct {
	ID          string        `json:"id" bson:"_id"`
	UserID      string        `json:"user_id" bson:"user_id"`
	JobID       string        `json:"job_id" bson:"job_id"`
	Features    FeatureVector `json:"features" bson:"features"`
	Label       float64       `json:"label" bson:"label"` // Success outcome (0-1)
	Weight      float64       `json:"weight" bson:"weight"`
	DataSource  string        `json:"data_source" bson:"data_source"`
	CreatedAt   time.Time     `json:"created_at" bson:"created_at"`
}