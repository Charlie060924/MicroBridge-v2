package monitoring

import (
	"context"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Metrics holds all application metrics
type Metrics struct {
	// HTTP metrics
	httpRequestsTotal   *prometheus.CounterVec
	httpRequestDuration *prometheus.HistogramVec
	httpRequestsInFlight *prometheus.GaugeVec

	// Business metrics
	matchingLatency     *prometheus.HistogramVec
	activeMatches       *prometheus.GaugeVec
	applicationConversion *prometheus.CounterVec
	userEngagement      *prometheus.GaugeVec
	jobPostingSuccess   *prometheus.CounterVec
	userRegistration    *prometheus.CounterVec
	skillMatchQuality   *prometheus.HistogramVec

	// Database metrics
	databaseConnections *prometheus.GaugeVec
	databaseQueryDuration *prometheus.HistogramVec
	databaseErrors      *prometheus.CounterVec

	// Cache metrics
	cacheHits           *prometheus.CounterVec
	cacheMisses         *prometheus.CounterVec
	cacheSize           *prometheus.GaugeVec

	// System metrics
	memoryUsage         *prometheus.GaugeVec
	cpuUsage            *prometheus.GaugeVec
	goroutines          *prometheus.GaugeVec

	// Custom business metrics
	matchScoreDistribution *prometheus.HistogramVec
	userRetentionRate     *prometheus.GaugeVec
	employerSatisfaction  *prometheus.GaugeVec
	timeToFirstMatch      *prometheus.HistogramVec
}

// NewMetrics creates and registers all metrics
func NewMetrics() *Metrics {
	m := &Metrics{
		// HTTP metrics
		httpRequestsTotal: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_http_requests_total",
				Help: "Total number of HTTP requests",
			},
			[]string{"method", "endpoint", "status_code", "user_type"},
		),
		httpRequestDuration: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_http_request_duration_seconds",
				Help:    "HTTP request duration in seconds",
				Buckets: prometheus.DefBuckets,
			},
			[]string{"method", "endpoint", "user_type"},
		),
		httpRequestsInFlight: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_http_requests_in_flight",
				Help: "Number of HTTP requests currently being processed",
			},
			[]string{"method", "endpoint"},
		),

		// Business metrics
		matchingLatency: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_matching_latency_seconds",
				Help:    "Time taken to calculate match scores",
				Buckets: []float64{0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0},
			},
			[]string{"algorithm_type", "user_type"},
		),
		activeMatches: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_active_matches",
				Help: "Number of active matches in the system",
			},
			[]string{"match_quality", "user_type"},
		),
		applicationConversion: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_application_conversions_total",
				Help: "Total number of successful job applications",
			},
			[]string{"status", "match_score_range", "job_category"},
		),
		userEngagement: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_user_engagement_score",
				Help: "User engagement score (0-100)",
			},
			[]string{"user_type", "engagement_type"},
		),
		jobPostingSuccess: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_job_posting_success_total",
				Help: "Total number of successful job postings",
			},
			[]string{"job_category", "experience_level", "location_type"},
		),
		userRegistration: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_user_registrations_total",
				Help: "Total number of user registrations",
			},
			[]string{"user_type", "registration_source"},
		),
		skillMatchQuality: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_skill_match_quality",
				Help:    "Quality of skill matches (0-1)",
				Buckets: []float64{0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0},
			},
			[]string{"skill_category", "experience_level"},
		),

		// Database metrics
		databaseConnections: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_database_connections",
				Help: "Number of active database connections",
			},
			[]string{"connection_type", "database"},
		),
		databaseQueryDuration: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_database_query_duration_seconds",
				Help:    "Database query duration in seconds",
				Buckets: []float64{0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0},
			},
			[]string{"query_type", "table"},
		),
		databaseErrors: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_database_errors_total",
				Help: "Total number of database errors",
			},
			[]string{"error_type", "operation"},
		),

		// Cache metrics
		cacheHits: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_cache_hits_total",
				Help: "Total number of cache hits",
			},
			[]string{"cache_layer", "cache_type"},
		),
		cacheMisses: promauto.NewCounterVec(
			prometheus.CounterOpts{
				Name: "microbridge_cache_misses_total",
				Help: "Total number of cache misses",
			},
			[]string{"cache_layer", "cache_type"},
		),
		cacheSize: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_cache_size",
				Help: "Number of items in cache",
			},
			[]string{"cache_layer", "cache_type"},
		),

		// System metrics
		memoryUsage: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_memory_usage_bytes",
				Help: "Memory usage in bytes",
			},
			[]string{"memory_type"},
		),
		cpuUsage: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_cpu_usage_percent",
				Help: "CPU usage percentage",
			},
			[]string{"cpu_type"},
		),
		goroutines: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_goroutines",
				Help: "Number of active goroutines",
			},
			[]string{"component"},
		),

		// Custom business metrics
		matchScoreDistribution: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_match_score_distribution",
				Help:    "Distribution of match scores",
				Buckets: []float64{0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0},
			},
			[]string{"user_type", "job_category"},
		),
		userRetentionRate: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_user_retention_rate",
				Help: "User retention rate percentage",
			},
			[]string{"user_type", "time_period"},
		),
		employerSatisfaction: promauto.NewGaugeVec(
			prometheus.GaugeOpts{
				Name: "microbridge_employer_satisfaction_score",
				Help: "Employer satisfaction score (1-5)",
			},
			[]string{"satisfaction_type"},
		),
		timeToFirstMatch: promauto.NewHistogramVec(
			prometheus.HistogramOpts{
				Name:    "microbridge_time_to_first_match_hours",
				Help:    "Time from registration to first match in hours",
				Buckets: []float64{1, 6, 12, 24, 48, 72, 168, 336, 720},
			},
			[]string{"user_type", "match_quality"},
		),
	}

	return m
}

// RecordHTTPRequest records HTTP request metrics
func (m *Metrics) RecordHTTPRequest(method, endpoint, statusCode, userType string, duration time.Duration) {
	m.httpRequestsTotal.WithLabelValues(method, endpoint, statusCode, userType).Inc()
	m.httpRequestDuration.WithLabelValues(method, endpoint, userType).Observe(duration.Seconds())
}

// RecordMatchingLatency records matching algorithm performance
func (m *Metrics) RecordMatchingLatency(algorithmType, userType string, duration time.Duration) {
	m.matchingLatency.WithLabelValues(algorithmType, userType).Observe(duration.Seconds())
}

// RecordActiveMatches records the number of active matches
func (m *Metrics) RecordActiveMatches(matchQuality, userType string, count float64) {
	m.activeMatches.WithLabelValues(matchQuality, userType).Set(count)
}

// RecordApplicationConversion records successful job applications
func (m *Metrics) RecordApplicationConversion(status, matchScoreRange, jobCategory string) {
	m.applicationConversion.WithLabelValues(status, matchScoreRange, jobCategory).Inc()
}

// RecordUserEngagement records user engagement metrics
func (m *Metrics) RecordUserEngagement(userType, engagementType string, score float64) {
	m.userEngagement.WithLabelValues(userType, engagementType).Set(score)
}

// RecordJobPostingSuccess records successful job postings
func (m *Metrics) RecordJobPostingSuccess(jobCategory, experienceLevel, locationType string) {
	m.jobPostingSuccess.WithLabelValues(jobCategory, experienceLevel, locationType).Inc()
}

// RecordUserRegistration records user registrations
func (m *Metrics) RecordUserRegistration(userType, registrationSource string) {
	m.userRegistration.WithLabelValues(userType, registrationSource).Inc()
}

// RecordSkillMatchQuality records skill matching quality
func (m *Metrics) RecordSkillMatchQuality(skillCategory, experienceLevel string, quality float64) {
	m.skillMatchQuality.WithLabelValues(skillCategory, experienceLevel).Observe(quality)
}

// RecordDatabaseConnection records database connection metrics
func (m *Metrics) RecordDatabaseConnection(connectionType, database string, count float64) {
	m.databaseConnections.WithLabelValues(connectionType, database).Set(count)
}

// RecordDatabaseQueryDuration records database query performance
func (m *Metrics) RecordDatabaseQueryDuration(queryType, table string, duration time.Duration) {
	m.databaseQueryDuration.WithLabelValues(queryType, table).Observe(duration.Seconds())
}

// RecordDatabaseError records database errors
func (m *Metrics) RecordDatabaseError(errorType, operation string) {
	m.databaseErrors.WithLabelValues(errorType, operation).Inc()
}

// RecordCacheHit records cache hits
func (m *Metrics) RecordCacheHit(cacheLayer, cacheType string) {
	m.cacheHits.WithLabelValues(cacheLayer, cacheType).Inc()
}

// RecordCacheMiss records cache misses
func (m *Metrics) RecordCacheMiss(cacheLayer, cacheType string) {
	m.cacheMisses.WithLabelValues(cacheLayer, cacheType).Inc()
}

// RecordCacheSize records cache size
func (m *Metrics) RecordCacheSize(cacheLayer, cacheType string, size float64) {
	m.cacheSize.WithLabelValues(cacheLayer, cacheType).Set(size)
}

// RecordMemoryUsage records memory usage
func (m *Metrics) RecordMemoryUsage(memoryType string, bytes int64) {
	m.memoryUsage.WithLabelValues(memoryType).Set(float64(bytes))
}

// RecordCPUUsage records CPU usage
func (m *Metrics) RecordCPUUsage(cpuType string, percentage float64) {
	m.cpuUsage.WithLabelValues(cpuType).Set(percentage)
}

// RecordGoroutines records number of goroutines
func (m *Metrics) RecordGoroutines(component string, count int) {
	m.goroutines.WithLabelValues(component).Set(float64(count))
}

// RecordMatchScoreDistribution records match score distribution
func (m *Metrics) RecordMatchScoreDistribution(userType, jobCategory string, score float64) {
	m.matchScoreDistribution.WithLabelValues(userType, jobCategory).Observe(score)
}

// RecordUserRetentionRate records user retention rate
func (m *Metrics) RecordUserRetentionRate(userType, timePeriod string, rate float64) {
	m.userRetentionRate.WithLabelValues(userType, timePeriod).Set(rate)
}

// RecordEmployerSatisfaction records employer satisfaction
func (m *Metrics) RecordEmployerSatisfaction(satisfactionType string, score float64) {
	m.employerSatisfaction.WithLabelValues(satisfactionType).Set(score)
}

// RecordTimeToFirstMatch records time to first match
func (m *Metrics) RecordTimeToFirstMatch(userType, matchQuality string, hours float64) {
	m.timeToFirstMatch.WithLabelValues(userType, matchQuality).Observe(hours)
}

// BusinessMetricsCollector provides business-specific metrics collection
type BusinessMetricsCollector struct {
	metrics *Metrics
}

// NewBusinessMetricsCollector creates a new business metrics collector
func NewBusinessMetricsCollector(metrics *Metrics) *BusinessMetricsCollector {
	return &BusinessMetricsCollector{
		metrics: metrics,
	}
}

// CollectMatchingMetrics collects comprehensive matching metrics
func (bc *BusinessMetricsCollector) CollectMatchingMetrics(ctx context.Context, stats map[string]interface{}) {
	// Record match score distribution
	if matchScores, ok := stats["match_scores"].([]float64); ok {
		for _, score := range matchScores {
			bc.metrics.RecordMatchScoreDistribution("freelancer", "all", score)
		}
	}

	// Record active matches by quality
	if activeMatches, ok := stats["active_matches"].(map[string]int); ok {
		for quality, count := range activeMatches {
			bc.metrics.RecordActiveMatches(quality, "freelancer", float64(count))
		}
	}

	// Record matching latency
	if latency, ok := stats["avg_matching_latency"].(time.Duration); ok {
		bc.metrics.RecordMatchingLatency("harmonic_mean", "freelancer", latency)
	}
}

// CollectUserEngagementMetrics collects user engagement metrics
func (bc *BusinessMetricsCollector) CollectUserEngagementMetrics(ctx context.Context, stats map[string]interface{}) {
	// Record user engagement scores
	if engagement, ok := stats["engagement_scores"].(map[string]float64); ok {
		for engagementType, score := range engagement {
			bc.metrics.RecordUserEngagement("freelancer", engagementType, score)
		}
	}

	// Record user retention rate
	if retention, ok := stats["retention_rate"].(float64); ok {
		bc.metrics.RecordUserRetentionRate("freelancer", "30_days", retention)
	}
}

// CollectApplicationMetrics collects application-related metrics
func (bc *BusinessMetricsCollector) CollectApplicationMetrics(ctx context.Context, stats map[string]interface{}) {
	// Record application conversions
	if conversions, ok := stats["conversions"].(map[string]int); ok {
		for status, count := range conversions {
			for i := 0; i < count; i++ {
				bc.metrics.RecordApplicationConversion(status, "0.7-1.0", "technology")
			}
		}
	}

	// Record time to first match
	if timeToMatch, ok := stats["avg_time_to_first_match"].(time.Duration); ok {
		bc.metrics.RecordTimeToFirstMatch("freelancer", "good", timeToMatch.Hours())
	}
}

// CollectSystemMetrics collects system performance metrics
func (bc *BusinessMetricsCollector) CollectSystemMetrics(ctx context.Context, stats map[string]interface{}) {
	// Record cache performance
	if cacheStats, ok := stats["cache_stats"].(map[string]interface{}); ok {
		if hits, ok := cacheStats["hits"].(int); ok {
			for i := 0; i < hits; i++ {
				bc.metrics.RecordCacheHit("redis", "match_results")
			}
		}
		if misses, ok := cacheStats["misses"].(int); ok {
			for i := 0; i < misses; i++ {
				bc.metrics.RecordCacheMiss("redis", "match_results")
			}
		}
	}

	// Record database performance
	if dbStats, ok := stats["database_stats"].(map[string]interface{}); ok {
		if queryDuration, ok := dbStats["avg_query_duration"].(time.Duration); ok {
			bc.metrics.RecordDatabaseQueryDuration("select", "users", queryDuration)
		}
		if connections, ok := dbStats["active_connections"].(int); ok {
			bc.metrics.RecordDatabaseConnection("active", "postgres", float64(connections))
		}
	}
}
