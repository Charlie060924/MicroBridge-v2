package matching

import (
	"context"
	"fmt"
	"time"

	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
)

type MatchingService struct {
	userRepo repository.UserRepository
	jobRepo  repository.JobRepository
}

func NewMatchingService(userRepo repository.UserRepository, jobRepo repository.JobRepository) *MatchingService {
	return &MatchingService{
		userRepo: userRepo,
		jobRepo:  jobRepo,
	}
}

// FindJobsForUser finds matching jobs for a user
func (s *MatchingService) FindJobsForUser(ctx context.Context, userID string, limit int) ([]MatchResult, error) {
	// Get user
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Get active jobs
	var jobs []models.Job
	if err := s.jobRepo.GetActiveJobs(ctx, &jobs, 1000); err != nil {
		return nil, fmt.Errorf("failed to get active jobs: %w", err)
	}

	// Calculate matches
	var results []MatchResult
	for _, job := range jobs {
		match := s.calculateMatch(user, &job)
		if match.HarmonicMeanScore > 0.3 { // Only keep decent matches
			results = append(results, match)
		}
	}

	// Sort by score (descending)
	for i := 0; i < len(results)-1; i++ {
		for j := i + 1; j < len(results); j++ {
			if results[i].HarmonicMeanScore < results[j].HarmonicMeanScore {
				results[i], results[j] = results[j], results[i]
			}
		}
	}

	// Limit results
	if len(results) > limit {
		results = results[:limit]
	}

	return results, nil
}

// calculateMatch calculates the match between a user and job
func (s *MatchingService) calculateMatch(user *models.User, job *models.Job) MatchResult {
	// Calculate skill match scores
	userToJobScore := s.calculateSkillMatchScore(user.Skills, job.Skills)
	jobToUserScore := s.calculateSkillMatchScore(job.Skills, user.Skills)

	// Apply experience level multiplier
	userToJobScore *= s.getExperienceLevelMultiplier(user.ExperienceLevel, job.ExperienceLevel)

	// Apply location bonus
	if s.isLocationMatch(user.Location, job.Location, job.IsRemote) {
		userToJobScore *= 1.1
		jobToUserScore *= 1.1
	}

	// Calculate harmonic mean
	harmonicMean := s.calculateHarmonicMean(userToJobScore, jobToUserScore)

	return MatchResult{
		JobID:             job.ID,
		UserToJobScore:    userToJobScore,
		JobToUserScore:    jobToUserScore,
		HarmonicMeanScore: harmonicMean,
		SkillMatchDetails: s.getSkillMatchDetails(user.Skills, job.Skills),
		CalculatedAt:      time.Now(),
	}
}

// calculateSkillMatchScore calculates how well user skills match job requirements
func (s *MatchingService) calculateSkillMatchScore(userSkills, jobSkills interface{}) float64 {
	// Convert skills to maps for easier comparison
	userSkillMap := s.skillsToMap(userSkills)
	jobSkillMap := s.skillsToMap(jobSkills)

	if len(jobSkillMap) == 0 {
		return 0.0
	}

	totalJobWeight := 0.0
	matchedWeight := 0.0

	for skill, jobWeight := range jobSkillMap {
		totalJobWeight += jobWeight
		if userWeight, hasSkill := userSkillMap[skill]; hasSkill {
			matchedWeight += userWeight * jobWeight
		}
	}

	if totalJobWeight == 0 {
		return 0.0
	}

	return matchedWeight / totalJobWeight
}

// skillsToMap converts skills interface to a map
func (s *MatchingService) skillsToMap(skills interface{}) map[string]float64 {
	result := make(map[string]float64)

	switch skillsData := skills.(type) {
	case []string:
		for _, skill := range skillsData {
			result[skill] = 1.0
		}
	case map[string]interface{}:
		for skill, weight := range skillsData {
			if w, ok := weight.(float64); ok {
				result[skill] = w
			} else {
				result[skill] = 1.0
			}
		}
	case []models.RequiredSkill:
		for _, skill := range skillsData {
			result[skill.Name] = skill.Importance
		}
	}

	return result
}

// getExperienceLevelMultiplier returns a multiplier based on experience level match
func (s *MatchingService) getExperienceLevelMultiplier(userLevel, jobLevel string) float64 {
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

// isLocationMatch checks if user and job locations match
func (s *MatchingService) isLocationMatch(userLocation, jobLocation string, isRemote bool) bool {
	if isRemote {
		return true
	}
	return userLocation == jobLocation
}

// calculateHarmonicMean calculates the harmonic mean of two scores
func (s *MatchingService) calculateHarmonicMean(score1, score2 float64) float64 {
	if score1 == 0 || score2 == 0 {
		return 0
	}
	return 2 * score1 * score2 / (score1 + score2)
}

// getSkillMatchDetails returns detailed skill match information
func (s *MatchingService) getSkillMatchDetails(userSkills, jobSkills interface{}) map[string]float64 {
	details := make(map[string]float64)
	userSkillMap := s.skillsToMap(userSkills)
	jobSkillMap := s.skillsToMap(jobSkills)

	for skill, jobWeight := range jobSkillMap {
		if userWeight, exists := userSkillMap[skill]; exists {
			details[skill] = userWeight * jobWeight
		} else {
			details[skill] = 0.0 // Missing skill
		}
	}

	return details
}

// MatchResult represents a match between a user and job
type MatchResult struct {
	JobID             string                 `json:"job_id"`
	UserToJobScore    float64                `json:"user_to_job_score"`
	JobToUserScore    float64                `json:"job_to_user_score"`
	HarmonicMeanScore float64                `json:"harmonic_mean_score"`
	SkillMatchDetails map[string]float64     `json:"skill_match_details"`
	CalculatedAt      time.Time              `json:"calculated_at"`
}
