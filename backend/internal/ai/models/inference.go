package models

import (
	"sync"
	"time"
)

// InferenceEngine represents the core inference engine interface
type InferenceEngine interface {
	LoadModel(modelPath, version string) error
	Predict(request *InferenceRequest) (*InferenceResult, error)
	GetModelInfo() *ModelInfo
	IsHealthy() bool
	Shutdown() error
}

// ModelInfo represents information about a loaded model
type ModelInfo struct {
	ModelID       string                 `json:"model_id"`
	ModelType     string                 `json:"model_type"` // "ncf", "gnn", "rl", "hybrid"
	Version       string                 `json:"version"`
	LoadedAt      time.Time              `json:"loaded_at"`
	InputShape    []int                  `json:"input_shape"`
	OutputShape   []int                  `json:"output_shape"`
	Parameters    int                    `json:"parameters"`
	ModelSize     int64                  `json:"model_size_bytes"`
	Capabilities  []string               `json:"capabilities"`
	Metadata      map[string]interface{} `json:"metadata"`
}

// NCFInferenceEngine implements inference for Neural Collaborative Filtering
type NCFInferenceEngine struct {
	mu                sync.RWMutex
	modelInfo         *ModelInfo
	userEmbeddings    map[string][]float64
	jobEmbeddings     map[string][]float64
	mlpWeights        [][]float64
	loaded            bool
	warmupCompleted   bool
}

// GNNInferenceEngine implements inference for Graph Neural Networks
type GNNInferenceEngine struct {
	mu              sync.RWMutex
	modelInfo       *ModelInfo
	skillGraph      *SkillGraph
	nodeEmbeddings  map[string][]float64
	edgeWeights     map[string]map[string]float64
	aggregationFunc func([]float64) []float64
	loaded          bool
	warmupCompleted bool
}

// RLInferenceEngine implements inference for Reinforcement Learning
type RLInferenceEngine struct {
	mu              sync.RWMutex
	modelInfo       *ModelInfo
	qNetwork        *QNetwork
	stateEncoder    *StateEncoder
	actionDecoder   *ActionDecoder
	loaded          bool
	warmupCompleted bool
}

// HybridInferenceEngine combines multiple engines
type HybridInferenceEngine struct {
	mu              sync.RWMutex
	ncfEngine       *NCFInferenceEngine
	gnnEngine       *GNNInferenceEngine
	rlEngine        *RLInferenceEngine
	ensembleWeights map[string]float64
	fallbackEngine  InferenceEngine
	loaded          bool
}

// SkillGraph represents the skill relationship graph
type SkillGraph struct {
	Nodes map[string]*SkillGraphNode `json:"nodes"`
	Edges map[string][]GraphEdge     `json:"edges"`
}

// GraphEdge represents an edge in the skill graph
type GraphEdge struct {
	SourceID   string  `json:"source_id"`
	TargetID   string  `json:"target_id"`
	Weight     float64 `json:"weight"`
	EdgeType   string  `json:"edge_type"` // "requires", "similar", "complements"
}

// QNetwork represents a Q-learning network
type QNetwork struct {
	InputDim    int           `json:"input_dim"`
	OutputDim   int           `json:"output_dim"`
	HiddenDims  []int         `json:"hidden_dims"`
	Weights     [][][]float64 `json:"weights"`
	Biases      [][]float64   `json:"biases"`
	Activations []string      `json:"activations"`
}

// StateEncoder encodes user/job state for RL
type StateEncoder struct {
	FeatureMap    map[string]int    `json:"feature_map"`
	Normalizers   map[string]Normalizer `json:"normalizers"`
	EmbeddingDims map[string]int    `json:"embedding_dims"`
}

// ActionDecoder decodes RL actions to recommendations
type ActionDecoder struct {
	ActionSpace   []string          `json:"action_space"`
	ActionWeights map[string]float64 `json:"action_weights"`
	ThresholdMap  map[string]float64 `json:"threshold_map"`
}

// Normalizer represents feature normalization parameters
type Normalizer struct {
	Type   string  `json:"type"` // "minmax", "zscore", "robust"
	Min    float64 `json:"min,omitempty"`
	Max    float64 `json:"max,omitempty"`
	Mean   float64 `json:"mean,omitempty"`
	Std    float64 `json:"std,omitempty"`
	Median float64 `json:"median,omitempty"`
	IQR    float64 `json:"iqr,omitempty"`
}

// InferenceContext provides context for inference operations
type InferenceContext struct {
	RequestID       string                 `json:"request_id"`
	UserID          string                 `json:"user_id"`
	SessionID       string                 `json:"session_id,omitempty"`
	RequestTime     time.Time              `json:"request_time"`
	ModelPreference []string               `json:"model_preference,omitempty"`
	Features        map[string]interface{} `json:"features"`
	Options         InferenceOptions       `json:"options"`
}

// InferenceOptions represents options for inference
type InferenceOptions struct {
	UseCache         bool                   `json:"use_cache"`
	CacheTTL         time.Duration          `json:"cache_ttl"`
	RequireExplanation bool                 `json:"require_explanation"`
	MaxCandidates    int                    `json:"max_candidates"`
	MinConfidence    float64                `json:"min_confidence"`
	Timeout          time.Duration          `json:"timeout"`
	Metadata         map[string]interface{} `json:"metadata"`
}

// ModelEnsemble represents an ensemble of models
type ModelEnsemble struct {
	Models          []InferenceEngine      `json:"-"`
	Weights         []float64              `json:"weights"`
	AggregationFunc string                 `json:"aggregation_func"` // "weighted_avg", "max", "voting"
	FallbackModel   InferenceEngine        `json:"-"`
	HealthCheck     func() bool            `json:"-"`
}

// InferenceCache represents caching for inference results
type InferenceCache struct {
	mu        sync.RWMutex
	cache     map[string]*CachedInference
	ttlMap    map[string]time.Time
	maxSize   int
	hitCount  int64
	missCount int64
}

// CachedInference represents cached inference result
type CachedInference struct {
	Result    *InferenceResult `json:"result"`
	CreatedAt time.Time        `json:"created_at"`
	TTL       time.Duration    `json:"ttl"`
	Metadata  map[string]interface{} `json:"metadata"`
}

// InferenceMetrics tracks inference performance
type InferenceMetrics struct {
	ModelType         string        `json:"model_type"`
	TotalRequests     int64         `json:"total_requests"`
	SuccessfulRequests int64        `json:"successful_requests"`
	FailedRequests    int64         `json:"failed_requests"`
	AverageLatency    time.Duration `json:"average_latency"`
	P95Latency        time.Duration `json:"p95_latency"`
	P99Latency        time.Duration `json:"p99_latency"`
	CacheHitRate      float64       `json:"cache_hit_rate"`
	ErrorRate         float64       `json:"error_rate"`
	ThroughputQPS     float64       `json:"throughput_qps"`
	LastUpdated       time.Time     `json:"last_updated"`
}

// BatchInferenceRequest represents a batch inference request
type BatchInferenceRequest struct {
	BatchID   string               `json:"batch_id"`
	Requests  []*InferenceRequest  `json:"requests"`
	Options   BatchInferenceOptions `json:"options"`
	CreatedAt time.Time            `json:"created_at"`
}

// BatchInferenceOptions represents options for batch inference
type BatchInferenceOptions struct {
	MaxBatchSize      int           `json:"max_batch_size"`
	Timeout           time.Duration `json:"timeout"`
	ParallelWorkers   int           `json:"parallel_workers"`
	RetryFailedItems  bool          `json:"retry_failed_items"`
	MaxRetries        int           `json:"max_retries"`
	ProgressCallback  func(float64) `json:"-"`
}

// BatchInferenceResult represents batch inference results
type BatchInferenceResult struct {
	BatchID      string                        `json:"batch_id"`
	Results      map[string]*InferenceResult   `json:"results"`
	Errors       map[string]string             `json:"errors"`
	ProcessedCount int                         `json:"processed_count"`
	SuccessCount   int                         `json:"success_count"`
	ErrorCount     int                         `json:"error_count"`
	ProcessingTime time.Duration               `json:"processing_time"`
	CompletedAt    time.Time                   `json:"completed_at"`
}

// ModelLoadBalancer distributes inference requests across model instances
type ModelLoadBalancer struct {
	mu        sync.RWMutex
	instances []InferenceEngine
	strategy  string // "round_robin", "least_connections", "weighted"
	weights   []float64
	current   int
}

// HealthCheckResult represents model health check result
type HealthCheckResult struct {
	ModelID     string                 `json:"model_id"`
	IsHealthy   bool                   `json:"is_healthy"`
	Latency     time.Duration          `json:"latency"`
	ErrorMsg    string                 `json:"error_msg,omitempty"`
	MemoryUsage int64                  `json:"memory_usage"`
	CPUUsage    float64                `json:"cpu_usage"`
	Metadata    map[string]interface{} `json:"metadata"`
	CheckedAt   time.Time              `json:"checked_at"`
}

// ModelRegistry manages model versions and deployments
type ModelRegistry struct {
	mu                sync.RWMutex
	activeModels      map[string]InferenceEngine
	modelVersions     map[string][]string
	deploymentConfigs map[string]*DeploymentConfig
	healthStatus      map[string]*HealthCheckResult
}

// DeploymentConfig represents model deployment configuration
type DeploymentConfig struct {
	ModelID         string                 `json:"model_id"`
	Version         string                 `json:"version"`
	InstanceCount   int                    `json:"instance_count"`
	Resources       ResourceRequirements   `json:"resources"`
	HealthCheck     HealthCheckConfig      `json:"health_check"`
	AutoScaling     AutoScalingConfig      `json:"auto_scaling"`
	Metadata        map[string]interface{} `json:"metadata"`
	CreatedAt       time.Time              `json:"created_at"`
}

// ResourceRequirements represents resource requirements for model deployment
type ResourceRequirements struct {
	CPU    string `json:"cpu"`    // e.g., "2000m"
	Memory string `json:"memory"` // e.g., "4Gi"
	GPU    string `json:"gpu,omitempty"` // e.g., "1"
}

// HealthCheckConfig represents health check configuration
type HealthCheckConfig struct {
	Enabled         bool          `json:"enabled"`
	Interval        time.Duration `json:"interval"`
	Timeout         time.Duration `json:"timeout"`
	FailureThreshold int          `json:"failure_threshold"`
	SuccessThreshold int          `json:"success_threshold"`
}

// AutoScalingConfig represents auto-scaling configuration
type AutoScalingConfig struct {
	Enabled     bool    `json:"enabled"`
	MinReplicas int     `json:"min_replicas"`
	MaxReplicas int     `json:"max_replicas"`
	TargetCPU   float64 `json:"target_cpu"`
	TargetQPS   float64 `json:"target_qps"`
}