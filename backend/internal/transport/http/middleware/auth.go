package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    jwtpkg "microbridge/backend/pkg/jwt"
    "microbridge/backend/pkg/logger"
)

type AuthMiddleware struct {
    jwtService *jwtpkg.Service
    logger     *logger.Logger
}

func NewAuthMiddleware(jwtService *jwtpkg.Service, logger *logger.Logger) *AuthMiddleware {
    return &AuthMiddleware{
        jwtService: jwtService,
        logger:     logger,
    }
}

// RequireAuth validates JWT token and sets user context
func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            m.logger.Warn().
                Str("path", c.Request.URL.Path).
                Str("method", c.Request.Method).
                Msg("Missing authorization header")
            
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Authorization header required",
                "code":  "MISSING_AUTH_HEADER",
            })
            c.Abort()
            return
        }

        // Extract token from "Bearer <token>"
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid authorization header format. Use: Bearer <token>",
                "code":  "INVALID_AUTH_FORMAT",
            })
            c.Abort()
            return
        }

        token := parts[1]
        claims, err := m.jwtService.ValidateToken(token)
        if err != nil {
            m.logger.Warn().
                Err(err).
                Str("path", c.Request.URL.Path).
                Msg("Invalid JWT token")

            var errorCode string
            var message string

            switch err {
            case jwtpkg.ErrTokenExpired:
                errorCode = "TOKEN_EXPIRED"
                message = "Token has expired"
            case jwtpkg.ErrTokenMalformed:
                errorCode = "TOKEN_MALFORMED"
                message = "Token is malformed"
            default:
                errorCode = "INVALID_TOKEN"
                message = "Invalid token"
            }

            c.JSON(http.StatusUnauthorized, gin.H{
                "error": message,
                "code":  errorCode,
            })
            c.Abort()
            return
        }

        // Set user context for downstream handlers
        c.Set("userID", claims.UserID)
        c.Set("userType", claims.UserType)
        c.Set("userEmail", claims.Email)
        c.Set("user_claims", claims)

        c.Next()
    }
}

// RequireRole checks if user has required role
func (m *AuthMiddleware) RequireRole(requiredRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        userType, exists := c.Get("userType")
        if !exists {
            c.JSON(http.StatusForbidden, gin.H{
                "error": "User type not found in context",
                "code":  "MISSING_USER_TYPE",
            })
            c.Abort()
            return
        }

        if userType.(string) != requiredRole {
            m.logger.Warn().
                Str("required_role", requiredRole).
                Str("user_role", userType.(string)).
                Str("path", c.Request.URL.Path).
                Msg("Insufficient permissions")

            c.JSON(http.StatusForbidden, gin.H{
                "error": "Insufficient permissions",
                "code":  "INSUFFICIENT_PERMISSIONS",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}

// RequireSelfOrAdmin ensures user can only access their own resources or is admin
func (m *AuthMiddleware) RequireSelfOrAdmin() gin.HandlerFunc {
    return func(c *gin.Context) {
        currentUserID, exists := c.Get("userID")
        if !exists {
            c.JSON(http.StatusForbidden, gin.H{
                "error": "User ID not found in context",
                "code":  "MISSING_USER_ID",
            })
            c.Abort()
            return
        }

        resourceUserID := c.Param("id")
        userType := c.GetString("userType")

        // Allow if accessing own resource or if admin
        if currentUserID.(string) != resourceUserID && userType != "admin" {
            m.logger.Warn().
                Str("current_user", currentUserID.(string)).
                Str("resource_user", resourceUserID).
                Str("user_type", userType).
                Str("path", c.Request.URL.Path).
                Msg("Unauthorized resource access attempt")

            c.JSON(http.StatusForbidden, gin.H{
                "error": "Access denied. You can only access your own resources.",
                "code":  "ACCESS_DENIED",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}
