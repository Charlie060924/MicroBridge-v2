package models

import (
"time"
"github.com/google/uuid"
"gorm.io/gorm"
)

type Application struct {
ID             uuid.UUID      json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"
JobID          uuid.UUID      json:"job_id" gorm:"type:uuid;not null"
StudentID      uuid.UUID      json:"student_id" gorm:"type:uuid;not null"
CoverLetter    string         json:"cover_letter"
ResumeURL      string         json:"resume_url"
Status         string         json:"status" gorm:"default:'Pending'"
MatchScore     float64        json:"match_score"
ScoreBreakdown map[string]float64 json:"score_breakdown" gorm:"type:jsonb"
AppliedAt      time.Time      json:"applied_at"
ReviewedAt     *time.Time     json:"reviewed_at"
CreatedAt      time.Time      json:"created_at"
UpdatedAt      time.Time      json:"updated_at"
DeletedAt      gorm.DeletedAt json:"-" gorm:"index"

// Relationships
Job     Job  json:"job,omitempty" gorm:"foreignKey:JobID"
Student User json:"student,omitempty" gorm:"foreignKey:StudentID"
}

func (a *Application) BeforeCreate(tx *gorm.DB) error {
if a.ID == uuid.Nil {
a.ID = uuid.New()
}
a.AppliedAt = time.Now()
return nil
}
