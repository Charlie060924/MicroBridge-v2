package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

// MatchingCache provides caching for matching results
type MatchingCache struct {
	cache *CacheLayer
}

// MatchResult represents a cached match result
type MatchResult struct {
	JobID             string                 `json:"job_id"`
	UserToJobScore    float64                `json:"user_to_job_score"`
	JobToUserScore    float64                `json:"job_to_user_score"`
	HarmonicMean      float64                `json:"harmonic_mean"`
	SkillMatches      map[string]float64     `json:"skill_matches"`
	CalculatedAt      time.Time              `json:"calculated_at"`
}

// NewMatchingCache creates a new matching cache
func NewMatchingCache(cache *CacheLayer) *MatchingCache {
	return &MatchingCache{
		cache: cache,
	}
}

// GetMatches retrieves cached matches for a user
func (mc *MatchingCache) GetMatches(ctx context.Context, userID string) ([]MatchResult, bool) {
	key := fmt.Sprintf("matches:%s", userID)
	
	// Try L1 cache first
	if cached, ok := mc.cache.L1.Load(key); ok {
		if matches, ok := cached.([]MatchResult); ok {
			return matches, true
		}
	}

	// Try L2 cache (Redis)
	data, err := mc.cache.L2.Get(ctx, key).Result()
	if err == nil {
		var matches []MatchResult
		if err := json.Unmarshal([]byte(data), &matches); err == nil {
			// Store in L1 cache
			mc.cache.L1.Store(key, matches)
			return matches, true
		}
	}

	return nil, false
}

// SetMatches stores matches in cache
func (mc *MatchingCache) SetMatches(ctx context.Context, userID string, matches []MatchResult) error {
	key := fmt.Sprintf("matches:%s", userID)
	
	// Store in L1 cache
	mc.cache.L1.Store(key, matches)

	// Store in L2 cache (Redis)
	data, err := json.Marshal(matches)
	if err != nil {
		return fmt.Errorf("failed to marshal matches: %w", err)
	}

	// Cache for 30 minutes
	err = mc.cache.L2.Set(ctx, key, data, 30*time.Minute).Err()
	if err != nil {
		return fmt.Errorf("failed to store in Redis: %w", err)
	}

	return nil
}

// InvalidateUserMatches invalidates cached matches for a user
func (mc *MatchingCache) InvalidateUserMatches(ctx context.Context, userID string) error {
	key := fmt.Sprintf("matches:%s", userID)
	
	// Remove from L1 cache
	mc.cache.L1.Delete(key)

	// Remove from L2 cache (Redis)
	err := mc.cache.L2.Del(ctx, key).Err()
	if err != nil {
		return fmt.Errorf("failed to delete from Redis: %w", err)
	}

	return nil
}

// InvalidateJobCache invalidates cached data for a job
func (mc *MatchingCache) InvalidateJobCache(ctx context.Context, jobID string) error {
	// This would need to invalidate all user matches that include this job
	// For now, we'll use a pattern-based deletion
	pattern := fmt.Sprintf("matches:*")
	
	// Get all matching keys
	keys, err := mc.cache.L2.Keys(ctx, pattern).Result()
	if err != nil {
		return fmt.Errorf("failed to get keys: %w", err)
	}

	// Delete all match caches (this is a bit aggressive but ensures consistency)
	for _, key := range keys {
		// Remove from L1 cache
		mc.cache.L1.Delete(key)
		
		// Remove from L2 cache
		if err := mc.cache.L2.Del(ctx, key).Err(); err != nil {
			return fmt.Errorf("failed to delete key %s: %w", key, err)
		}
	}

	return nil
}

// GetUserProfile retrieves cached user profile
func (mc *MatchingCache) GetUserProfile(ctx context.Context, userID string) (*UserProfile, bool) {
	key := fmt.Sprintf("user_profile:%s", userID)
	
	// Try L1 cache first
	if cached, ok := mc.cache.L1.Load(key); ok {
		if profile, ok := cached.(*UserProfile); ok {
			return profile, true
		}
	}

	// Try L2 cache (Redis)
	data, err := mc.cache.L2.Get(ctx, key).Result()
	if err == nil {
		var profile UserProfile
		if err := json.Unmarshal([]byte(data), &profile); err == nil {
			// Store in L1 cache
			mc.cache.L1.Store(key, &profile)
			return &profile, true
		}
	}

	return nil, false
}

// SetUserProfile stores user profile in cache
func (mc *MatchingCache) SetUserProfile(ctx context.Context, userID string, profile *UserProfile) error {
	key := fmt.Sprintf("user_profile:%s", userID)
	
	// Store in L1 cache
	mc.cache.L1.Store(key, profile)

	// Store in L2 cache (Redis)
	data, err := json.Marshal(profile)
	if err != nil {
		return fmt.Errorf("failed to marshal profile: %w", err)
	}

	// Cache for 15 minutes
	err = mc.cache.L2.Set(ctx, key, data, 15*time.Minute).Err()
	if err != nil {
		return fmt.Errorf("failed to store in Redis: %w", err)
	}

	return nil
}

// UserProfile represents a cached user profile
type UserProfile struct {
	UserID           string                 `json:"user_id"`
	Skills           map[string]float64     `json:"skills"`
	ExperienceLevel  string                 `json:"experience_level"`
	Location         string                 `json:"location"`
	Availability     string                 `json:"availability"`
	LastUpdated      time.Time              `json:"last_updated"`
}

// GetJobProfile retrieves cached job profile
func (mc *MatchingCache) GetJobProfile(ctx context.Context, jobID string) (*JobProfile, bool) {
	key := fmt.Sprintf("job_profile:%s", jobID)
	
	// Try L1 cache first
	if cached, ok := mc.cache.L1.Load(key); ok {
		if profile, ok := cached.(*JobProfile); ok {
			return profile, true
		}
	}

	// Try L2 cache (Redis)
	data, err := mc.cache.L2.Get(ctx, key).Result()
	if err == nil {
		var profile JobProfile
		if err := json.Unmarshal([]byte(data), &profile); err == nil {
			// Store in L1 cache
			mc.cache.L1.Store(key, &profile)
			return &profile, true
		}
	}

	return nil, false
}

// SetJobProfile stores job profile in cache
func (mc *MatchingCache) SetJobProfile(ctx context.Context, jobID string, profile *JobProfile) error {
	key := fmt.Sprintf("job_profile:%s", jobID)
	
	// Store in L1 cache
	mc.cache.L1.Store(key, profile)

	// Store in L2 cache (Redis)
	data, err := json.Marshal(profile)
	if err != nil {
		return fmt.Errorf("failed to marshal profile: %w", err)
	}

	// Cache for 30 minutes
	err = mc.cache.L2.Set(ctx, key, data, 30*time.Minute).Err()
	if err != nil {
		return fmt.Errorf("failed to store in Redis: %w", err)
	}

	return nil
}

// JobProfile represents a cached job profile
type JobProfile struct {
	JobID            string                 `json:"job_id"`
	RequiredSkills   map[string]float64     `json:"required_skills"`
	ExperienceLevel  string                 `json:"experience_level"`
	Location         string                 `json:"location"`
	IsRemote         bool                   `json:"is_remote"`
	LastUpdated      time.Time              `json:"last_updated"`
}
