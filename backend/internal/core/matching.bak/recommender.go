package matching

import (
    "sort"
    "microbridge/backend/internal/models"
)

type Recommendation struct {
    Job        *models.Job  `json:"job"`
    Score      *MatchScore  `json:"score"`
    Rank       int          `json:"rank"`
    Reasoning  []string     `json:"reasoning"`
}

// Enhanced recommendations with better ranking
func (ms *MatchingService) GetRecommendations(user *models.User, jobs []*models.Job, limit int) ([]*Recommendation, error) {
    var recommendations []*Recommendation
    
    // Calculate scores for all jobs
    for _, job := range jobs {
        score, err := ms.CalculateMatchScore(user, job)
        if err != nil {
            continue
        }
        
        // Only include viable matches
        if score.OverallScore > 0.2 {
            recommendations = append(recommendations, &Recommendation{
                Job:       job,
                Score:     score,
                Reasoning: ms.generateRecommendationReasoning(score),
            })
        }
    }
    
    // Sort by overall score (descending)
    sort.Slice(recommendations, func(i, j int) bool {
        return recommendations[i].Score.OverallScore > recommendations[j].Score.OverallScore
    })
    
    // Add rankings
    for i, rec := range recommendations {
        rec.Rank = i + 1
    }
    
    // Limit results
    if len(recommendations) > limit {
        recommendations = recommendations[:limit]
    }
    
    return recommendations, nil
}

// Generate reasoning for recommendations
func (ms *MatchingService) generateRecommendationReasoning(score *MatchScore) []string {
    var reasons []string
    
    // Skill-based reasoning
    if score.ScoreBreakdown.Skills.Score > 0.3 {
        matchCount := len(score.ScoreBreakdown.Skills.MatchedSkills)
        reasons = append(reasons, 
            fmt.Sprintf("Strong skill match with %d relevant skills", matchCount))
    }
    
    // Experience reasoning
    if score.ScoreBreakdown.Experience > 0.15 {
        reasons = append(reasons, "Good experience level fit")
    }
    
    // Location reasoning
    if score.ScoreBreakdown.Location > 0.15 {
        reasons = append(reasons, "Convenient location or remote-friendly")
    }
    
    return reasons
}