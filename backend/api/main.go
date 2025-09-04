package main

import (
"log"
"net/http"
"os"

"github.com/gin-gonic/gin"
"github.com/gin-contrib/cors"
"github.com/joho/godotenv"

"microbridge/backend/internal/database"
"microbridge/backend/internal/transport/http/handlers"
"microbridge/backend/internal/transport/http/middleware"
"microbridge/backend/internal/routes"
)

func main() {
// Load environment variables
if err := godotenv.Load(); err != nil {
log.Println("No .env file found")
}

// Initialize database
db, err := database.InitDB()
if err != nil {
log.Fatal("Failed to connect to database:", err)
}

// Initialize Gin router
r := gin.Default()

// CORS configuration
config := cors.DefaultConfig()
config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001"}
config.AllowCredentials = true
config.AddAllowHeaders("Authorization")
r.Use(cors.New(config))

// Middleware
r.Use(middleware.Logger())
r.Use(middleware.ErrorHandler())

// Initialize routes
routes.SetupRoutes(r, db)

// Health check
r.GET("/health", func(c *gin.Context) {
c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "microbridge-api"})
})

// Start server
port := os.Getenv("PORT")
if port == "" {
port = "8080"
}

log.Printf(" MicroBridge API starting on port %s", port)
if err := r.Run(":" + port); err != nil {
log.Fatal("Failed to start server:", err)
}
}
