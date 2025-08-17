package matching

import (
	"context"
	"fmt"
	"time"
	
	"microbridge/backend/internal/cache"
	"microbridge/backend/internal/monitoring"
	"microbridge/backend/internal/models"
)

type CachedMatchingService struct {
	baseService *MatchingService
	cache       *cache.MatchingCache
}

func NewCachedMatchingService(baseService *MatchingService, cache *cache.MatchingCache) *CachedMatchingService {
	return &CachedMatchingService{
		baseService: baseService,
		cache:       cache,
	}
}

func (s *CachedMatchingService) FindMatches(ctx context.Context, userID string, limit int) ([]cache.MatchResult, error) {
	start := time.Now()
	defer func() {
		monitoring.RecordMatchingOperation("cached_find_matches", time.Since(start), limit)
	}()
	
	// Try cache first
	if matches, found := s.cache.GetMatches(ctx, userID); found {
		monitoring.RecordCacheOperation("matching", "get", true)
		return matches[:min(len(matches), limit)], nil
	}
	
	monitoring.RecordCacheOperation("matching", "get", false)
	
	// Calculate matches using base service
	matches, err := s.baseService.FindJobsForUser(ctx, userID, limit*2) // Get more for better caching
	if err != nil {
		monitoring.RecordError("matching_calculation", "cached_service")
		return nil, fmt.Errorf("failed to calculate matches: %w", err)
	}
	
	// Convert to cache format
	cacheMatches := make([]cache.MatchResult, len(matches))
	for i, match := range matches {
		cacheMatches[i] = cache.MatchResult{
			JobID:             match.JobID,
			UserToJobScore:    match.UserToJobScore,
			JobToUserScore:    match.JobToUserScore,
			HarmonicMean:      match.HarmonicMeanScore,
			SkillMatches:      match.SkillMatchDetails,
			CalculatedAt:      time.Now(),
		}
	}
	
	// Cache the results
	if err := s.cache.SetMatches(ctx, userID, cacheMatches); err != nil {
		// Log but don't fail the request
		monitoring.RecordError("cache_set", "cached_service")
	}
	
	return cacheMatches[:min(len(cacheMatches), limit)], nil
}

func (s *CachedMatchingService) InvalidateUserCache(ctx context.Context, userID string) error {
	return s.cache.InvalidateUserMatches(ctx, userID)
}

func (s *CachedMatchingService) InvalidateJobCache(ctx context.Context, jobID string) error {
	return s.cache.InvalidateJobMatches(ctx, jobID)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
