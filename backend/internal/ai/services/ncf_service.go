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

// NCFService implements Neural Collaborative Filtering for recommendation
type NCFService struct {
	mu                    sync.RWMutex
	userEmbeddings        map[string][]float64
	jobEmbeddings         map[string][]float64
	userBias              map[string]float64
	jobBias               map[string]float64
	globalBias            float64
	embeddingDim          int
	hiddenLayers          []int
	mlpWeights            [][]float64
	mlpBiases             [][]float64
	learningRate          float64
	regularization        float64
	isTraining            bool
	trainingData          []*models.TrainingData
	validationData        []*models.TrainingData
	modelVersion          string
	lastTrainingTime      time.Time
	performanceMetrics    *models.ModelPerformanceMetrics
}

// NewNCFService creates a new Neural Collaborative Filtering service
func NewNCFService(config *models.NCFConfig) *NCFService {
	service := &NCFService{
		userEmbeddings:   make(map[string][]float64),
		jobEmbeddings:    make(map[string][]float64),
		userBias:         make(map[string]float64),
		jobBias:          make(map[string]float64),
		embeddingDim:     config.EmbeddingDim,
		hiddenLayers:     config.HiddenLayers,
		learningRate:     config.LearningRate,
		regularization:   config.RegularizationL2,
		modelVersion:     fmt.Sprintf("ncf_v%d", time.Now().Unix()),
	}
	
	// Initialize MLP layers
	service.initializeMLP()
	
	return service
}

// PredictUserJobInteraction predicts the interaction score between user and job
func (s *NCFService) PredictUserJobInteraction(ctx context.Context, userID, jobID string) (float64, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	// Get user and job embeddings
	userEmb, userExists := s.userEmbeddings[userID]
	jobEmb, jobExists := s.jobEmbeddings[jobID]
	
	if !userExists || !jobExists {
		// Cold start - use average embeddings or train new embeddings
		return s.handleColdStart(ctx, userID, jobID)
	}
	
	// General Matrix Factorization (GMF) component
	gmfScore := s.computeGMF(userEmb, jobEmb)
	
	// Multi-Layer Perceptron (MLP) component
	mlpScore := s.computeMLP(userEmb, jobEmb)
	
	// Neural Matrix Factorization - combine GMF and MLP
	finalScore := s.combineGMFAndMLP(gmfScore, mlpScore)
	
	// Add bias terms
	userBiasVal := s.userBias[userID]
	jobBiasVal := s.jobBias[jobID]
	finalScore += userBiasVal + jobBiasVal + s.globalBias
	
	// Apply sigmoid to get probability
	probability := utils.Sigmoid(finalScore)
	
	return probability, nil
}

// GetTopRecommendations returns top N job recommendations for a user
func (s *NCFService) GetTopRecommendations(ctx context.Context, userID string, candidateJobs []string, topN int) ([]*models.AIRecommendation, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	var recommendations []*models.AIRecommendation
	
	// Score all candidate jobs
	for _, jobID := range candidateJobs {
		score, err := s.PredictUserJobInteraction(ctx, userID, jobID)
		if err != nil {
			continue
		}
		
		// Calculate confidence based on embedding quality
		confidence := s.calculateConfidence(userID, jobID, score)
		
		recommendation := &models.AIRecommendation{
			ID:                fmt.Sprintf("ncf_%s_%s_%d", userID, jobID, time.Now().Unix()),
			UserID:            userID,
			JobID:             jobID,
			ModelVersion:      s.modelVersion,
			ConfidenceScore:   confidence,
			PredictionScore:   score,
			SuccessProbability: score, // For NCF, prediction score is success probability
			Features:          s.extractFeatures(userID, jobID),
			CreatedAt:         time.Now(),
			UpdatedAt:         time.Now(),
		}
		
		recommendations = append(recommendations, recommendation)
	}
	
	// Sort by prediction score (descending)
	s.sortRecommendations(recommendations)
	
	// Return top N
	if len(recommendations) > topN {
		recommendations = recommendations[:topN]
	}
	
	return recommendations, nil
}

// TrainModel trains the NCF model with provided data
func (s *NCFService) TrainModel(ctx context.Context, trainingData []*models.TrainingData, config *models.NCFConfig) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	s.isTraining = true
	defer func() { s.isTraining = false }()
	
	s.trainingData = trainingData
	
	// Split data into training and validation
	trainData, validData := s.splitData(trainingData, config.ValidationSplit)
	s.validationData = validData
	
	// Initialize embeddings if not exist
	s.initializeEmbeddings(trainData)
	
	// Training loop
	for epoch := 0; epoch < config.MaxEpochs; epoch++ {
		// Shuffle training data
		s.shuffleData(trainData)
		
		// Train in batches
		totalLoss := 0.0
		batchCount := 0
		
		for i := 0; i < len(trainData); i += config.BatchSize {
			end := min(i+config.BatchSize, len(trainData))
			batch := trainData[i:end]
			
			batchLoss := s.trainBatch(batch, config)
			totalLoss += batchLoss
			batchCount++
		}
		
		avgLoss := totalLoss / float64(batchCount)
		
		// Validate
		validationMetrics := s.validateModel(validData)
		
		fmt.Printf("Epoch %d - Loss: %.4f, Val Accuracy: %.4f\n", 
			epoch+1, avgLoss, validationMetrics.Accuracy)
		
		// Early stopping check
		if config.EarlyStopping && s.shouldEarlyStop(validationMetrics, epoch) {
			fmt.Printf("Early stopping at epoch %d\n", epoch+1)
			break
		}
	}
	
	s.lastTrainingTime = time.Now()
	s.updatePerformanceMetrics()
	
	return nil
}

// UpdateEmbeddings updates user/job embeddings with new interaction data
func (s *NCFService) UpdateEmbeddings(ctx context.Context, userID, jobID string, interaction float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	// Online learning - update embeddings incrementally
	userEmb := s.userEmbeddings[userID]
	jobEmb := s.jobEmbeddings[jobID]
	
	if userEmb == nil || jobEmb == nil {
		return fmt.Errorf("embeddings not found for user %s or job %s", userID, jobID)
	}
	
	// Compute prediction error
	prediction, _ := s.PredictUserJobInteraction(ctx, userID, jobID)
	error := interaction - prediction
	
	// Update embeddings using SGD
	for i := 0; i < s.embeddingDim; i++ {
		userFeature := userEmb[i]
		jobFeature := jobEmb[i]
		
		// Update user embedding
		userEmb[i] += s.learningRate * (error*jobFeature - s.regularization*userFeature)
		
		// Update job embedding
		jobEmb[i] += s.learningRate * (error*userFeature - s.regularization*jobFeature)
	}
	
	// Update bias terms
	s.userBias[userID] += s.learningRate * (error - s.regularization*s.userBias[userID])
	s.jobBias[jobID] += s.learningRate * (error - s.regularization*s.jobBias[jobID])
	
	return nil
}

// GetModelInfo returns information about the current model
func (s *NCFService) GetModelInfo() *models.ModelInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	return &models.ModelInfo{
		ModelID:      s.modelVersion,
		ModelType:    "ncf",
		Version:      s.modelVersion,
		LoadedAt:     s.lastTrainingTime,
		InputShape:   []int{s.embeddingDim * 2}, // User + Job embeddings
		OutputShape:  []int{1},                  // Single prediction score
		Parameters:   s.countParameters(),
		Capabilities: []string{"user_job_prediction", "top_n_recommendations", "online_learning"},
		Metadata: map[string]interface{}{
			"embedding_dim":   s.embeddingDim,
			"hidden_layers":   s.hiddenLayers,
			"learning_rate":   s.learningRate,
			"regularization":  s.regularization,
			"user_count":      len(s.userEmbeddings),
			"job_count":       len(s.jobEmbeddings),
		},
	}
}

// Private methods

func (s *NCFService) initializeMLP() {
	if len(s.hiddenLayers) == 0 {
		return
	}
	
	// Initialize MLP weights and biases
	inputDim := s.embeddingDim * 2 // Concatenated user and job embeddings
	
	s.mlpWeights = make([][]float64, len(s.hiddenLayers)+1)
	s.mlpBiases = make([][]float64, len(s.hiddenLayers)+1)
	
	// Input to first hidden layer
	s.mlpWeights[0] = s.initializeMatrix(inputDim, s.hiddenLayers[0])
	s.mlpBiases[0] = make([]float64, s.hiddenLayers[0])
	
	// Hidden layers
	for i := 1; i < len(s.hiddenLayers); i++ {
		s.mlpWeights[i] = s.initializeMatrix(s.hiddenLayers[i-1], s.hiddenLayers[i])
		s.mlpBiases[i] = make([]float64, s.hiddenLayers[i])
	}
	
	// Last hidden layer to output
	lastHiddenDim := s.hiddenLayers[len(s.hiddenLayers)-1]
	s.mlpWeights[len(s.hiddenLayers)] = s.initializeMatrix(lastHiddenDim, 1)
	s.mlpBiases[len(s.hiddenLayers)] = make([]float64, 1)
}

func (s *NCFService) initializeMatrix(rows, cols int) []float64 {
	matrix := make([]float64, rows*cols)
	stddev := math.Sqrt(2.0 / float64(rows)) // He initialization
	
	for i := range matrix {
		matrix[i] = rand.NormFloat64() * stddev
	}
	
	return matrix
}

func (s *NCFService) initializeEmbeddings(data []*models.TrainingData) {
	// Collect unique users and jobs
	users := make(map[string]bool)
	jobs := make(map[string]bool)
	
	for _, sample := range data {
		users[sample.UserID] = true
		jobs[sample.JobID] = true
	}
	
	// Initialize embeddings with random values
	for userID := range users {
		if _, exists := s.userEmbeddings[userID]; !exists {
			s.userEmbeddings[userID] = s.randomEmbedding(s.embeddingDim)
			s.userBias[userID] = rand.NormFloat64() * 0.01
		}
	}
	
	for jobID := range jobs {
		if _, exists := s.jobEmbeddings[jobID]; !exists {
			s.jobEmbeddings[jobID] = s.randomEmbedding(s.embeddingDim)
			s.jobBias[jobID] = rand.NormFloat64() * 0.01
		}
	}
}

func (s *NCFService) randomEmbedding(dim int) []float64 {
	embedding := make([]float64, dim)
	stddev := math.Sqrt(1.0 / float64(dim))
	
	for i := range embedding {
		embedding[i] = rand.NormFloat64() * stddev
	}
	
	return embedding
}

func (s *NCFService) computeGMF(userEmb, jobEmb []float64) float64 {
	// Element-wise product of user and job embeddings
	gmfVector := make([]float64, len(userEmb))
	for i := range userEmb {
		gmfVector[i] = userEmb[i] * jobEmb[i]
	}
	
	// Sum all elements (simplified - could use learned weights)
	sum := 0.0
	for _, val := range gmfVector {
		sum += val
	}
	
	return sum
}

func (s *NCFService) computeMLP(userEmb, jobEmb []float64) float64 {
	if len(s.mlpWeights) == 0 {
		return 0.0
	}
	
	// Concatenate user and job embeddings
	input := append(userEmb, jobEmb...)
	
	// Forward pass through MLP
	current := input
	for i := 0; i < len(s.mlpWeights); i++ {
		current = s.matrixVectorMultiply(s.mlpWeights[i], current, s.mlpBiases[i])
		
		// Apply activation (ReLU for hidden layers, linear for output)
		if i < len(s.mlpWeights)-1 {
			current = s.applyReLU(current)
		}
	}
	
	return current[0]
}

func (s *NCFService) combineGMFAndMLP(gmfScore, mlpScore float64) float64 {
	// Simple combination - could be learned
	return 0.5*gmfScore + 0.5*mlpScore
}

func (s *NCFService) matrixVectorMultiply(weights, input, bias []float64) []float64 {
	rows := len(bias)
	cols := len(input)
	result := make([]float64, rows)
	
	for i := 0; i < rows; i++ {
		sum := bias[i]
		for j := 0; j < cols; j++ {
			sum += weights[i*cols+j] * input[j]
		}
		result[i] = sum
	}
	
	return result
}

func (s *NCFService) applyReLU(input []float64) []float64 {
	result := make([]float64, len(input))
	for i, val := range input {
		result[i] = math.Max(0, val)
	}
	return result
}

func (s *NCFService) handleColdStart(ctx context.Context, userID, jobID string) (float64, error) {
	// For cold start, return average prediction or use content-based features
	return 0.5, nil // Neutral prediction
}

func (s *NCFService) calculateConfidence(userID, jobID string, score float64) float64 {
	// Confidence based on embedding norms and prediction certainty
	userEmb := s.userEmbeddings[userID]
	jobEmb := s.jobEmbeddings[jobID]
	
	if userEmb == nil || jobEmb == nil {
		return 0.1 // Low confidence for cold start
	}
	
	// Calculate embedding norms
	userNorm := s.vectorNorm(userEmb)
	jobNorm := s.vectorNorm(jobEmb)
	
	// Higher norms indicate more training, higher confidence
	embeddingConfidence := math.Min(userNorm*jobNorm, 1.0)
	
	// Prediction certainty (how far from 0.5)
	certainty := math.Abs(score - 0.5) * 2
	
	return (embeddingConfidence + certainty) / 2.0
}

func (s *NCFService) vectorNorm(vec []float64) float64 {
	sum := 0.0
	for _, val := range vec {
		sum += val * val
	}
	return math.Sqrt(sum)
}

func (s *NCFService) extractFeatures(userID, jobID string) map[string]float64 {
	features := make(map[string]float64)
	
	// Embedding features
	if userEmb := s.userEmbeddings[userID]; userEmb != nil {
		features["user_embedding_norm"] = s.vectorNorm(userEmb)
	}
	
	if jobEmb := s.jobEmbeddings[jobID]; jobEmb != nil {
		features["job_embedding_norm"] = s.vectorNorm(jobEmb)
	}
	
	// Bias features
	features["user_bias"] = s.userBias[userID]
	features["job_bias"] = s.jobBias[jobID]
	features["global_bias"] = s.globalBias
	
	return features
}

func (s *NCFService) sortRecommendations(recommendations []*models.AIRecommendation) {
	// Simple bubble sort by prediction score (descending)
	n := len(recommendations)
	for i := 0; i < n-1; i++ {
		for j := 0; j < n-i-1; j++ {
			if recommendations[j].PredictionScore < recommendations[j+1].PredictionScore {
				recommendations[j], recommendations[j+1] = recommendations[j+1], recommendations[j]
			}
		}
	}
}

func (s *NCFService) splitData(data []*models.TrainingData, validationSplit float64) ([]*models.TrainingData, []*models.TrainingData) {
	splitIndex := int(float64(len(data)) * (1.0 - validationSplit))
	return data[:splitIndex], data[splitIndex:]
}

func (s *NCFService) shuffleData(data []*models.TrainingData) {
	rand.Shuffle(len(data), func(i, j int) {
		data[i], data[j] = data[j], data[i]
	})
}

func (s *NCFService) trainBatch(batch []*models.TrainingData, config *models.NCFConfig) float64 {
	totalLoss := 0.0
	
	for _, sample := range batch {
		prediction, _ := s.PredictUserJobInteraction(context.Background(), sample.UserID, sample.JobID)
		loss := (sample.Label - prediction) * (sample.Label - prediction)
		totalLoss += loss
		
		// Update embeddings
		s.UpdateEmbeddings(context.Background(), sample.UserID, sample.JobID, sample.Label)
	}
	
	return totalLoss / float64(len(batch))
}

func (s *NCFService) validateModel(validationData []*models.TrainingData) *models.ValidationMetrics {
	if len(validationData) == 0 {
		return &models.ValidationMetrics{}
	}
	
	correctPredictions := 0
	totalLoss := 0.0
	
	for _, sample := range validationData {
		prediction, _ := s.PredictUserJobInteraction(context.Background(), sample.UserID, sample.JobID)
		
		// Binary classification accuracy (threshold at 0.5)
		predicted := 0.0
		if prediction > 0.5 {
			predicted = 1.0
		}
		
		if predicted == sample.Label {
			correctPredictions++
		}
		
		loss := (sample.Label - prediction) * (sample.Label - prediction)
		totalLoss += loss
	}
	
	accuracy := float64(correctPredictions) / float64(len(validationData))
	avgLoss := totalLoss / float64(len(validationData))
	
	return &models.ValidationMetrics{
		Loss:     avgLoss,
		Accuracy: accuracy,
		RMSE:     math.Sqrt(avgLoss),
	}
}

func (s *NCFService) shouldEarlyStop(metrics *models.ValidationMetrics, epoch int) bool {
	// Simple early stopping based on accuracy improvement
	return false // Implement proper early stopping logic
}

func (s *NCFService) countParameters() int {
	count := 0
	
	// Embedding parameters
	count += len(s.userEmbeddings) * s.embeddingDim
	count += len(s.jobEmbeddings) * s.embeddingDim
	
	// Bias parameters
	count += len(s.userBias) + len(s.jobBias) + 1 // +1 for global bias
	
	// MLP parameters
	for i, weights := range s.mlpWeights {
		count += len(weights) + len(s.mlpBiases[i])
	}
	
	return count
}

func (s *NCFService) updatePerformanceMetrics() {
	s.performanceMetrics = &models.ModelPerformanceMetrics{
		ModelID:      s.modelVersion,
		ModelType:    "ncf",
		Version:      s.modelVersion,
		TrainingTime: time.Since(s.lastTrainingTime),
		CreatedAt:    time.Now(),
	}
}

// Helper functions

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}