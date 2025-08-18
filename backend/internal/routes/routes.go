package routes

import (
	"net/http"
	
	"github.com/gin-gonic/gin"
	"microbridge/backend/internal/handlers"
	"microbridge/backend/internal/middleware"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// API versioning
	api := r.Group("/api/v1")
	
	// Middleware
	api.Use(middleware.Logger())
	api.Use(middleware.ErrorHandler())
	api.Use(middleware.CORS())
	
	// Initialize services
	notificationService := services.NewNotificationService(db)
	reviewService := services.NewReviewService(
		repository.NewReviewRepository(db),
		repository.NewUserRepository(db),
		repository.NewJobRepository(db),
		repository.NewApplicationRepository(db),
	)
	
	// Initialize handlers
	userHandler := handlers.NewUserHandler(db)
	jobHandler := handlers.NewJobHandler(db)
	matchingHandler := handlers.NewMatchingHandler(db)
	applicationHandler := handlers.NewApplicationHandler(db)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	reviewHandler := handlers.NewReviewHandler(reviewService)
	
	// User routes
	userRoutes := api.Group("/users")
	{
		userRoutes.POST("", userHandler.CreateUser)
		userRoutes.GET("/:id", userHandler.GetUser)
		userRoutes.PUT("/:id", userHandler.UpdateUser)
		userRoutes.PUT("/:id/profile", userHandler.UpdateProfile)
	}
	
	// Job routes
	jobRoutes := api.Group("/jobs")
	{
		jobRoutes.GET("", jobHandler.GetJobs)
		jobRoutes.POST("", jobHandler.CreateJob)
		jobRoutes.GET("/:id", jobHandler.GetJob)
		jobRoutes.PUT("/:id", jobHandler.UpdateJob)
		jobRoutes.DELETE("/:id", jobHandler.DeleteJob)
	}
	
	// Enhanced matching routes
	matchingRoutes := api.Group("/matching")
	{
		// User-centric matching endpoints
		matchingRoutes.GET("/recommendations/:userId", matchingHandler.GetRecommendations)
		matchingRoutes.POST("/recommendations/:userId", matchingHandler.GetRecommendationsWithFilters)
		matchingRoutes.GET("/calculate/:userId/:jobId", matchingHandler.CalculateMatchScore)
		matchingRoutes.GET("/similar/:jobId", matchingHandler.GetSimilarJobs)
		
		// Analytics and insights
		matchingRoutes.GET("/analytics/:userId", matchingHandler.GetMatchingAnalytics)
		matchingRoutes.GET("/insights/:userId", matchingHandler.GetUserInsights)
	}
	
	// Application routes
	applicationRoutes := api.Group("/applications")
	{
		applicationRoutes.POST("", applicationHandler.CreateApplication)
		applicationRoutes.GET("/:id", applicationHandler.GetApplication)
		applicationRoutes.PUT("/:id", applicationHandler.UpdateApplication)
		applicationRoutes.GET("/user/:userId", applicationHandler.GetUserApplications)
		applicationRoutes.GET("/job/:jobId", applicationHandler.GetJobApplications)
	}
	
	// Review routes
	reviewRoutes := api.Group("/reviews")
	{
		reviewRoutes.POST("", reviewHandler.CreateReview)
		reviewRoutes.GET("/:userId", reviewHandler.GetUserReviews)
		reviewRoutes.GET("/:id", reviewHandler.GetReviewByID)
		reviewRoutes.PUT("/:id", reviewHandler.UpdateReview)
		reviewRoutes.DELETE("/:id", reviewHandler.DeleteReview)
		reviewRoutes.GET("/eligibility/:jobId", reviewHandler.CheckReviewEligibility)
	}
	
	// Job completion route
	jobRoutes.POST("/:id/complete", reviewHandler.CompleteJob)
	
	// Notification routes
	notificationRoutes := api.Group("/notifications")
	{
		notificationRoutes.GET("", notificationHandler.GetNotifications)
		notificationRoutes.GET("/unread-count", notificationHandler.GetUnreadCount)
		notificationRoutes.PUT("/:id/read", notificationHandler.MarkAsRead)
		notificationRoutes.PUT("/mark-all-read", notificationHandler.MarkAllAsRead)
		notificationRoutes.DELETE("/:id", notificationHandler.DeleteNotification)
		notificationRoutes.GET("/settings", notificationHandler.GetNotificationSettings)
		notificationRoutes.PUT("/settings", notificationHandler.UpdateNotificationSettings)
		notificationRoutes.POST("", notificationHandler.CreateNotification)
	}
	
	// Health check
	api.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"service": "microbridge-api",
		})
	})
}