package matching

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"microbridge/backend/internal/shared/cache"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/shared/monitoring"
)

type OptimizedMatchingService struct {
	baseService    *MatchingService
	cache          *cache.MatchingCache
	profileCache   *sync.Map // Hot cache for user profiles
	jobCache       *sync.Map // Hot cache for active jobs
	scoreCache     *sync.Map // Pre-calculated skill scores
	lastCacheFlush time.Time
}

type CachedUserProfile struct {
	UserID           string                 `json:"user_id"`
	Skills           map[string]float64     `json:"skills"`          // Pre-weighted
	ExperienceLevel  string                 `json:"experience_level"`
	Location         string                 `json:"location"`
	Availability     string                 `json:"availability"`
	LastUpdated      time.Time              `json:"last_updated"`
}

type CachedJobProfile struct {
	JobID            string                 `json:"job_id"`
	RequiredSkills   map[string]float64     `json:"required_skills"` // Pre-weighted
	ExperienceLevel  string                 `json:"experience_level"`
	Location         string                 `json:"location"`
	IsRemote         bool                   `json:"is_remote"`
	LastUpdated      time.Time              `json:"last_updated"`
}

func NewOptimizedMatchingService(baseService *MatchingService, cache *cache.MatchingCache) *OptimizedMatchingService {
	service := &OptimizedMatchingService{
		baseService:    baseService,
		cache:          cache,
		profileCache:   &sync.Map{},
		jobCache:       &sync.Map{},
		scoreCache:     &sync.Map{},
		lastCacheFlush: time.Now(),
	}
	
	// Start background cache warm-up
	go service.warmUpCache()
	
	return service
}

// CRITICAL: This replaces your expensive matching algorithm
func (s *OptimizedMatchingService) FindMatches(ctx context.Context, userID string, limit int) ([]cache.MatchResult, error) {
	start := time.Now()
	defer func() {
		monitoring.RecordMatchingOperation("optimized_find_matches", time.Since(start), limit)
	}()

	// L1 Cache: Check for recent matches
	cacheKey := fmt.Sprintf("matches:%s:%d", userID, limit)
	if cached, found := s.cache.GetMatches(ctx, userID); found {
		monitoring.RecordCacheOperation("matching", "L1_hit", true)
		return s.limitResults(cached, limit), nil
	}
	monitoring.RecordCacheOperation("matching", "L1_miss", false)

	// Get user profile (cached)
	userProfile, err := s.getCachedUserProfile(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}

	// Get active jobs (cached)
	activeJobs, err := s.getCachedActiveJobs(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get active jobs: %w", err)
	}

	// Parallel matching with pre-calculated scores
	matches := s.calculateMatchesInParallel(userProfile, activeJobs, limit*2) // Get more for better ranking

	// Cache results
	if err := s.cache.SetMatches(ctx, userID, matches); err != nil {
		log.Printf("Failed to cache matches: %v", err)
	}

	return s.limitResults(matches, limit), nil
}

func (s *OptimizedMatchingService) getCachedUserProfile(ctx context.Context, userID string) (*CachedUserProfile, error) {
	// Check hot cache first
	if cached, ok := s.profileCache.Load(userID); ok {
		if profile, ok := cached.(*CachedUserProfile); ok {
			if time.Since(profile.LastUpdated) < 10*time.Minute {
				monitoring.RecordCacheOperation("profile", "hot_cache_hit", true)
				return profile, nil
			}
		}
	}

	monitoring.RecordCacheOperation("profile", "hot_cache_miss", false)

	// Fetch from database with monitoring
	start := time.Now()
	defer monitoring.RecordDatabaseQuery("SELECT", "user_profiles", time.Since(start))

	var user models.User
	var profile models.UserProfile
	
	if err := s.baseService.userRepo.GetByID(ctx, userID, &user); err != nil {
		return nil, err
	}
	
	if err := s.baseService.userRepo.GetProfile(ctx, userID, &profile); err != nil {
		return nil, err
	}

	// Pre-calculate skill weights (expensive operation done once)
	skillWeights := s.calculateSkillWeights(profile.Skills)
	
	cachedProfile := &CachedUserProfile{
		UserID:          userID,
		Skills:          skillWeights,
		ExperienceLevel: profile.ExperienceLevel,
		Location:        profile.Location,
		Availability:    profile.Availability,
		LastUpdated:     time.Now(),
	}

	// Store in hot cache
	s.profileCache.Store(userID, cachedProfile)
	
	return cachedProfile, nil
}

func (s *OptimizedMatchingService) getCachedActiveJobs(ctx context.Context) ([]*CachedJobProfile, error) {
	cacheKey := "active_jobs"
	
	// Check if we have recent active jobs cached
	if cached, ok := s.jobCache.Load(cacheKey); ok {
		if jobs, ok := cached.([]*CachedJobProfile); ok {
			if len(jobs) > 0 && time.Since(jobs[0].LastUpdated) < 5*time.Minute {
				monitoring.RecordCacheOperation("jobs", "active_cache_hit", true)
				return jobs, nil
			}
		}
	}

	monitoring.RecordCacheOperation("jobs", "active_cache_miss", false)

	// Fetch active jobs from database
	start := time.Now()
	defer monitoring.RecordDatabaseQuery("SELECT", "jobs", time.Since(start))

	var jobs []models.Job
	if err := s.baseService.jobRepo.GetActiveJobs(ctx, &jobs, 1000); err != nil {
		return nil, err
	}

	// Pre-process jobs for faster matching
	cachedJobs := make([]*CachedJobProfile, len(jobs))
	for i, job := range jobs {
		skillWeights := s.calculateSkillWeights(job.SkillsRequired)
		
		cachedJobs[i] = &CachedJobProfile{
			JobID:           job.ID,
			RequiredSkills:  skillWeights,
			ExperienceLevel: job.ExperienceLevel,
			Location:        job.Location,
			IsRemote:        job.IsRemote,
			LastUpdated:     time.Now(),
		}
	}

	// Cache the processed jobs
	s.jobCache.Store(cacheKey, cachedJobs)
	
	return cachedJobs, nil
}

// CRITICAL: Optimized parallel matching algorithm
func (s *OptimizedMatchingService) calculateMatchesInParallel(userProfile *CachedUserProfile, jobs []*CachedJobProfile, limit int) []cache.MatchResult {
	type matchJob struct {
		job   *CachedJobProfile
		index int
	}
	
	type matchResult struct {
		result cache.MatchResult
		index  int
	}

	// Worker pool for parallel processing
	jobChan := make(chan matchJob, len(jobs))
	resultChan := make(chan matchResult, len(jobs))
	
	numWorkers := 4 // Adjust based on your CPU cores
	var wg sync.WaitGroup

	// Start workers
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobChan {
				match := s.calculateSingleMatch(userProfile, job.job)
				resultChan <- matchResult{
					result: match,
					index:  job.index,
				}
			}
		}()
	}

	// Send jobs to workers
	go func() {
		defer close(jobChan)
		for i, job := range jobs {
			jobChan <- matchJob{job: job, index: i}
		}
	}()

	// Close result channel when all workers done
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect results
	results := make([]cache.MatchResult, 0, len(jobs))
	for result := range resultChan {
		if result.result.HarmonicMean > 0.3 { // Only keep decent matches
			results = append(results, result.result)
		}
	}

	// Sort by harmonic mean score (descending)
	return s.sortAndLimitResults(results, limit)
}

// OPTIMIZED: Single match calculation with pre-computed weights
func (s *OptimizedMatchingService) calculateSingleMatch(user *CachedUserProfile, job *CachedJobProfile) cache.MatchResult {
	// Use pre-calculated skill weights instead of recalculating
	userToJobScore := s.calculateSkillMatchScore(user.Skills, job.RequiredSkills)
	jobToUserScore := s.calculateSkillMatchScore(job.RequiredSkills, user.Skills)
	
	// Apply experience level multiplier
	userToJobScore *= s.getExperienceLevelMultiplier(user.ExperienceLevel, job.ExperienceLevel)
	
	// Apply location bonus
	if s.isLocationMatch(user.Location, job.Location, job.IsRemote) {
		userToJobScore *= 1.1
		jobToUserScore *= 1.1
	}
	
	// Calculate harmonic mean
	harmonicMean := s.calculateHarmonicMean(userToJobScore, jobToUserScore)
	
	return cache.MatchResult{
		JobID:             job.JobID,
		UserToJobScore:    userToJobScore,
		JobToUserScore:    jobToUserScore,
		HarmonicMean:      harmonicMean,
		SkillMatches:      s.getSkillMatchDetails(user.Skills, job.RequiredSkills),
		CalculatedAt:      time.Now(),
	}
}

// Pre-calculate skill weights to avoid repeated JSON parsing
func (s *OptimizedMatchingService) calculateSkillWeights(skills interface{}) map[string]float64 {
	cacheKey := fmt.Sprintf("skill_weights:%v", skills)
	
	if cached, ok := s.scoreCache.Load(cacheKey); ok {
		if weights, ok := cached.(map[string]float64); ok {
			return weights
		}
	}
	
	weights := make(map[string]float64)
	
	// Handle different skill input types
	switch skillsData := skills.(type) {
	case []byte:
		var skillsList []string
		if err := json.Unmarshal(skillsData, &skillsList); err == nil {
			for _, skill := range skillsList {
				weights[skill] = 1.0 // Default weight
			}
		}
	case []string:
		for _, skill := range skillsData {
			weights[skill] = 1.0
		}
	case map[string]interface{}:
		for skill, weight := range skillsData {
			if w, ok := weight.(float64); ok {
				weights[skill] = w
			} else {
				weights[skill] = 1.0
			}
		}
	}
	
	// Cache the calculated weights
	s.scoreCache.Store(cacheKey, weights)
	
	return weights
}

func (s *OptimizedMatchingService) calculateSkillMatchScore(userSkills, jobSkills map[string]float64) float64 {
	if len(userSkills) == 0 || len(jobSkills) == 0 {
		return 0.0
	}
	
	totalJobWeight := 0.0
	matchedWeight := 0.0
	
	for skill, jobWeight := range jobSkills {
		totalJobWeight += jobWeight
		if userWeight, hasSkill := userSkills[skill]; hasSkill {
			matchedWeight += userWeight * jobWeight
		}
	}
	
	if totalJobWeight == 0 {
		return 0.0
	}
	
	return matchedWeight / totalJobWeight
}

func (s *OptimizedMatchingService) getExperienceLevelMultiplier(userLevel, jobLevel string) float64 {
	levels := map[string]int{"entry": 1, "mid": 2, "senior": 3}
	userLevelNum, jobLevelNum := levels[userLevel], levels[jobLevel]
	
	diff := userLevelNum - jobLevelNum
	switch {
	case diff == 0:
		return 1.0 // Perfect match
	case diff == 1:
		return 0.9 // Overqualified but good
	case diff == -1:
		return 0.8 // Slightly underqualified
	case diff >= 2:
		return 0.7 // Significantly overqualified
	default:
		return 0.5 // Significantly underqualified
	}
}

func (s *OptimizedMatchingService) isLocationMatch(userLocation, jobLocation string, isRemote bool) bool {
	if isRemote {
		return true
	}
	return userLocation == jobLocation
}

func (s *OptimizedMatchingService) calculateHarmonicMean(score1, score2 float64) float64 {
	if score1 == 0 || score2 == 0 {
		return 0
	}
	return 2 * score1 * score2 / (score1 + score2)
}

func (s *OptimizedMatchingService) getSkillMatchDetails(userSkills, jobSkills map[string]float64) map[string]float64 {
	details := make(map[string]float64)
	for skill, jobWeight := range jobSkills {
		if userWeight, exists := userSkills[skill]; exists {
			details[skill] = userWeight * jobWeight
		} else {
			details[skill] = 0.0 // Missing skill
		}
	}
	return details
}

func (s *OptimizedMatchingService) sortAndLimitResults(results []cache.MatchResult, limit int) []cache.MatchResult {
	// Simple but efficient sorting
	for i := 0; i < len(results)-1; i++ {
		for j := i + 1; j < len(results); j++ {
			if results[i].HarmonicMean < results[j].HarmonicMean {
				results[i], results[j] = results[j], results[i]
			}
		}
		if i >= limit-1 {
			break // Early termination when we have enough sorted
		}
	}
	
	if len(results) > limit {
		results = results[:limit]
	}
	
	return results
}

func (s *OptimizedMatchingService) limitResults(results []cache.MatchResult, limit int) []cache.MatchResult {
	if len(results) > limit {
		return results[:limit]
	}
	return results
}

// Background cache warming
func (s *OptimizedMatchingService) warmUpCache() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()
	
	for range ticker.C {
		ctx := context.Background()
		
		// Warm up active jobs cache
		if _, err := s.getCachedActiveJobs(ctx); err != nil {
			log.Printf("Failed to warm up jobs cache: %v", err)
		}
		
		// Clear old profile cache entries
		now := time.Now()
		s.profileCache.Range(func(key, value interface{}) bool {
			if profile, ok := value.(*CachedUserProfile); ok {
				if now.Sub(profile.LastUpdated) > 30*time.Minute {
					s.profileCache.Delete(key)
				}
			}
			return true
		})
	}
}

// Cache invalidation methods
func (s *OptimizedMatchingService) InvalidateUserCache(ctx context.Context, userID string) error {
	s.profileCache.Delete(userID)
	return s.cache.InvalidateUserMatches(ctx, userID)
}

func (s *OptimizedMatchingService) InvalidateJobCache(ctx context.Context, jobID string) error {
	s.jobCache.Delete("active_jobs") // Clear all job cache
	return s.cache.InvalidateJobMatches(ctx, jobID)
}

func (s *OptimizedMatchingService) InvalidateAllCaches(ctx context.Context) error {
	// Clear all in-memory caches
	s.profileCache = &sync.Map{}
	s.jobCache = &sync.Map{}
	s.scoreCache = &sync.Map{}
	
	// Clear Redis caches
	return s.cache.DeletePattern(ctx, "matches:*")
}
