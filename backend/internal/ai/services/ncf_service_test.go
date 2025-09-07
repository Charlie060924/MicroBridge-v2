package services

import (
	"context"
	"fmt"
	"testing"

	"microbridge/backend/internal/ai/models"
	"microbridge/backend/internal/ai/utils"
)

func TestNCFService_PredictUserJobInteraction(t *testing.T) {
	// Initialize NCF service with test config
	config := &models.NCFConfig{
		EmbeddingDim: 32,
		HiddenLayers: []int{64, 32},
		TrainingConfig: models.TrainingConfig{
			LearningRate:     0.01,
			RegularizationL2: 0.001,
		},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Test case 1: Cold start (no embeddings)
	t.Run("ColdStart", func(t *testing.T) {
		score, err := service.PredictUserJobInteraction(ctx, "new_user", "new_job")
		if err != nil {
			t.Errorf("Expected no error for cold start, got: %v", err)
		}
		
		if score != 0.5 {
			t.Errorf("Expected cold start score of 0.5, got: %f", score)
		}
	})

	// Test case 2: After training with embeddings
	t.Run("WithTraining", func(t *testing.T) {
		// Create mock training data
		trainingData := []*models.TrainingData{
			{
				UserID: "user1",
				JobID:  "job1",
				Label:  1.0, // Positive interaction
				Features: models.FeatureVector{
					UserFeatures: map[string]float64{"skill_js": 1.0},
					JobFeatures:  map[string]float64{"req_js": 1.0},
				},
			},
			{
				UserID: "user1",
				JobID:  "job2",
				Label:  0.0, // Negative interaction
				Features: models.FeatureVector{
					UserFeatures: map[string]float64{"skill_js": 1.0},
					JobFeatures:  map[string]float64{"req_python": 1.0},
				},
			},
		}

		// Train the model
		err := service.TrainModel(ctx, trainingData, config)
		if err != nil {
			t.Fatalf("Training failed: %v", err)
		}

		// Test prediction after training
		score, err := service.PredictUserJobInteraction(ctx, "user1", "job1")
		if err != nil {
			t.Errorf("Prediction failed: %v", err)
		}

		if score < 0.0 || score > 1.0 {
			t.Errorf("Score should be between 0 and 1, got: %f", score)
		}
	})
}

func TestNCFService_GetTopRecommendations(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 16,
		HiddenLayers: []int{32, 16},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	candidateJobs := []string{"job1", "job2", "job3", "job4", "job5"}
	topN := 3

	recommendations, err := service.GetTopRecommendations(ctx, "user1", candidateJobs, topN)
	if err != nil {
		t.Fatalf("GetTopRecommendations failed: %v", err)
	}

	if len(recommendations) != topN {
		t.Errorf("Expected %d recommendations, got %d", topN, len(recommendations))
	}

	// Check that recommendations are sorted by score (descending)
	for i := 1; i < len(recommendations); i++ {
		if recommendations[i-1].PredictionScore < recommendations[i].PredictionScore {
			t.Errorf("Recommendations not sorted by score")
		}
	}

	// Check recommendation structure
	for i, rec := range recommendations {
		if rec.UserID != "user1" {
			t.Errorf("Recommendation %d has wrong UserID: %s", i, rec.UserID)
		}
		
		if rec.ModelVersion == "" {
			t.Errorf("Recommendation %d missing ModelVersion", i)
		}
		
		if rec.CreatedAt.IsZero() {
			t.Errorf("Recommendation %d missing CreatedAt", i)
		}
	}
}

func TestNCFService_UpdateEmbeddings(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 8,
		TrainingConfig: models.TrainingConfig{
			LearningRate: 0.1,
		},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Initialize some embeddings first
	service.userEmbeddings["user1"] = []float64{0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8}
	service.jobEmbeddings["job1"] = []float64{0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9}
	service.userBias["user1"] = 0.1
	service.jobBias["job1"] = 0.2

	// Store original values for comparison
	originalUserEmb := make([]float64, len(service.userEmbeddings["user1"]))
	copy(originalUserEmb, service.userEmbeddings["user1"])

	// Test embedding update
	err := service.UpdateEmbeddings(ctx, "user1", "job1", 1.0)
	if err != nil {
		t.Fatalf("UpdateEmbeddings failed: %v", err)
	}

	// Check that embeddings were updated (should be different)
	updatedUserEmb := service.userEmbeddings["user1"]
	embeddingsChanged := false
	for i := range originalUserEmb {
		if originalUserEmb[i] != updatedUserEmb[i] {
			embeddingsChanged = true
			break
		}
	}

	if !embeddingsChanged {
		t.Error("Embeddings were not updated")
	}

	// Test error case: non-existent user/job
	err = service.UpdateEmbeddings(ctx, "nonexistent_user", "job1", 1.0)
	if err == nil {
		t.Error("Expected error for non-existent user, got nil")
	}
}

func TestNCFService_GetModelInfo(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 16,
		HiddenLayers: []int{32, 16},
	}
	
	service := NewNCFService(config)

	info := service.GetModelInfo()

	// Check basic model info
	if info.ModelType != "ncf" {
		t.Errorf("Expected ModelType 'ncf', got '%s'", info.ModelType)
	}

	if len(info.InputShape) == 0 {
		t.Error("InputShape should not be empty")
	}

	if len(info.OutputShape) == 0 {
		t.Error("OutputShape should not be empty")
	}

	if len(info.Capabilities) == 0 {
		t.Error("Capabilities should not be empty")
	}

	// Check capabilities
	expectedCapabilities := []string{"user_job_prediction", "top_n_recommendations", "online_learning"}
	for _, capability := range expectedCapabilities {
		found := false
		for _, c := range info.Capabilities {
			if c == capability {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("Missing capability: %s", capability)
		}
	}

	// Check metadata
	if info.Metadata == nil {
		t.Error("Metadata should not be nil")
	}

	if embDim, exists := info.Metadata["embedding_dim"]; !exists || embDim != 16 {
		t.Errorf("Expected embedding_dim 16 in metadata, got %v", embDim)
	}
}

func TestNCFService_TrainModel(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 8,
		HiddenLayers: []int{16, 8},
		TrainingConfig: models.TrainingConfig{
			MaxEpochs:        5,
			BatchSize:        2,
			ValidationSplit:  0.2,
			EarlyStopping:    false,
			LearningRate:     0.1,
			RegularizationL2: 0.01,
		},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Create training data
	trainingData := []*models.TrainingData{
		{UserID: "u1", JobID: "j1", Label: 1.0, Weight: 1.0},
		{UserID: "u1", JobID: "j2", Label: 0.0, Weight: 1.0},
		{UserID: "u2", JobID: "j1", Label: 0.0, Weight: 1.0},
		{UserID: "u2", JobID: "j2", Label: 1.0, Weight: 1.0},
		{UserID: "u3", JobID: "j1", Label: 1.0, Weight: 1.0},
	}

	// Test training
	err := service.TrainModel(ctx, trainingData, config)
	if err != nil {
		t.Fatalf("Training failed: %v", err)
	}

	// Check that embeddings were created
	if len(service.userEmbeddings) == 0 {
		t.Error("No user embeddings created")
	}

	if len(service.jobEmbeddings) == 0 {
		t.Error("No job embeddings created")
	}

	// Check that last training time was updated
	if service.lastTrainingTime.IsZero() {
		t.Error("Last training time not set")
	}

	// Check that embeddings have correct dimensions
	for userID, embedding := range service.userEmbeddings {
		if len(embedding) != config.EmbeddingDim {
			t.Errorf("User %s embedding has wrong dimension: expected %d, got %d",
				userID, config.EmbeddingDim, len(embedding))
		}
	}
}

func BenchmarkNCFService_PredictUserJobInteraction(b *testing.B) {
	config := &models.NCFConfig{
		EmbeddingDim: 64,
		HiddenLayers: []int{128, 64},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Initialize some embeddings for benchmarking
	service.userEmbeddings["user1"] = make([]float64, config.EmbeddingDim)
	service.jobEmbeddings["job1"] = make([]float64, config.EmbeddingDim)

	for i := 0; i < config.EmbeddingDim; i++ {
		service.userEmbeddings["user1"][i] = 0.5
		service.jobEmbeddings["job1"][i] = 0.5
	}

	b.ResetTimer()
	
	for i := 0; i < b.N; i++ {
		_, err := service.PredictUserJobInteraction(ctx, "user1", "job1")
		if err != nil {
			b.Fatalf("Prediction failed: %v", err)
		}
	}
}

func BenchmarkNCFService_GetTopRecommendations(b *testing.B) {
	config := &models.NCFConfig{
		EmbeddingDim: 32,
		HiddenLayers: []int{64, 32},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Create candidate jobs
	candidateJobs := make([]string, 100)
	for i := 0; i < 100; i++ {
		jobID := fmt.Sprintf("job_%d", i)
		candidateJobs[i] = jobID
		service.jobEmbeddings[jobID] = make([]float64, config.EmbeddingDim)
	}

	// Initialize user embedding
	service.userEmbeddings["user1"] = make([]float64, config.EmbeddingDim)

	b.ResetTimer()
	
	for i := 0; i < b.N; i++ {
		_, err := service.GetTopRecommendations(ctx, "user1", candidateJobs, 10)
		if err != nil {
			b.Fatalf("GetTopRecommendations failed: %v", err)
		}
	}
}

func TestNCFService_VectorOperations(t *testing.T) {
	service := NewNCFService(&models.NCFConfig{EmbeddingDim: 4})

	// Test vector norm calculation
	vec := []float64{3.0, 4.0, 0.0, 0.0}
	norm := service.vectorNorm(vec)
	expectedNorm := 5.0 // sqrt(3^2 + 4^2)
	
	if norm != expectedNorm {
		t.Errorf("Vector norm calculation incorrect: expected %f, got %f", expectedNorm, norm)
	}

	// Test GMF computation
	userEmb := []float64{1.0, 2.0, 3.0, 4.0}
	jobEmb := []float64{2.0, 1.0, 0.5, 0.25}
	
	gmfScore := service.computeGMF(userEmb, jobEmb)
	expectedScore := 1.0*2.0 + 2.0*1.0 + 3.0*0.5 + 4.0*0.25 // 2 + 2 + 1.5 + 1 = 6.5
	
	if gmfScore != expectedScore {
		t.Errorf("GMF score calculation incorrect: expected %f, got %f", expectedScore, gmfScore)
	}
}

// Integration test with multiple components
func TestNCFService_Integration(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 16,
		HiddenLayers: []int{32, 16},
		TrainingConfig: models.TrainingConfig{
			MaxEpochs:        3,
			BatchSize:        4,
			ValidationSplit:  0.2,
			LearningRate:     0.05,
			RegularizationL2: 0.001,
		},
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	// Create comprehensive training data
	trainingData := []*models.TrainingData{
		{UserID: "developer_1", JobID: "frontend_job", Label: 1.0},
		{UserID: "developer_1", JobID: "backend_job", Label: 0.3},
		{UserID: "developer_2", JobID: "frontend_job", Label: 0.2},
		{UserID: "developer_2", JobID: "backend_job", Label: 1.0},
		{UserID: "designer_1", JobID: "frontend_job", Label: 0.8},
		{UserID: "designer_1", JobID: "backend_job", Label: 0.1},
	}

	// Train the model
	err := service.TrainModel(ctx, trainingData, config)
	if err != nil {
		t.Fatalf("Integration test training failed: %v", err)
	}

	// Test predictions make sense
	frontendScore, err := service.PredictUserJobInteraction(ctx, "developer_1", "frontend_job")
	if err != nil {
		t.Fatalf("Integration test prediction failed: %v", err)
	}

	backendScore, err := service.PredictUserJobInteraction(ctx, "developer_1", "backend_job")
	if err != nil {
		t.Fatalf("Integration test prediction failed: %v", err)
	}

	// Developer_1 should prefer frontend over backend based on training data
	if frontendScore <= backendScore {
		t.Errorf("Integration test: Expected frontend score (%f) > backend score (%f) for developer_1",
			frontendScore, backendScore)
	}

	// Test recommendations
	candidates := []string{"frontend_job", "backend_job", "data_job"}
	recommendations, err := service.GetTopRecommendations(ctx, "developer_1", candidates, 3)
	if err != nil {
		t.Fatalf("Integration test recommendations failed: %v", err)
	}

	if len(recommendations) != 3 {
		t.Errorf("Integration test: Expected 3 recommendations, got %d", len(recommendations))
	}

	// Test online learning
	err = service.UpdateEmbeddings(ctx, "developer_1", "frontend_job", 1.0)
	if err != nil {
		t.Fatalf("Integration test online learning failed: %v", err)
	}

	// Get model info
	info := service.GetModelInfo()
	if info.Parameters == 0 {
		t.Error("Integration test: Model should have parameters > 0")
	}
}

// Test edge cases and error handling
func TestNCFService_EdgeCases(t *testing.T) {
	config := &models.NCFConfig{
		EmbeddingDim: 8,
	}
	
	service := NewNCFService(config)
	ctx := context.Background()

	t.Run("EmptyTrainingData", func(t *testing.T) {
		err := service.TrainModel(ctx, []*models.TrainingData{}, config)
		// Should handle empty data gracefully
		if err != nil {
			t.Errorf("Should handle empty training data gracefully, got error: %v", err)
		}
	})

	t.Run("InvalidEmbeddingDimension", func(t *testing.T) {
		invalidConfig := &models.NCFConfig{
			EmbeddingDim: 0, // Invalid
		}
		invalidService := NewNCFService(invalidConfig)
		
		// Should create service but may have limited functionality
		if invalidService == nil {
			t.Error("Should create service even with invalid config")
		}
	})

	t.Run("VeryLargeScore", func(t *testing.T) {
		// Test sigmoid function with very large input
		largeValue := utils.Sigmoid(1000.0)
		if largeValue != 1.0 {
			t.Errorf("Sigmoid of large value should be close to 1.0, got %f", largeValue)
		}

		smallValue := utils.Sigmoid(-1000.0)
		if smallValue > 0.001 {
			t.Errorf("Sigmoid of very negative value should be close to 0.0, got %f", smallValue)
		}
	})
}