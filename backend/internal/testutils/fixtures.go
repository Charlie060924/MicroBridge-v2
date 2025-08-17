package testutils

import (
	"time"
	"microbridge/backend/internal/models"

	"github.com/google/uuid"
)

func CreateTestUser() *models.User {
	return &models.User{
		ID:              uuid.New().String(),
		Email:           "test@example.com",
		Name:            "Test User",
		Password:        "$2a$10$YourHashedPasswordHere", // bcrypt hash of "password"
		UserType:        "student",
		Phone:           "+1234567890",
		Bio:             "Test bio",
		ExperienceLevel: "intermediate",
		Location:        "Hong Kong",
		WorkPreference:  "remote",
		Skills: []models.UserSkill{
			{Name: "JavaScript", Level: 3, Experience: "2-3 years", Verified: false},
			{Name: "Go", Level: 2, Experience: "1-2 years", Verified: false},
		},
		Interests:   []string{"Web Development", "Backend Development"},
		Level:       3,
		XP:          1500,
		CareerCoins: 75,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

func CreateTestJob(employerID string) *models.Job {
	return &models.Job{
		ID:              uuid.New().String(),
		Title:           "Test Job",
		Description:     "Test job description",
		Category:        "Web Development",
		Skills:          []string{"JavaScript", "React", "Node.js"},
		ExperienceLevel: "intermediate",
		Duration:        "1-3 months",
		Budget:          5000.0,
		IsRemote:        true,
		Location:        "Hong Kong",
		EmployerID:      employerID,
		Status:          "active",
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}
}

func CreateTestEmployer(userID string) *models.Employer {
	return &models.Employer{
		ID:          uuid.New().String(),
		UserID:      userID,
		CompanyName: "Test Company",
		Industry:    "Technology",
		CompanySize: "10-50",
		Website:     "https://testcompany.com",
		Description: "Test company description",
		Location:    "Hong Kong",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

func CreateTestApplication(studentID, jobID string) *models.Application {
	return &models.Application{
		ID:         uuid.New().String(),
		StudentID:  studentID,
		JobID:      jobID,
		Status:     "pending",
		CoverLetter: "Test cover letter",
		MatchScore: 0.85,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
}

func CreateTestNotification(userID string) *models.Notification {
	return &models.Notification{
		ID:        uuid.New().String(),
		UserID:    userID,
		Title:     "Test Notification",
		Message:   "This is a test notification",
		Type:      "info",
		IsRead:    false,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
