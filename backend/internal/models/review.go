package models

import (
	"time"
)

// Review represents a review given by one user to another after job completion
type Review struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	ReviewerID  string    `json:"reviewer_id" gorm:"index;not null"`
	RevieweeID  string    `json:"reviewee_id" gorm:"index;not null"`
	JobID       string    `json:"job_id" gorm:"index;not null"`
	
	// Review details
	Rating      int       `json:"rating" gorm:"not null"` // 1-5 stars
	Comment     string    `json:"comment"`
	
	// Category ratings for detailed feedback
	CategoryRatings CategoryRatings `json:"category_ratings" gorm:"type:jsonb"`
	
	// Review visibility (double-blind system)
	IsVisible    bool      `json:"is_visible" gorm:"default:false"`
	VisibleAt    *time.Time `json:"visible_at,omitempty"`
	
	// Timestamps
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	
	// Relationships
	Reviewer     User      `json:"reviewer" gorm:"foreignKey:ReviewerID"`
	Reviewee     User      `json:"reviewee" gorm:"foreignKey:RevieweeID"`
	Job          Job       `json:"job" gorm:"foreignKey:JobID"`
}

// CategoryRatings stores detailed ratings for different aspects
type CategoryRatings struct {
	// For student reviews (reviewing employers)
	ClearRequirements  int `json:"clear_requirements,omitempty"`  // 1-5
	Professionalism    int `json:"professionalism,omitempty"`      // 1-5
	PaymentReliability int `json:"payment_reliability,omitempty"`  // 1-5
	
	// For employer reviews (reviewing students)
	QualityOfWork      int `json:"quality_of_work,omitempty"`      // 1-5
	Communication      int `json:"communication,omitempty"`        // 1-5
	Timeliness         int `json:"timeliness,omitempty"`           // 1-5
}

// TableName specifies the table name for Review
func (Review) TableName() string {
	return "reviews"
}

// CalculateOverallRating calculates the overall rating from category ratings
func (r *Review) CalculateOverallRating() float64 {
	if r.CategoryRatings.ClearRequirements == 0 && r.CategoryRatings.QualityOfWork == 0 {
		return float64(r.Rating)
	}
	
	var total int
	var count int
	
	// Check if this is a student reviewing employer
	if r.CategoryRatings.ClearRequirements > 0 {
		total += r.CategoryRatings.ClearRequirements
		total += r.CategoryRatings.Professionalism
		total += r.CategoryRatings.PaymentReliability
		count = 3
	} else if r.CategoryRatings.QualityOfWork > 0 {
		total += r.CategoryRatings.QualityOfWork
		total += r.CategoryRatings.Communication
		total += r.CategoryRatings.Timeliness
		count = 3
	}
	
	if count == 0 {
		return float64(r.Rating)
	}
	
	return float64(total) / float64(count)
}

// IsDoubleBlindReady checks if both parties have submitted reviews
func (r *Review) IsDoubleBlindReady(otherReview *Review) bool {
	return r != nil && otherReview != nil
}

// ShouldBeVisible checks if the review should be visible based on double-blind rules
func (r *Review) ShouldBeVisible(otherReview *Review) bool {
	if r.IsVisible {
		return true
	}
	
	// If both reviews exist, make them visible
	if r.IsDoubleBlindReady(otherReview) {
		return true
	}
	
	// If 14 days have passed since creation, make visible
	if time.Since(r.CreatedAt) >= 14*24*time.Hour {
		return true
	}
	
	return false
}
