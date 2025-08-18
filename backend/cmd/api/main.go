package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/go-redis/redis/v8"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"microbridge/backend/config"
	"microbridge/backend/internal/cache"
	"microbridge/backend/internal/handlers"
	"microbridge/backend/internal/middleware"
	"microbridge/backend/internal/monitoring"
	"microbridge/backend/internal/repository"
	"microbridge/backend/internal/service"
	"microbridge/backend/internal/services/database"
	"microbridge/backend/internal/services/matching"
	"microbridge/backend/internal/validation"
	pkglogger "microbridge/backend/pkg/logger"
)

type Application struct {
	config    *config.Config
	logger    *pkglogger.Logger
	db        *database.PostgresDB
	validator *validation.Validator
	// Services
	userService    service.UserService
	matchingService *matching.OptimizedMatchingService
	// Handlers
	userHandler    *handlers.UserHandler
	jobHandler     *handlers.JobHandler
	matchingHandler *handlers.MatchingHandler
}

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(fmt.Sprintf("Failed to load config: %v", err))
	}

	// Initialize logger
	isDev := cfg.Server.Environment == "development"
	log := pkglogger.New("info", isDev)
	pkglogger.Init("info", isDev)

	// Initialize database with migration support
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Hong_Kong",
		cfg.Database.Host, cfg.Database.User, cfg.Database.Password, 
		cfg.Database.DBName, cfg.Database.Port, cfg.Database.SSLMode,
	)
	
	db, err := database.NewPostgresDB(dsn)
	if err != nil {
		log.Error().Err(err).Msg("Failed to connect to database")
		os.Exit(1)
	}
	defer db.Close()

	// CRITICAL: Replace dangerous AutoMigrate with proper migrations
	ctx := context.Background()
	if err := db.RunMigrations(ctx); err != nil {
		log.Error().Err(err).Msg("Database migration failed")
		os.Exit(1)
	}

	// Show migration status
	if err := db.GetMigrationStatus(ctx); err != nil {
		log.Error().Err(err).Msg("Failed to get migration status")
	}

	// Initialize Redis for caching
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       0,
	})

	// Test Redis connection
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Error().Err(err).Msg("Failed to connect to Redis")
		os.Exit(1)
	}

	// Initialize cache layer
	cacheLayer := cache.NewCacheLayer(redisClient)
	matchingCache := cache.NewMatchingCache(cacheLayer)

	// Initialize validator
	validator := validation.New()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db.DB)
	jobRepo := repository.NewJobRepository(db.DB)

	// Initialize services
	userService := service.NewUserService(userRepo)
	
	// CRITICAL: Replace your matching service with optimized version
	baseMatchingService := matching.NewMatchingService(userRepo, jobRepo)
	matchingService := matching.NewOptimizedMatchingService(baseMatchingService, matchingCache)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService, validator)
	jobHandler := handlers.NewJobHandler(jobRepo)
	matchingHandler := handlers.NewMatchingHandler(matchingService)

	app := &Application{
		config:          cfg,
		logger:          log,
		db:              db,
		validator:       validator,
		userService:     userService,
		matchingService: matchingService,
		userHandler:     userHandler,
		jobHandler:      jobHandler,
		matchingHandler: matchingHandler,
	}

	// Setup router
	router := app.setupRouter()

	// Create server
	srv := &http.Server{
		Addr:         ":" + cfg.Server.Port,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	// Start server
	go func() {
		log.Info().
			Str("address", srv.Addr).
			Str("environment", cfg.Server.Environment).
			Msg("Starting server")

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error().Err(err).Msg("Server failed to start")
			os.Exit(1)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("Shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error().Err(err).Msg("Server forced to shutdown")
		os.Exit(1)
	}

	// Close Redis connection
	if err := redisClient.Close(); err != nil {
		log.Error().Err(err).Msg("Failed to close Redis connection")
	}

	log.Info().Msg("Server stopped")
}

func (app *Application) setupRouter() *gin.Engine {
	if app.config.Server.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// Add monitoring middleware FIRST
	r.Use(monitoring.PrometheusMiddleware())
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Add metrics endpoint
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001"}
	config.AllowCredentials = true
	config.AddAllowHeaders("Authorization")
	r.Use(cors.New(config))

	// Global middleware
	r.Use(middleware.RequestLogger())
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.ErrorHandler())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		// Check database health
		if err := app.db.SqlDB.PingContext(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status": "unhealthy",
				"error":  "database connection failed",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":      "healthy",
			"timestamp":   time.Now(),
			"environment": app.config.Server.Environment,
			"version":     "v1.0.0",
		})
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", app.userHandler.CreateUser)
			auth.POST("/login", app.userHandler.Login)
			auth.POST("/forgot-password", app.userHandler.ForgotPassword)
			auth.POST("/reset-password", app.userHandler.ResetPassword)
			auth.POST("/verify-email", app.userHandler.VerifyEmail)
			auth.POST("/resend-verification", app.userHandler.ResendVerification)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthRequired())
		{
			// User routes
			users := protected.Group("/users")
			{
				users.GET("/:id", app.userHandler.GetUser)
				users.PUT("/:id", app.userHandler.UpdateUser)
				users.DELETE("/:id", app.userHandler.DeleteUser)
				users.GET("", app.userHandler.ListUsers)
			}

			// Job routes
			jobs := protected.Group("/jobs")
			{
				jobs.GET("", app.jobHandler.GetJobs)
				jobs.POST("", app.jobHandler.CreateJob)
				jobs.GET("/:id", app.jobHandler.GetJob)
				jobs.PUT("/:id", app.jobHandler.UpdateJob)
				jobs.DELETE("/:id", app.jobHandler.DeleteJob)
			}

			// Application routes
			applications := protected.Group("/applications")
			{
				applications.POST("", app.applicationHandler.CreateApplication)
				applications.GET("/user", app.applicationHandler.GetUserApplications)
				applications.GET("/job/:job_id", app.applicationHandler.GetJobApplications)
				applications.GET("/:id", app.applicationHandler.GetApplication)
				applications.PUT("/:id", app.applicationHandler.UpdateApplication)
				applications.DELETE("/:id", app.applicationHandler.DeleteApplication)
				applications.PUT("/:id/status", app.applicationHandler.UpdateApplicationStatus)
				applications.POST("/:id/withdraw", app.applicationHandler.WithdrawApplication)
			}

			// Notification routes
			notifications := protected.Group("/notifications")
			{
				notifications.GET("", app.notificationHandler.GetNotifications)
				notifications.GET("/unread-count", app.notificationHandler.GetUnreadCount)
				notifications.PUT("/:id/read", app.notificationHandler.MarkAsRead)
				notifications.PUT("/read-all", app.notificationHandler.MarkAllAsRead)
				notifications.DELETE("/:id", app.notificationHandler.DeleteNotification)
				notifications.GET("/settings", app.notificationHandler.GetNotificationSettings)
				notifications.PUT("/settings", app.notificationHandler.UpdateNotificationSettings)
			}

			// Matching routes (now cached!)
			matching := protected.Group("/matching")
			{
				matching.GET("/jobs", app.matchingHandler.GetRecommendedJobs)
			}
		}
	}

	return r
}
