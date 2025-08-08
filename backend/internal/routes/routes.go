package routes

import (
"microbridge/backend/internal/handlers"
"microbridge/backend/internal/middleware"

"github.com/gin-gonic/gin"
"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
// Initialize handlers
authHandler := handlers.NewAuthHandler(db)
userHandler := handlers.NewUserHandler(db)
jobHandler := handlers.NewJobHandler(db)
applicationHandler := handlers.NewApplicationHandler(db)
matchingHandler := handlers.NewMatchingHandler(db)

// API v1 routes
v1 := r.Group("/api/v1")
{
// Auth routes
auth := v1.Group("/auth")
{
auth.POST("/register", authHandler.Register)
auth.POST("/login", authHandler.Login)
auth.POST("/logout", authHandler.Logout)
auth.GET("/me", middleware.AuthRequired(), authHandler.GetCurrentUser)
}

// User routes
users := v1.Group("/users")
users.Use(middleware.AuthRequired())
{
users.GET("/", userHandler.GetUsers)
users.GET("/:id", userHandler.GetUser)
users.PUT("/:id", userHandler.UpdateUser)
users.DELETE("/:id", userHandler.DeleteUser)
users.GET("/:id/skills", userHandler.GetUserSkills)
users.PUT("/:id/skills", userHandler.UpdateUserSkills)
}

// Job routes
jobs := v1.Group("/jobs")
jobs.Use(middleware.AuthRequired())
{
jobs.GET("/", jobHandler.GetJobs)
jobs.POST("/", jobHandler.CreateJob)
jobs.GET("/:id", jobHandler.GetJob)
jobs.PUT("/:id", jobHandler.UpdateJob)
jobs.DELETE("/:id", jobHandler.DeleteJob)
jobs.GET("/:id/applications", jobHandler.GetJobApplications)
}

// Application routes
applications := v1.Group("/applications")
applications.Use(middleware.AuthRequired())
{
applications.GET("/", applicationHandler.GetApplications)
applications.POST("/", applicationHandler.CreateApplication)
applications.GET("/:id", applicationHandler.GetApplication)
applications.PUT("/:id/status", applicationHandler.UpdateApplicationStatus)
}

// Matching routes
matching := v1.Group("/matching")
matching.Use(middleware.AuthRequired())
{
matching.GET("/recommendations/:userId", matchingHandler.GetRecommendations)
matching.GET("/calculate/:userId/:jobId", matchingHandler.CalculateMatchScore)
matching.GET("/similar/:jobId", matchingHandler.GetSimilarJobs)
matching.GET("/analytics/:userId", matchingHandler.GetMatchingAnalytics)
}
}
}
