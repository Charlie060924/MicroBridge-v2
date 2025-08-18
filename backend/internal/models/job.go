package models

import (
    "database/sql/driver"
    "encoding/json"
    "errors"
    "strings"
    "time"
)

type Job struct {
    ID              string              `json:"id" gorm:"primaryKey"`
    EmployerID      string              `json:"employer_id" gorm:"not null"`
    Title           string              `json:"title"`
    Description     string              `json:"description"`
    Company         string              `json:"company"`
    CompanyID       string              `json:"company_id"`
    
    // Enhanced matching fields
    Skills          RequiredSkillsArray `json:"skills" gorm:"type:jsonb"`
    ExperienceLevel string              `json:"experience_level"` // "entry" | "intermediate" | "advanced" | "senior" | "expert"
    Location        string              `json:"location"`
    Duration        int                 `json:"duration"`         // Duration in weeks
    Category        string              `json:"category"`         // Job category/field
    IsRemote        bool                `json:"is_remote"`
    
    // Job details
    JobType         string              `json:"job_type"`         // "full-time" | "part-time" | "contract" | "internship"
    Salary          SalaryRange         `json:"salary" gorm:"type:jsonb"`
    Benefits        StringArray         `json:"benefits" gorm:"type:jsonb"`
    Requirements    StringArray         `json:"requirements" gorm:"type:jsonb"`
    
    // Work arrangement
    WorkArrangement WorkArrangement     `json:"work_arrangement" gorm:"type:jsonb"`
    
    // Application settings
    ApplicationDeadline *time.Time      `json:"application_deadline,omitempty"`
    StartDate          *time.Time       `json:"start_date,omitempty"`
    EndDate            *time.Time       `json:"end_date,omitempty"`
    
    // Matching preferences
    PreferredCandidates CandidatePreferences `json:"preferred_candidates" gorm:"type:jsonb"`
    
    // Status and metadata - Updated lifecycle states
    Status          string              `json:"status"`           // "draft" | "posted" | "hired" | "in_progress" | "submitted" | "review_pending" | "completed" | "disputed" | "archived"
    Views           int                 `json:"views"`
    Applications    int                 `json:"applications"`
    
    // Review and completion tracking
    ReviewDueDate   *time.Time          `json:"review_due_date,omitempty"`
    CompletedAt     *time.Time          `json:"completed_at,omitempty"`
    HiredStudentID  *string             `json:"hired_student_id,omitempty"`
    
    // Timestamps
    CreatedAt       time.Time           `json:"created_at"`
    UpdatedAt       time.Time           `json:"updated_at"`
}

// Custom types for Job
type RequiredSkillsArray []RequiredSkill

type RequiredSkill struct {
    Name            string  `json:"name"`
    Level           int     `json:"level"`              // 1-5 scale
    IsRequired      bool    `json:"is_required"`        // Required vs nice-to-have
    Importance      float64 `json:"importance"`         // Weight in matching (0-1)
    CanLearn        bool    `json:"can_learn"`          // Whether on-the-job learning is acceptable
}

type SalaryRange struct {
    Min             int     `json:"min"`
    Max             int     `json:"max"`
    Currency        string  `json:"currency"`
    Period          string  `json:"period"`             // "hourly" | "monthly" | "yearly"
    IsNegotiable    bool    `json:"is_negotiable"`
}

type WorkArrangement struct {
    HoursPerWeek    int         `json:"hours_per_week"`
    FlexibleHours   bool        `json:"flexible_hours"`
    CoreHours       []TimeSlot  `json:"core_hours"`
    RemoteRatio     float64     `json:"remote_ratio"`    // 0.0 (fully onsite) to 1.0 (fully remote)
    TimeZones       []string    `json:"time_zones"`      // Accepted time zones
}

type CandidatePreferences struct {
    PreferredExperience []string    `json:"preferred_experience"`
    PreferredSkills     []string    `json:"preferred_skills"`
    PreferredLocation   []string    `json:"preferred_location"`
    MinAvailability     int         `json:"min_availability"`    // Minimum hours per week
    CultureFit          []string    `json:"culture_fit"`         // Cultural values/traits
}

// GORM JSON marshaling for Job custom types
func (r RequiredSkillsArray) Value() (driver.Value, error) {
    return json.Marshal(r)
}

func (r *RequiredSkillsArray) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into RequiredSkillsArray")
    }
    return json.Unmarshal(bytes, r)
}

func (s SalaryRange) Value() (driver.Value, error) {
    return json.Marshal(s)
}

func (s *SalaryRange) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into SalaryRange")
    }
    return json.Unmarshal(bytes, s)
}

func (w WorkArrangement) Value() (driver.Value, error) {
    return json.Marshal(w)
}

func (w *WorkArrangement) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into WorkArrangement")
    }
    return json.Unmarshal(bytes, w)
}

func (c CandidatePreferences) Value() (driver.Value, error) {
    return json.Marshal(c)
}

func (c *CandidatePreferences) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into CandidatePreferences")
    }
    return json.Unmarshal(bytes, c)
}

// Helper methods for Job
func (j *Job) GetRequiredSkillByName(skillName string) *RequiredSkill {
    for _, skill := range j.Skills {
        if strings.EqualFold(skill.Name, skillName) {
            return &skill
        }
    }
    return nil
}

func (j *Job) GetRequiredSkillsLevel(skillName string) int {
    skill := j.GetRequiredSkillByName(skillName)
    if skill != nil {
        return skill.Level
    }
    return 0
}

func (j *Job) IsSkillRequired(skillName string) bool {
    skill := j.GetRequiredSkillByName(skillName)
    return skill != nil && skill.IsRequired
}