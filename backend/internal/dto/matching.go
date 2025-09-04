package dto

import "time"

// MatchScore represents the match score between a user and job
type MatchScore struct {
	UserID         string             `json:"user_id"`
	JobID          string             `json:"job_id"`
	OverallScore   float64            `json:"overall_score"`
	SkillScore     float64            `json:"skill_score"`
	ExperienceScore float64           `json:"experience_score"`
	LocationScore  float64            `json:"location_score"`
	AvailabilityScore float64         `json:"availability_score"`
	SkillMatches   map[string]float64 `json:"skill_matches"`
	Reasons        []string           `json:"reasons"`
	CalculatedAt   time.Time          `json:"calculated_at"`
}

// MatchingAnalytics represents matching analytics for a user
type MatchingAnalytics struct {
	UserID           string    `json:"user_id"`
	TotalMatches     int       `json:"total_matches"`
	AverageScore     float64   `json:"average_score"`
	TopSkills        []string  `json:"top_skills"`
	RecommendedCategories []string `json:"recommended_categories"`
	MatchTrends      []float64 `json:"match_trends"`
	LastUpdated      time.Time `json:"last_updated"`
}

// UserInsights represents insights about a user's profile and matching performance
type UserInsights struct {
	UserID              string             `json:"user_id"`
	ProfileCompleteness float64            `json:"profile_completeness"`
	SkillGaps          []string           `json:"skill_gaps"`
	MarketDemand       map[string]float64 `json:"market_demand"`
	SuggestedSkills    []string           `json:"suggested_skills"`
	CompetitionLevel   string             `json:"competition_level"`
	MatchingTips       []string           `json:"matching_tips"`
	LastUpdated        time.Time          `json:"last_updated"`
}

// TokenClaims represents JWT token claims
type TokenClaims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	IssuedAt int64  `json:"iat"`
	ExpiresAt int64 `json:"exp"`
}