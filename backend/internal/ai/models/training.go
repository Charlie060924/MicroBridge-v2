package models

import (
	"time"
)

// TrainingConfig represents configuration for training ML models
type TrainingConfig struct {
	ModelType        string                 `json:"model_type" yaml:"model_type"`
	HyperParameters  map[string]interface{} `json:"hyperparameters" yaml:"hyperparameters"`
	DataSplitRatio   float64                `json:"data_split_ratio" yaml:"data_split_ratio"`
	ValidationSplit  float64                `json:"validation_split" yaml:"validation_split"`
	BatchSize        int                    `json:"batch_size" yaml:"batch_size"`
	MaxEpochs        int                    `json:"max_epochs" yaml:"max_epochs"`
	EarlyStopping    bool                   `json:"early_stopping" yaml:"early_stopping"`
	LearningRate     float64                `json:"learning_rate" yaml:"learning_rate"`
	RegularizationL2 float64                `json:"regularization_l2" yaml:"regularization_l2"`
	DropoutRate      float64                `json:"dropout_rate" yaml:"dropout_rate"`
}

// NCFConfig represents Neural Collaborative Filtering configuration
type NCFConfig struct {
	TrainingConfig   `yaml:",inline"`
	EmbeddingDim     int     `json:"embedding_dim" yaml:"embedding_dim"`
	HiddenLayers     []int   `json:"hidden_layers" yaml:"hidden_layers"`
	NumFactors       int     `json:"num_factors" yaml:"num_factors"`
	NumNegatives     int     `json:"num_negatives" yaml:"num_negatives"`
	UseAttention     bool    `json:"use_attention" yaml:"use_attention"`
	AttentionHeads   int     `json:"attention_heads" yaml:"attention_heads"`
}

// GNNConfig represents Graph Neural Network configuration
type GNNConfig struct {
	TrainingConfig    `yaml:",inline"`
	GraphType         string  `json:"graph_type" yaml:"graph_type"` // "skill_graph", "user_job_graph"
	NodeEmbeddingDim  int     `json:"node_embedding_dim" yaml:"node_embedding_dim"`
	HiddenDim         int     `json:"hidden_dim" yaml:"hidden_dim"`
	NumLayers         int     `json:"num_layers" yaml:"num_layers"`
	AggregationType   string  `json:"aggregation_type" yaml:"aggregation_type"` // "mean", "max", "attention"
	ActivationFunc    string  `json:"activation_func" yaml:"activation_func"`
	UseResidual       bool    `json:"use_residual" yaml:"use_residual"`
	GraphSamplingRate float64 `json:"graph_sampling_rate" yaml:"graph_sampling_rate"`
}

// RLConfig represents Reinforcement Learning configuration
type RLConfig struct {
	TrainingConfig    `yaml:",inline"`
	Algorithm         string  `json:"algorithm" yaml:"algorithm"` // "dqn", "a3c", "ppo"
	StateSpaceDim     int     `json:"state_space_dim" yaml:"state_space_dim"`
	ActionSpaceDim    int     `json:"action_space_dim" yaml:"action_space_dim"`
	RewardFunction    string  `json:"reward_function" yaml:"reward_function"`
	DiscountFactor    float64 `json:"discount_factor" yaml:"discount_factor"`
	ExplorationRate   float64 `json:"exploration_rate" yaml:"exploration_rate"`
	ExplorationDecay  float64 `json:"exploration_decay" yaml:"exploration_decay"`
	MemorySize        int     `json:"memory_size" yaml:"memory_size"`
	TargetUpdateFreq  int     `json:"target_update_freq" yaml:"target_update_freq"`
}

// TrainingJob represents a training job instance
type TrainingJob struct {
	ID               string                 `json:"id" bson:"_id"`
	ModelType        string                 `json:"model_type" bson:"model_type"`
	Version          string                 `json:"version" bson:"version"`
	Config           map[string]interface{} `json:"config" bson:"config"`
	Status           string                 `json:"status" bson:"status"` // "pending", "running", "completed", "failed"
	Progress         float64                `json:"progress" bson:"progress"`
	DatasetSize      int                    `json:"dataset_size" bson:"dataset_size"`
	TrainingMetrics  TrainingMetrics        `json:"training_metrics" bson:"training_metrics"`
	ValidationMetrics ValidationMetrics     `json:"validation_metrics" bson:"validation_metrics"`
	ErrorMessage     string                 `json:"error_message,omitempty" bson:"error_message,omitempty"`
	StartedAt        time.Time              `json:"started_at" bson:"started_at"`
	CompletedAt      *time.Time             `json:"completed_at,omitempty" bson:"completed_at,omitempty"`
	CreatedBy        string                 `json:"created_by" bson:"created_by"`
}

// TrainingMetrics represents metrics during training
type TrainingMetrics struct {
	Loss           []float64 `json:"loss" bson:"loss"`
	Accuracy       []float64 `json:"accuracy" bson:"accuracy"`
	Precision      []float64 `json:"precision" bson:"precision"`
	Recall         []float64 `json:"recall" bson:"recall"`
	F1Score        []float64 `json:"f1_score" bson:"f1_score"`
	RMSE           []float64 `json:"rmse" bson:"rmse"`
	LearningRate   []float64 `json:"learning_rate" bson:"learning_rate"`
	CurrentEpoch   int       `json:"current_epoch" bson:"current_epoch"`
	BestEpoch      int       `json:"best_epoch" bson:"best_epoch"`
	EarlyStopCount int       `json:"early_stop_count" bson:"early_stop_count"`
}

// ValidationMetrics represents validation metrics
type ValidationMetrics struct {
	Loss           float64 `json:"loss" bson:"loss"`
	Accuracy       float64 `json:"accuracy" bson:"accuracy"`
	Precision      float64 `json:"precision" bson:"precision"`
	Recall         float64 `json:"recall" bson:"recall"`
	F1Score        float64 `json:"f1_score" bson:"f1_score"`
	RMSE           float64 `json:"rmse" bson:"rmse"`
	AUC            float64 `json:"auc" bson:"auc"`
	ConfusionMatrix [][]int `json:"confusion_matrix" bson:"confusion_matrix"`
}

// ModelArtifact represents stored model artifacts
type ModelArtifact struct {
	ID           string                 `json:"id" bson:"_id"`
	ModelType    string                 `json:"model_type" bson:"model_type"`
	Version      string                 `json:"version" bson:"version"`
	TrainingJobID string                `json:"training_job_id" bson:"training_job_id"`
	ModelPath    string                 `json:"model_path" bson:"model_path"`
	ConfigPath   string                 `json:"config_path" bson:"config_path"`
	MetricsPath  string                 `json:"metrics_path" bson:"metrics_path"`
	FileSize     int64                  `json:"file_size" bson:"file_size"`
	Checksum     string                 `json:"checksum" bson:"checksum"`
	Metadata     map[string]interface{} `json:"metadata" bson:"metadata"`
	IsActive     bool                   `json:"is_active" bson:"is_active"`
	CreatedAt    time.Time              `json:"created_at" bson:"created_at"`
}

// DatasetSample represents a single training sample
type DatasetSample struct {
	UserID        string                 `json:"user_id"`
	JobID         string                 `json:"job_id"`
	UserFeatures  map[string]float64     `json:"user_features"`
	JobFeatures   map[string]float64     `json:"job_features"`
	Interaction   map[string]interface{} `json:"interaction"`
	Label         float64                `json:"label"` // Success probability or binary outcome
	Weight        float64                `json:"weight"`
	SampleSource  string                 `json:"sample_source"`
	Timestamp     time.Time              `json:"timestamp"`
}

// FeatureEngineering represents feature engineering configuration
type FeatureEngineering struct {
	UserFeatures    []FeatureConfig `json:"user_features" yaml:"user_features"`
	JobFeatures     []FeatureConfig `json:"job_features" yaml:"job_features"`
	InteractionFeatures []FeatureConfig `json:"interaction_features" yaml:"interaction_features"`
	NormalizationMethod string        `json:"normalization_method" yaml:"normalization_method"`
	OutlierHandling     string        `json:"outlier_handling" yaml:"outlier_handling"`
	MissingValueStrategy string       `json:"missing_value_strategy" yaml:"missing_value_strategy"`
}

// FeatureConfig represents configuration for individual features
type FeatureConfig struct {
	Name         string                 `json:"name" yaml:"name"`
	Type         string                 `json:"type" yaml:"type"` // "numerical", "categorical", "text", "embedding"
	Source       string                 `json:"source" yaml:"source"`
	Transformation string               `json:"transformation" yaml:"transformation"`
	Weight       float64                `json:"weight" yaml:"weight"`
	Required     bool                   `json:"required" yaml:"required"`
	DefaultValue interface{}            `json:"default_value" yaml:"default_value"`
	Metadata     map[string]interface{} `json:"metadata" yaml:"metadata"`
}

// ABTestConfig represents A/B testing configuration for models
type ABTestConfig struct {
	TestID          string                 `json:"test_id"`
	TestName        string                 `json:"test_name"`
	Description     string                 `json:"description"`
	ControlModel    string                 `json:"control_model"`
	TreatmentModel  string                 `json:"treatment_model"`
	TrafficSplit    float64                `json:"traffic_split"`
	SuccessMetrics  []string               `json:"success_metrics"`
	MinSampleSize   int                    `json:"min_sample_size"`
	MaxDuration     time.Duration          `json:"max_duration"`
	Status          string                 `json:"status"` // "draft", "running", "completed", "stopped"
	Metadata        map[string]interface{} `json:"metadata"`
	StartedAt       *time.Time             `json:"started_at,omitempty"`
	CompletedAt     *time.Time             `json:"completed_at,omitempty"`
	CreatedAt       time.Time              `json:"created_at"`
}

// ABTestResult represents A/B test results
type ABTestResult struct {
	TestID            string                 `json:"test_id"`
	ControlMetrics    map[string]float64     `json:"control_metrics"`
	TreatmentMetrics  map[string]float64     `json:"treatment_metrics"`
	StatSignificance  map[string]float64     `json:"statistical_significance"`
	ConfidenceLevel   float64                `json:"confidence_level"`
	Recommendation    string                 `json:"recommendation"`
	SampleSizes       map[string]int         `json:"sample_sizes"`
	EffectSizes       map[string]float64     `json:"effect_sizes"`
	Metadata          map[string]interface{} `json:"metadata"`
	AnalyzedAt        time.Time              `json:"analyzed_at"`
}