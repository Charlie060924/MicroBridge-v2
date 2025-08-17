package jwt

import (
    "errors"
    "fmt"
    "time"

    "github.com/golang-jwt/jwt/v5"
)

var (
    ErrInvalidToken     = errors.New("invalid token")
    ErrTokenExpired     = errors.New("token expired")
    ErrTokenMalformed   = errors.New("token malformed")
)

type Claims struct {
    UserID   string `json:"user_id"`
    UserType string `json:"user_type"`
    Email    string `json:"email"`
    jwt.RegisteredClaims
}

type Service struct {
    secretKey       []byte
    issuer          string
    accessDuration  time.Duration
    refreshDuration time.Duration
}

func NewJWTService(secretKey, issuer string, accessDuration, refreshDuration time.Duration) *Service {
    return &Service{
        secretKey:       []byte(secretKey),
        issuer:          issuer,
        accessDuration:  accessDuration,
        refreshDuration: refreshDuration,
    }
}

func (s *Service) GenerateTokenPair(userID, userType, email string) (accessToken, refreshToken string, err error) {
    // Generate access token
    accessToken, err = s.generateToken(userID, userType, email, s.accessDuration, "access")
    if err != nil {
        return "", "", fmt.Errorf("failed to generate access token: %w", err)
    }

    // Generate refresh token
    refreshToken, err = s.generateToken(userID, userType, email, s.refreshDuration, "refresh")
    if err != nil {
        return "", "", fmt.Errorf("failed to generate refresh token: %w", err)
    }

    return accessToken, refreshToken, nil
}

func (s *Service) generateToken(userID, userType, email string, duration time.Duration, tokenType string) (string, error) {
    now := time.Now()
    claims := Claims{
        UserID:   userID,
        UserType: userType,
        Email:    email,
        RegisteredClaims: jwt.RegisteredClaims{
            Issuer:    s.issuer,
            Subject:   userID,
            Audience:  []string{"microbridge-api"},
            ExpiresAt: jwt.NewNumericDate(now.Add(duration)),
            NotBefore: jwt.NewNumericDate(now),
            IssuedAt:  jwt.NewNumericDate(now),
            ID:        fmt.Sprintf("%s_%s_%d", userID, tokenType, now.Unix()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(s.secretKey)
}

func (s *Service) ValidateToken(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return s.secretKey, nil
    })

    if err != nil {
        if errors.Is(err, jwt.ErrTokenExpired) {
            return nil, ErrTokenExpired
        }
        if errors.Is(err, jwt.ErrTokenMalformed) {
            return nil, ErrTokenMalformed
        }
        return nil, ErrInvalidToken
    }

    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }

    return nil, ErrInvalidToken
}

func (s *Service) RefreshToken(refreshTokenString string) (newAccessToken, newRefreshToken string, err error) {
    claims, err := s.ValidateToken(refreshTokenString)
    if err != nil {
        return "", "", err
    }

    // Generate new token pair
    return s.GenerateTokenPair(claims.UserID, claims.UserType, claims.Email)
}
