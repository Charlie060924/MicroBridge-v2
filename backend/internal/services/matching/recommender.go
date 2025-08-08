package matching

import (
"sort"
"microbridge/backend/internal/models"
"gorm.io/gorm"
)

type Recommendation struct {
Job         *models.Job  json:"job"
MatchScore  *MatchScore  json:"match_score"
Rank        int          json:"rank"
}

type Recommender struct {
algorithm *MatchingAlgorithm
db        *gorm.DB
}

func NewRecommender(db *gorm.DB) *Recommender {
return &Recommender{
algorithm: NewMatchingAlgorithm(),
db:        db,
}
}

// GetRecommendations returns personalized job recommendations for a user
func (r *Recommender) GetRecommendations(userID string, limit int) ([]Recommendation, error) {
// Get user
var user models.User
if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
return nil, err
}

// Get active jobs
var jobs []models.Job
if err := r.db.Where("status = ?", "Active").
Preload("Employer").
Order("created_at DESC").
Find(&jobs).Error; err != nil {
return nil, err
}

// Calculate match scores for all jobs
var recommendations []Recommendation
for _, job := range jobs {
matchScore := r.algorithm.CalculateMatchScore(&user, &job)

recommendations = append(recommendations, Recommendation{
Job:        &job,
MatchScore: matchScore,
})
}

// Sort by match score (highest first)
sort.Slice(recommendations, func(i, j int) bool {
return recommendations[i].MatchScore.TotalScore > recommendations[j].MatchScore.TotalScore
})

// Add rank and limit results
for i := range recommendations {
recommendations[i].Rank = i + 1
}

if limit > 0 && limit < len(recommendations) {
recommendations = recommendations[:limit]
}

return recommendations, nil
}

// GetSimilarJobs returns jobs similar to a given job
func (r *Recommender) GetSimilarJobs(jobID string, limit int) ([]Recommendation, error) {
var targetJob models.Job
if err := r.db.Where("id = ?", jobID).First(&targetJob).Error; err != nil {
return nil, err
}

// Get other active jobs
var jobs []models.Job
if err := r.db.Where("status = ? AND id != ?", "Active", jobID).
Preload("Employer").
Find(&jobs).Error; err != nil {
return nil, err
}

// Calculate similarity scores
var recommendations []Recommendation
for _, job := range jobs {
similarityScore := r.calculateJobSimilarity(&targetJob, &job)

recommendations = append(recommendations, Recommendation{
Job: &job,
MatchScore: &MatchScore{
TotalScore: similarityScore,
Breakdown: map[string]float64{
"similarity": similarityScore,
},
},
})
}

// Sort by similarity score
sort.Slice(recommendations, func(i, j int) bool {
return recommendations[i].MatchScore.TotalScore > recommendations[j].MatchScore.TotalScore
})

// Add rank and limit results
for i := range recommendations {
recommendations[i].Rank = i + 1
}

if limit > 0 && limit < len(recommendations) {
recommendations = recommendations[:limit]
}

return recommendations, nil
}

// calculateJobSimilarity calculates similarity between two jobs
func (r *Recommender) calculateJobSimilarity(job1, job2 *models.Job) float64 {
// Calculate skill similarity
skillSimilarity := r.calculateSkillsSimilarity(job1.Skills, job2.Skills)

// Calculate category similarity
categorySimilarity := 0.0
if job1.Category == job2.Category {
categorySimilarity = 1.0
}

// Calculate experience level similarity
expSimilarity := r.calculateExperienceSimilarity(job1.ExperienceLevel, job2.ExperienceLevel)

// Weighted average
return (skillSimilarity*0.5 + categorySimilarity*0.3 + expSimilarity*0.2)
}

// calculateSkillsSimilarity calculates similarity between skill sets
func (r *Recommender) calculateSkillsSimilarity(skills1, skills2 []string) float64 {
if len(skills1) == 0 || len(skills2) == 0 {
return 0.0
}

skillSet1 := make(map[string]bool)
for _, skill := range skills1 {
skillSet1[skill] = true
}

intersection := 0
for _, skill := range skills2 {
if skillSet1[skill] {
intersection++
}
}

union := len(skills1) + len(skills2) - intersection
if union == 0 {
return 0.0
}

return float64(intersection) / float64(union)
}

// calculateExperienceSimilarity calculates similarity between experience levels
func (r *Recommender) calculateExperienceSimilarity(level1, level2 string) float64 {
levels := map[string]int{
"Entry":        1,
"Intermediate": 2,
"Advanced":     3,
}

score1 := levels[level1]
score2 := levels[level2]

if score1 == 0 || score2 == 0 {
return 0.5
}

difference := abs(score1 - score2)
return 1.0 - float64(difference)*0.3
}

func abs(x int) int {
if x < 0 {
return -x
}
return x
}
