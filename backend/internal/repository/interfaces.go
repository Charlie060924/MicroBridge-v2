package repository

import (
	"context"
	"microbridge/backend/internal/models"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	Update(ctx context.Context, user *models.User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*models.User, int64, error)
	UpdateLastActivity(ctx context.Context, userID string) error
}

type JobRepository interface {
	Create(ctx context.Context, job *models.Job) error
	GetByID(ctx context.Context, id string) (*models.Job, error)
	Update(ctx context.Context, job *models.Job) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filters map[string]interface{}, limit, offset int) ([]*models.Job, int64, error)
	GetByEmployerID(ctx context.Context, employerID string, limit, offset int) ([]*models.Job, int64, error)
	Search(ctx context.Context, query string, filters map[string]interface{}, limit, offset int) ([]*models.Job, int64, error)
}

type ApplicationRepository interface {
	Create(ctx context.Context, application *models.Application) error
	GetByID(ctx context.Context, id string) (*models.Application, error)
	Update(ctx context.Context, application *models.Application) error
	Delete(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Application, int64, error)
	GetByJobID(ctx context.Context, jobID string, limit, offset int) ([]*models.Application, int64, error)
	GetByUserAndJob(ctx context.Context, userID, jobID string) (*models.Application, error)
	UpdateStatus(ctx context.Context, id string, status string) error
}

type NotificationRepository interface {
	Create(ctx context.Context, notification *models.Notification) error
	GetByID(ctx context.Context, id string) (*models.Notification, error)
	Update(ctx context.Context, notification *models.Notification) error
	Delete(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID string, unreadOnly bool, limit, offset int) ([]*models.Notification, int64, error)
	MarkAsRead(ctx context.Context, userID, notificationID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	GetUnreadCount(ctx context.Context, userID string) (int64, error)
}

type ProjectRepository interface {
	Create(ctx context.Context, project *models.Project) error
	GetByID(ctx context.Context, id string) (*models.Project, error)
	Update(ctx context.Context, project *models.Project) error
	Delete(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*models.Project, int64, error)
	GetByEmployerID(ctx context.Context, employerID string, limit, offset int) ([]*models.Project, int64, error)
	UpdateStatus(ctx context.Context, id string, status string) error
}

type EmployerRepository interface {
	Create(ctx context.Context, employer *models.Employer) error
	GetByID(ctx context.Context, id string) (*models.Employer, error)
	Update(ctx context.Context, employer *models.Employer) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*models.Employer, int64, error)
	GetByUserID(ctx context.Context, userID string) (*models.Employer, error)
}
