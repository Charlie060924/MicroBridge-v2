package models

import (
"time"
"github.com/google/uuid"
"gorm.io/gorm"
)

type User struct {
ID                uuid.UUID      json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"
Name              string         json:"name" gorm:"not null"
Email             string         json:"email" gorm:"unique;not null"
Password          string         json:"-" gorm:"not null"
Role              string         json:"role" gorm:"default:'student'"
ProfileCompleted  bool           json:"profile_completed" gorm:"default:false"
Skills            []string       json:"skills" gorm:"type:jsonb"
Interests         []string       json:"interests" gorm:"type:jsonb"
ExperienceLevel   string         json:"experience_level" gorm:"default:'Entry'"
Location          string         json:"location"
Availability      string         json:"availability"
Bio               string         json:"bio"
AvatarURL         string         json:"avatar_url"
ResumeURL         string         json:"resume_url"
VerifiedAt        *time.Time     json:"verified_at"
CreatedAt         time.Time      json:"created_at"
UpdatedAt         time.Time      json:"updated_at"
DeletedAt         gorm.DeletedAt json:"-" gorm:"index"

// Relationships
Jobs          []Job          json:"jobs,omitempty" gorm:"foreignKey:EmployerID"
Applications  []Application  json:"applications,omitempty" gorm:"foreignKey:StudentID"
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
if u.ID == uuid.Nil {
u.ID = uuid.New()
}
return nil
}
