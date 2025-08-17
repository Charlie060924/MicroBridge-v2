package dto

import (
	"time"
)

type CreateUserRequest struct {
	Email           string   `json:"email" validate:"required,email" example:"user@example.com"`
	Name            string   `json:"name" validate:"required,min=2,max=100" example:"John Doe"`
	Password        string   `json:"password" validate:"required,min=8" example:"password123"`
	UserType        string   `json:"user_type" validate:"required,user_type" example:"student"`
	Phone           string   `json:"phone,omitempty" validate:"omitempty,e164" example:"+1234567890"`
	ExperienceLevel string   `json:"experience_level,omitempty" validate:"omitempty,experience_level" example:"intermediate"`
	Location        string   `json:"location,omitempty" validate:"omitempty,max=200" example:"Hong Kong"`
	WorkPreference  string   `json:"work_preference,omitempty" validate:"omitempty,work_preference" example:"remote"`
	Bio             string   `json:"bio,omitempty" validate:"omitempty,max=500" example:"Software developer with 5 years experience"`
	Portfolio       string   `json:"portfolio,omitempty" validate:"omitempty,url" example:"https://portfolio.example.com"`
	Skills          []string `json:"skills,omitempty" example:"[\"JavaScript\", \"Go\", \"React\"]"`
	Interests       []string `json:"interests,omitempty" example:"[\"Web Development\", \"AI\", \"Blockchain\"]"`
}

type UpdateUserRequest struct {
	Name            string   `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Phone           string   `json:"phone,omitempty" validate:"omitempty,e164"`
	Bio             string   `json:"bio,omitempty" validate:"omitempty,max=500"`
	Portfolio       string   `json:"portfolio,omitempty" validate:"omitempty,url"`
	ExperienceLevel string   `json:"experience_level,omitempty" validate:"omitempty,experience_level"`
	Location        string   `json:"location,omitempty" validate:"omitempty,max=200"`
	WorkPreference  string   `json:"work_preference,omitempty" validate:"omitempty,work_preference"`
	Skills          []string `json:"skills,omitempty"`
	Interests       []string `json:"interests,omitempty"`
	LearningGoals   []string `json:"learning_goals,omitempty"`
	CareerGoals     []string `json:"career_goals,omitempty"`
}

type UserResponse struct {
	ID              string    `json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
	Email           string    `json:"email" example:"user@example.com"`
	Name            string    `json:"name" example:"John Doe"`
	UserType        string    `json:"user_type" example:"student"`
	Phone           string    `json:"phone,omitempty" example:"+1234567890"`
	Bio             string    `json:"bio,omitempty" example:"Software developer with 5 years experience"`
	Portfolio       string    `json:"portfolio,omitempty" example:"https://portfolio.example.com"`
	ExperienceLevel string    `json:"experience_level,omitempty" example:"intermediate"`
	Location        string    `json:"location,omitempty" example:"Hong Kong"`
	WorkPreference  string    `json:"work_preference,omitempty" example:"remote"`
	Skills          []string  `json:"skills,omitempty" example:"[\"JavaScript\", \"Go\", \"React\"]"`
	Interests       []string  `json:"interests,omitempty" example:"[\"Web Development\", \"AI\", \"Blockchain\"]"`
	Level           int       `json:"level" example:"5"`
	XP              int       `json:"xp" example:"2500"`
	CareerCoins     int       `json:"career_coins" example:"150"`
	CreatedAt       time.Time `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt       time.Time `json:"updated_at" example:"2023-01-01T00:00:00Z"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email" example:"user@example.com"`
	Password string `json:"password" validate:"required" example:"password123"`
}

type LoginResponse struct {
	User         UserResponse `json:"user"`
	AccessToken  string       `json:"access_token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	RefreshToken string       `json:"refresh_token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	ExpiresAt    time.Time    `json:"expires_at" example:"2023-01-01T01:00:00Z"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8"`
}

type UserListResponse struct {
	Users      []UserResponse `json:"users"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	Limit      int            `json:"limit"`
	TotalPages int            `json:"total_pages"`
}
