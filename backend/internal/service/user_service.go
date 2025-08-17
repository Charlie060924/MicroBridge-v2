package service

import (
	"context"
	"time"
	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/repository"
	apperrors "microbridge/backend/internal/errors"
	jwtpkg "microbridge/backend/pkg/jwt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepo repository.UserRepository
	jwtService *jwtpkg.Service
}

func NewUserService(userRepo repository.UserRepository, jwtService *jwtpkg.Service) UserService {
	return &userService{
		userRepo: userRepo,
		jwtService: jwtService,
	}
}

func (s *userService) CreateUser(ctx context.Context, req dto.CreateUserRequest) (*models.User, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil && err != apperrors.ErrUserNotFound {
		return nil, err
	}
	if existingUser != nil {
		return nil, apperrors.ErrUserAlreadyExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperrors.NewAppError(500, "Failed to hash password", err)
	}

	// Convert skills slice to UserSkill slice
	var userSkills []models.UserSkill
	for _, skill := range req.Skills {
		userSkills = append(userSkills, models.UserSkill{
			Name:       skill,
			Level:      1, // Default level
			Experience: "0-1 years",
			Verified:   false,
		})
	}

	// Create user model
	user := &models.User{
		ID:              uuid.New().String(),
		Email:           req.Email,
		Name:            req.Name,
		Password:        string(hashedPassword),
		UserType:        req.UserType,
		Phone:           req.Phone,
		Bio:             req.Bio,
		Portfolio:       req.Portfolio,
		ExperienceLevel: req.ExperienceLevel,
		Location:        req.Location,
		WorkPreference:  req.WorkPreference,
		Skills:          userSkills,
		Interests:       req.Interests,
		Level:           1,
		XP:              0,
		TotalXP:         0,
		CareerCoins:     0,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Don't return password
	user.Password = ""
	return user, nil
}

func (s *userService) GetUser(ctx context.Context, id string) (*models.User, error) {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	
	// Don't return password
	user.Password = ""
	return user, nil
}

func (s *userService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	
	// Don't return password
	user.Password = ""
	return user, nil
}

func (s *userService) UpdateUser(ctx context.Context, id string, req dto.UpdateUserRequest) (*models.User, error) {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Update fields
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Bio != "" {
		user.Bio = req.Bio
	}
	if req.Portfolio != "" {
		user.Portfolio = req.Portfolio
	}
	if req.ExperienceLevel != "" {
		user.ExperienceLevel = req.ExperienceLevel
	}
	if req.Location != "" {
		user.Location = req.Location
	}
	if req.WorkPreference != "" {
		user.WorkPreference = req.WorkPreference
	}
	if len(req.Skills) > 0 {
		var userSkills []models.UserSkill
		for _, skill := range req.Skills {
			// Check if skill already exists to preserve level and experience
			existingSkill := user.GetSkillByName(skill)
			if existingSkill != nil {
				userSkills = append(userSkills, *existingSkill)
			} else {
				userSkills = append(userSkills, models.UserSkill{
					Name:       skill,
					Level:      1,
					Experience: "0-1 years",
					Verified:   false,
				})
			}
		}
		user.Skills = userSkills
	}
	if len(req.Interests) > 0 {
		user.Interests = req.Interests
	}
	if len(req.LearningGoals) > 0 {
		user.LearningGoals = req.LearningGoals
	}
	if len(req.CareerGoals) > 0 {
		user.CareerGoals = req.CareerGoals
	}

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	// Don't return password
	user.Password = ""
	return user, nil
}

func (s *userService) DeleteUser(ctx context.Context, id string) error {
	return s.userRepo.Delete(ctx, id)
}

func (s *userService) ListUsers(ctx context.Context, limit, offset int) ([]*models.User, int64, error) {
	users, total, err := s.userRepo.List(ctx, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	// Don't return passwords
	for _, user := range users {
		user.Password = ""
	}

	return users, total, nil
}

func (s *userService) AuthenticateUser(ctx context.Context, email, password string) (*models.User, string, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, "", apperrors.ErrUnauthorized
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "", apperrors.ErrUnauthorized
	}

	// Update last activity
	if err := s.userRepo.UpdateLastActivity(ctx, user.ID); err != nil {
		// Log error but don't fail authentication
		// logger.Error().Err(err).Str("user_id", user.ID).Msg("Failed to update last activity")
	}

	// Generate JWT token pair
	accessToken, refreshToken, err := s.jwtService.GenerateTokenPair(user.ID, user.UserType, user.Email)
	if err != nil {
		return nil, "", apperrors.NewAppError(500, "Failed to generate tokens", err)
	}

	// Return access token for now (refresh token can be handled separately)
	token := accessToken

	// Don't return password
	user.Password = ""
	return user, token, nil
}

func (s *userService) ChangePassword(ctx context.Context, userID string, req dto.ChangePasswordRequest) error {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return err
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return apperrors.NewUnauthorizedError("Current password is incorrect")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return apperrors.NewAppError(500, "Failed to hash new password", err)
	}

	user.Password = string(hashedPassword)
	return s.userRepo.Update(ctx, user)
}

func (s *userService) UpdateLastActivity(ctx context.Context, userID string) error {
	return s.userRepo.UpdateLastActivity(ctx, userID)
}
