package models

import (
    "database/sql/driver"
    "encoding/json"
    "time"
)

type Application struct {
    ID              string              `json:"id" gorm:"primaryKey"`
    UserID          string              `json:"user_id" gorm:"index"`
    JobID           string              `json:"job_id" gorm:"index"`
    
    // Application details
    Status          string              `json:"status"`          // "draft" | "submitted" | "reviewed" | "interviewed" | "accepted" | "rejected"
    CoverLetter     string              `json:"cover_letter"`
    CustomResume    string              `json:"custom_resume"`
    
    // Enhanced matching data
    MatchScore      float64             `json:"match_score"`
    ScoreBreakdown  DetailedScoreBreakdown `json:"score_breakdown" gorm:"type:jsonb"`
    
    // Application tracking
    AppliedAt       time.Time           `json:"applied_at"`
    ReviewedAt      *time.Time          `json:"reviewed_at,omitempty"`
    ResponseAt      *time.Time          `json:"response_at,omitempty"`
    
    // Feedback and notes
    EmployerFeedback    string          `json:"employer_feedback"`
    CandidateFeedback   string          `json:"candidate_feedback"`
    InternalNotes       string          `json:"internal_notes"`
    
    // Interview scheduling
    InterviewScheduled  *time.Time      `json:"interview_scheduled,omitempty"`
    InterviewNotes      string          `json:"interview_notes"`
    
    // Timestamps
    CreatedAt       time.Time           `json:"created_at"`
    UpdatedAt       time.Time           `json:"updated_at"`
}

// Enhanced score breakdown with detailed analytics
type DetailedScoreBreakdown struct {
    OverallScore        float64                 `json:"overall_score"`
    UserToJobScore      float64                 `json:"user_to_job_score"`
    JobToUserScore      float64                 `json:"job_to_user_score"`
    
    // Detailed component scores
    Skills              SkillMatchBreakdown     `json:"skills"`
    Experience          ExperienceBreakdown     `json:"experience"`
    Location            LocationBreakdown       `json:"location"`
    Availability        AvailabilityBreakdown   `json:"availability"`
    Interest            InterestBreakdown       `json:"interest"`
    LearningGoals       LearningGoalsBreakdown  `json:"learning_goals"`
    
    // Match quality and insights
    MatchQuality        string                  `json:"match_quality"`      // "excellent" | "good" | "fair" | "poor"
    StrengthAreas       []string                `json:"strength_areas"`
    ImprovementAreas    []string                `json:"improvement_areas"`
    Recommendations     []string                `json:"recommendations"`
    
    // Calculated at application time
    CalculatedAt        time.Time               `json:"calculated_at"`
    AlgorithmVersion    string                  `json:"algorithm_version"`
}

type SkillMatchBreakdown struct {
    Score               float64             `json:"score"`
    TotalSkillsRequired int                 `json:"total_skills_required"`
    SkillsMatched       int                 `json:"skills_matched"`
    SkillsPartialMatch  int                 `json:"skills_partial_match"`
    SkillsMissing       int                 `json:"skills_missing"`
    
    // Detailed skill analysis
    ExactMatches        []SkillMatch        `json:"exact_matches"`
    PartialMatches      []SkillMatch        `json:"partial_matches"`
    MissingSkills       []MissingSkill      `json:"missing_skills"`
    BonusSkills         []UserSkill         `json:"bonus_skills"`
    
    // Skill development insights
    SkillGaps           []SkillGap          `json:"skill_gaps"`
    LearningPath        []string            `json:"learning_path"`
}

type SkillMatch struct {
    SkillName           string  `json:"skill_name"`
    UserLevel           int     `json:"user_level"`
    RequiredLevel       int     `json:"required_level"`
    Similarity          float64 `json:"similarity"`
    IsExactMatch        bool    `json:"is_exact_match"`
    Confidence          float64 `json:"confidence"`
}

type MissingSkill struct {
    SkillName           string  `json:"skill_name"`
    RequiredLevel       int     `json:"required_level"`
    Importance          float64 `json:"importance"`
    IsRequired          bool    `json:"is_required"`
    CanLearn            bool    `json:"can_learn"`
    EstimatedLearningTime string `json:"estimated_learning_time"`
}

type SkillGap struct {
    SkillName           string  `json:"skill_name"`
    CurrentLevel        int     `json:"current_level"`
    RequiredLevel       int     `json:"required_level"`
    GapSize             int     `json:"gap_size"`
    Priority            string  `json:"priority"`           // "high" | "medium" | "low"
    Actionable          bool    `json:"actionable"`
}

type ExperienceBreakdown struct {
    Score               float64 `json:"score"`
    UserExperience      string  `json:"user_experience"`
    RequiredExperience  string  `json:"required_experience"`
    ExperienceGap       int     `json:"experience_gap"`     // Positive if over-qualified, negative if under-qualified
    IsGoodFit           bool    `json:"is_good_fit"`
}

type LocationBreakdown struct {
    Score               float64 `json:"score"`
    UserLocation        string  `json:"user_location"`
    JobLocation         string  `json:"job_location"`
    IsRemoteCompatible  bool    `json:"is_remote_compatible"`
    Distance            float64 `json:"distance,omitempty"`  // In kilometers
    CommuteTime         int     `json:"commute_time,omitempty"` // In minutes
}

type AvailabilityBreakdown struct {
    Score               float64 `json:"score"`
    UserHoursPerWeek    int     `json:"user_hours_per_week"`
    RequiredHoursPerWeek int    `json:"required_hours_per_week"`
    ScheduleOverlap     float64 `json:"schedule_overlap"`    // Percentage of overlapping hours
    TimezoneCompatible  bool    `json:"timezone_compatible"`
}

type InterestBreakdown struct {
    Score               float64     `json:"score"`
    MatchingInterests   []string    `json:"matching_interests"`
    JobCategories       []string    `json:"job_categories"`
    InterestAlignment   float64     `json:"interest_alignment"`
}

type LearningGoalsBreakdown struct {
    Score               float64     `json:"score"`
    AlignedGoals        []string    `json:"aligned_goals"`
    LearningOpportunities []string  `json:"learning_opportunities"`
    CareerGrowthPotential float64   `json:"career_growth_potential"`
}

// GORM JSON marshaling for Application custom types
func (d DetailedScoreBreakdown) Value() (driver.Value, error) {
    return json.Marshal(d)
}

func (d *DetailedScoreBreakdown) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into DetailedScoreBreakdown")
    }
    return json.Unmarshal(bytes, d)
}