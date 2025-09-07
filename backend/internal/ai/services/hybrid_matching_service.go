package services

import (
	"context"
	"fmt"
	"math"
	"sync"
	"time"

	"microbridge/backend/internal/core/matching"
	coreModels "microbridge/backend/internal/models"
)

// HybridMatchingService combines NCF, GNN, and RL for superior matching
type HybridMatchingService struct {
	mu                      sync.RWMutex
	ncfService             *NCFService
	gnnService             *GNNService
	rlService              *RLService
	llmService             *LLMService
	basicAlgorithm         *matching.MatchingAlgorithm
	ensembleWeights        map[string]float64
	fallbackEnabled        bool
	confidenceThreshold    float64
	abTestConfig           *ABTestConfig
	performanceTracker     *HybridPerformanceTracker
	lastModelUpdate        time.Time
	modelVersion           string
}

// HybridMatchResult represents a comprehensive match result
type HybridMatchResult struct {
	UserID               string                         `json:"user_id"`
	JobID                string                         `json:"job_id"`
	FinalScore           float64                        `json:"final_score"`
	ConfidenceLevel      float64                        `json:"confidence_level"`
	SuccessProbability   float64                        `json:"success_probability"`
	ModelContributions   map[string]float64             `json:"model_contributions"`
	BasicAlgorithmScore  *matching.MatchScore           `json:"basic_algorithm_score"`
	NCFScore             float64                        `json:"ncf_score"`
	GNNSkillAlignment    float64                        `json:"gnn_skill_alignment"`
	RLRecommendationScore float64                       `json:"rl_recommendation_score"`
	Explanation          string                         `json:"explanation,omitempty"`
	SkillGapAnalysis     *LLMResponse                   `json:"skill_gap_analysis,omitempty"`
	ModelUsed            string                         `json:"model_used"`
	ProcessingTime       time.Duration                  `json:"processing_time"`
	Features             map[string]interface{}         `json:"features"`
	CreatedAt            time.Time                      `json:"created_at"`
}

// ABTestConfig represents A/B testing configuration
type ABTestConfig struct {
	Enabled         bool                   `json:"enabled"`
	TestGroups      map[string]TestGroup   `json:"test_groups"`
	TrafficSplit    map[string]float64     `json:"traffic_split"`
	CurrentTest     string                 `json:"current_test"`
	TestStartDate   time.Time              `json:"test_start_date"`
	TestDuration    time.Duration          `json:"test_duration"`
}

// TestGroup represents an A/B test group configuration
type TestGroup struct {
	Name            string             `json:"name"`
	EnsembleWeights map[string]float64 `json:"ensemble_weights"`
	Description     string             `json:"description"`
}

// HybridPerformanceTracker tracks performance across all models
type HybridPerformanceTracker struct {
	mu                    sync.RWMutex
	totalRequests         int64                          `json:"total_requests"`
	successfulMatches     int64                          `json:"successful_matches"`
	modelPerformance      map[string]*ModelPerformance   `json:"model_performance"`
	averageProcessingTime time.Duration                  `json:"average_processing_time"`
	confidenceDistribution map[string]int                `json:"confidence_distribution"`
	fallbackCount         int64                          `json:"fallback_count"`
	lastUpdated           time.Time                      `json:"last_updated"`
}

// ModelPerformance tracks individual model performance
type ModelPerformance struct {
	TotalPredictions   int64         `json:"total_predictions"`
	AverageScore       float64       `json:"average_score"`
	AverageConfidence  float64       `json:"average_confidence"`
	ProcessingTime     time.Duration `json:"processing_time"`
	ErrorCount         int64         `json:"error_count"`
	ContributionWeight float64       `json:"contribution_weight"`
}

// Getter methods for HybridPerformanceTracker
func (h *HybridPerformanceTracker) ModelPerformance() map[string]*ModelPerformance {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.modelPerformance
}

func (h *HybridPerformanceTracker) TotalRequests() int64 {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.totalRequests
}

func (h *HybridPerformanceTracker) FallbackCount() int64 {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.fallbackCount
}

// NewHybridMatchingService creates a new hybrid matching service
func NewHybridMatchingService(
	ncfService *NCFService,
	gnnService *GNNService,
	rlService *RLService,
	llmService *LLMService,
	basicAlgorithm *matching.MatchingAlgorithm,
) *HybridMatchingService {

	service := &HybridMatchingService{
		ncfService:      ncfService,
		gnnService:      gnnService,
		rlService:       rlService,
		llmService:      llmService,
		basicAlgorithm:  basicAlgorithm,
		ensembleWeights: map[string]float64{
			"basic": 0.15, // Reduced weight for basic algorithm
			"ncf":   0.35, // High weight for collaborative filtering
			"gnn":   0.25, // Moderate weight for skill relationships
			"rl":    0.25, // Moderate weight for learned preferences
		},
		fallbackEnabled:     true,
		confidenceThreshold: 0.3,
		performanceTracker: &HybridPerformanceTracker{
			modelPerformance:       make(map[string]*ModelPerformance),
			confidenceDistribution: make(map[string]int),
		},
		modelVersion: fmt.Sprintf("hybrid_v%d", time.Now().Unix()),
	}

	service.initializeABTesting()
	service.initializePerformanceTracking()

	return service
}

// FindBestMatches returns the top matching jobs for a user using hybrid AI approach
func (s *HybridMatchingService) FindBestMatches(ctx context.Context, userID string, limit int) ([]*HybridMatchResult, error) {
	startTime := time.Now()
	defer func() {
		s.updateProcessingTime(time.Since(startTime))
	}()

	s.mu.RLock()
	defer s.mu.RUnlock()

	// Get candidate jobs (this would come from your job repository)
	candidateJobs, err := s.getCandidateJobs(ctx, userID, limit*3) // Get more candidates for better filtering
	if err != nil {
		return nil, fmt.Errorf("failed to get candidate jobs: %w", err)
	}

	var matches []*HybridMatchResult
	user, _ := s.getMockUserAndJobData(userID) // Mock data - replace with real data

	// Process each candidate job
	for _, candidateJob := range candidateJobs {
		match, err := s.calculateHybridMatch(ctx, user, candidateJob)
		if err != nil {
			continue // Skip failed matches
		}

		// Filter by confidence threshold
		if match.ConfidenceLevel >= s.confidenceThreshold {
			matches = append(matches, match)
		}
	}

	// Sort by final score (descending)
	s.sortMatchesByScore(matches)

	// Limit results
	if len(matches) > limit {
		matches = matches[:limit]
	}

	// Update performance metrics
	s.updatePerformanceMetrics(int64(len(matches)))

	return matches, nil
}

// CalculateMatchScore calculates a comprehensive match score using all AI models
func (s *HybridMatchingService) CalculateMatchScore(ctx context.Context, userID, jobID string) (*HybridMatchResult, error) {
	startTime := time.Now()

	user, job := s.getMockUserAndJobData(userID) // Mock data - replace with real data
	job.ID = jobID

	match, err := s.calculateHybridMatch(ctx, user, job)
	if err != nil {
		return nil, fmt.Errorf("hybrid match calculation failed: %w", err)
	}

	match.ProcessingTime = time.Since(startTime)
	return match, nil
}

// ProcessUserFeedback processes user feedback to improve future recommendations
func (s *HybridMatchingService) ProcessUserFeedback(ctx context.Context, userID, jobID, matchID, action string, outcome float64) error {
	// Update RL service with feedback
	if s.rlService != nil {
		err := s.rlService.ProcessUserFeedback(ctx, userID, jobID, matchID, action, outcome)
		if err != nil {
			return fmt.Errorf("RL feedback processing failed: %w", err)
		}
	}

	// Update NCF service with interaction data
	if s.ncfService != nil {
		err := s.ncfService.UpdateEmbeddings(ctx, userID, jobID, outcome)
		if err != nil {
			return fmt.Errorf("NCF update failed: %w", err)
		}
	}

	// Update ensemble weights based on feedback (adaptive learning)
	s.updateEnsembleWeights(action, outcome)

	return nil
}

// GetMatchExplanation generates an explanation for why a match was recommended
func (s *HybridMatchingService) GetMatchExplanation(ctx context.Context, userID, jobID string, tierLevel string) (*LLMResponse, error) {
	if s.llmService == nil {
		return nil, fmt.Errorf("LLM service not available")
	}

	// Get the match details
	match, err := s.CalculateMatchScore(ctx, userID, jobID)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate match: %w", err)
	}

	user, job := s.getMockUserAndJobData(userID)
	job.ID = jobID

	// Generate explanation using LLM service
	explanation, err := s.llmService.ExplainMatch(ctx, userID, match.BasicAlgorithmScore, user, job)
	if err != nil {
		return nil, fmt.Errorf("LLM explanation failed: %w", err)
	}

	return explanation, nil
}

// GetSkillGapAnalysis provides skill gap analysis for pro-tier users
func (s *HybridMatchingService) GetSkillGapAnalysis(ctx context.Context, userID, jobID string) (*LLMResponse, error) {
	if s.llmService == nil {
		return nil, fmt.Errorf("LLM service not available")
	}

	user, job := s.getMockUserAndJobData(userID)
	job.ID = jobID

	// Generate skill gap analysis using LLM service
	analysis, err := s.llmService.AnalyzeSkillGaps(ctx, userID, user, job)
	if err != nil {
		return nil, fmt.Errorf("skill gap analysis failed: %w", err)
	}

	return analysis, nil
}

// GetCareerAdvice provides personalized career advice for pro-tier users
func (s *HybridMatchingService) GetCareerAdvice(ctx context.Context, userID, careerGoals string) (*LLMResponse, error) {
	if s.llmService == nil {
		return nil, fmt.Errorf("LLM service not available")
	}

	user, _ := s.getMockUserAndJobData(userID)

	// Generate career advice using LLM service
	advice, err := s.llmService.GenerateCareerAdvice(ctx, userID, user, careerGoals)
	if err != nil {
		return nil, fmt.Errorf("career advice generation failed: %w", err)
	}

	return advice, nil
}

// GetModelPerformanceMetrics returns comprehensive performance metrics
func (s *HybridMatchingService) GetModelPerformanceMetrics() *HybridPerformanceTracker {
	s.performanceTracker.mu.RLock()
	defer s.performanceTracker.mu.RUnlock()

	// Create a copy to avoid concurrent access issues
	metrics := &HybridPerformanceTracker{
		totalRequests:         s.performanceTracker.totalRequests,
		successfulMatches:     s.performanceTracker.successfulMatches,
		averageProcessingTime: s.performanceTracker.averageProcessingTime,
		fallbackCount:         s.performanceTracker.fallbackCount,
		lastUpdated:           s.performanceTracker.lastUpdated,
		modelPerformance:      make(map[string]*ModelPerformance),
		confidenceDistribution: make(map[string]int),
	}

	// Deep copy model performance data
	for model, perf := range s.performanceTracker.modelPerformance {
		metrics.modelPerformance[model] = &ModelPerformance{
			TotalPredictions:   perf.TotalPredictions,
			AverageScore:       perf.AverageScore,
			AverageConfidence:  perf.AverageConfidence,
			ProcessingTime:     perf.ProcessingTime,
			ErrorCount:         perf.ErrorCount,
			ContributionWeight: perf.ContributionWeight,
		}
	}

	// Deep copy confidence distribution
	for key, value := range s.performanceTracker.confidenceDistribution {
		metrics.confidenceDistribution[key] = value
	}

	return metrics
}

// Private methods

func (s *HybridMatchingService) calculateHybridMatch(ctx context.Context, user *coreModels.User, job *coreModels.Job) (*HybridMatchResult, error) {
	startTime := time.Now()

	// Determine which test group user belongs to (A/B testing)
	weights := s.getWeightsForUser(user.ID)

	// 1. Calculate basic algorithm score
	var basicScore *matching.MatchScore
	if weights["basic"] > 0 {
		basicScore = s.basicAlgorithm.CalculateMatchScore(user, job)
	}

	// 2. Calculate NCF score
	var ncfScore float64
	var ncfError error
	if s.ncfService != nil && weights["ncf"] > 0 {
		ncfScore, ncfError = s.ncfService.PredictUserJobInteraction(ctx, user.ID, job.ID)
		if ncfError != nil {
			s.recordModelError("ncf")
		}
	}

	// 3. Calculate GNN skill alignment
	var gnnScore float64
	var gnnError error
	if s.gnnService != nil && weights["gnn"] > 0 {
		gnnScore, gnnError = s.calculateGNNSkillAlignment(ctx, user, job)
		if gnnError != nil {
			s.recordModelError("gnn")
		}
	}

	// 4. Calculate RL recommendation score
	var rlScore float64
	var rlError error
	if s.rlService != nil && weights["rl"] > 0 {
		rlScore, rlError = s.rlService.GetRecommendationScore(ctx, user.ID, job.ID)
		if rlError != nil {
			s.recordModelError("rl")
		}
	}

	// 5. Combine scores using ensemble weights
	finalScore, confidence := s.ensembleScores(map[string]float64{
		"basic": s.getBasicScore(basicScore),
		"ncf":   ncfScore,
		"gnn":   gnnScore,
		"rl":    rlScore,
	}, weights)

	// 6. Calculate success probability
	successProbability := s.calculateSuccessProbability(finalScore, confidence, basicScore)

	// 7. Determine which model was primarily used
	modelUsed := s.getPrimaryModel(weights)

	// 8. Create hybrid match result
	match := &HybridMatchResult{
		UserID:               user.ID,
		JobID:                job.ID,
		FinalScore:           finalScore,
		ConfidenceLevel:      confidence,
		SuccessProbability:   successProbability,
		BasicAlgorithmScore:  basicScore,
		NCFScore:             ncfScore,
		GNNSkillAlignment:    gnnScore,
		RLRecommendationScore: rlScore,
		ModelUsed:            modelUsed,
		ProcessingTime:       time.Since(startTime),
		CreatedAt:            time.Now(),
		ModelContributions: map[string]float64{
			"basic": weights["basic"],
			"ncf":   weights["ncf"],
			"gnn":   weights["gnn"],
			"rl":    weights["rl"],
		},
		Features: map[string]interface{}{
			"user_skills_count":    len(user.Skills),
			"job_skills_count":     len(job.Skills),
			"experience_match":     user.ExperienceLevel == job.ExperienceLevel,
			"location_match":       user.Location == job.Location || job.IsRemote,
			"basic_score_valid":    basicScore != nil,
			"ncf_error":            ncfError != nil,
			"gnn_error":            gnnError != nil,
			"rl_error":             rlError != nil,
		},
	}

	// Update individual model performance
	s.updateModelPerformance("basic", s.getBasicScore(basicScore), confidence)
	s.updateModelPerformance("ncf", ncfScore, confidence)
	s.updateModelPerformance("gnn", gnnScore, confidence)
	s.updateModelPerformance("rl", rlScore, confidence)

	return match, nil
}

func (s *HybridMatchingService) calculateGNNSkillAlignment(ctx context.Context, user *coreModels.User, job *coreModels.Job) (float64, error) {
	if len(user.Skills) == 0 || len(job.Skills) == 0 {
		return 0.0, nil
	}

	totalAlignment := 0.0
	alignmentCount := 0

	// Calculate skill-to-skill alignment using GNN
	for _, userSkill := range user.Skills {
		for _, jobSkill := range job.Skills {
			similarity, err := s.gnnService.GetSkillSimilarity(ctx, userSkill.Name, jobSkill.Name)
			if err != nil {
				continue // Skip failed similarity calculations
			}
			totalAlignment += similarity
			alignmentCount++
		}
	}

	if alignmentCount == 0 {
		return 0.0, nil
	}

	return totalAlignment / float64(alignmentCount), nil
}

func (s *HybridMatchingService) ensembleScores(scores map[string]float64, weights map[string]float64) (float64, float64) {
	weightedSum := 0.0
	totalWeight := 0.0
	confidenceSum := 0.0
	validScores := 0

	for model, score := range scores {
		weight := weights[model]
		if weight > 0 && !math.IsNaN(score) && score >= 0 {
			weightedSum += score * weight
			totalWeight += weight
			confidenceSum += s.getModelConfidence(model, score)
			validScores++
		}
	}

	if totalWeight == 0 {
		// Fallback to basic algorithm if available
		if s.fallbackEnabled && scores["basic"] > 0 {
			s.recordFallback()
			return scores["basic"], 0.3
		}
		return 0.0, 0.0
	}

	finalScore := weightedSum / totalWeight
	confidence := confidenceSum / float64(validScores)

	return finalScore, confidence
}

func (s *HybridMatchingService) getModelConfidence(model string, score float64) float64 {
	switch model {
	case "basic":
		return 0.7 // Basic algorithm has consistent confidence
	case "ncf":
		return math.Min(0.9, 0.5+score*0.4) // NCF confidence based on score
	case "gnn":
		return math.Min(0.8, 0.4+score*0.4) // GNN confidence based on score
	case "rl":
		return math.Min(0.95, 0.3+score*0.65) // RL has highest potential confidence
	default:
		return 0.5
	}
}

func (s *HybridMatchingService) calculateSuccessProbability(finalScore, confidence float64, basicScore *matching.MatchScore) float64 {
	// Combine final score with confidence to estimate success probability
	baseProbability := finalScore
	
	// Adjust based on confidence
	adjustedProbability := baseProbability * (0.5 + confidence*0.5)
	
	// Add boost for high-quality basic matches
	if basicScore != nil && basicScore.MatchQuality == "excellent" {
		adjustedProbability = math.Min(1.0, adjustedProbability*1.1)
	}
	
	return math.Max(0.0, math.Min(1.0, adjustedProbability))
}

func (s *HybridMatchingService) getBasicScore(basicScore *matching.MatchScore) float64 {
	if basicScore == nil {
		return 0.0
	}
	return basicScore.TotalScore
}

func (s *HybridMatchingService) getPrimaryModel(weights map[string]float64) string {
	maxWeight := 0.0
	primaryModel := "basic"
	
	for model, weight := range weights {
		if weight > maxWeight {
			maxWeight = weight
			primaryModel = model
		}
	}
	
	return primaryModel
}

func (s *HybridMatchingService) getWeightsForUser(userID string) map[string]float64 {
	// A/B testing logic
	if s.abTestConfig != nil && s.abTestConfig.Enabled {
		testGroup := s.determineTestGroup(userID)
		if group, exists := s.abTestConfig.TestGroups[testGroup]; exists {
			return group.EnsembleWeights
		}
	}
	
	return s.ensembleWeights
}

func (s *HybridMatchingService) determineTestGroup(userID string) string {
	// Simple hash-based assignment for consistent user experience
	hash := 0
	for _, char := range userID {
		hash = hash*31 + int(char)
	}
	
	if hash%100 < 50 { // 50% split
		return "control"
	}
	return "treatment"
}

func (s *HybridMatchingService) initializeABTesting() {
	s.abTestConfig = &ABTestConfig{
		Enabled: true,
		TestGroups: map[string]TestGroup{
			"control": {
				Name: "Control Group - Standard Weights",
				EnsembleWeights: map[string]float64{
					"basic": 0.15,
					"ncf":   0.35,
					"gnn":   0.25,
					"rl":    0.25,
				},
				Description: "Standard ensemble weights",
			},
			"treatment": {
				Name: "Treatment Group - RL Emphasized",
				EnsembleWeights: map[string]float64{
					"basic": 0.10,
					"ncf":   0.25,
					"gnn":   0.20,
					"rl":    0.45, // Increased RL weight
				},
				Description: "Increased RL weight for better personalization",
			},
		},
		TrafficSplit: map[string]float64{
			"control":   0.5,
			"treatment": 0.5,
		},
		CurrentTest:   "rl_weight_test",
		TestStartDate: time.Now(),
		TestDuration:  30 * 24 * time.Hour, // 30 days
	}
}

func (s *HybridMatchingService) initializePerformanceTracking() {
	models := []string{"basic", "ncf", "gnn", "rl"}
	for _, model := range models {
		s.performanceTracker.modelPerformance[model] = &ModelPerformance{
			TotalPredictions:   0,
			AverageScore:       0.0,
			AverageConfidence:  0.0,
			ProcessingTime:     0,
			ErrorCount:         0,
			ContributionWeight: s.ensembleWeights[model],
		}
	}
}

func (s *HybridMatchingService) updateModelPerformance(model string, score, confidence float64) {
	if perf, exists := s.performanceTracker.modelPerformance[model]; exists {
		perf.TotalPredictions++
		
		// Update running average
		if perf.TotalPredictions == 1 {
			perf.AverageScore = score
			perf.AverageConfidence = confidence
		} else {
			alpha := 0.1 // Learning rate for exponential moving average
			perf.AverageScore = alpha*score + (1-alpha)*perf.AverageScore
			perf.AverageConfidence = alpha*confidence + (1-alpha)*perf.AverageConfidence
		}
	}
}

func (s *HybridMatchingService) recordModelError(model string) {
	if perf, exists := s.performanceTracker.modelPerformance[model]; exists {
		perf.ErrorCount++
	}
}

func (s *HybridMatchingService) recordFallback() {
	s.performanceTracker.fallbackCount++
}

func (s *HybridMatchingService) updateProcessingTime(duration time.Duration) {
	s.performanceTracker.mu.Lock()
	defer s.performanceTracker.mu.Unlock()
	
	// Update exponential moving average
	alpha := 0.1
	if s.performanceTracker.totalRequests == 0 {
		s.performanceTracker.averageProcessingTime = duration
	} else {
		currentAvg := float64(s.performanceTracker.averageProcessingTime.Nanoseconds())
		newAvg := alpha*float64(duration.Nanoseconds()) + (1-alpha)*currentAvg
		s.performanceTracker.averageProcessingTime = time.Duration(int64(newAvg))
	}
}

func (s *HybridMatchingService) updatePerformanceMetrics(matchCount int64) {
	s.performanceTracker.mu.Lock()
	defer s.performanceTracker.mu.Unlock()
	
	s.performanceTracker.totalRequests++
	s.performanceTracker.successfulMatches += matchCount
	s.performanceTracker.lastUpdated = time.Now()
}

func (s *HybridMatchingService) updateEnsembleWeights(action string, outcome float64) {
	// Adaptive learning: adjust weights based on feedback
	learningRate := 0.01
	
	switch action {
	case "applied", "hired":
		if outcome > 0.7 { // Positive outcome
			// Increase RL weight slightly since it handles user feedback
			s.ensembleWeights["rl"] = math.Min(0.5, s.ensembleWeights["rl"]+learningRate)
			s.ensembleWeights["ncf"] = math.Max(0.1, s.ensembleWeights["ncf"]-learningRate*0.5)
		}
	case "dismissed", "not_interested":
		if outcome < 0.3 { // Negative outcome
			// Increase GNN weight for better skill alignment
			s.ensembleWeights["gnn"] = math.Min(0.4, s.ensembleWeights["gnn"]+learningRate)
			s.ensembleWeights["ncf"] = math.Max(0.1, s.ensembleWeights["ncf"]-learningRate*0.5)
		}
	}
	
	// Normalize weights to sum to 1.0
	s.normalizeEnsembleWeights()
}

func (s *HybridMatchingService) normalizeEnsembleWeights() {
	total := 0.0
	for _, weight := range s.ensembleWeights {
		total += weight
	}
	
	if total > 0 {
		for model := range s.ensembleWeights {
			s.ensembleWeights[model] /= total
		}
	}
}

func (s *HybridMatchingService) sortMatchesByScore(matches []*HybridMatchResult) {
	// Simple bubble sort by final score (descending)
	n := len(matches)
	for i := 0; i < n-1; i++ {
		for j := 0; j < n-i-1; j++ {
			if matches[j].FinalScore < matches[j+1].FinalScore {
				matches[j], matches[j+1] = matches[j+1], matches[j]
			}
		}
	}
}

func (s *HybridMatchingService) getCandidateJobs(ctx context.Context, userID string, limit int) ([]*coreModels.Job, error) {
	// Mock implementation - replace with actual job repository call
	jobs := []*coreModels.Job{}
	for i := 0; i < limit; i++ {
		job := &coreModels.Job{
			ID:              fmt.Sprintf("job_%d", i),
			Title:           fmt.Sprintf("Software Developer %d", i),
			Skills:          coreModels.RequiredSkillsArray{
				{Name: "JavaScript", Level: 3, IsRequired: true, Importance: 0.8},
				{Name: "React", Level: 3, IsRequired: true, Importance: 0.8},
				{Name: "Node.js", Level: 2, IsRequired: false, Importance: 0.6},
			},
			ExperienceLevel: "Intermediate",
			Location:        "Remote",
			IsRemote:        true,
			Category:        "Software Development",
			Duration:        40, // 40 weeks (full-time)
		}
		jobs = append(jobs, job)
	}
	return jobs, nil
}

func (s *HybridMatchingService) getMockUserAndJobData(userID string) (*coreModels.User, *coreModels.Job) {
	// Mock user data - replace with actual data fetching
	user := &coreModels.User{
		ID:              userID,
		Skills:          coreModels.SkillsArray{
			{Name: "JavaScript", Level: 4, Experience: "2-3 years", Verified: true},
			{Name: "Python", Level: 3, Experience: "1-2 years", Verified: false},
			{Name: "React", Level: 4, Experience: "2-3 years", Verified: true},
		},
		ExperienceLevel: "Intermediate",
		Location:        "San Francisco",
		Availability:    coreModels.Availability{
			HoursPerWeek: 40,
			IsFlexible:   true,
			Timezone:     "America/Los_Angeles",
		},
		Interests:       coreModels.StringArray{"web development", "machine learning"},
	}
	
	job := &coreModels.Job{
		ID:              "job_1",
		Title:           "Full Stack Developer",
		Skills:          coreModels.RequiredSkillsArray{
			{Name: "JavaScript", Level: 4, IsRequired: true, Importance: 0.9},
			{Name: "React", Level: 3, IsRequired: true, Importance: 0.8},
			{Name: "Node.js", Level: 3, IsRequired: true, Importance: 0.8},
			{Name: "Python", Level: 2, IsRequired: false, Importance: 0.6},
		},
		ExperienceLevel: "Intermediate",
		Location:        "Remote",
		IsRemote:        true,
		Category:        "Software Development",
		Duration:        48, // 48 weeks duration
	}
	
	return user, job
}