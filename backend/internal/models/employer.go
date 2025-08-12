package models

import (
    "time"
)

// EmployerProfile represents the unified employer profile combining company and personal information
type EmployerProfile struct {
    ID          string    `json:"id" gorm:"primaryKey"`
    UserID      string    `json:"user_id" gorm:"uniqueIndex;not null"`
    
    // Company Information (Public)
    CompanyName    string `json:"company_name" gorm:"not null"`
    CompanyType    string `json:"company_type" gorm:"not null"` // startup, sme, corporate, nonprofit, education, other
    Industry       string `json:"industry" gorm:"not null"`
    CompanySize    string `json:"company_size" gorm:"not null"` // 1-10, 10-50, 50-200, 200-1000, 1000+
    Website        string `json:"website"`
    Location       string `json:"location" gorm:"not null"`
    Description    string `json:"description"`
    LogoURL        string `json:"logo_url"`
    
    // Personal Information (Private - HR Contact)
    FirstName      string `json:"first_name" gorm:"not null"`
    LastName       string `json:"last_name" gorm:"not null"`
    Email          string `json:"email" gorm:"not null"`
    Phone          string `json:"phone" gorm:"not null"`
    Position       string `json:"position" gorm:"not null"`
    Bio            string `json:"bio"`
    
    // Profile completion status
    IsComplete     bool      `json:"is_complete" gorm:"default:false"`
    CompletedAt    *time.Time `json:"completed_at"`
    
    // Timestamps
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
    
    // Relationships
    User           User      `json:"user" gorm:"foreignKey:UserID"`
}

// TableName specifies the table name for EmployerProfile
func (EmployerProfile) TableName() string {
    return "employer_profiles"
}

// IsProfileComplete checks if all required fields are filled
func (ep *EmployerProfile) IsProfileComplete() bool {
    requiredFields := []string{
        ep.CompanyName, ep.CompanyType, ep.Industry, ep.CompanySize, ep.Location,
        ep.FirstName, ep.LastName, ep.Email, ep.Phone, ep.Position,
    }
    
    for _, field := range requiredFields {
        if field == "" {
            return false
        }
    }
    
    return true
}

// MarkAsComplete marks the profile as complete and sets the completion timestamp
func (ep *EmployerProfile) MarkAsComplete() {
    if ep.IsProfileComplete() {
        ep.IsComplete = true
        now := time.Now()
        ep.CompletedAt = &now
    }
}

// GetFullName returns the full name of the HR contact
func (ep *EmployerProfile) GetFullName() string {
    return ep.FirstName + " " + ep.LastName
}

// GetPublicInfo returns only the public company information
func (ep *EmployerProfile) GetPublicInfo() map[string]interface{} {
    return map[string]interface{}{
        "company_name": ep.CompanyName,
        "company_type": ep.CompanyType,
        "industry":     ep.Industry,
        "company_size": ep.CompanySize,
        "website":      ep.Website,
        "location":     ep.Location,
        "description":  ep.Description,
        "logo_url":     ep.LogoURL,
    }
}

// GetPrivateInfo returns only the private HR contact information
func (ep *EmployerProfile) GetPrivateInfo() map[string]interface{} {
    return map[string]interface{}{
        "first_name": ep.FirstName,
        "last_name":  ep.LastName,
        "email":      ep.Email,
        "phone":      ep.Phone,
        "position":   ep.Position,
        "bio":        ep.Bio,
    }
}
