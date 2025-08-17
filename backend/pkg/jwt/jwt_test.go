package jwt

import (
    "testing"
    "time"
)

func TestJWTService_GenerateAndValidateToken(t *testing.T) {
    // Test secret key (32+ characters for security)
    secretKey := "test-secret-key-that-is-long-enough-for-security"
    issuer := "test-issuer"
    accessDuration := 15 * time.Minute
    refreshDuration := 24 * time.Hour

    service := NewJWTService(secretKey, issuer, accessDuration, refreshDuration)

    // Test data
    userID := "test-user-123"
    userType := "student"
    email := "test@example.com"

    // Generate token pair
    accessToken, refreshToken, err := service.GenerateTokenPair(userID, userType, email)
    if err != nil {
        t.Fatalf("Failed to generate token pair: %v", err)
    }

    // Validate access token
    claims, err := service.ValidateToken(accessToken)
    if err != nil {
        t.Fatalf("Failed to validate access token: %v", err)
    }

    // Check claims
    if claims.UserID != userID {
        t.Errorf("Expected UserID %s, got %s", userID, claims.UserID)
    }
    if claims.UserType != userType {
        t.Errorf("Expected UserType %s, got %s", userType, claims.UserType)
    }
    if claims.Email != email {
        t.Errorf("Expected Email %s, got %s", email, claims.Email)
    }

    // Validate refresh token
    refreshClaims, err := service.ValidateToken(refreshToken)
    if err != nil {
        t.Fatalf("Failed to validate refresh token: %v", err)
    }

    // Check refresh token claims
    if refreshClaims.UserID != userID {
        t.Errorf("Expected UserID %s, got %s", userID, refreshClaims.UserID)
    }

    // Test token refresh
    newAccessToken, newRefreshToken, err := service.RefreshToken(refreshToken)
    if err != nil {
        t.Fatalf("Failed to refresh token: %v", err)
    }

    // Validate new tokens
    _, err = service.ValidateToken(newAccessToken)
    if err != nil {
        t.Errorf("Failed to validate new access token: %v", err)
    }

    _, err = service.ValidateToken(newRefreshToken)
    if err != nil {
        t.Errorf("Failed to validate new refresh token: %v", err)
    }
}

func TestJWTService_InvalidToken(t *testing.T) {
    service := NewJWTService("test-secret", "test-issuer", time.Hour, 24*time.Hour)

    // Test invalid token
    _, err := service.ValidateToken("invalid-token")
    if err == nil {
        t.Error("Expected error for invalid token, got nil")
    }

    // Test empty token
    _, err = service.ValidateToken("")
    if err == nil {
        t.Error("Expected error for empty token, got nil")
    }
}

func TestJWTService_WeakSecret(t *testing.T) {
    // Test with weak secret (should still work but warn in production)
    weakSecret := "weak"
    service := NewJWTService(weakSecret, "test-issuer", time.Hour, 24*time.Hour)

    userID := "test-user"
    userType := "student"
    email := "test@example.com"

    // Should still work
    accessToken, _, err := service.GenerateTokenPair(userID, userType, email)
    if err != nil {
        t.Fatalf("Failed to generate token with weak secret: %v", err)
    }

    // Should validate
    claims, err := service.ValidateToken(accessToken)
    if err != nil {
        t.Fatalf("Failed to validate token with weak secret: %v", err)
    }

    if claims.UserID != userID {
        t.Errorf("Expected UserID %s, got %s", userID, claims.UserID)
    }
}
