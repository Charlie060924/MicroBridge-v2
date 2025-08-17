# 🔒 MicroBridge Security Implementation

This document describes the security features implemented in the MicroBridge backend.

## 🚀 Quick Start

### Running the Secure Server
```bash
# Run the secure version with all security features
make run-secure

# Or directly
go run cmd/api/secure_main.go
```

### Testing Security Features
```bash
# Test JWT implementation
make test-jwt

# Run all security tests
make test-security
```

## 🛡️ Security Features

### 1. JWT Authentication
- **Access Tokens**: 15-minute expiry (configurable)
- **Refresh Tokens**: 7-day expiry (configurable)
- **Secure Token Generation**: Uses HMAC-SHA256
- **Token Validation**: Comprehensive validation with specific error types

### 2. Authentication Middleware
- **Bearer Token Validation**: Proper "Bearer <token>" format
- **Role-Based Access Control**: User type validation
- **Resource Ownership**: Users can only access their own resources
- **Admin Access**: Special admin role for system-wide access

### 3. Rate Limiting
- **IP-based Limiting**: 100 requests per hour per IP (configurable)
- **Burst Protection**: 10 requests burst capacity
- **Automatic Cleanup**: Removes old entries every 5 minutes

### 4. Security Headers
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin

### 5. Secure Error Handling
- **Correlation IDs**: Track errors across requests
- **No Information Disclosure**: Internal errors never exposed
- **Structured Logging**: Secure logging with sensitive data filtering

### 6. Database Security
- **SSL Enforcement**: Required in production
- **Connection Pooling**: Optimized for security and performance
- **Parameterized Queries**: SQL injection prevention
- **Secure Logging**: No sensitive data in logs

## 🔧 Configuration

### Environment Variables
```bash
# Required for production
JWT_SECRET=your-very-long-secret-key-at-least-32-characters

# Optional (with defaults)
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=168h
BCRYPT_COST=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=1h
MAX_LOGIN_ATTEMPTS=5
LOGIN_ATTEMPT_WINDOW=15m
REQUIRE_HTTPS=false
ALLOWED_ORIGINS=http://localhost:3000
CSRF_PROTECTION=true
SESSION_TIMEOUT=30m
```

### Security Configuration
The security configuration is loaded from `config/security.go` and provides:
- Automatic JWT secret generation for development
- Production validation for required secrets
- Configurable rate limiting and authentication settings

## 🔐 API Endpoints

### Public Endpoints (No Auth Required)
```
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /health
```

### Protected Endpoints (Auth Required)
```
GET    /api/v1/users/:id          # Self or admin access only
PUT    /api/v1/users/:id          # Self or admin access only
DELETE /api/v1/users/:id          # Self or admin access only
POST   /api/v1/users/:id/change-password  # Self access only
```

### Admin Endpoints (Admin Role Required)
```
GET    /api/v1/admin/users        # List all users
```

## 🧪 Testing

### JWT Tests
```bash
go test -v ./pkg/jwt/...
```

### Security Integration Tests
```bash
./scripts/test_security.sh
```

### Manual Testing
```bash
# 1. Start the secure server
make run-secure

# 2. Register a user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "user_type": "student"
  }'

# 3. Login to get token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 4. Use token to access protected endpoint
curl -X GET http://localhost:8080/api/v1/users/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚨 Security Best Practices

### 1. JWT Secrets
- **Minimum 32 characters** in production
- **Use cryptographically secure random generation**
- **Never commit secrets to version control**
- **Rotate secrets regularly**

### 2. Rate Limiting
- **Monitor rate limit violations**
- **Adjust limits based on usage patterns**
- **Consider different limits for different endpoints**

### 3. Error Handling
- **Never expose internal errors to clients**
- **Use correlation IDs for debugging**
- **Log security events appropriately**

### 4. Database Security
- **Always use SSL in production**
- **Use parameterized queries**
- **Limit database user permissions**
- **Regular security audits**

## 🔍 Monitoring & Logging

### Security Events Logged
- Failed authentication attempts
- Rate limit violations
- Unauthorized access attempts
- Token validation failures

### Log Format
```json
{
  "level": "warn",
  "error": "Invalid JWT token",
  "path": "/api/v1/users/123",
  "method": "GET",
  "client_ip": "192.168.1.1",
  "correlation_id": "uuid-here",
  "timestamp": "2023-01-01T00:00:00Z"
}
```

## 🚀 Deployment Checklist

- [ ] Set `JWT_SECRET` environment variable (32+ characters)
- [ ] Set `GO_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` for your frontend
- [ ] Enable `REQUIRE_HTTPS=true` in production
- [ ] Set `DB_SSLMODE=require` for database
- [ ] Configure proper logging levels
- [ ] Set up monitoring for security events
- [ ] Test all authentication flows
- [ ] Verify rate limiting works correctly

## 🆘 Troubleshooting

### Common Issues

1. **"JWT_SECRET is required in production"**
   - Set the `JWT_SECRET` environment variable
   - Ensure it's at least 32 characters long

2. **"Authorization header required"**
   - Include `Authorization: Bearer <token>` header
   - Ensure token is valid and not expired

3. **"Rate limit exceeded"**
   - Reduce request frequency
   - Check if you're making too many requests

4. **"Access denied"**
   - Verify you're accessing your own resources
   - Check if you have the required role

### Debug Mode
For debugging, set `GO_ENV=development` to get more detailed error messages (never in production).
