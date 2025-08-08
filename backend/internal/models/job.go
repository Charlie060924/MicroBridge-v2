package models

import (
"time"
"github.com/google/uuid"
"gorm.io/gorm"
)

type Job struct {
ID             uuid.UUID      json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"
Title          string         json:"title" gorm:"not null"
Company        string         json:"company" gorm:"not null"
Location       string         json:"location" gorm:"not null"
Salary         string         json:"salary"
Duration       string         json:"duration"
Category       string         json:"category" gorm:"not null"
Description    string         json:"description" gorm:"not null"
Skills         []string       json:"skills" gorm:"type:jsonb;not null"
Requirements   []string       json:"requirements" gorm:"type:jsonb"
ExperienceLevel string        json:"experience_level" gorm:"default:'Entry'"
IsRemote       bool           json:"is_remote" gorm:"default:false"
Deadline       *time.Time     json:"deadline"
Status         string         json:"status" gorm:"default:'Active'"
EmployerID     uuid.UUID      json:"employer_id" gorm:"type:uuid;not null"
CreatedAt      time.Time      json:"created_at"
UpdatedAt      time.Time      json:"updated_at"
DeletedAt      gorm.DeletedAt json:"-" gorm:"index"

// Relationships
Employer      User           json:"employer,omitempty" gorm:"foreignKey:EmployerID"
Applications  []Application  json:"applications,omitempty" gorm:"foreignKey:JobID"
}

func (j *Job) BeforeCreate(tx *gorm.DB) error {
if j.ID == uuid.Nil {
j.ID = uuid.New()
}
return nil
}
