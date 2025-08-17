package service

import (
	"context"
	"time"
	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/models"
)

type UserService interface {
	CreateUser(ctx context.Context, req dto.CreateUserRequest) (*models.User, error)
	GetUser(ctx context.Context, id string) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	UpdateUser(ctx context.Context, id string, req dto.UpdateUserRequest) (*models.User, error)
	DeleteUser(ctx context.Context, id string) error
	ListUsers(ctx context.Context, limit, offset int) ([]*models.User, int64, error)
	AuthenticateUser(ctx context.Context, email, password string) (*models.User, string, error)
	ChangePassword(ctx context.Context, userID string, req dto.ChangePasswordRequest) error
	UpdateLastActivity(ctx context.Context, userID string) error
}

type JobService interface {
	CreateJob(ctx context.Context, req dto.CreateJobRequest) (*models.Job, error)
	GetJob(ctx context.Context, id string) (*models.Job, error)
	UpdateJob(ctx context.Context, id string, req dto.UpdateJobRequest) (*models.Job, error)
	DeleteJob(ctx context.Context, id string) error
	ListJobs(ctx context.Context, filters dto.JobFilters, limit, offset int) ([]*models.Job, int64, error)
	GetJobsByEmployer(ctx context.Context, employerID string, limit, offset int) ([]*models.Job, int64, error)
	SearchJobs(ctx context.Context, query string, filters dto.JobFilters, limit, offset int) ([]*models.Job, int64, error)
}

type ApplicationService interface {
	CreateApplication(ctx context.Context, req dto.CreateApplicationRequest) (*models.Application, error)
	GetApplication(ctx context.Context, id string) (*models.Application, error)
	UpdateApplication(ctx context.Context, id string, req dto.UpdateApplicationRequest) (*models.Application, error)
	DeleteApplication(ctx context.Context, id string) error
	GetUserApplications(ctx context.Context, userID string, limit, offset int) ([]*models.Application, int64, error)
	GetJobApplications(ctx context.Context, jobID string, limit, offset int) ([]*models.Application, int64, error)
	UpdateApplicationStatus(ctx context.Context, id string, status string) error
	CheckExistingApplication(ctx context.Context, userID, jobID string) (*models.Application, error)
}

type NotificationService interface {
	CreateNotification(ctx context.Context, req dto.CreateNotificationRequest) (*models.Notification, error)
	GetNotification(ctx context.Context, id string) (*models.Notification, error)
	GetUserNotifications(ctx context.Context, userID string, unreadOnly bool, limit, offset int) ([]*models.Notification, int64, error)
	MarkAsRead(ctx context.Context, userID, notificationID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	DeleteNotification(ctx context.Context, userID, notificationID string) error
	GetUnreadCount(ctx context.Context, userID string) (int64, error)
	CreateJobMatchNotification(ctx context.Context, userID, jobID string, jobTitle string) error
	CreatePaymentNotification(ctx context.Context, userID string, amount float64, projectTitle string) error
	CreateDeadlineReminder(ctx context.Context, userID string, projectTitle string, daysUntilDeadline int) error
}

type ProjectService interface {
	CreateProject(ctx context.Context, req dto.CreateProjectRequest) (*models.Project, error)
	GetProject(ctx context.Context, id string) (*models.Project, error)
	UpdateProject(ctx context.Context, id string, req dto.UpdateProjectRequest) (*models.Project, error)
	DeleteProject(ctx context.Context, id string) error
	GetUserProjects(ctx context.Context, userID string, limit, offset int) ([]*models.Project, int64, error)
	GetEmployerProjects(ctx context.Context, employerID string, limit, offset int) ([]*models.Project, int64, error)
	UpdateProjectStatus(ctx context.Context, id string, status string) error
}

type EmployerService interface {
	CreateEmployer(ctx context.Context, req dto.CreateEmployerRequest) (*models.Employer, error)
	GetEmployer(ctx context.Context, id string) (*models.Employer, error)
	UpdateEmployer(ctx context.Context, id string, req dto.UpdateEmployerRequest) (*models.Employer, error)
	DeleteEmployer(ctx context.Context, id string) error
	ListEmployers(ctx context.Context, limit, offset int) ([]*models.Employer, int64, error)
	GetEmployerByUserID(ctx context.Context, userID string) (*models.Employer, error)
}

type MatchingService interface {
	GetRecommendations(ctx context.Context, userID string, limit int) ([]dto.JobRecommendation, error)
	CalculateMatchScore(ctx context.Context, userID, jobID string) (*dto.MatchScore, error)
	GetSimilarJobs(ctx context.Context, jobID string, limit int) ([]*models.Job, error)
	GetMatchingAnalytics(ctx context.Context, userID string) (*dto.MatchingAnalytics, error)
	GetUserInsights(ctx context.Context, userID string) (*dto.UserInsights, error)
}

type AuthService interface {
	GenerateTokens(ctx context.Context, userID string) (accessToken, refreshToken string, expiresAt time.Time, error)
	ValidateToken(ctx context.Context, tokenString string) (*dto.TokenClaims, error)
	RefreshToken(ctx context.Context, refreshToken string) (accessToken string, expiresAt time.Time, error)
	RevokeToken(ctx context.Context, tokenString string) error
}
