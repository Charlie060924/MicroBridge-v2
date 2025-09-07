package services

import (
	"context"
	"crypto/md5"
	"fmt"
	"strings"
	"sync"
	"time"

	"microbridge/backend/internal/core/matching"
	coreModels "microbridge/backend/internal/models"
)

// LLMService provides cost-optimized LLM explanations and career advice
type LLMService struct {
	mu                    sync.RWMutex
	apiKey                string
	baseURL               string
	model                 string
	cache                 *LLMCache
	costTracker           *CostTracker
	usageQuotas           map[string]*UserQuota
	templateCache         map[string]string
	responseCacheEnabled  bool
	maxCachedResponses    int
	defaultCacheTTL       time.Duration
}

// LLMCache manages cached LLM responses
type LLMCache struct {
	mu        sync.RWMutex
	responses map[string]*CachedResponse
	hitCount  int64
	missCount int64
}

// CachedResponse represents a cached LLM response
type CachedResponse struct {
	Content   string                 `json:"content"`
	TokensUsed int                   `json:"tokens_used"`
	Cost      float64                `json:"cost"`
	CreatedAt time.Time              `json:"created_at"`
	ExpiresAt time.Time              `json:"expires_at"`
	Metadata  map[string]interface{} `json:"metadata"`
}

// CostTracker tracks LLM usage costs
type CostTracker struct {
	mu                    sync.RWMutex
	dailyCosts           map[string]float64 // date -> cost
	userMonthlyCosts     map[string]float64 // userID -> monthly cost
	totalTokensUsed      int64
	totalCost            float64
	costPerInputToken    float64
	costPerOutputToken   float64
	lastResetTime        time.Time
}

// UserQuota tracks individual user usage and quotas
type UserQuota struct {
	UserID              string    `json:"user_id"`
	Tier                string    `json:"tier"` // "free", "pro", "enterprise"
	MonthlyLimit        int       `json:"monthly_limit"`
	CurrentUsage        int       `json:"current_usage"`
	LastResetDate       time.Time `json:"last_reset_date"`
	RemainingExplanations int     `json:"remaining_explanations"`
	RemainingCareerAdvice int     `json:"remaining_career_advice"`
}

// LLMRequest represents a request to the LLM service
type LLMRequest struct {
	UserID      string                 `json:"user_id"`
	Type        string                 `json:"type"` // "explanation", "skill_advice", "career_guidance"
	Context     map[string]interface{} `json:"context"`
	CacheKey    string                 `json:"cache_key,omitempty"`
	MaxTokens   int                    `json:"max_tokens"`
	Temperature float64                `json:"temperature"`
	SystemPrompt string                `json:"system_prompt,omitempty"`
	UserPrompt  string                 `json:"user_prompt"`
}

// LLMResponse represents a response from the LLM service
type LLMResponse struct {
	Content         string                 `json:"content"`
	TokensUsed      int                    `json:"tokens_used"`
	Cost            float64                `json:"cost"`
	Cached          bool                   `json:"cached"`
	ProcessingTime  time.Duration          `json:"processing_time"`
	CacheHit        bool                   `json:"cache_hit"`
	QuotaRemaining  int                    `json:"quota_remaining"`
	Metadata        map[string]interface{} `json:"metadata"`
}

// NewLLMService creates a new LLM service with cost optimization
func NewLLMService(apiKey, baseURL, model string) *LLMService {
	service := &LLMService{
		apiKey:                apiKey,
		baseURL:               baseURL,
		model:                 model,
		cache:                 &LLMCache{responses: make(map[string]*CachedResponse)},
		costTracker:           &CostTracker{
			dailyCosts:         make(map[string]float64),
			userMonthlyCosts:   make(map[string]float64),
			costPerInputToken:  0.0001,  // $0.0001 per input token (DeepSeek R1 pricing)
			costPerOutputToken: 0.0002,  // $0.0002 per output token
			lastResetTime:      time.Now(),
		},
		usageQuotas:           make(map[string]*UserQuota),
		templateCache:         make(map[string]string),
		responseCacheEnabled:  true,
		maxCachedResponses:    10000,
		defaultCacheTTL:       24 * time.Hour,
	}

	service.initializePromptTemplates()
	go service.startCacheCleanup()
	go service.startCostReset()
	
	return service
}

// ExplainMatch generates an explanation for why a job matches a user
func (s *LLMService) ExplainMatch(ctx context.Context, userID string, match *matching.MatchScore, user *coreModels.User, job *coreModels.Job) (*LLMResponse, error) {
	// Check quota first
	if !s.checkQuota(userID, "explanation") {
		return nil, fmt.Errorf("explanation quota exceeded for user %s", userID)
	}

	// Generate cache key
	cacheKey := s.generateCacheKey("match_explanation", userID, match.TotalScore, user, job)
	
	// Check cache
	if cached := s.getCachedResponse(cacheKey); cached != nil {
		s.decrementQuota(userID, "explanation")
		return &LLMResponse{
			Content:        cached.Content,
			TokensUsed:     cached.TokensUsed,
			Cost:           cached.Cost,
			Cached:         true,
			CacheHit:       true,
			QuotaRemaining: s.getRemainingQuota(userID, "explanation"),
		}, nil
	}

	// Build context
	context := map[string]interface{}{
		"user_skills":        user.Skills,
		"user_experience":    user.ExperienceLevel,
		"user_location":      user.Location,
		"user_interests":     user.Interests,
		"job_title":          job.Title,
		"job_skills":         job.Skills,
		"job_experience":     job.ExperienceLevel,
		"job_location":       job.Location,
		"job_category":       job.Category,
		"match_score":        match.TotalScore,
		"matched_skills":     match.MatchedSkills,
		"missing_skills":     match.MissingSkills,
		"skill_gaps":         match.SkillGaps,
		"match_quality":      match.MatchQuality,
	}

	// Build prompt
	systemPrompt := s.getTemplate("match_explanation_system")
	userPrompt := s.buildMatchExplanationPrompt(context)

	// Create LLM request
	llmRequest := &LLMRequest{
		UserID:       userID,
		Type:         "explanation",
		Context:      context,
		CacheKey:     cacheKey,
		MaxTokens:    300, // Keep explanations concise for cost control
		Temperature:  0.3, // Lower temperature for consistent explanations
		SystemPrompt: systemPrompt,
		UserPrompt:   userPrompt,
	}

	// Make LLM call
	response, err := s.callLLM(ctx, llmRequest)
	if err != nil {
		return nil, fmt.Errorf("LLM call failed: %w", err)
	}

	// Cache response
	s.cacheResponse(cacheKey, response, s.defaultCacheTTL)
	
	// Update quota
	s.decrementQuota(userID, "explanation")
	
	// Update cost tracking
	s.updateCosts(userID, response.Cost)

	response.QuotaRemaining = s.getRemainingQuota(userID, "explanation")
	return response, nil
}

// AnalyzeSkillGaps provides skill gap analysis and learning recommendations
func (s *LLMService) AnalyzeSkillGaps(ctx context.Context, userID string, user *coreModels.User, targetJob *coreModels.Job) (*LLMResponse, error) {
	// Check if user has pro tier access
	if !s.checkProTierAccess(userID) {
		return nil, fmt.Errorf("skill gap analysis requires Pro tier subscription")
	}

	// Generate cache key
	cacheKey := s.generateCacheKey("skill_gaps", userID, 0, user, targetJob)
	
	// Check cache
	if cached := s.getCachedResponse(cacheKey); cached != nil {
		return &LLMResponse{
			Content:        cached.Content,
			TokensUsed:     cached.TokensUsed,
			Cost:           cached.Cost,
			Cached:         true,
			CacheHit:       true,
			QuotaRemaining: -1, // Unlimited for Pro tier
		}, nil
	}

	// Build context
	context := map[string]interface{}{
		"user_skills":      user.Skills,
		"user_experience":  user.ExperienceLevel,
		"target_job_title": targetJob.Title,
		"required_skills":  targetJob.Skills,
		"job_experience":   targetJob.ExperienceLevel,
		"job_category":     targetJob.Category,
	}

	// Build prompt
	systemPrompt := s.getTemplate("skill_gap_analysis_system")
	userPrompt := s.buildSkillGapAnalysisPrompt(context)

	// Create LLM request
	llmRequest := &LLMRequest{
		UserID:       userID,
		Type:         "skill_advice",
		Context:      context,
		CacheKey:     cacheKey,
		MaxTokens:    500, // More detailed for skill analysis
		Temperature:  0.4,
		SystemPrompt: systemPrompt,
		UserPrompt:   userPrompt,
	}

	// Make LLM call
	response, err := s.callLLM(ctx, llmRequest)
	if err != nil {
		return nil, fmt.Errorf("LLM call failed: %w", err)
	}

	// Cache response
	s.cacheResponse(cacheKey, response, s.defaultCacheTTL)
	
	// Update cost tracking
	s.updateCosts(userID, response.Cost)

	response.QuotaRemaining = -1 // Unlimited for Pro tier
	return response, nil
}

// GenerateCareerAdvice provides personalized career guidance
func (s *LLMService) GenerateCareerAdvice(ctx context.Context, userID string, user *coreModels.User, careerGoals string) (*LLMResponse, error) {
	// Check if user has pro tier access
	if !s.checkProTierAccess(userID) {
		return nil, fmt.Errorf("career advice requires Pro tier subscription")
	}

	// Generate cache key (include career goals in hash)
	cacheKey := s.generateCareerAdviceCacheKey(userID, user, careerGoals)
	
	// Check cache
	if cached := s.getCachedResponse(cacheKey); cached != nil {
		return &LLMResponse{
			Content:        cached.Content,
			TokensUsed:     cached.TokensUsed,
			Cost:           cached.Cost,
			Cached:         true,
			CacheHit:       true,
			QuotaRemaining: -1, // Unlimited for Pro tier
		}, nil
	}

	// Build context
	context := map[string]interface{}{
		"user_skills":      user.Skills,
		"user_experience":  user.ExperienceLevel,
		"user_interests":   user.Interests,
		"user_location":    user.Location,
		"career_goals":     careerGoals,
	}

	// Build prompt
	systemPrompt := s.getTemplate("career_advice_system")
	userPrompt := s.buildCareerAdvicePrompt(context)

	// Create LLM request
	llmRequest := &LLMRequest{
		UserID:       userID,
		Type:         "career_guidance",
		Context:      context,
		CacheKey:     cacheKey,
		MaxTokens:    600, // More comprehensive for career advice
		Temperature:  0.5, // Slightly more creative for career advice
		SystemPrompt: systemPrompt,
		UserPrompt:   userPrompt,
	}

	// Make LLM call
	response, err := s.callLLM(ctx, llmRequest)
	if err != nil {
		return nil, fmt.Errorf("LLM call failed: %w", err)
	}

	// Cache response
	s.cacheResponse(cacheKey, response, s.defaultCacheTTL)
	
	// Update cost tracking
	s.updateCosts(userID, response.Cost)

	response.QuotaRemaining = -1 // Unlimited for Pro tier
	return response, nil
}

// GetUsageStats returns usage statistics for a user
func (s *LLMService) GetUsageStats(ctx context.Context, userID string) (*UserUsageStats, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	quota, exists := s.usageQuotas[userID]
	if !exists {
		quota = s.getDefaultQuota(userID)
	}

	stats := &UserUsageStats{
		UserID:                userID,
		Tier:                  quota.Tier,
		MonthlyLimit:          quota.MonthlyLimit,
		CurrentUsage:          quota.CurrentUsage,
		RemainingExplanations: quota.RemainingExplanations,
		RemainingCareerAdvice: quota.RemainingCareerAdvice,
		MonthlyCost:           s.costTracker.userMonthlyCosts[userID],
		CacheHitRate:          s.getCacheHitRate(),
		LastResetDate:         quota.LastResetDate,
	}

	return stats, nil
}

// GetCostMetrics returns overall cost metrics
func (s *LLMService) GetCostMetrics(ctx context.Context) (*CostMetrics, error) {
	s.costTracker.mu.RLock()
	defer s.costTracker.mu.RUnlock()

	metrics := &CostMetrics{
		TotalTokensUsed:   s.costTracker.totalTokensUsed,
		TotalCost:         s.costTracker.totalCost,
		DailyCosts:        s.costTracker.dailyCosts,
		AverageCostPerUser: s.getAverageCostPerUser(),
		CacheHitRate:      s.getCacheHitRate(),
		ActiveUsers:       len(s.usageQuotas),
		LastResetTime:     s.costTracker.lastResetTime,
	}

	return metrics, nil
}

// Private methods

func (s *LLMService) initializePromptTemplates() {
	s.templateCache["match_explanation_system"] = `You are a career advisor AI that explains why jobs match user profiles. 
Provide concise, personalized explanations focusing on skill alignment, experience fit, and career growth potential. 
Keep responses under 200 words and be encouraging while being honest about gaps.`

	s.templateCache["skill_gap_analysis_system"] = `You are a skill development expert. Analyze the gap between a user's current skills and target job requirements.
Provide specific, actionable learning recommendations with estimated timelines. Prioritize skills by importance and learning difficulty.
Format as a structured plan with clear next steps.`

	s.templateCache["career_advice_system"] = `You are a senior career counselor with expertise across multiple industries.
Provide strategic career guidance based on the user's background, skills, and goals. Include industry trends, potential career paths,
networking suggestions, and skill development priorities. Be specific and actionable.`
}

func (s *LLMService) buildMatchExplanationPrompt(context map[string]interface{}) string {
	return fmt.Sprintf(`Explain why this job is a %.1f%% match for the user:

User Profile:
- Skills: %v
- Experience: %s
- Interests: %v
- Location: %s

Job Details:
- Title: %s
- Required Skills: %v
- Experience Level: %s
- Location: %s
- Category: %s

Match Analysis:
- Matched Skills: %v
- Missing Skills: %v
- Match Quality: %s

Provide a brief, encouraging explanation highlighting strengths and addressing any gaps.`,
		context["match_score"].(float64)*100,
		context["user_skills"],
		context["user_experience"],
		context["user_interests"],
		context["user_location"],
		context["job_title"],
		context["job_skills"],
		context["job_experience"],
		context["job_location"],
		context["job_category"],
		context["matched_skills"],
		context["missing_skills"],
		context["match_quality"])
}

func (s *LLMService) buildSkillGapAnalysisPrompt(context map[string]interface{}) string {
	return fmt.Sprintf(`Analyze the skill gaps for this career transition:

Current Profile:
- Skills: %v
- Experience Level: %s

Target Position:
- Job Title: %s
- Required Skills: %v
- Experience Level: %s
- Category: %s

Provide:
1. Priority skills to develop (High/Medium/Low priority)
2. Estimated learning time for each skill
3. Recommended learning resources or approaches
4. Skills that transfer well from current background
5. Timeline for becoming job-ready`,
		context["user_skills"],
		context["user_experience"],
		context["target_job_title"],
		context["required_skills"],
		context["job_experience"],
		context["job_category"])
}

func (s *LLMService) buildCareerAdvicePrompt(context map[string]interface{}) string {
	return fmt.Sprintf(`Provide strategic career advice for this professional:

Background:
- Current Skills: %v
- Experience Level: %s
- Interests: %v
- Location: %s
- Career Goals: %s

Provide comprehensive guidance including:
1. Career path options based on current skills
2. Industry trends and opportunities
3. Skill development priorities
4. Networking strategies
5. Next concrete steps to take
6. Timeline for achieving career goals`,
		context["user_skills"],
		context["user_experience"],
		context["user_interests"],
		context["user_location"],
		context["career_goals"])
}

func (s *LLMService) callLLM(ctx context.Context, request *LLMRequest) (*LLMResponse, error) {
	startTime := time.Now()

	// Mock LLM API call (replace with actual implementation)
	// This would make an HTTP request to OpenRouter/DeepSeek R1
	
	mockContent := s.generateMockResponse(request)
	mockTokensUsed := len(strings.Split(mockContent, " ")) + len(strings.Split(request.UserPrompt, " "))
	mockCost := float64(mockTokensUsed) * s.costTracker.costPerOutputToken

	response := &LLMResponse{
		Content:        mockContent,
		TokensUsed:     mockTokensUsed,
		Cost:           mockCost,
		Cached:         false,
		ProcessingTime: time.Since(startTime),
		CacheHit:       false,
	}

	return response, nil
}

func (s *LLMService) generateMockResponse(request *LLMRequest) string {
	switch request.Type {
	case "explanation":
		return "This position is an excellent match for your profile! Your skills in JavaScript and React align perfectly with the frontend requirements. Your experience level matches well, and the remote work option fits your location preferences. Consider strengthening your TypeScript skills to become an even stronger candidate."
	case "skill_advice":
		return `Based on your skill gap analysis:

HIGH PRIORITY:
- TypeScript (2-3 months): Essential for modern React development
- Node.js (1-2 months): Complements your frontend skills

MEDIUM PRIORITY:  
- AWS/Cloud basics (3-4 months): Increasingly important
- Testing frameworks (1 month): Jest, React Testing Library

Your JavaScript and React foundation transfers excellently. Focus on TypeScript first, then expand to full-stack capabilities.`
	case "career_guidance":
		return `Career Path Recommendations:

1. FRONTEND SPECIALIST: Deepen React expertise, learn Next.js
2. FULL-STACK DEVELOPER: Add Node.js, databases, cloud skills  
3. TECHNICAL LEAD: Develop mentoring and architecture skills

IMMEDIATE STEPS:
- Complete TypeScript course (priority #1)
- Build 2-3 portfolio projects showcasing new skills
- Join React community groups for networking
- Consider React/frontend-focused conferences

Timeline: 6-12 months to significantly strengthen profile for senior roles.`
	default:
		return "I can help explain job matches, analyze skill gaps, or provide career guidance. How can I assist you today?"
	}
}

func (s *LLMService) generateCacheKey(requestType, userID string, score float64, user *coreModels.User, job *coreModels.Job) string {
	// Create a hash of the key parameters to create a cache key
	data := fmt.Sprintf("%s_%s_%.2f_%v_%v_%s_%s", 
		requestType, userID, score, user.Skills, job.Skills, user.ExperienceLevel, job.ExperienceLevel)
	
	hash := md5.Sum([]byte(data))
	return fmt.Sprintf("%x", hash)
}

func (s *LLMService) generateCareerAdviceCacheKey(userID string, user *coreModels.User, careerGoals string) string {
	data := fmt.Sprintf("career_%s_%v_%s_%v_%s", 
		userID, user.Skills, user.ExperienceLevel, user.Interests, careerGoals)
	
	hash := md5.Sum([]byte(data))
	return fmt.Sprintf("%x", hash)
}

func (s *LLMService) getCachedResponse(cacheKey string) *CachedResponse {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()

	cached, exists := s.cache.responses[cacheKey]
	if !exists {
		s.cache.missCount++
		return nil
	}

	if time.Now().After(cached.ExpiresAt) {
		// Expired
		delete(s.cache.responses, cacheKey)
		s.cache.missCount++
		return nil
	}

	s.cache.hitCount++
	return cached
}

func (s *LLMService) cacheResponse(cacheKey string, response *LLMResponse, ttl time.Duration) {
	s.cache.mu.Lock()
	defer s.cache.mu.Unlock()

	// Implement LRU eviction if cache is full
	if len(s.cache.responses) >= s.maxCachedResponses {
		s.evictOldestCacheEntry()
	}

	cached := &CachedResponse{
		Content:   response.Content,
		TokensUsed: response.TokensUsed,
		Cost:      response.Cost,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(ttl),
	}

	s.cache.responses[cacheKey] = cached
}

func (s *LLMService) evictOldestCacheEntry() {
	var oldestKey string
	var oldestTime time.Time = time.Now()

	for key, cached := range s.cache.responses {
		if cached.CreatedAt.Before(oldestTime) {
			oldestTime = cached.CreatedAt
			oldestKey = key
		}
	}

	if oldestKey != "" {
		delete(s.cache.responses, oldestKey)
	}
}

func (s *LLMService) checkQuota(userID, requestType string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	quota, exists := s.usageQuotas[userID]
	if !exists {
		quota = s.getDefaultQuota(userID)
		s.usageQuotas[userID] = quota
	}

	// Check if monthly reset is needed
	if time.Now().Month() != quota.LastResetDate.Month() {
		s.resetMonthlyQuota(quota)
	}

	switch requestType {
	case "explanation":
		return quota.RemainingExplanations > 0
	case "skill_advice", "career_guidance":
		return quota.Tier == "pro" || quota.Tier == "enterprise"
	default:
		return false
	}
}

func (s *LLMService) decrementQuota(userID, requestType string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	quota := s.usageQuotas[userID]
	if quota == nil {
		return
	}

	quota.CurrentUsage++
	
	switch requestType {
	case "explanation":
		if quota.RemainingExplanations > 0 {
			quota.RemainingExplanations--
		}
	case "skill_advice", "career_guidance":
		if quota.RemainingCareerAdvice > 0 {
			quota.RemainingCareerAdvice--
		}
	}
}

func (s *LLMService) getRemainingQuota(userID, requestType string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	quota, exists := s.usageQuotas[userID]
	if !exists {
		quota = s.getDefaultQuota(userID)
	}

	switch requestType {
	case "explanation":
		return quota.RemainingExplanations
	case "skill_advice", "career_guidance":
		if quota.Tier == "pro" || quota.Tier == "enterprise" {
			return -1 // Unlimited
		}
		return 0
	default:
		return 0
	}
}

func (s *LLMService) checkProTierAccess(userID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	quota, exists := s.usageQuotas[userID]
	if !exists {
		return false
	}

	return quota.Tier == "pro" || quota.Tier == "enterprise"
}

func (s *LLMService) getDefaultQuota(userID string) *UserQuota {
	return &UserQuota{
		UserID:                userID,
		Tier:                  "free",
		MonthlyLimit:          10,
		CurrentUsage:          0,
		LastResetDate:         time.Now(),
		RemainingExplanations: 10,
		RemainingCareerAdvice: 0,
	}
}

func (s *LLMService) resetMonthlyQuota(quota *UserQuota) {
	quota.CurrentUsage = 0
	quota.LastResetDate = time.Now()
	
	switch quota.Tier {
	case "free":
		quota.RemainingExplanations = 10
		quota.RemainingCareerAdvice = 0
	case "pro":
		quota.RemainingExplanations = -1 // Unlimited
		quota.RemainingCareerAdvice = -1 // Unlimited
	case "enterprise":
		quota.RemainingExplanations = -1 // Unlimited
		quota.RemainingCareerAdvice = -1 // Unlimited
	}
}

func (s *LLMService) updateCosts(userID string, cost float64) {
	s.costTracker.mu.Lock()
	defer s.costTracker.mu.Unlock()

	// Update total costs
	s.costTracker.totalCost += cost

	// Update daily costs
	today := time.Now().Format("2006-01-02")
	s.costTracker.dailyCosts[today] += cost

	// Update user monthly costs
	s.costTracker.userMonthlyCosts[userID] += cost
}

func (s *LLMService) getCacheHitRate() float64 {
	s.cache.mu.RLock()
	defer s.cache.mu.RUnlock()

	total := s.cache.hitCount + s.cache.missCount
	if total == 0 {
		return 0.0
	}

	return float64(s.cache.hitCount) / float64(total) * 100.0
}

func (s *LLMService) getAverageCostPerUser() float64 {
	if len(s.costTracker.userMonthlyCosts) == 0 {
		return 0.0
	}

	total := 0.0
	for _, cost := range s.costTracker.userMonthlyCosts {
		total += cost
	}

	return total / float64(len(s.costTracker.userMonthlyCosts))
}

func (s *LLMService) getTemplate(templateName string) string {
	if template, exists := s.templateCache[templateName]; exists {
		return template
	}
	return ""
}

func (s *LLMService) startCacheCleanup() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.cleanupExpiredCache()
		}
	}
}

func (s *LLMService) startCostReset() {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.resetDailyCosts()
		}
	}
}

func (s *LLMService) cleanupExpiredCache() {
	s.cache.mu.Lock()
	defer s.cache.mu.Unlock()

	now := time.Now()
	for key, cached := range s.cache.responses {
		if now.After(cached.ExpiresAt) {
			delete(s.cache.responses, key)
		}
	}
}

func (s *LLMService) resetDailyCosts() {
	s.costTracker.mu.Lock()
	defer s.costTracker.mu.Unlock()

	// Keep only last 30 days of daily costs
	cutoff := time.Now().AddDate(0, 0, -30)
	cutoffStr := cutoff.Format("2006-01-02")

	for date := range s.costTracker.dailyCosts {
		if date < cutoffStr {
			delete(s.costTracker.dailyCosts, date)
		}
	}
}

// Supporting types

type UserUsageStats struct {
	UserID                string    `json:"user_id"`
	Tier                  string    `json:"tier"`
	MonthlyLimit          int       `json:"monthly_limit"`
	CurrentUsage          int       `json:"current_usage"`
	RemainingExplanations int       `json:"remaining_explanations"`
	RemainingCareerAdvice int       `json:"remaining_career_advice"`
	MonthlyCost           float64   `json:"monthly_cost"`
	CacheHitRate          float64   `json:"cache_hit_rate"`
	LastResetDate         time.Time `json:"last_reset_date"`
}

type CostMetrics struct {
	TotalTokensUsed   int64              `json:"total_tokens_used"`
	TotalCost         float64            `json:"total_cost"`
	DailyCosts        map[string]float64 `json:"daily_costs"`
	AverageCostPerUser float64           `json:"average_cost_per_user"`
	CacheHitRate      float64            `json:"cache_hit_rate"`
	ActiveUsers       int                `json:"active_users"`
	LastResetTime     time.Time          `json:"last_reset_time"`
}