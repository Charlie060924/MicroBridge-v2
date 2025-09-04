package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
	apperrors "microbridge/backend/internal/shared/errors"
	"microbridge/backend/pkg/jwt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Register(ctx context.Context, req dto.UserRegistrationRequest) (*dto.UserResponse, error)
	Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error)
	GetProfile(ctx context.Context, userID string) (*dto.UserResponse, error)
	UpdateProfile(ctx context.Context, userID string, req dto.UpdateUserRequest) (*dto.UserResponse, error)
	DeleteUser(ctx context.Context, userID string) error
	VerifyEmail(ctx context.Context, token string) error
	ForgotPassword(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error
	RefreshToken(ctx context.Context, refreshToken string) (*dto.TokenResponse, error)
}

type userService struct {
	userRepo    repository.UserRepository
	jwtService  *jwt.Service
	emailService EmailService
}

func NewUserService(userRepo repository.UserRepository, jwtService *jwt.Service, emailService EmailService) UserService {
	return &userService{
		userRepo:    userRepo,
		jwtService:  jwtService,
		emailService: emailService,
	}
}

func (s *userService) Register(ctx context.Context, req dto.UserRegistrationRequest) (*dto.UserResponse, error) {
	// Validate input
	if err := s.validateRegistrationRequest(req); err != nil {
		return nil, err
	}

	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil && !apperrors.IsNotFoundError(err) {
		return nil, err
	}
	if existingUser != nil {
		return nil, apperrors.ErrUserAlreadyExists
	}

	// Hash password
	hashedPassword, err := s.hashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Generate verification token
	verificationToken := uuid.New().String()

	// Create user
	user := &models.User{
		ID:                uuid.New().String(),
		Email:             strings.ToLower(req.Email),
		Name:              req.Name,
		Password:          hashedPassword,
		UserType:          req.UserType,
		EmailVerified:     false,
		VerificationToken: &verificationToken,
		IsActive:          true,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Send verification email
	if err := s.emailService.SendVerificationEmail(user.Email, user.Name, verificationToken); err != nil {
		// Log error but don't fail registration
		// In production, you might want to queue this for retry
		fmt.Printf("Failed to send verification email: %v\n", err)
	}

	return s.userToResponse(user), nil
}

func (s *userService) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error) {
	// Validate input
	if req.Email == "" || req.Password == "" {
		return nil, apperrors.NewAppError(400, "Email and password are required", nil)
	}

	// Get user by email
	user, err := s.userRepo.GetByEmail(ctx, strings.ToLower(req.Email))
	if err != nil {
		if apperrors.IsNotFoundError(err) {
			return nil, apperrors.NewAppError(401, "Invalid credentials", nil)
		}
		return nil, err
	}

	// Check if user is active
	if !user.IsActive {
		return nil, apperrors.NewAppError(403, "Account is deactivated", nil)
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, apperrors.NewAppError(401, "Invalid credentials", nil)
	}

	// Generate JWT tokens
	accessToken, refreshToken, err := s.jwtService.GenerateTokenPair(user.ID, user.UserType, user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Update last login time
	user.LastLoginAt = &time.Time{}
	*user.LastLoginAt = time.Now()
	if err := s.userRepo.Update(ctx, user); err != nil {
		// Log error but don't fail login
		fmt.Printf("Failed to update last login time: %v\n", err)
	}

	return &dto.LoginResponse{
		User:         s.userToResponse(user),
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(time.Hour * 24 / time.Second), // 24 hours in seconds
	}, nil
}

func (s *userService) GetProfile(ctx context.Context, userID string) (*dto.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return s.userToResponse(user), nil
}

func (s *userService) UpdateProfile(ctx context.Context, userID string, req dto.UpdateUserRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.Bio != nil {
		user.Bio = *req.Bio
	}
	if req.Skills != nil {
		user.Skills = *req.Skills
	}
	if req.Interests != nil {
		user.Interests = *req.Interests
	}
	if req.ExperienceLevel != nil {
		user.ExperienceLevel = *req.ExperienceLevel
	}
	if req.Location != nil {
		user.Location = *req.Location
	}
	if req.Portfolio != nil {
		user.Portfolio = *req.Portfolio
	}
	if req.PreferredSalary != nil {
		user.PreferredSalary = *req.PreferredSalary
	}
	if req.WorkPreference != nil {
		user.WorkPreference = *req.WorkPreference
	}

	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	return s.userToResponse(user), nil
}

func (s *userService) DeleteUser(ctx context.Context, userID string) error {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return err
	}

	// Soft delete - mark as inactive instead of hard delete
	user.IsActive = false
	user.UpdatedAt = time.Now()

	return s.userRepo.Update(ctx, user)
}

func (s *userService) VerifyEmail(ctx context.Context, token string) error {
	user, err := s.userRepo.GetByVerificationToken(ctx, token)
	if err != nil {
		if apperrors.IsNotFoundError(err) {
			return apperrors.NewAppError(400, "Invalid verification token", nil)
		}
		return err
	}

	if user.EmailVerified {
		return apperrors.NewAppError(400, "Email already verified", nil)
	}

	// Mark email as verified and clear token
	user.EmailVerified = true
	user.VerificationToken = nil
	user.UpdatedAt = time.Now()

	return s.userRepo.Update(ctx, user)
}

func (s *userService) ForgotPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.GetByEmail(ctx, strings.ToLower(email))
	if err != nil {
		if apperrors.IsNotFoundError(err) {
			// Don't reveal if email exists or not
			return nil
		}
		return err
	}

	// Generate reset token
	resetToken := uuid.New().String()
	expiresAt := time.Now().Add(time.Hour) // 1 hour expiry

	user.ResetToken = &resetToken
	user.ResetTokenExpiresAt = &expiresAt
	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		return err
	}

	// Send reset email
	if err := s.emailService.SendPasswordResetEmail(user.Email, user.Name, resetToken); err != nil {
		// Log error but don't fail request
		fmt.Printf("Failed to send password reset email: %v\n", err)
	}

	return nil
}

func (s *userService) ResetPassword(ctx context.Context, req dto.ResetPasswordRequest) error {
	// Validate input
	if req.Token == "" || req.Password == "" {
		return apperrors.NewAppError(400, "Token and password are required", nil)
	}

	if len(req.Password) < 8 {
		return apperrors.NewAppError(400, "Password must be at least 8 characters", nil)
	}

	user, err := s.userRepo.GetByResetToken(ctx, req.Token)
	if err != nil {
		if apperrors.IsNotFoundError(err) {
			return apperrors.NewAppError(400, "Invalid or expired reset token", nil)
		}
		return err
	}

	// Check if token is expired
	if user.ResetTokenExpiresAt == nil || time.Now().After(*user.ResetTokenExpiresAt) {
		return apperrors.NewAppError(400, "Reset token has expired", nil)
	}

	// Hash new password
	hashedPassword, err := s.hashPassword(req.Password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update user
	user.Password = hashedPassword
	user.ResetToken = nil
	user.ResetTokenExpiresAt = nil
	user.UpdatedAt = time.Now()

	return s.userRepo.Update(ctx, user)
}

func (s *userService) RefreshToken(ctx context.Context, refreshToken string) (*dto.TokenResponse, error) {
	// Validate refresh token
	claims, err := s.jwtService.ValidateToken(refreshToken)
	if err != nil {
		return nil, apperrors.NewAppError(401, "Invalid refresh token", err)
	}

	// Check if it's a refresh token
	if claims.Subject != "refresh" {
		return nil, apperrors.NewAppError(401, "Invalid token type", nil)
	}

	// Get user to ensure they still exist and are active
	user, err := s.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, err
	}

	if !user.IsActive {
		return nil, apperrors.NewAppError(403, "Account is deactivated", nil)
	}

	// Generate new token pair
	accessToken, newRefreshToken, err := s.jwtService.GenerateTokenPair(user.ID, user.UserType, user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &dto.TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    int64(time.Hour * 24 / time.Second),
	}, nil
}

// Helper methods

func (s *userService) validateRegistrationRequest(req dto.UserRegistrationRequest) error {
	if req.Email == "" {
		return apperrors.NewAppError(400, "Email is required", nil)
	}
	if req.Name == "" {
		return apperrors.NewAppError(400, "Name is required", nil)
	}
	if req.Password == "" {
		return apperrors.NewAppError(400, "Password is required", nil)
	}
	if len(req.Password) < 8 {
		return apperrors.NewAppError(400, "Password must be at least 8 characters", nil)
	}
	if req.UserType != "student" && req.UserType != "employer" {
		return apperrors.NewAppError(400, "User type must be 'student' or 'employer'", nil)
	}

	return nil
}

func (s *userService) hashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func (s *userService) userToResponse(user *models.User) *dto.UserResponse {
	return &dto.UserResponse{
		ID:              user.ID,
		Email:           user.Email,
		Name:            user.Name,
		UserType:        user.UserType,
		EmailVerified:   user.EmailVerified,
		IsActive:        user.IsActive,
		Bio:             user.Bio,
		Skills:          user.Skills,
		Interests:       user.Interests,
		ExperienceLevel: user.ExperienceLevel,
		Location:        user.Location,
		Portfolio:       user.Portfolio,
		PreferredSalary: user.PreferredSalary,
		WorkPreference:  user.WorkPreference,
		Level:           user.Level,
		XP:              user.XP,
		CareerCoins:     user.CareerCoins,
		CreatedAt:       user.CreatedAt,
		UpdatedAt:       user.UpdatedAt,
	}
}