package matching

import (
"math"
"strings"
"microbridge/backend/internal/models"
)

type MatchScore struct {
TotalScore    float64            json:"total_score"
Breakdown     map[string]float64 json:"breakdown"
MatchedSkills []string           json:"matched_skills"
MissingSkills []string           json:"missing_skills"
}

type MatchingAlgorithm struct{}

func NewMatchingAlgorithm() *MatchingAlgorithm {
return &MatchingAlgorithm{}
}

// CalculateMatchScore calculates the overall match score between a user and job
func (ma *MatchingAlgorithm) CalculateMatchScore(user *models.User, job *models.Job) *MatchScore {
scores := map[string]float64{
"skills":      ma.calculateSkillsScore(user.Skills, job.Skills),
"experience":  ma.calculateExperienceScore(user.ExperienceLevel, job.ExperienceLevel),
"location":    ma.calculateLocationScore(user.Location, job.Location, job.IsRemote),
"availability": ma.calculateAvailabilityScore(user.Availability, job.Duration),
"interest":    ma.calculateInterestScore(user.Interests, job.Category),
}

// Calculate weighted total score
totalScore := ma.calculateWeightedScore(scores)

// Get matched and missing skills
matchedSkills, missingSkills := ma.getSkillMatches(user.Skills, job.Skills)

return &MatchScore{
TotalScore:    totalScore,
Breakdown:     scores,
MatchedSkills: matchedSkills,
MissingSkills: missingSkills,
}
}

// calculateSkillsScore calculates skill matching score (0-1)
func (ma *MatchingAlgorithm) calculateSkillsScore(userSkills, jobSkills []string) float64 {
if len(jobSkills) == 0 {
return 0.0
}

userSkillSet := make(map[string]bool)
for _, skill := range userSkills {
userSkillSet[strings.ToLower(skill)] = true
}

matchedCount := 0
for _, skill := range jobSkills {
if userSkillSet[strings.ToLower(skill)] {
matchedCount++
}
}

return float64(matchedCount) / float64(len(jobSkills))
}

// calculateExperienceScore calculates experience level matching
func (ma *MatchingAlgorithm) calculateExperienceScore(userLevel, jobLevel string) float64 {
levels := map[string]int{
"Entry":        1,
"Intermediate": 2,
"Advanced":     3,
}

userScore := levels[userLevel]
jobScore := levels[jobLevel]

if userScore == 0 || jobScore == 0 {
return 0.5 // Default score for unknown levels
}

// Perfect match gets 1.0, one level difference gets 0.7, two levels gets 0.4
difference := int(math.Abs(float64(userScore - jobScore)))
return math.Max(0, 1-float64(difference)*0.3)
}

// calculateLocationScore calculates location compatibility
func (ma *MatchingAlgorithm) calculateLocationScore(userLocation, jobLocation string, isRemote bool) float64 {
if isRemote {
return 1.0 // Remote jobs are compatible with all locations
}

if userLocation == "" || jobLocation == "" {
return 0.5 // Partial score for missing data
}

if strings.EqualFold(userLocation, jobLocation) {
return 1.0 // Perfect location match
}

// Check if locations are in the same city/region
if ma.isSameRegion(userLocation, jobLocation) {
return 0.8
}

return 0.3 // Different locations
}

// calculateAvailabilityScore calculates availability compatibility
func (ma *MatchingAlgorithm) calculateAvailabilityScore(userAvailability, jobDuration string) float64 {
if userAvailability == "" || jobDuration == "" {
return 0.5
}

// Simple scoring based on availability matching
if strings.Contains(strings.ToLower(userAvailability), "flexible") {
return 0.9
}

if strings.Contains(strings.ToLower(userAvailability), "immediate") {
return 0.8
}

return 0.6 // Default score
}

// calculateInterestScore calculates interest alignment
func (ma *MatchingAlgorithm) calculateInterestScore(userInterests []string, jobCategory string) float64 {
if len(userInterests) == 0 || jobCategory == "" {
return 0.5
}

jobCategoryLower := strings.ToLower(jobCategory)
for _, interest := range userInterests {
if strings.Contains(jobCategoryLower, strings.ToLower(interest)) {
return 1.0
}
}

return 0.3 // No interest match
}

// calculateWeightedScore calculates weighted total score
func (ma *MatchingAlgorithm) calculateWeightedScore(scores map[string]float64) float64 {
weights := map[string]float64{
"skills":      0.35, // Skills are most important
"experience":  0.25,
"location":    0.20,
"availability": 0.15,
"interest":    0.05,
}

totalScore := 0.0
totalWeight := 0.0

for category, score := range scores {
weight := weights[category]
totalScore += score * weight
totalWeight += weight
}

if totalWeight == 0 {
return 0.0
}

return totalScore / totalWeight
}

// getSkillMatches returns matched and missing skills
func (ma *MatchingAlgorithm) getSkillMatches(userSkills, jobSkills []string) ([]string, []string) {
userSkillSet := make(map[string]bool)
for _, skill := range userSkills {
userSkillSet[strings.ToLower(skill)] = true
}

var matchedSkills []string
var missingSkills []string

for _, skill := range jobSkills {
if userSkillSet[strings.ToLower(skill)] {
matchedSkills = append(matchedSkills, skill)
} else {
missingSkills = append(missingSkills, skill)
}
}

return matchedSkills, missingSkills
}

// isSameRegion checks if two locations are in the same region
func (ma *MatchingAlgorithm) isSameRegion(loc1, loc2 string) bool {
// Simple implementation - can be enhanced with geocoding
loc1Lower := strings.ToLower(loc1)
loc2Lower := strings.ToLower(loc2)

// Check for common city names or regions
commonCities := []string{"hong kong", "hk", "kowloon", "new territories"}

for _, city := range commonCities {
if strings.Contains(loc1Lower, city) && strings.Contains(loc2Lower, city) {
return true
}
}

return false
}
