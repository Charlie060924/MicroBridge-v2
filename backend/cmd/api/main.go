package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"microbridge/backend/config"
	"microbridge/backend/internal/database"
	"microbridge/backend/internal/repository"
	"microbridge/backend/internal/services"
	"microbridge/backend/internal/transport/http/handlers"
	"microbridge/backend/internal/transport/http/middleware"
	"microbridge/backend/pkg/jwt"
	pkglogger "microbridge/backend/pkg/logger"
)

type Application struct {
	config       *config.Config
	logger       *pkglogger.Logger
	db           database.Database
	jwtService   *jwt.Service
	userService  services.UserService
	emailService services.EmailService
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

	// Run database migrations
	ctx := context.Background()
	if err := db.RunMigrations(ctx); err != nil {
		log.Error().Err(err).Msg("Database migration failed")
		os.Exit(1)
	}

	// Show migration status
	if err := db.GetMigrationStatus(ctx); err != nil {
		log.Error().Err(err).Msg("Failed to get migration status")
	}

	// Initialize JWT service
	jwtService := jwt.NewJWTService(
		cfg.JWT.SecretKey,
		"microbridge",
		cfg.JWT.AccessExpiry,
		cfg.JWT.RefreshExpiry,
	)

	// Initialize repositories
	userRepo := repository.NewUserRepository(db.DB())

	// Initialize services
	emailService := services.NewEmailService()
	userService := services.NewUserService(userRepo, jwtService, emailService)

	app := &Application{
		config:       cfg,
		logger:       log,
		db:           db,
		jwtService:   jwtService,
		userService:  userService,
		emailService: emailService,
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


	log.Info().Msg("Server stopped")
}

func (app *Application) setupRouter() *gin.Engine {
	if app.config.Server.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
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

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":      "healthy",
			"timestamp":   time.Now(),
			"environment": app.config.Server.Environment,
			"version":     "v1.0.0",
		})
	})

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(app.jwtService, app.logger)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(app.userService)

	// API routes
	api := r.Group("/api/v1")
	
	// Public authentication routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
		auth.POST("/refresh", userHandler.RefreshToken)
		auth.GET("/verify-email", userHandler.VerifyEmail)
		auth.POST("/forgot-password", userHandler.ForgotPassword)
		auth.POST("/reset-password", userHandler.ResetPassword)
	}

	// Protected user routes
	users := api.Group("/users")
	users.Use(authMiddleware.RequireAuth())
	{
		users.GET("/profile", userHandler.GetProfile)
		users.PUT("/profile", userHandler.UpdateProfile)
		users.GET("/:id", userHandler.GetUser)
	}

	// Admin routes (placeholder)
	admin := api.Group("/admin")
	admin.Use(authMiddleware.RequireAuth())
	admin.Use(authMiddleware.RequireRole("admin"))
	{
		admin.GET("/users", userHandler.ListUsers)
		admin.DELETE("/users/:id", userHandler.DeleteUser)
	}

	return r
}
