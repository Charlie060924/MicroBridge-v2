package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/go-redis/redis/v8"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/services/matching"
)

// CacheLayer provides multi-layer caching for MicroBridge
type CacheLayer struct {
	L1 *sync.Map          // In-memory for hot data
	L2 *redis.Client      // Redis for shared cache
	L3 interface{}        // Database with optimized queries
	logger interface {
		Info() interface{ Str(string, string) interface{}; Msg(string) }
		Error() interface{ Err(error) interface{}; Msg(string) }
	}
}

// CacheConfig holds cache configuration
type CacheConfig struct {
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int
	TTL           time.Duration
	MaxMemory     int64
}

// MatchCache represents cached matching data
type MatchCache struct {
	UserSkillProfile map[string]float64  // Pre-calculated weights
	JobRequirements  map[string]float64  // Cached requirements
	LastUpdated      time.Time
	TTL              time.Duration
	Version          int // For cache invalidation
}

// NewCacheLayer creates a new multi-layer cache
func NewCacheLayer(redisClient *redis.Client) *CacheLayer {
	return &CacheLayer{
		L1: &sync.Map{},
		L2: redisClient,
		logger: &defaultLogger{},
	}
}

// defaultLogger provides a simple logger implementation
type defaultLogger struct{}

func (l *defaultLogger) Info() interface{ 
	return &defaultLoggerEvent{} 
}

func (l *defaultLogger) Error() interface{ 
	return &defaultLoggerEvent{} 
}

type defaultLoggerEvent struct{}

func (e *defaultLoggerEvent) Str(key, value string) interface{} { return e }
func (e *defaultLoggerEvent) Err(err error) interface{} { return e }
func (e *defaultLoggerEvent) Msg(msg string) {}

// GetUserSkillProfile retrieves user skill profile from cache
func (c *CacheLayer) GetUserSkillProfile(ctx context.Context, userID string) (*MatchCache, error) {
	// Try L1 cache first
	if cached, ok := c.L1.Load(userID); ok {
		if cache, ok := cached.(*MatchCache); ok && !c.isExpired(cache) {
			c.logger.Info().Str("user_id", userID).Msg("Cache hit L1")
			return cache, nil
		}
	}

	// Try L2 cache (Redis)
	key := fmt.Sprintf("user_skills:%s", userID)
	data, err := c.L2.Get(ctx, key).Result()
	if err == nil {
		var cache MatchCache
		if err := json.Unmarshal([]byte(data), &cache); err == nil && !c.isExpired(&cache) {
			// Store in L1 cache
			c.L1.Store(userID, &cache)
			c.logger.Info().Str("user_id", userID).Msg("Cache hit L2")
			return &cache, nil
		}
	}

	c.logger.Info().Str("user_id", userID).Msg("Cache miss")
	return nil, fmt.Errorf("cache miss")
}

// SetUserSkillProfile stores user skill profile in cache
func (c *CacheLayer) SetUserSkillProfile(ctx context.Context, userID string, skills []string, weights map[string]float64) error {
	cache := &MatchCache{
		UserSkillProfile: weights,
		LastUpdated:      time.Now(),
		TTL:              15 * time.Minute, // 15 minutes TTL
		Version:          1,
	}

	// Store in L1 cache
	c.L1.Store(userID, cache)

	// Store in L2 cache (Redis)
	key := fmt.Sprintf("user_skills:%s", userID)
	data, err := json.Marshal(cache)
	if err != nil {
		return fmt.Errorf("failed to marshal cache data: %w", err)
	}

	err = c.L2.Set(ctx, key, data, cache.TTL).Err()
	if err != nil {
		c.logger.Error().Err(err).Str("user_id", userID).Msg("Failed to store in L2 cache")
		return fmt.Errorf("failed to store in Redis: %w", err)
	}

	c.logger.Info().Str("user_id", userID).Msg("Cache stored")
	return nil
}

// GetJobRequirements retrieves job requirements from cache
func (c *CacheLayer) GetJobRequirements(ctx context.Context, jobID string) (*MatchCache, error) {
	// Try L1 cache first
	if cached, ok := c.L1.Load(jobID); ok {
		if cache, ok := cached.(*MatchCache); ok && !c.isExpired(cache) {
			c.logger.Info().Str("job_id", jobID).Msg("Cache hit L1")
			return cache, nil
		}
	}

	// Try L2 cache (Redis)
	key := fmt.Sprintf("job_requirements:%s", jobID)
	data, err := c.L2.Get(ctx, key).Result()
	if err == nil {
		var cache MatchCache
		if err := json.Unmarshal([]byte(data), &cache); err == nil && !c.isExpired(&cache) {
			// Store in L1 cache
			c.L1.Store(jobID, &cache)
			c.logger.Info().Str("job_id", jobID).Msg("Cache hit L2")
			return &cache, nil
		}
	}

	c.logger.Info().Str("job_id", jobID).Msg("Cache miss")
	return nil, fmt.Errorf("cache miss")
}

// SetJobRequirements stores job requirements in cache
func (c *CacheLayer) SetJobRequirements(ctx context.Context, jobID string, requirements map[string]float64) error {
	cache := &MatchCache{
		JobRequirements: requirements,
		LastUpdated:     time.Now(),
		TTL:             30 * time.Minute, // 30 minutes TTL for job data
		Version:         1,
	}

	// Store in L1 cache
	c.L1.Store(jobID, cache)

	// Store in L2 cache (Redis)
	key := fmt.Sprintf("job_requirements:%s", jobID)
	data, err := json.Marshal(cache)
	if err != nil {
		return fmt.Errorf("failed to marshal cache data: %w", err)
	}

	err = c.L2.Set(ctx, key, data, cache.TTL).Err()
	if err != nil {
		c.logger.Error().Err(err).Str("job_id", jobID).Msg("Failed to store in L2 cache")
		return fmt.Errorf("failed to store in Redis: %w", err)
	}

	c.logger.Info().Str("job_id", jobID).Msg("Cache stored")
	return nil
}

// GetMatchResult retrieves cached match result
func (c *CacheLayer) GetMatchResult(ctx context.Context, userID, jobID string) (*matching.MatchScore, error) {
	key := fmt.Sprintf("match:%s:%s", userID, jobID)
	
	// Try L1 cache first
	if cached, ok := c.L1.Load(key); ok {
		if cache, ok := cached.(*matching.MatchScore); ok {
			c.logger.Info().Str("user_id", userID).Str("job_id", jobID).Msg("Match cache hit L1")
			return cache, nil
		}
	}

	// Try L2 cache (Redis)
	data, err := c.L2.Get(ctx, key).Result()
	if err == nil {
		var matchScore matching.MatchScore
		if err := json.Unmarshal([]byte(data), &matchScore); err == nil {
			// Store in L1 cache
			c.L1.Store(key, &matchScore)
			c.logger.Info().Str("user_id", userID).Str("job_id", jobID).Msg("Match cache hit L2")
			return &matchScore, nil
		}
	}

	c.logger.Info().Str("user_id", userID).Str("job_id", jobID).Msg("Match cache miss")
	return nil, fmt.Errorf("cache miss")
}

// SetMatchResult stores match result in cache
func (c *CacheLayer) SetMatchResult(ctx context.Context, userID, jobID string, matchScore *matching.MatchScore) error {
	key := fmt.Sprintf("match:%s:%s", userID, jobID)
	
	// Store in L1 cache
	c.L1.Store(key, matchScore)

	// Store in L2 cache (Redis)
	data, err := json.Marshal(matchScore)
	if err != nil {
		return fmt.Errorf("failed to marshal match score: %w", err)
	}

	// Cache match results for 10 minutes
	err = c.L2.Set(ctx, key, data, 10*time.Minute).Err()
	if err != nil {
		c.logger.Error().Err(err).Str("user_id", userID).Str("job_id", jobID).Msg("Failed to store match in L2 cache")
		return fmt.Errorf("failed to store match in Redis: %w", err)
	}

	c.logger.Info().Str("user_id", userID).Str("job_id", jobID).Msg("Match cache stored")
	return nil
}

// InvalidateUserCache invalidates all cache entries for a user
func (c *CacheLayer) InvalidateUserCache(ctx context.Context, userID string) error {
	// Clear L1 cache
	c.L1.Delete(userID)
	
	// Clear L2 cache patterns
	patterns := []string{
		fmt.Sprintf("user_skills:%s", userID),
		fmt.Sprintf("match:%s:*", userID),
	}
	
	for _, pattern := range patterns {
		keys, err := c.L2.Keys(ctx, pattern).Result()
		if err != nil {
			c.logger.Error().Err(err).Str("pattern", pattern).Msg("Failed to get keys for invalidation")
			continue
		}
		
		if len(keys) > 0 {
			if err := c.L2.Del(ctx, keys...).Err(); err != nil {
				c.logger.Error().Err(err).Strs("keys", keys).Msg("Failed to delete cache keys")
			}
		}
	}
	
	c.logger.Info().Str("user_id", userID).Msg("User cache invalidated")
	return nil
}

// InvalidateJobCache invalidates all cache entries for a job
func (c *CacheLayer) InvalidateJobCache(ctx context.Context, jobID string) error {
	// Clear L1 cache
	c.L1.Delete(jobID)
	
	// Clear L2 cache patterns
	patterns := []string{
		fmt.Sprintf("job_requirements:%s", jobID),
		fmt.Sprintf("match:*:%s", jobID),
	}
	
	for _, pattern := range patterns {
		keys, err := c.L2.Keys(ctx, pattern).Result()
		if err != nil {
			c.logger.Error().Err(err).Str("pattern", pattern).Msg("Failed to get keys for invalidation")
			continue
		}
		
		if len(keys) > 0 {
			if err := c.L2.Del(ctx, keys...).Err(); err != nil {
				c.logger.Error().Err(err).Strs("keys", keys).Msg("Failed to delete cache keys")
			}
		}
	}
	
	c.logger.Info().Str("job_id", jobID).Msg("Job cache invalidated")
	return nil
}

// GetCacheStats returns cache statistics
func (c *CacheLayer) GetCacheStats(ctx context.Context) map[string]interface{} {
	// Get Redis info
	info, err := c.L2.Info(ctx, "memory").Result()
	if err != nil {
		c.logger.Error().Err(err).Msg("Failed to get Redis info")
	}
	
	// Count L1 cache entries
	l1Count := 0
	c.L1.Range(func(key, value interface{}) bool {
		l1Count++
		return true
	})
	
	return map[string]interface{}{
		"l1_cache_entries": l1Count,
		"redis_info":       info,
		"cache_layer":      "multi_layer",
	}
}

// Close closes the cache layer
func (c *CacheLayer) Close() error {
	return c.L2.Close()
}

// isExpired checks if cache entry is expired
func (c *CacheLayer) isExpired(cache *MatchCache) bool {
	return time.Since(cache.LastUpdated) > cache.TTL
}

// CacheMiddleware provides caching middleware for HTTP requests
func (c *CacheLayer) CacheMiddleware(ttl time.Duration) func(ctx context.Context, key string, handler func() (interface{}, error)) (interface{}, error) {
	return func(ctx context.Context, key string, handler func() (interface{}, error)) (interface{}, error) {
		// Try to get from cache first
		if data, err := c.L2.Get(ctx, key).Result(); err == nil {
			var result interface{}
			if err := json.Unmarshal([]byte(data), &result); err == nil {
				c.logger.Info().Str("key", key).Msg("Cache hit")
				return result, nil
			}
		}
		
		// Execute handler
		result, err := handler()
		if err != nil {
			return nil, err
		}
		
		// Store in cache
		if data, err := json.Marshal(result); err == nil {
			c.L2.Set(ctx, key, data, ttl)
			c.logger.Info().Str("key", key).Msg("Cache stored")
		}
		
		return result, nil
	}
}
