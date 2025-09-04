package middleware

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "golang.org/x/time/rate"
    "sync"
)

type RateLimiter struct {
    visitors map[string]*Visitor
    mu       sync.RWMutex
    rate     rate.Limit
    burst    int
    cleanup  time.Duration
}

type Visitor struct {
    limiter  *rate.Limiter
    lastSeen time.Time
}

func NewRateLimiter(requestsPerSecond float64, burst int) *RateLimiter {
    rl := &RateLimiter{
        visitors: make(map[string]*Visitor),
        rate:     rate.Limit(requestsPerSecond),
        burst:    burst,
        cleanup:  5 * time.Minute,
    }

    // Clean up old visitors periodically
    go rl.cleanupVisitors()
    
    return rl
}

func (rl *RateLimiter) getVisitor(ip string) *rate.Limiter {
    rl.mu.Lock()
    defer rl.mu.Unlock()

    v, exists := rl.visitors[ip]
    if !exists {
        limiter := rate.NewLimiter(rl.rate, rl.burst)
        rl.visitors[ip] = &Visitor{limiter, time.Now()}
        return limiter
    }

    v.lastSeen = time.Now()
    return v.limiter
}

func (rl *RateLimiter) cleanupVisitors() {
    for {
        time.Sleep(rl.cleanup)
        rl.mu.Lock()
        for ip, v := range rl.visitors {
            if time.Since(v.lastSeen) > rl.cleanup {
                delete(rl.visitors, ip)
            }
        }
        rl.mu.Unlock()
    }
}

func (rl *RateLimiter) Limit() gin.HandlerFunc {
    return func(c *gin.Context) {
        limiter := rl.getVisitor(c.ClientIP())
        if !limiter.Allow() {
            c.JSON(http.StatusTooManyRequests, gin.H{
                "error": "Rate limit exceeded",
                "code":  "RATE_LIMIT_EXCEEDED",
                "retry_after": limiter.Reserve().Delay().Seconds(),
            })
            c.Abort()
            return
        }
        c.Next()
    }
}
