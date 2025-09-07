package matching

import (
    "math"
    "strings"
	"microbridge/backend/internal/models"
)

type MatchScore struct {
	TotalScore    float64            `json:"total_score"`
	UserToJobScore float64           `json:"user_to_job_score"`
	JobToUserScore float64           `json:"job_to_user_score"`
	Breakdown     map[string]float64 `json:"breakdown"`
	MatchedSkills []string           `json:"matched_skills"`
	MissingSkills []string           `json:"missing_skills"`
	SkillGaps     []SkillGap         `json:"skill_gaps"`
	MatchQuality  string             `json:"match_quality"`
	Recommendations []string         `json:"recommendations"`
}

type SkillGap struct {
	Skill         string  `json:"skill"`
	CurrentLevel  int     `json:"current_level"`
	RequiredLevel int     `json:"required_level"`
	GapSize       int     `json:"gap_size"`
	Importance    float64 `json:"importance"`
}

type MatchingAlgorithm struct{}

func NewMatchingAlgorithm() *MatchingAlgorithm {
	return &MatchingAlgorithm{}
}

// CalculateMatchScore calculates the overall match score between a user and job
func (ma *MatchingAlgorithm) CalculateMatchScore(user *models.User, job *models.Job) *MatchScore {
    // Early knockout check
	if !ma.isViableMatch(user, job) {
        return &MatchScore{
			TotalScore:    0.0,
			MatchQuality:  "not_viable",
            Recommendations: []string{"This position has requirements that don't match your current profile"},
		}
	}

	// Calculate User → Job compatibility (how well user fits the job)
	u2jSkills := ma.calculateSkillsScore(user.Skills, job.Skills)
	u2jExperience := ma.calculateExperienceScore(user.ExperienceLevel, job.ExperienceLevel)
	u2jLocation := ma.calculateLocationScore(user.Location, job.Location, job.IsRemote)
	u2jAvailability := ma.calculateAvailabilityScore(user.Availability, job.Duration)
	u2jLearning := ma.calculateLearningGoalsScore(user, job)

	// Calculate Job → User compatibility (how well job fits user's preferences)
	j2uInterest := ma.calculateInterestScore(user.Interests, job.Category)
	j2uTimeCommitment := ma.calculateTimeCommitmentScore(user, job)
	j2uCareerFit := ma.calculateCareerFitScore(user, job)

    // Combine scores using weighted approach
	userToJob := ma.calculateUserToJobScore(u2jSkills, u2jExperience, u2jLocation, u2jAvailability, u2jLearning)
	jobToUser := ma.calculateJobToUserScore(j2uInterest, j2uTimeCommitment, j2uCareerFit, u2jLearning)

    // Final harmonic mean for balanced consideration
	overallScore := ma.calculateHarmonicMean(userToJob, jobToUser)

	// Get matched and missing skills with gap analysis
	matchedSkills, missingSkills, skillGaps := ma.getSkillMatchesWithGaps(user.Skills, job.Skills)

    // Determine match quality and generate recommendations
	matchQuality, recommendations := ma.generateMatchInsights(overallScore, u2jSkills, user, job)

    return &MatchScore{
		TotalScore:     overallScore,
        UserToJobScore: userToJob,
        JobToUserScore: jobToUser,
		Breakdown: map[string]float64{
			"skills":       u2jSkills,
			"experience":   u2jExperience,
			"location":     u2jLocation,
			"availability": u2jAvailability,
			"interest":     j2uInterest,
			"learning":     u2jLearning,
			"time_commitment": j2uTimeCommitment,
			"career_fit":   j2uCareerFit,
		},
		MatchedSkills:   matchedSkills,
		MissingSkills:   missingSkills,
		SkillGaps:       skillGaps,
        MatchQuality:    matchQuality,
        Recommendations: recommendations,
	}
}

// isViableMatch performs early knockout checks
func (ma *MatchingAlgorithm) isViableMatch(user *models.User, job *models.Job) bool {
	// Check if user has any skills
	if len(user.Skills) == 0 {
		return false
	}

	// Check if job has any required skills
	if len(job.Skills) == 0 {
		return false
	}

	// Check experience level compatibility
	if !ma.isExperienceCompatible(user.ExperienceLevel, job.ExperienceLevel) {
		return false
	}

	return true
}

// isExperienceCompatible checks if user experience level is compatible with job requirements
func (ma *MatchingAlgorithm) isExperienceCompatible(userLevel, jobLevel string) bool {
	levels := map[string]int{
		"Entry":        1,
		"Intermediate": 2,
		"Advanced":     3,
	}

	userScore := levels[userLevel]
	jobScore := levels[jobLevel]

	// User can apply to jobs at their level or one level below
	return userScore >= jobScore-1
}

// calculateSkillsScore calculates skill matching score (0-1) with enhanced logic
func (ma *MatchingAlgorithm) calculateSkillsScore(userSkills models.SkillsArray, jobSkills models.RequiredSkillsArray) float64 {
	if len(jobSkills) == 0 {
		return 0.0
	}

	userSkillSet := make(map[string]bool)
	for _, skill := range userSkills {
		userSkillSet[strings.ToLower(skill.Name)] = true
	}

	matchedCount := 0
	totalWeight := 0.0
	weightedScore := 0.0

	// Calculate weighted scores based on skill importance and requirements
	for _, skill := range jobSkills {
		weight := skill.Importance
		if skill.IsRequired {
			weight *= 1.5 // Required skills are more important
		}
		totalWeight += weight

		if userSkillSet[strings.ToLower(skill.Name)] {
			matchedCount++
			weightedScore += weight
		}
	}

	if totalWeight == 0 {
		return 0.0
	}

	return weightedScore / totalWeight
}

// calculateExperienceScore calculates experience level matching with improved logic
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
	score := math.Max(0, 1-float64(difference)*0.3)

	// Bonus for overqualified candidates (but not too much)
	if userScore > jobScore {
		score = math.Min(score+0.1, 1.0)
	}
    
    return score
}

// calculateLocationScore calculates location compatibility with enhanced logic
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

	// Check if locations are in the same country
	if ma.isSameCountry(userLocation, jobLocation) {
		return 0.6
	}

	return 0.3 // Different locations
}

// calculateAvailabilityScore calculates availability compatibility
func (ma *MatchingAlgorithm) calculateAvailabilityScore(userAvailability models.Availability, jobDuration int) float64 {
	if jobDuration <= 0 {
		return 0.5
	}

	// Calculate score based on hours per week compatibility
	userHoursPerWeek := float64(userAvailability.HoursPerWeek)
	jobHoursPerWeek := float64(jobDuration) // Assuming duration is hours per week

	if userAvailability.IsFlexible {
		return 0.9
	}

	// Calculate compatibility based on hours
	if userHoursPerWeek >= jobHoursPerWeek {
		return 1.0 // User can commit required hours
	}

	// Partial availability compatibility
	ratio := userHoursPerWeek / jobHoursPerWeek
	if ratio >= 0.8 {
		return 0.8 // Close match
	} else if ratio >= 0.6 {
		return 0.6 // Partial match
	} else {
		return 0.3 // Poor match
	}
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

// calculateLearningGoalsScore calculates alignment with user's learning goals
func (ma *MatchingAlgorithm) calculateLearningGoalsScore(user *models.User, job *models.Job) float64 {
	// This could be enhanced with actual learning goals data
	// For now, we'll use a simple heuristic based on skill gaps
	if len(user.Skills) == 0 || len(job.Skills) == 0 {
		return 0.5
	}

	userSkillSet := make(map[string]bool)
	for _, skill := range user.Skills {
		userSkillSet[strings.ToLower(skill.Name)] = true
	}

	missingSkills := 0
	for _, skill := range job.Skills {
		if !userSkillSet[strings.ToLower(skill.Name)] {
			missingSkills++
		}
	}

	// Some learning opportunity is good, but too many gaps might be overwhelming
	learningRatio := float64(missingSkills) / float64(len(job.Skills))
	if learningRatio <= 0.3 {
		return 0.8 // Good learning opportunity
	} else if learningRatio <= 0.6 {
		return 0.6 // Moderate learning opportunity
	} else {
		return 0.3 // Too many gaps
	}
}

// calculateTimeCommitmentScore calculates if the job fits user's time availability
func (ma *MatchingAlgorithm) calculateTimeCommitmentScore(user *models.User, job *models.Job) float64 {
	// Use the availability scoring logic
	return ma.calculateAvailabilityScore(user.Availability, job.Duration)
}

// calculateCareerFitScore calculates overall career fit
func (ma *MatchingAlgorithm) calculateCareerFitScore(user *models.User, job *models.Job) float64 {
	// This could be enhanced with career path analysis
	// For now, we'll use a combination of experience and interest alignment
	experienceScore := ma.calculateExperienceScore(user.ExperienceLevel, job.ExperienceLevel)
	interestScore := ma.calculateInterestScore(user.Interests, job.Category)

	return (experienceScore + interestScore) / 2.0
}

// calculateUserToJobScore calculates weighted user-to-job compatibility
func (ma *MatchingAlgorithm) calculateUserToJobScore(skills, experience, location, availability, learning float64) float64 {
	weights := map[string]float64{
		"skills":      0.35, // Skills are most important
		"experience":  0.25,
		"location":    0.20,
		"availability": 0.15,
		"learning":    0.05,
	}

	scores := map[string]float64{
		"skills":       skills,
		"experience":   experience,
		"location":     location,
		"availability": availability,
		"learning":     learning,
	}

	return ma.calculateWeightedScore(scores, weights)
}

// calculateJobToUserScore calculates weighted job-to-user compatibility
func (ma *MatchingAlgorithm) calculateJobToUserScore(interest, timeCommitment, careerFit, learning float64) float64 {
	weights := map[string]float64{
		"interest":       0.40, // Interest is most important for job-to-user
		"career_fit":     0.30,
		"time_commitment": 0.20,
		"learning":       0.10,
	}

	scores := map[string]float64{
		"interest":        interest,
		"career_fit":      careerFit,
		"time_commitment": timeCommitment,
		"learning":        learning,
	}

	return ma.calculateWeightedScore(scores, weights)
}

// calculateHarmonicMean calculates harmonic mean for balanced scoring
func (ma *MatchingAlgorithm) calculateHarmonicMean(a, b float64) float64 {
	if a == 0 || b == 0 {
		return 0.0
	}
	return 2.0 * a * b / (a + b)
}

// calculateWeightedScore calculates weighted total score
func (ma *MatchingAlgorithm) calculateWeightedScore(scores map[string]float64, weights map[string]float64) float64 {
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

// getSkillMatchesWithGaps returns matched and missing skills with gap analysis
func (ma *MatchingAlgorithm) getSkillMatchesWithGaps(userSkills models.SkillsArray, jobSkills models.RequiredSkillsArray) ([]string, []string, []SkillGap) {
	userSkillMap := make(map[string]models.UserSkill)
	for _, skill := range userSkills {
		userSkillMap[strings.ToLower(skill.Name)] = skill
	}

	var matchedSkills []string
	var missingSkills []string
	var skillGaps []SkillGap

	for _, jobSkill := range jobSkills {
		skillName := jobSkill.Name
		if userSkill, exists := userSkillMap[strings.ToLower(skillName)]; exists {
			matchedSkills = append(matchedSkills, skillName)
			
			// Check for skill level gaps even if skill exists
			if userSkill.Level < jobSkill.Level {
				skillGaps = append(skillGaps, SkillGap{
					Skill:         skillName,
					CurrentLevel:  userSkill.Level,
					RequiredLevel: jobSkill.Level,
					GapSize:       jobSkill.Level - userSkill.Level,
					Importance:    jobSkill.Importance,
				})
			}
		} else {
			missingSkills = append(missingSkills, skillName)
			// Create skill gap for missing skill
			skillGaps = append(skillGaps, SkillGap{
				Skill:         skillName,
				CurrentLevel:  0,
				RequiredLevel: jobSkill.Level,
				GapSize:       jobSkill.Level,
				Importance:    jobSkill.Importance,
			})
		}
	}

	return matchedSkills, missingSkills, skillGaps
}

// generateMatchInsights generates match quality and recommendations
func (ma *MatchingAlgorithm) generateMatchInsights(overallScore, skillsScore float64, user *models.User, job *models.Job) (string, []string) {
	var matchQuality string
    var recommendations []string
    
    // Determine match quality
	if overallScore >= 0.8 {
		matchQuality = "excellent"
		recommendations = append(recommendations, "This is an excellent match for your profile!")
	} else if overallScore >= 0.6 {
		matchQuality = "good"
		recommendations = append(recommendations, "This is a good match for your skills and experience")
	} else if overallScore >= 0.4 {
		matchQuality = "fair"
		recommendations = append(recommendations, "This position has some alignment with your profile")
	} else {
		matchQuality = "poor"
		recommendations = append(recommendations, "Consider focusing on roles better suited to your current profile")
	}

	// Skill-based recommendations
	if skillsScore < 0.5 {
		recommendations = append(recommendations, "Consider developing the required skills for this role")
	}

	// Experience-based recommendations
	if user.ExperienceLevel == "Entry" && job.ExperienceLevel == "Advanced" {
		recommendations = append(recommendations, "This role may require more experience than you currently have")
	}

	// Location-based recommendations
	if !job.IsRemote && user.Location != job.Location {
		recommendations = append(recommendations, "This position requires on-site work in a different location")
	}

	return matchQuality, recommendations
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

// isSameCountry checks if two locations are in the same country
func (ma *MatchingAlgorithm) isSameCountry(loc1, loc2 string) bool {
	// Simple implementation - can be enhanced with geocoding
	loc1Lower := strings.ToLower(loc1)
	loc2Lower := strings.ToLower(loc2)

	// Check for country indicators
	countryIndicators := []string{"hong kong", "hk", "china", "cn"}

	for _, country := range countryIndicators {
		if strings.Contains(loc1Lower, country) && strings.Contains(loc2Lower, country) {
			return true
		}
	}

	return false
}