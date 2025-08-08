package models

import (
    "database/sql/driver"
    "encoding/json"
    "time"
)

type User struct {
    ID              string          `json:"id" gorm:"primaryKey"`
    Email           string          `json:"email" gorm:"uniqueIndex"`
    Name            string          `json:"name"`
    UserType        string          `json:"user_type"` // "student" | "employer"
    
    // Enhanced matching fields
    Skills          SkillsArray     `json:"skills" gorm:"type:jsonb"`
    Interests       StringArray     `json:"interests" gorm:"type:jsonb"`
    ExperienceLevel string          `json:"experience_level"` // "entry" | "intermediate" | "advanced" | "senior" | "expert"
    Location        string          `json:"location"`
    Availability    Availability    `json:"availability" gorm:"type:jsonb"`
    
    // Additional profile fields
    Bio             string          `json:"bio"`
    Portfolio       string          `json:"portfolio"`
    Resume          string          `json:"resume"`
    PreferredSalary string          `json:"preferred_salary"`
    WorkPreference  string          `json:"work_preference"` // "remote" | "onsite" | "hybrid"
    
    // Learning and career goals
    LearningGoals   StringArray     `json:"learning_goals" gorm:"type:jsonb"`
    CareerGoals     StringArray     `json:"career_goals" gorm:"type:jsonb"`
    
    // Timestamps
    CreatedAt       time.Time       `json:"created_at"`
    UpdatedAt       time.Time       `json:"updated_at"`
}

// Custom types for JSON fields
type SkillsArray []UserSkill

type UserSkill struct {
    Name        string  `json:"name"`
    Level       int     `json:"level"`        // 1-5 scale
    Experience  string  `json:"experience"`   // "0-1 years", "1-3 years", etc.
    Verified    bool    `json:"verified"`     // Skill verification status
}

type StringArray []string

type Availability struct {
    HoursPerWeek    int             `json:"hours_per_week"`
    PreferredHours  []TimeSlot      `json:"preferred_hours"`
    StartDate       *time.Time      `json:"start_date,omitempty"`
    EndDate         *time.Time      `json:"end_date,omitempty"`
    Timezone        string          `json:"timezone"`
    IsFlexible      bool            `json:"is_flexible"`
}

type TimeSlot struct {
    DayOfWeek   int     `json:"day_of_week"`  // 0=Sunday, 1=Monday, etc.
    StartTime   string  `json:"start_time"`   // "09:00"
    EndTime     string  `json:"end_time"`     // "17:00"
}

// GORM JSON marshaling for custom types
func (s SkillsArray) Value() (driver.Value, error) {
    return json.Marshal(s)
}

func (s *SkillsArray) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into SkillsArray")
    }
    return json.Unmarshal(bytes, s)
}

func (s StringArray) Value() (driver.Value, error) {
    return json.Marshal(s)
}

func (s *StringArray) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into StringArray")
    }
    return json.Unmarshal(bytes, s)
}

func (a Availability) Value() (driver.Value, error) {
    return json.Marshal(a)
}

func (a *Availability) Scan(value interface{}) error {
    if value == nil {
        return nil
    }
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("cannot scan non-bytes into Availability")
    }
    return json.Unmarshal(bytes, a)
}

// Helper methods for User
func (u *User) GetSkillByName(skillName string) *UserSkill {
    for _, skill := range u.Skills {
        if strings.EqualFold(skill.Name, skillName) {
            return &skill
        }
    }
    return nil
}

func (u *User) HasSkill(skillName string, minLevel int) bool {
    skill := u.GetSkillByName(skillName)
    return skill != nil && skill.Level >= minLevel
}

func (u *User) GetSkillLevel(skillName string) int {
    skill := u.GetSkillByName(skillName)
    if skill != nil {
        return skill.Level
    }
    return 0
}