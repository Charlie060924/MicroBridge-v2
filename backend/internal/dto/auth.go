package dto

import (
	"time"
	"microbridge/backend/internal/models"
)

// Authentication request/response DTOs

type UserRegistrationRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
	UserType string `json:"user_type" binding:"required,oneof=student employer"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	User         *UserResponse `json:"user"`
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int64         `json:"expires_in"` // seconds
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"` // seconds
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" binding:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

// User response DTO (for public consumption)
type UserResponse struct {
	ID              string                `json:"id"`
	Email           string                `json:"email"`
	Name            string                `json:"name"`
	UserType        string                `json:"user_type"`
	EmailVerified   bool                  `json:"email_verified"`
	IsActive        bool                  `json:"is_active"`
	Bio             string                `json:"bio"`
	Skills          models.SkillsArray    `json:"skills"`
	Interests       models.StringArray    `json:"interests"`
	ExperienceLevel string                `json:"experience_level"`
	Location        string                `json:"location"`
	Portfolio       string                `json:"portfolio"`
	PreferredSalary string                `json:"preferred_salary"`
	WorkPreference  string                `json:"work_preference"`
	Level           int                   `json:"level"`
	XP              int                   `json:"xp"`
	CareerCoins     int                   `json:"career_coins"`
	CreatedAt       time.Time             `json:"created_at"`
	UpdatedAt       time.Time             `json:"updated_at"`
}

// Update user request DTO (for profile updates)
type UpdateUserRequest struct {
	Name            *string                `json:"name,omitempty"`
	Bio             *string                `json:"bio,omitempty"`
	Skills          *models.SkillsArray    `json:"skills,omitempty"`
	Interests       *models.StringArray    `json:"interests,omitempty"`
	ExperienceLevel *string                `json:"experience_level,omitempty"`
	Location        *string                `json:"location,omitempty"`
	Portfolio       *string                `json:"portfolio,omitempty"`
	PreferredSalary *string                `json:"preferred_salary,omitempty"`
	WorkPreference  *string                `json:"work_preference,omitempty"`
}

// Standard API response format
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Errors  []string    `json:"errors,omitempty"`
}

type PaginatedResponse struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data,omitempty"`
	Message    string      `json:"message,omitempty"`
	Errors     []string    `json:"errors,omitempty"`
	Pagination Pagination  `json:"pagination,omitempty"`
}

type Pagination struct {
	Page     int  `json:"page"`
	Limit    int  `json:"limit"`
	Total    int  `json:"total"`
	HasMore  bool `json:"has_more"`
}