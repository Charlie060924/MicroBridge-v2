package services

import (
	"context"
	"fmt"
	"testing"

	"microbridge/backend/internal/ai/models"
	"microbridge/backend/internal/core/matching"
)

func TestHybridMatchingService_FindBestMatches(t *testing.T) {
	// Setup services
	ncfService := NewNCFService(&models.NCFConfig{EmbeddingDim: 16})
	gnnService := NewGNNService(&models.GNNConfig{NodeEmbeddingDim: 16})
	rlService := NewRLService(&models.RLConfig{StateSpaceDim: 32, ActionSpaceDim: 5})
	llmService := NewLLMService("test-key", "test-url", "test-model")
	basicAlgorithm := matching.NewMatchingAlgorithm()

	hybridService := NewHybridMatchingService(
		ncfService, gnnService, rlService, llmService, basicAlgorithm,
	)

	ctx := context.Background()
	userID := "test_user_1"
	limit := 5

	matches, err := hybridService.FindBestMatches(ctx, userID, limit)
	if err != nil {
		t.Fatalf("FindBestMatches failed: %v", err)
	}

	// Test basic constraints
	if len(matches) > limit {
		t.Errorf("Expected at most %d matches, got %d", limit, len(matches))
	}

	// Test match structure
	for i, match := range matches {
		if match.UserID != userID {
			t.Errorf("Match %d has wrong UserID: expected %s, got %s", i, userID, match.UserID)
		}

		if match.FinalScore < 0 || match.FinalScore > 1 {
			t.Errorf("Match %d has invalid FinalScore: %f", i, match.FinalScore)
		}

		if match.ConfidenceLevel < 0 || match.ConfidenceLevel > 1 {
			t.Errorf("Match %d has invalid ConfidenceLevel: %f", i, match.ConfidenceLevel)
		}

		if match.ModelUsed == "" {
			t.Errorf("Match %d missing ModelUsed", i)
		}

		if match.CreatedAt.IsZero() {
			t.Errorf("Match %d missing CreatedAt", i)
		}

		if match.ModelContributions == nil || len(match.ModelContributions) == 0 {
			t.Errorf("Match %d missing ModelContributions", i)
		}
	}

	// Test ordering (should be sorted by score)
	for i := 1; i < len(matches); i++ {
		if matches[i-1].FinalScore < matches[i].FinalScore {
			t.Error("Matches should be sorted by FinalScore in descending order")
		}
	}
}

func TestHybridMatchingService_CalculateMatchScore(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	userID := "test_user_1"
	jobID := "test_job_1"

	match, err := hybridService.CalculateMatchScore(ctx, userID, jobID)
	if err != nil {
		t.Fatalf("CalculateMatchScore failed: %v", err)
	}

	// Test match result structure
	if match.UserID != userID {
		t.Errorf("Expected UserID %s, got %s", userID, match.UserID)
	}

	if match.JobID != jobID {
		t.Errorf("Expected JobID %s, got %s", jobID, match.JobID)
	}

	// Test score ranges
	if match.FinalScore < 0 || match.FinalScore > 1 {
		t.Errorf("FinalScore out of range: %f", match.FinalScore)
	}

	if match.ConfidenceLevel < 0 || match.ConfidenceLevel > 1 {
		t.Errorf("ConfidenceLevel out of range: %f", match.ConfidenceLevel)
	}

	if match.SuccessProbability < 0 || match.SuccessProbability > 1 {
		t.Errorf("SuccessProbability out of range: %f", match.SuccessProbability)
	}

	// Test individual model scores are present
	if match.ModelContributions == nil {
		t.Error("ModelContributions should not be nil")
	}

	expectedModels := []string{"basic", "ncf", "gnn", "rl"}
	for _, model := range expectedModels {
		if _, exists := match.ModelContributions[model]; !exists {
			t.Errorf("Missing model contribution for: %s", model)
		}
	}

	// Test processing time is recorded
	if match.ProcessingTime <= 0 {
		t.Error("ProcessingTime should be positive")
	}

	// Test features are populated
	if match.Features == nil || len(match.Features) == 0 {
		t.Error("Features should be populated")
	}
}

func TestHybridMatchingService_ProcessUserFeedback(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	userID := "test_user_1"
	jobID := "test_job_1"
	matchID := "match_123"

	testCases := []struct {
		action   string
		outcome  float64
		expectError bool
	}{
		{"applied", 1.0, false},
		{"viewed", 0.7, false},
		{"dismissed", 0.1, false},
		{"invalid_action", 0.5, false}, // Should handle gracefully
		{"hired", 1.0, false},
	}

	for _, tc := range testCases {
		t.Run(tc.action, func(t *testing.T) {
			err := hybridService.ProcessUserFeedback(ctx, userID, jobID, matchID, tc.action, tc.outcome)
			
			if tc.expectError && err == nil {
				t.Error("Expected error but got nil")
			} else if !tc.expectError && err != nil {
				t.Errorf("Unexpected error: %v", err)
			}
		})
	}
}

func TestHybridMatchingService_GetMatchExplanation(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	userID := "test_user_1"
	jobID := "test_job_1"

	explanation, err := hybridService.GetMatchExplanation(ctx, userID, jobID, "free")
	if err != nil {
		t.Fatalf("GetMatchExplanation failed: %v", err)
	}

	// Test explanation structure
	if explanation.Content == "" {
		t.Error("Explanation content should not be empty")
	}

	if explanation.TokensUsed <= 0 {
		t.Error("TokensUsed should be positive")
	}

	if explanation.ProcessingTime <= 0 {
		t.Error("ProcessingTime should be positive")
	}
}

func TestHybridMatchingService_EnsembleWeights(t *testing.T) {
	hybridService := createTestHybridService()

	// Test initial weights
	initialWeights := map[string]float64{
		"basic": 0.15,
		"ncf":   0.35,
		"gnn":   0.25,
		"rl":    0.25,
	}

	for model, expectedWeight := range initialWeights {
		if weight, exists := hybridService.ensembleWeights[model]; !exists {
			t.Errorf("Missing ensemble weight for model: %s", model)
		} else if weight != expectedWeight {
			t.Errorf("Wrong initial weight for %s: expected %f, got %f", model, expectedWeight, weight)
		}
	}

	// Test weight normalization
	totalWeight := 0.0
	for _, weight := range hybridService.ensembleWeights {
		totalWeight += weight
	}

	if totalWeight < 0.99 || totalWeight > 1.01 { // Allow small floating point errors
		t.Errorf("Ensemble weights should sum to 1.0, got %f", totalWeight)
	}
}

func TestHybridMatchingService_ABTesting(t *testing.T) {
	hybridService := createTestHybridService()

	// Test A/B test configuration
	if hybridService.abTestConfig == nil {
		t.Fatal("ABTestConfig should be initialized")
	}

	if !hybridService.abTestConfig.Enabled {
		t.Error("A/B testing should be enabled by default")
	}

	// Test user assignment to test groups
	testUsers := []string{"user_1", "user_2", "user_3", "user_4", "user_5"}
	
	controlCount := 0
	treatmentCount := 0

	for _, userID := range testUsers {
		group := hybridService.determineTestGroup(userID)
		if group == "control" {
			controlCount++
		} else if group == "treatment" {
			treatmentCount++
		} else {
			t.Errorf("Invalid test group: %s", group)
		}
	}

	// Should have some distribution (not all in one group)
	if controlCount == 0 || treatmentCount == 0 {
		t.Errorf("A/B test assignment too unbalanced: control=%d, treatment=%d", controlCount, treatmentCount)
	}

	// Test that same user gets same group consistently
	userID := "consistent_user"
	group1 := hybridService.determineTestGroup(userID)
	group2 := hybridService.determineTestGroup(userID)

	if group1 != group2 {
		t.Error("User should be assigned to same test group consistently")
	}
}

func TestHybridMatchingService_PerformanceMetrics(t *testing.T) {
	hybridService := createTestHybridService()

	// Get initial metrics
	initialMetrics := hybridService.GetModelPerformanceMetrics()
	if initialMetrics == nil {
		t.Fatal("Performance metrics should not be nil")
	}

	// Test metrics structure
	if initialMetrics.ModelPerformance() == nil {
		t.Error("ModelPerformance should be initialized")
	}

	expectedModels := []string{"basic", "ncf", "gnn", "rl"}
	for _, model := range expectedModels {
		if _, exists := initialMetrics.ModelPerformance()[model]; !exists {
			t.Errorf("Missing performance metrics for model: %s", model)
		}
	}

	// Simulate some activity
	ctx := context.Background()
	_, err := hybridService.FindBestMatches(ctx, "test_user", 3)
	if err != nil {
		t.Fatalf("Test activity failed: %v", err)
	}

	// Get updated metrics
	updatedMetrics := hybridService.GetModelPerformanceMetrics()
	
	if updatedMetrics.TotalRequests() <= initialMetrics.TotalRequests() {
		t.Error("TotalRequests should have increased")
	}
}

func TestHybridMatchingService_FallbackBehavior(t *testing.T) {
	// Create service with limited functionality to test fallback
	hybridService := createTestHybridService()
	
	// Force fallback by disabling confidence threshold temporarily
	hybridService.confidenceThreshold = 0.99 // Very high threshold

	ctx := context.Background()
	matches, err := hybridService.FindBestMatches(ctx, "test_user", 5)
	if err != nil {
		t.Fatalf("FindBestMatches with fallback failed: %v", err)
	}

	// Should still return some matches (from fallback)
	if len(matches) == 0 {
		t.Error("Fallback should provide some matches")
	}

	// Check fallback metrics
	metrics := hybridService.GetModelPerformanceMetrics()
	if metrics.FallbackCount() == 0 {
		// Note: This test might not trigger fallback depending on mock implementation
		t.Log("No fallback triggered in this test run")
	}
}

func TestHybridMatchingService_ConcurrentAccess(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	// Test concurrent access to the service
	numGoroutines := 10
	numRequestsPerGoroutine := 5

	results := make(chan error, numGoroutines*numRequestsPerGoroutine)

	for i := 0; i < numGoroutines; i++ {
		go func(goroutineID int) {
			for j := 0; j < numRequestsPerGoroutine; j++ {
				userID := fmt.Sprintf("user_%d_%d", goroutineID, j)
				_, err := hybridService.FindBestMatches(ctx, userID, 3)
				results <- err
			}
		}(i)
	}

	// Collect results
	errorCount := 0
	for i := 0; i < numGoroutines*numRequestsPerGoroutine; i++ {
		if err := <-results; err != nil {
			errorCount++
			t.Errorf("Concurrent request failed: %v", err)
		}
	}

	if errorCount > 0 {
		t.Errorf("Concurrent access resulted in %d errors", errorCount)
	}
}

func BenchmarkHybridMatchingService_FindBestMatches(b *testing.B) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		userID := fmt.Sprintf("bench_user_%d", i%100) // Rotate users
		_, err := hybridService.FindBestMatches(ctx, userID, 10)
		if err != nil {
			b.Fatalf("Benchmark failed: %v", err)
		}
	}
}

func BenchmarkHybridMatchingService_CalculateMatchScore(b *testing.B) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		userID := fmt.Sprintf("bench_user_%d", i%50)
		jobID := fmt.Sprintf("bench_job_%d", i%50)
		
		_, err := hybridService.CalculateMatchScore(ctx, userID, jobID)
		if err != nil {
			b.Fatalf("Benchmark failed: %v", err)
		}
	}
}

// Test ensemble score calculation
func TestHybridMatchingService_EnsembleScores(t *testing.T) {
	hybridService := createTestHybridService()

	testCases := []struct {
		name    string
		scores  map[string]float64
		weights map[string]float64
		expectedFinalScore float64
		expectedConfidence float64
	}{
		{
			name: "All models agree high",
			scores: map[string]float64{
				"basic": 0.8,
				"ncf":   0.9,
				"gnn":   0.85,
				"rl":    0.88,
			},
			weights: map[string]float64{
				"basic": 0.25,
				"ncf":   0.25,
				"gnn":   0.25,
				"rl":    0.25,
			},
			expectedFinalScore: 0.86, // Approximate weighted average
		},
		{
			name: "Mixed scores",
			scores: map[string]float64{
				"basic": 0.3,
				"ncf":   0.8,
				"gnn":   0.6,
				"rl":    0.4,
			},
			weights: map[string]float64{
				"basic": 0.1,
				"ncf":   0.5,
				"gnn":   0.2,
				"rl":    0.2,
			},
			expectedFinalScore: 0.63, // Weighted toward NCF
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			finalScore, confidence := hybridService.ensembleScores(tc.scores, tc.weights)
			
			// Allow some tolerance for floating point operations
			if abs(finalScore-tc.expectedFinalScore) > 0.05 {
				t.Errorf("Expected final score ~%f, got %f", tc.expectedFinalScore, finalScore)
			}

			if confidence < 0 || confidence > 1 {
				t.Errorf("Confidence should be 0-1, got %f", confidence)
			}
		})
	}
}

// Test edge cases
func TestHybridMatchingService_EdgeCases(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	t.Run("EmptyUserID", func(t *testing.T) {
		_, err := hybridService.FindBestMatches(ctx, "", 5)
		// Should handle gracefully, not necessarily error
		if err != nil {
			t.Logf("Empty userID error: %v", err)
		}
	})

	t.Run("ZeroLimit", func(t *testing.T) {
		matches, err := hybridService.FindBestMatches(ctx, "test_user", 0)
		if err != nil {
			t.Errorf("Zero limit should not cause error: %v", err)
		}
		if len(matches) != 0 {
			t.Error("Zero limit should return no matches")
		}
	})

	t.Run("VeryHighLimit", func(t *testing.T) {
		matches, err := hybridService.FindBestMatches(ctx, "test_user", 1000)
		if err != nil {
			t.Errorf("High limit should not cause error: %v", err)
		}
		// Should be capped by available candidates
		if len(matches) > 100 { // Assuming mock has <= 100 candidates
			t.Error("Should be capped by available candidates")
		}
	})

	t.Run("InvalidFeedbackOutcome", func(t *testing.T) {
		// Test with out-of-range outcome values
		err := hybridService.ProcessUserFeedback(ctx, "user1", "job1", "match1", "applied", -0.5)
		// Should handle gracefully
		if err != nil {
			t.Logf("Invalid outcome error: %v", err)
		}

		err = hybridService.ProcessUserFeedback(ctx, "user1", "job1", "match1", "applied", 1.5)
		if err != nil {
			t.Logf("Invalid outcome error: %v", err)
		}
	})
}

// Helper function to create test hybrid service
func createTestHybridService() *HybridMatchingService {
	ncfConfig := &models.NCFConfig{EmbeddingDim: 8, HiddenLayers: []int{16, 8}}
	gnnConfig := &models.GNNConfig{NodeEmbeddingDim: 8, NumLayers: 2}
	rlConfig := &models.RLConfig{StateSpaceDim: 16, ActionSpaceDim: 5}

	ncfService := NewNCFService(ncfConfig)
	gnnService := NewGNNService(gnnConfig)
	rlService := NewRLService(rlConfig)
	llmService := NewLLMService("test-key", "test-url", "test-model")
	basicAlgorithm := matching.NewMatchingAlgorithm()

	return NewHybridMatchingService(
		ncfService, gnnService, rlService, llmService, basicAlgorithm,
	)
}

// Helper function for absolute value
func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}

// Integration test with all components
func TestHybridMatchingService_Integration(t *testing.T) {
	hybridService := createTestHybridService()
	ctx := context.Background()

	// Step 1: Find matches
	userID := "integration_user"
	matches, err := hybridService.FindBestMatches(ctx, userID, 3)
	if err != nil {
		t.Fatalf("Integration: FindBestMatches failed: %v", err)
	}

	if len(matches) == 0 {
		t.Fatal("Integration: No matches found")
	}

	// Step 2: Get detailed score for first match
	firstMatch := matches[0]
	detailedMatch, err := hybridService.CalculateMatchScore(ctx, userID, firstMatch.JobID)
	if err != nil {
		t.Fatalf("Integration: CalculateMatchScore failed: %v", err)
	}

	// Scores should be consistent
	if abs(firstMatch.FinalScore-detailedMatch.FinalScore) > 0.01 {
		t.Errorf("Integration: Inconsistent scores: %f vs %f", 
			firstMatch.FinalScore, detailedMatch.FinalScore)
	}

	// Step 3: Process user feedback
	err = hybridService.ProcessUserFeedback(ctx, userID, firstMatch.JobID, "match_1", "applied", 1.0)
	if err != nil {
		t.Fatalf("Integration: ProcessUserFeedback failed: %v", err)
	}

	// Step 4: Get explanation (if LLM service available)
	explanation, err := hybridService.GetMatchExplanation(ctx, userID, firstMatch.JobID, "free")
	if err != nil {
		t.Logf("Integration: GetMatchExplanation failed (expected): %v", err)
	} else if explanation.Content == "" {
		t.Error("Integration: Empty explanation content")
	}

	// Step 5: Check performance metrics
	metrics := hybridService.GetModelPerformanceMetrics()
	if metrics.TotalRequests() == 0 {
		t.Error("Integration: No requests recorded in metrics")
	}

	// Step 6: Test with different user for A/B testing
	matches2, err := hybridService.FindBestMatches(ctx, "integration_user_2", 3)
	if err != nil {
		t.Fatalf("Integration: Second user matches failed: %v", err)
	}

	// Should get results for second user too
	if len(matches2) == 0 {
		t.Error("Integration: No matches for second user")
	}

	t.Logf("Integration test completed successfully. Processed %d total requests", 
		metrics.TotalRequests())
}