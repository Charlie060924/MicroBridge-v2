package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"microbridge/backend/internal/dto"
	"microbridge/backend/internal/transport/http/handlers"
	"microbridge/backend/internal/repository"
	"microbridge/backend/internal/core/reviews"
	"microbridge/backend/internal/testutils"
	"microbridge/backend/internal/shared/validation"
)

func TestUserHandler_CreateUser(t *testing.T) {
	// Setup
	db := testutils.SetupTestDB()
	defer testutils.CleanupTestDB(db)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	validator := validation.New()
	handler := handlers.NewUserHandler(userService, validator)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/users", handler.CreateUser)

	// Test data
	req := dto.CreateUserRequest{
		Email:           "test@example.com",
		Name:            "Test User",
		Password:        "password123",
		UserType:        "student",
		ExperienceLevel: "intermediate",
		Location:        "Hong Kong",
		Skills:          []string{"JavaScript", "Go"},
		Interests:       []string{"Web Development"},
	}

	body, _ := json.Marshal(req)

	// Execute
	w := httptest.NewRecorder()
	httpReq, _ := http.NewRequest("POST", "/users", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, httpReq)

	// Assert
	assert.Equal(t, http.StatusCreated, w.Code)

	var response dto.UserResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.Equal(t, req.Email, response.Email)
	assert.Equal(t, req.Name, response.Name)
	assert.Equal(t, req.UserType, response.UserType)
	assert.Equal(t, req.ExperienceLevel, response.ExperienceLevel)
	assert.Equal(t, req.Location, response.Location)
	assert.NotEmpty(t, response.ID)
	assert.NotZero(t, response.CreatedAt)
}

func TestUserHandler_CreateUser_ValidationError(t *testing.T) {
	// Setup
	db := testutils.SetupTestDB()
	defer testutils.CleanupTestDB(db)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	validator := validation.New()
	handler := handlers.NewUserHandler(userService, validator)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/users", handler.CreateUser)

	// Test data with invalid email
	req := dto.CreateUserRequest{
		Email:    "invalid-email",
		Name:     "Test User",
		Password: "password123",
		UserType: "student",
	}

	body, _ := json.Marshal(req)

	// Execute
	w := httptest.NewRecorder()
	httpReq, _ := http.NewRequest("POST", "/users", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, httpReq)

	// Assert
	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.Contains(t, response["error"], "email must be a valid email")
}

func TestUserHandler_GetUser(t *testing.T) {
	// Setup
	db := testutils.SetupTestDB()
	defer testutils.CleanupTestDB(db)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	validator := validation.New()
	handler := handlers.NewUserHandler(userService, validator)

	// Create a test user
	testUser := testutils.CreateTestUser()
	err := userRepo.Create(context.Background(), testUser)
	require.NoError(t, err)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/users/:id", handler.GetUser)

	// Execute
	w := httptest.NewRecorder()
	httpReq, _ := http.NewRequest("GET", "/users/"+testUser.ID, nil)
	router.ServeHTTP(w, httpReq)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code)

	var response dto.UserResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.Equal(t, testUser.ID, response.ID)
	assert.Equal(t, testUser.Email, response.Email)
	assert.Equal(t, testUser.Name, response.Name)
}

func TestUserHandler_GetUser_NotFound(t *testing.T) {
	// Setup
	db := testutils.SetupTestDB()
	defer testutils.CleanupTestDB(db)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	validator := validation.New()
	handler := handlers.NewUserHandler(userService, validator)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/users/:id", handler.GetUser)

	// Execute
	w := httptest.NewRecorder()
	httpReq, _ := http.NewRequest("GET", "/users/nonexistent-id", nil)
	router.ServeHTTP(w, httpReq)

	// Assert
	assert.Equal(t, http.StatusNotFound, w.Code)
}
