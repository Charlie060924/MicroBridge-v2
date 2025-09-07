package services

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"sync"
	"time"

	"microbridge/backend/internal/ai/models"
	"microbridge/backend/internal/ai/utils"
)

// RLService implements Reinforcement Learning for continuous matching improvement
type RLService struct {
	mu                     sync.RWMutex
	qNetwork               *QNetwork
	targetNetwork          *QNetwork
	experienceReplay       *ExperienceReplay
	stateEncoder           *StateEncoder
	actionDecoder          *ActionDecoder
	epsilon                float64 // Exploration rate
	epsilonDecay           float64
	epsilonMin             float64
	learningRate           float64
	discountFactor         float64
	targetUpdateFrequency  int
	trainingSteps          int
	modelVersion           string
	isTraining             bool
	lastTrainingTime       time.Time
	performanceMetrics     *RLPerformanceMetrics
}

// QNetwork represents a Deep Q-Network
type QNetwork struct {
	layers    []Layer
	inputDim  int
	outputDim int
}

// Layer represents a neural network layer
type Layer struct {
	weights     [][]float64
	biases      []float64
	activation  string
	inputSize   int
	outputSize  int
}

// ExperienceReplay stores and samples training experiences
type ExperienceReplay struct {
	mu          sync.RWMutex
	experiences []*Experience
	maxSize     int
	currentSize int
	position    int
}

// Experience represents a reinforcement learning experience tuple
type Experience struct {
	State      []float64 `json:"state"`
	Action     int       `json:"action"`
	Reward     float64   `json:"reward"`
	NextState  []float64 `json:"next_state"`
	Done       bool      `json:"done"`
	Timestamp  time.Time `json:"timestamp"`
}

// StateEncoder encodes user/job interactions into state vectors
type StateEncoder struct {
	featureExtractor *FeatureExtractor
	normalizers      map[string]*Normalizer
	stateSize        int
}

// ActionDecoder maps Q-network outputs to recommendation actions
type ActionDecoder struct {
	actionSpace     []ActionType
	actionToIndex   map[ActionType]int
	indexToAction   map[int]ActionType
}

// ActionType represents different recommendation actions
type ActionType string

const (
	ActionRecommendHigh   ActionType = "recommend_high"    // Strong recommendation
	ActionRecommendMedium ActionType = "recommend_medium"  // Medium recommendation  
	ActionRecommendLow    ActionType = "recommend_low"     // Weak recommendation
	ActionNoRecommend     ActionType = "no_recommend"      // Don't recommend
	ActionRequestFeedback ActionType = "request_feedback"  // Ask for user feedback
)

// FeatureExtractor extracts state features from user/job data
type FeatureExtractor struct {
	userFeatureSize    int
	jobFeatureSize     int
	contextFeatureSize int
}

// RLPerformanceMetrics tracks RL model performance
type RLPerformanceMetrics struct {
	AverageReward        float64   `json:"average_reward"`
	CumulativeReward     float64   `json:"cumulative_reward"`
	EpisodeCount         int       `json:"episode_count"`
	ExplorationRate      float64   `json:"exploration_rate"`
	LearningProgress     []float64 `json:"learning_progress"`
	SuccessfulActions    int       `json:"successful_actions"`
	TotalActions         int       `json:"total_actions"`
	LastTrainingTime     time.Time `json:"last_training_time"`
}

// Normalizer normalizes feature values
type Normalizer struct {
	Mean     float64 `json:"mean"`
	Std      float64 `json:"std"`
	Min      float64 `json:"min"`
	Max      float64 `json:"max"`
	Method   string  `json:"method"` // "zscore" or "minmax"
}

// NewRLService creates a new Reinforcement Learning service
func NewRLService(config *models.RLConfig) *RLService {
	service := &RLService{
		epsilon:               config.ExplorationRate,
		epsilonDecay:          config.ExplorationDecay,
		epsilonMin:            0.01,
		learningRate:          config.LearningRate,
		discountFactor:        config.DiscountFactor,
		targetUpdateFrequency: config.TargetUpdateFreq,
		modelVersion:          fmt.Sprintf("rl_v%d", time.Now().Unix()),
		performanceMetrics:    &RLPerformanceMetrics{},
	}

	// Initialize components
	service.initializeQNetwork(config.StateSpaceDim, config.ActionSpaceDim)
	service.initializeExperienceReplay(config.MemorySize)
	service.initializeStateEncoder()
	service.initializeActionDecoder()

	return service
}

// ProcessUserFeedback processes user feedback and updates the model
func (s *RLService) ProcessUserFeedback(ctx context.Context, userID, jobID, matchID, action string, outcome float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Extract state from current context
	state, err := s.extractState(ctx, userID, jobID)
	if err != nil {
		return fmt.Errorf("failed to extract state: %w", err)
	}

	// Convert action string to action index
	actionIndex, err := s.encodeAction(action)
	if err != nil {
		return fmt.Errorf("failed to encode action: %w", err)
	}

	// Calculate reward based on user outcome
	reward := s.calculateReward(action, outcome)

	// Get next state (if available)
	nextState := state // Simplified - would normally get actual next state

	// Create experience
	experience := &Experience{
		State:     state,
		Action:    actionIndex,
		Reward:    reward,
		NextState: nextState,
		Done:      true, // Simplified - each interaction is considered terminal
		Timestamp: time.Now(),
	}

	// Add to experience replay buffer
	s.experienceReplay.Add(experience)

	// Train if we have enough experiences
	if s.experienceReplay.Size() > 32 { // Minimum batch size
		err = s.trainStep()
		if err != nil {
			return fmt.Errorf("training step failed: %w", err)
		}
	}

	// Update performance metrics
	s.updatePerformanceMetrics(reward, actionIndex)

	return nil
}

// GetOptimalAction returns the best action for a given user-job pair
func (s *RLService) GetOptimalAction(ctx context.Context, userID, jobID string, explorationMode bool) (ActionType, float64, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Extract state
	state, err := s.extractState(ctx, userID, jobID)
	if err != nil {
		return ActionNoRecommend, 0.0, fmt.Errorf("failed to extract state: %w", err)
	}

	// Get Q-values from network
	qValues, err := s.qNetwork.Forward(state)
	if err != nil {
		return ActionNoRecommend, 0.0, fmt.Errorf("forward pass failed: %w", err)
	}

	var actionIndex int
	var confidence float64

	if explorationMode && rand.Float64() < s.epsilon {
		// Exploration: choose random action
		actionIndex = rand.Intn(len(s.actionDecoder.actionSpace))
		confidence = 0.5 // Low confidence for random actions
	} else {
		// Exploitation: choose best action
		actionIndex = s.argmax(qValues)
		confidence = s.softmax(qValues)[actionIndex] // Confidence based on softmax probability
	}

	action := s.actionDecoder.indexToAction[actionIndex]
	return action, confidence, nil
}

// GetRecommendationScore returns a recommendation score based on RL policy
func (s *RLService) GetRecommendationScore(ctx context.Context, userID, jobID string) (float64, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Extract state
	state, err := s.extractState(ctx, userID, jobID)
	if err != nil {
		return 0.0, fmt.Errorf("failed to extract state: %w", err)
	}

	// Get Q-values
	qValues, err := s.qNetwork.Forward(state)
	if err != nil {
		return 0.0, fmt.Errorf("forward pass failed: %w", err)
	}

	// Convert Q-values to recommendation score
	// Higher Q-values for recommendation actions = higher score
	recommendScore := 0.0
	for i, action := range s.actionDecoder.actionSpace {
		switch action {
		case ActionRecommendHigh:
			recommendScore += qValues[i] * 1.0
		case ActionRecommendMedium:
			recommendScore += qValues[i] * 0.7
		case ActionRecommendLow:
			recommendScore += qValues[i] * 0.3
		case ActionNoRecommend:
			recommendScore += qValues[i] * 0.0
		case ActionRequestFeedback:
			recommendScore += qValues[i] * 0.5
		}
	}

	// Normalize to 0-1 range
	return math.Max(0, math.Min(1, utils.Sigmoid(recommendScore))), nil
}

// TrainFromBatch trains the RL model on a batch of experiences
func (s *RLService) TrainFromBatch(ctx context.Context, batchSize int, epochs int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.isTraining = true
	defer func() { s.isTraining = false }()

	if s.experienceReplay.Size() < batchSize {
		return fmt.Errorf("not enough experiences for training: have %d, need %d", s.experienceReplay.Size(), batchSize)
	}

	for epoch := 0; epoch < epochs; epoch++ {
		// Sample batch from experience replay
		batch := s.experienceReplay.Sample(batchSize)
		
		// Train on batch
		loss, err := s.trainOnBatch(batch)
		if err != nil {
			return fmt.Errorf("batch training failed: %w", err)
		}

		s.trainingSteps++

		// Update target network periodically
		if s.trainingSteps%s.targetUpdateFrequency == 0 {
			s.updateTargetNetwork()
		}

		// Decay exploration rate
		s.epsilon = math.Max(s.epsilonMin, s.epsilon*s.epsilonDecay)

		if epoch%10 == 0 {
			fmt.Printf("RL Training - Epoch %d, Loss: %.4f, Epsilon: %.4f\n", epoch, loss, s.epsilon)
		}
	}

	s.lastTrainingTime = time.Now()
	return nil
}

// GetPerformanceMetrics returns current RL performance metrics
func (s *RLService) GetPerformanceMetrics() *RLPerformanceMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()

	metrics := *s.performanceMetrics
	metrics.ExplorationRate = s.epsilon
	return &metrics
}

// GetModelInfo returns information about the RL model
func (s *RLService) GetModelInfo() *models.ModelInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return &models.ModelInfo{
		ModelID:      s.modelVersion,
		ModelType:    "rl",
		Version:      s.modelVersion,
		LoadedAt:     s.lastTrainingTime,
		InputShape:   []int{s.stateEncoder.stateSize},
		OutputShape:  []int{len(s.actionDecoder.actionSpace)},
		Parameters:   s.countParameters(),
		Capabilities: []string{"action_selection", "feedback_learning", "continuous_improvement", "exploration"},
		Metadata: map[string]interface{}{
			"state_size":              s.stateEncoder.stateSize,
			"action_space_size":       len(s.actionDecoder.actionSpace),
			"experience_buffer_size":  s.experienceReplay.Size(),
			"training_steps":          s.trainingSteps,
			"exploration_rate":        s.epsilon,
			"learning_rate":           s.learningRate,
			"discount_factor":         s.discountFactor,
		},
	}
}

// Private methods

func (s *RLService) initializeQNetwork(stateSize, actionSize int) {
	// Create a simple deep Q-network architecture
	hiddenLayers := []int{256, 128, 64}
	
	s.qNetwork = &QNetwork{
		inputDim:  stateSize,
		outputDim: actionSize,
		layers:    []Layer{},
	}

	// Input layer
	prevSize := stateSize
	for _, hiddenSize := range hiddenLayers {
		layer := Layer{
			weights:    s.initializeWeights(prevSize, hiddenSize),
			biases:     make([]float64, hiddenSize),
			activation: "relu",
			inputSize:  prevSize,
			outputSize: hiddenSize,
		}
		s.qNetwork.layers = append(s.qNetwork.layers, layer)
		prevSize = hiddenSize
	}

	// Output layer (no activation for Q-values)
	outputLayer := Layer{
		weights:    s.initializeWeights(prevSize, actionSize),
		biases:     make([]float64, actionSize),
		activation: "linear",
		inputSize:  prevSize,
		outputSize: actionSize,
	}
	s.qNetwork.layers = append(s.qNetwork.layers, outputLayer)

	// Initialize target network as copy of main network
	s.targetNetwork = s.copyQNetwork(s.qNetwork)
}

func (s *RLService) initializeExperienceReplay(maxSize int) {
	s.experienceReplay = &ExperienceReplay{
		experiences: make([]*Experience, maxSize),
		maxSize:     maxSize,
		currentSize: 0,
		position:    0,
	}
}

func (s *RLService) initializeStateEncoder() {
	s.stateEncoder = &StateEncoder{
		featureExtractor: &FeatureExtractor{
			userFeatureSize:    20, // User skills, experience, preferences
			jobFeatureSize:     15, // Job requirements, category, level
			contextFeatureSize: 10, // Time, location, market conditions
		},
		normalizers: make(map[string]*Normalizer),
		stateSize:   45, // Total feature size
	}
}

func (s *RLService) initializeActionDecoder() {
	actions := []ActionType{
		ActionRecommendHigh,
		ActionRecommendMedium,
		ActionRecommendLow,
		ActionNoRecommend,
		ActionRequestFeedback,
	}

	s.actionDecoder = &ActionDecoder{
		actionSpace:   actions,
		actionToIndex: make(map[ActionType]int),
		indexToAction: make(map[int]ActionType),
	}

	for i, action := range actions {
		s.actionDecoder.actionToIndex[action] = i
		s.actionDecoder.indexToAction[i] = action
	}
}

func (s *RLService) initializeWeights(inputSize, outputSize int) [][]float64 {
	weights := make([][]float64, inputSize)
	stddev := math.Sqrt(2.0 / float64(inputSize)) // He initialization

	for i := range weights {
		weights[i] = make([]float64, outputSize)
		for j := range weights[i] {
			weights[i][j] = rand.NormFloat64() * stddev
		}
	}

	return weights
}

func (s *RLService) extractState(ctx context.Context, userID, jobID string) ([]float64, error) {
	// In a real implementation, this would extract features from user and job data
	// For now, create a mock state vector
	state := make([]float64, s.stateEncoder.stateSize)
	
	// Fill with mock features (normally would extract from database)
	for i := range state {
		state[i] = rand.NormFloat64() * 0.5 // Normalized random features
	}
	
	return state, nil
}

func (s *RLService) encodeAction(action string) (int, error) {
	actionType := ActionType(action)
	if index, exists := s.actionDecoder.actionToIndex[actionType]; exists {
		return index, nil
	}
	
	// Map common action strings to ActionTypes
	switch action {
	case "applied", "viewed", "interested":
		return s.actionDecoder.actionToIndex[ActionRecommendHigh], nil
	case "saved", "shared":
		return s.actionDecoder.actionToIndex[ActionRecommendMedium], nil
	case "dismissed", "not_interested":
		return s.actionDecoder.actionToIndex[ActionNoRecommend], nil
	default:
		return s.actionDecoder.actionToIndex[ActionRecommendLow], nil
	}
}

func (s *RLService) calculateReward(action string, outcome float64) float64 {
	// Calculate reward based on action and outcome
	baseReward := outcome // User satisfaction or success metric (0-1)
	
	switch action {
	case "applied":
		return baseReward * 2.0 // High reward for applications
	case "hired":
		return baseReward * 5.0 // Very high reward for successful hires
	case "viewed":
		return baseReward * 0.5 // Lower reward for just viewing
	case "ignored", "dismissed":
		return -0.1 // Small negative reward for dismissals
	case "not_interested":
		return -0.2 // Larger negative reward for explicit negative feedback
	default:
		return baseReward
	}
}

func (s *RLService) trainStep() error {
	batchSize := 32
	if s.experienceReplay.Size() < batchSize {
		return nil // Not enough data yet
	}

	// Sample batch
	batch := s.experienceReplay.Sample(batchSize)
	
	// Train on batch
	_, err := s.trainOnBatch(batch)
	if err != nil {
		return err
	}

	s.trainingSteps++
	
	// Update target network
	if s.trainingSteps%s.targetUpdateFrequency == 0 {
		s.updateTargetNetwork()
	}
	
	// Decay epsilon
	s.epsilon = math.Max(s.epsilonMin, s.epsilon*s.epsilonDecay)
	
	return nil
}

func (s *RLService) trainOnBatch(batch []*Experience) (float64, error) {
	totalLoss := 0.0
	
	for _, experience := range batch {
		// Get current Q-values
		currentQ, err := s.qNetwork.Forward(experience.State)
		if err != nil {
			return 0.0, err
		}

		// Get next Q-values from target network
		nextQ, err := s.targetNetwork.Forward(experience.NextState)
		if err != nil {
			return 0.0, err
		}

		// Calculate target Q-value using Bellman equation
		target := experience.Reward
		if !experience.Done {
			target += s.discountFactor * s.maxValue(nextQ)
		}

		// Calculate loss (squared error)
		currentValue := currentQ[experience.Action]
		loss := (target - currentValue) * (target - currentValue)
		totalLoss += loss

		// Backpropagate (simplified - would use proper gradient descent)
		s.updateWeights(experience.State, experience.Action, target, currentValue)
	}

	return totalLoss / float64(len(batch)), nil
}

func (s *RLService) updateWeights(state []float64, action int, target, current float64) {
	// Simplified weight update - in practice would use proper backpropagation
	learningRate := s.learningRate
	error := target - current

	// Update output layer weights (simplified)
	for i := range state {
		if i < len(s.qNetwork.layers[len(s.qNetwork.layers)-1].weights) {
			s.qNetwork.layers[len(s.qNetwork.layers)-1].weights[i][action] += learningRate * error * state[i%len(s.qNetwork.layers[len(s.qNetwork.layers)-1].weights)]
		}
	}
}

func (s *RLService) updateTargetNetwork() {
	// Copy main network weights to target network
	s.targetNetwork = s.copyQNetwork(s.qNetwork)
}

func (s *RLService) copyQNetwork(source *QNetwork) *QNetwork {
	target := &QNetwork{
		inputDim:  source.inputDim,
		outputDim: source.outputDim,
		layers:    make([]Layer, len(source.layers)),
	}

	for i, layer := range source.layers {
		target.layers[i] = Layer{
			weights:    s.copyMatrix(layer.weights),
			biases:     s.copySlice(layer.biases),
			activation: layer.activation,
			inputSize:  layer.inputSize,
			outputSize: layer.outputSize,
		}
	}

	return target
}

func (s *RLService) copyMatrix(source [][]float64) [][]float64 {
	target := make([][]float64, len(source))
	for i := range source {
		target[i] = make([]float64, len(source[i]))
		copy(target[i], source[i])
	}
	return target
}

func (s *RLService) copySlice(source []float64) []float64 {
	target := make([]float64, len(source))
	copy(target, source)
	return target
}

func (s *RLService) updatePerformanceMetrics(reward float64, action int) {
	s.performanceMetrics.CumulativeReward += reward
	s.performanceMetrics.EpisodeCount++
	s.performanceMetrics.TotalActions++

	if reward > 0 {
		s.performanceMetrics.SuccessfulActions++
	}

	// Calculate average reward
	s.performanceMetrics.AverageReward = s.performanceMetrics.CumulativeReward / float64(s.performanceMetrics.EpisodeCount)

	// Update learning progress
	s.performanceMetrics.LearningProgress = append(s.performanceMetrics.LearningProgress, s.performanceMetrics.AverageReward)
	if len(s.performanceMetrics.LearningProgress) > 100 {
		// Keep only last 100 episodes
		s.performanceMetrics.LearningProgress = s.performanceMetrics.LearningProgress[1:]
	}

	s.performanceMetrics.LastTrainingTime = time.Now()
}

func (s *RLService) countParameters() int {
	count := 0
	for _, layer := range s.qNetwork.layers {
		for _, weights := range layer.weights {
			count += len(weights)
		}
		count += len(layer.biases)
	}
	return count
}

// QNetwork methods

func (q *QNetwork) Forward(input []float64) ([]float64, error) {
	if len(input) != q.inputDim {
		return nil, fmt.Errorf("input size mismatch: expected %d, got %d", q.inputDim, len(input))
	}

	current := input
	for _, layer := range q.layers {
		current = layer.Forward(current)
	}

	return current, nil
}

func (l *Layer) Forward(input []float64) []float64 {
	if len(input) != l.inputSize {
		return nil // Error handling simplified
	}

	output := make([]float64, l.outputSize)
	
	// Matrix multiplication + bias
	for i := 0; i < l.outputSize; i++ {
		sum := l.biases[i]
		for j := 0; j < l.inputSize; j++ {
			sum += l.weights[j][i] * input[j]
		}
		
		// Apply activation function
		switch l.activation {
		case "relu":
			output[i] = math.Max(0, sum)
		case "sigmoid":
			output[i] = utils.Sigmoid(sum)
		case "tanh":
			output[i] = math.Tanh(sum)
		case "linear":
			output[i] = sum
		default:
			output[i] = sum
		}
	}

	return output
}

// ExperienceReplay methods

func (er *ExperienceReplay) Add(experience *Experience) {
	er.mu.Lock()
	defer er.mu.Unlock()

	er.experiences[er.position] = experience
	er.position = (er.position + 1) % er.maxSize
	
	if er.currentSize < er.maxSize {
		er.currentSize++
	}
}

func (er *ExperienceReplay) Sample(batchSize int) []*Experience {
	er.mu.RLock()
	defer er.mu.RUnlock()

	if batchSize > er.currentSize {
		batchSize = er.currentSize
	}

	batch := make([]*Experience, batchSize)
	for i := 0; i < batchSize; i++ {
		randomIndex := rand.Intn(er.currentSize)
		batch[i] = er.experiences[randomIndex]
	}

	return batch
}

func (er *ExperienceReplay) Size() int {
	er.mu.RLock()
	defer er.mu.RUnlock()
	return er.currentSize
}

// Utility functions

func (s *RLService) argmax(values []float64) int {
	maxIndex := 0
	maxValue := values[0]
	
	for i, value := range values {
		if value > maxValue {
			maxValue = value
			maxIndex = i
		}
	}
	
	return maxIndex
}

func (s *RLService) maxValue(values []float64) float64 {
	if len(values) == 0 {
		return 0.0
	}
	
	maxVal := values[0]
	for _, val := range values {
		if val > maxVal {
			maxVal = val
		}
	}
	
	return maxVal
}

func (s *RLService) softmax(values []float64) []float64 {
	result := make([]float64, len(values))
	sum := 0.0
	
	// Find max value for numerical stability
	maxVal := s.maxValue(values)
	
	// Compute exponentials and sum
	for i, val := range values {
		result[i] = math.Exp(val - maxVal)
		sum += result[i]
	}
	
	// Normalize
	for i := range result {
		result[i] /= sum
	}
	
	return result
}

