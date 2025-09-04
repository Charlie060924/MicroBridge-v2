package models

import (
	"time"
	"gorm.io/gorm"
)

// Project represents a work project in the system
type Project struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Status      string    `json:"status" gorm:"default:'active'"`
	JobID       uint      `json:"job_id"`
	Job         Job       `json:"job" gorm:"foreignKey:JobID"`
	FreelancerID uint     `json:"freelancer_id"`
	Freelancer  User      `json:"freelancer" gorm:"foreignKey:FreelancerID"`
	EmployerID  uint      `json:"employer_id"`
	Employer    User      `json:"employer" gorm:"foreignKey:EmployerID"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Budget      float64   `json:"budget"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Project model
func (Project) TableName() string {
	return "projects"
}