package repository

import (
	"context"
	"errors"
	"time"
	"microbridge/backend/internal/models"
	apperrors "microbridge/backend/internal/shared/errors"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
	if err := r.db.WithContext(ctx).Create(user).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return apperrors.ErrUserAlreadyExists
		}
		return apperrors.NewAppError(500, "Failed to create user", err)
	}
	return nil
}

func (r *userRepository) GetByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrUserNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get user", err)
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).First(&user, "email = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrUserNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get user", err)
	}
	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *models.User) error {
	user.UpdatedAt = time.Now()
	if err := r.db.WithContext(ctx).Save(user).Error; err != nil {
		return apperrors.NewAppError(500, "Failed to update user", err)
	}
	return nil
}

func (r *userRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Delete(&models.User{}, "id = ?", id)
	if result.Error != nil {
		return apperrors.NewAppError(500, "Failed to delete user", result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.ErrUserNotFound
	}
	return nil
}

func (r *userRepository) List(ctx context.Context, limit, offset int) ([]*models.User, int64, error) {
	var users []*models.User
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).Model(&models.User{}).Count(&total).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to count users", err)
	}

	// Get paginated results
	if err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&users).Error; err != nil {
		return nil, 0, apperrors.NewAppError(500, "Failed to list users", err)
	}

	return users, total, nil
}

func (r *userRepository) UpdateLastActivity(ctx context.Context, userID string) error {
	now := time.Now()
	result := r.db.WithContext(ctx).
		Model(&models.User{}).
		Where("id = ?", userID).
		Update("last_activity_at", &now)

	if result.Error != nil {
		return apperrors.NewAppError(500, "Failed to update last activity", result.Error)
	}
	if result.RowsAffected == 0 {
		return apperrors.ErrUserNotFound
	}
	return nil
}

func (r *userRepository) GetByResetToken(ctx context.Context, token string) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).First(&user, "reset_token = ?", token).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrUserNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get user by reset token", err)
	}
	return &user, nil
}

func (r *userRepository) GetByVerificationToken(ctx context.Context, token string) (*models.User, error) {
	var user models.User
	if err := r.db.WithContext(ctx).First(&user, "verification_token = ?", token).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.ErrUserNotFound
		}
		return nil, apperrors.NewAppError(500, "Failed to get user by verification token", err)
	}
	return &user, nil
}