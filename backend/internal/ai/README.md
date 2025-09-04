# AI Service Architecture Analysis

## Existing Architecture Pattern Analysis

### Core Service Structure
- **Location**: `/backend/internal/core/` (not `/backend/internal/services/`)
- **Pattern**: Domain-driven structure with `matching/` and `reviews/` modules
- **Interface-first design**: Services implement interfaces defined in each domain
- **Dependency injection**: Services accept repository interfaces in constructors

### Service Constructor Pattern
```go
func NewMatchingService(userRepo repository.UserRepository, jobRepo repository.JobRepository) *MatchingService
```

### Existing Matching System Architecture
- **Core Algorithm**: Harmonic mean calculation with skill matching
- **Multi-factor scoring**: Skills, experience level, location, remote work
- **Performance**: Processes 1000+ jobs per matching request
- **Caching**: No explicit caching in core matching (opportunity for Redis integration)

## AI/ML Library Requirements (Max 3, Size-Optimized)

### Selected Libraries
1. **gonum.org/v1/gonum** (Scientific computing, linear algebra)
   - Size: ~15MB
   - Purpose: Mathematical operations, similarity calculations
   - Justification: Native Go, minimal dependencies

2. **github.com/sjwhitworth/golearn** (Basic ML algorithms)
   - Size: ~25MB  
   - Purpose: Simple clustering, classification for matching
   - Justification: Pure Go implementation, lightweight

3. **github.com/go-gota/gota** (Data frames for feature engineering)
   - Size: ~5MB
   - Purpose: Data preprocessing, feature extraction
   - Justification: Minimal dependencies, data manipulation

**Total estimated size increase: ~45MB** (well under 200MB limit)

## AI Service Memory and CPU Resource Limits

### Memory Allocation
- **AI Service Process**: 512MB maximum
- **Model Storage**: 100MB maximum per model
- **Inference Cache**: 256MB Redis allocation
- **Feature Extraction**: 100MB working memory

### CPU Constraints
- **Inference Timeout**: 3 seconds per request
- **Batch Processing**: Max 50 concurrent inferences
- **Background Training**: Low priority scheduling

## Docker Optimization Strategy

### Multi-stage Build Plan
```dockerfile
# Stage 1: AI dependencies
FROM golang:1.21-alpine AS ai-builder
RUN apk add --no-cache git
COPY go.mod go.sum ./
RUN go mod download

# Stage 2: Application build (existing)
FROM golang:1.21-alpine AS builder
COPY --from=ai-builder /go/pkg /go/pkg
...existing build steps...

# Stage 3: Runtime (optimized)
FROM alpine:latest
RUN apk --no-cache add ca-certificates
# AI models and config
COPY --from=builder /app/models /app/models
COPY --from=builder /app/main .
```

**Estimated image size increase: 45MB** (within 200MB limit)

## Performance Impact Analysis

### Database Performance Baseline
- Current average query time: ~2ms
- Target with AI tables: <7ms (5ms tolerance)
- Mitigation: Proper indexing, partitioning for behavior tracking

### API Response Time Impact
- Existing matching: ~500ms
- With AI inference: Target <3s (graceful degradation at 3.1s)
- Caching strategy: Redis with 1-hour TTL for predictions

## Graceful Degradation Architecture

### Fallback Strategy
1. **AI Service Timeout**: 3 seconds → fallback to existing matching
2. **AI Service Failure**: Circuit breaker → existing matching
3. **Model Loading Error**: Disable AI features, log error
4. **Memory Exhaustion**: Restart AI service, maintain core functionality

### Implementation Pattern
```go
type AIEnhancedMatchingService struct {
    baseMatching    *matching.MatchingService
    aiService       AIService
    circuitBreaker  *CircuitBreaker
    fallbackEnabled bool
}

func (s *AIEnhancedMatchingService) FindJobsForUser(ctx context.Context, userID string, limit int) ([]MatchResult, error) {
    if s.circuitBreaker.CanExecute() {
        // Try AI-enhanced matching with timeout
        ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
        defer cancel()
        
        results, err := s.aiService.EnhancedMatching(ctx, userID, limit)
        if err == nil {
            return results, nil
        }
        s.circuitBreaker.RecordFailure()
    }
    
    // Fallback to existing matching
    return s.baseMatching.FindJobsForUser(ctx, userID, limit)
}
```

## Integration Risk Assessment

### LOW RISK ✅
- Using existing repository interfaces
- Following established service patterns
- Memory-constrained AI libraries

### MEDIUM RISK 🟡  
- New database tables (mitigated by indexing strategy)
- Docker image size (mitigated by multi-stage build)

### HIGH RISK 🔴
- AI inference latency (mitigated by strict timeouts + fallback)
- Resource consumption (mitigated by process limits + monitoring)

## Next Steps
1. Create AI service directory structure following core patterns
2. Implement graceful degradation wrapper
3. Add AI-specific configuration to existing config system
4. Implement monitoring and alerting integration