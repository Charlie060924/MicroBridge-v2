package config

import (
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "os"
    "strings"
    "time"
)

type SecurityConfig struct {
    JWTSecretKey           string
    JWTAccessTokenExpiry   time.Duration
    JWTRefreshTokenExpiry  time.Duration
    BCryptCost             int
    RateLimitRequests      int
    RateLimitWindow        time.Duration
    MaxLoginAttempts       int
    LoginAttemptWindow     time.Duration
    RequireHTTPS           bool
    AllowedOrigins         []string
    CSRFProtection         bool
    SessionTimeout         time.Duration
}

func LoadSecurityConfig() (*SecurityConfig, error) {
    // Generate random JWT secret if not provided (NEVER use in production)
    jwtSecret := getEnv("JWT_SECRET", "")
    if jwtSecret == "" {
        if getEnv("GO_ENV", "development") == "production" {
            return nil, fmt.Errorf("JWT_SECRET is required in production")
        }
        // Generate random secret for development
        jwtSecret = generateRandomSecret(32)
        fmt.Printf("⚠️  Generated random JWT secret for development: %s\n", jwtSecret)
        fmt.Println("⚠️  Set JWT_SECRET environment variable for production!")
    }

    // Validate secret strength
    if len(jwtSecret) < 32 {
        return nil, fmt.Errorf("JWT_SECRET must be at least 32 characters long")
    }

    return &SecurityConfig{
        JWTSecretKey:          jwtSecret,
        JWTAccessTokenExpiry:  getDurationEnv("JWT_ACCESS_EXPIRY", 15*time.Minute),
        JWTRefreshTokenExpiry: getDurationEnv("JWT_REFRESH_EXPIRY", 7*24*time.Hour),
        BCryptCost:            getIntEnv("BCRYPT_COST", 12),
        RateLimitRequests:     getIntEnv("RATE_LIMIT_REQUESTS", 100),
        RateLimitWindow:       getDurationEnv("RATE_LIMIT_WINDOW", time.Hour),
        MaxLoginAttempts:      getIntEnv("MAX_LOGIN_ATTEMPTS", 5),
        LoginAttemptWindow:    getDurationEnv("LOGIN_ATTEMPT_WINDOW", 15*time.Minute),
        RequireHTTPS:          getBoolEnv("REQUIRE_HTTPS", false),
        AllowedOrigins:        getSliceEnv("ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
        CSRFProtection:        getBoolEnv("CSRF_PROTECTION", true),
        SessionTimeout:        getDurationEnv("SESSION_TIMEOUT", 30*time.Minute),
    }, nil
}

func generateRandomSecret(length int) string {
    bytes := make([]byte, length)
    if _, err := rand.Read(bytes); err != nil {
        panic(fmt.Sprintf("Failed to generate random secret: %v", err))
    }
    return base64.URLEncoding.EncodeToString(bytes)
}

func getBoolEnv(key string, defaultValue bool) bool {
    if value := os.Getenv(key); value != "" {
        return value == "true" || value == "1"
    }
    return defaultValue
}

func getSliceEnv(key string, defaultValue []string) []string {
    if value := os.Getenv(key); value != "" {
        return strings.Split(value, ",")
    }
    return defaultValue
}


