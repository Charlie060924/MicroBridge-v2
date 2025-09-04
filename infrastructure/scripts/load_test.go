package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

// LoadTestConfig holds load test configuration
type LoadTestConfig struct {
	BaseURL           string
	ConcurrentUsers   int
	Duration          time.Duration
	RampUpTime        time.Duration
	ThinkTime         time.Duration
	TestScenarios     []TestScenario
}

// TestScenario defines a test scenario
type TestScenario struct {
	Name           string
	Endpoint       string
	Method         string
	Headers        map[string]string
	Body           interface{}
	ExpectedStatus int
	Weight         int // Relative weight for scenario selection
}

// LoadTestResult holds test results
type LoadTestResult struct {
	ScenarioName    string
	TotalRequests   int
	SuccessfulRequests int
	FailedRequests  int
	AverageResponseTime time.Duration
	MinResponseTime time.Duration
	MaxResponseTime time.Duration
	Percentile95    time.Duration
	Percentile99    time.Duration
	Errors          []string
}

// LoadTestRunner runs load tests
type LoadTestRunner struct {
	config LoadTestConfig
	results map[string]*LoadTestResult
	mu      sync.RWMutex
}

// NewLoadTestRunner creates a new load test runner
func NewLoadTestRunner(config LoadTestConfig) *LoadTestRunner {
	return &LoadTestRunner{
		config: config,
		results: make(map[string]*LoadTestResult),
	}
}

// Run executes the load test
func (r *LoadTestRunner) Run() {
	fmt.Printf("Starting load test with %d concurrent users for %v\n", 
		r.config.ConcurrentUsers, r.config.Duration)
	
	// Initialize results
	for _, scenario := range r.config.TestScenarios {
		r.results[scenario.Name] = &LoadTestResult{
			ScenarioName: scenario.Name,
		}
	}

	// Start concurrent users
	var wg sync.WaitGroup
	startTime := time.Now()
	
	for i := 0; i < r.config.ConcurrentUsers; i++ {
		wg.Add(1)
		go r.runUser(i, &wg)
		
		// Ramp up users gradually
		if r.config.RampUpTime > 0 {
			time.Sleep(r.config.RampUpTime / time.Duration(r.config.ConcurrentUsers))
		}
	}

	// Wait for test duration
	time.Sleep(r.config.Duration)
	
	// Signal users to stop
	// (In a real implementation, you'd use a context with cancellation)
	
	wg.Wait()
	
	// Print results
	r.printResults(time.Since(startTime))
}

// runUser simulates a single user
func (r *LoadTestRunner) runUser(userID int, wg *sync.WaitGroup) {
	defer wg.Done()
	
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	
	for {
		// Select scenario based on weights
		scenario := r.selectScenario()
		
		// Execute request
		start := time.Now()
		resp, err := r.executeRequest(client, scenario)
		duration := time.Since(start)
		
		// Record result
		r.recordResult(scenario, duration, resp, err)
		
		// Think time
		time.Sleep(r.config.ThinkTime)
	}
}

// selectScenario selects a test scenario based on weights
func (r *LoadTestRunner) selectScenario() TestScenario {
	// Simple weighted random selection
	totalWeight := 0
	for _, scenario := range r.config.TestScenarios {
		totalWeight += scenario.Weight
	}
	
	// For simplicity, just return the first scenario
	// In a real implementation, you'd implement weighted random selection
	return r.config.TestScenarios[0]
}

// executeRequest executes a single HTTP request
func (r *LoadTestRunner) executeRequest(client *http.Client, scenario TestScenario) (*http.Response, error) {
	var body []byte
	var err error
	
	if scenario.Body != nil {
		body, err = json.Marshal(scenario.Body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
	}
	
	req, err := http.NewRequest(scenario.Method, r.config.BaseURL+scenario.Endpoint, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	
	// Set headers
	req.Header.Set("Content-Type", "application/json")
	for key, value := range scenario.Headers {
		req.Header.Set(key, value)
	}
	
	return client.Do(req)
}

// recordResult records a test result
func (r *LoadTestRunner) recordResult(scenario TestScenario, duration time.Duration, resp *http.Response, err error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	result := r.results[scenario.Name]
	result.TotalRequests++
	
	if err != nil {
		result.FailedRequests++
		result.Errors = append(result.Errors, err.Error())
		return
	}
	
	if resp.StatusCode == scenario.ExpectedStatus {
		result.SuccessfulRequests++
	} else {
		result.FailedRequests++
		result.Errors = append(result.Errors, fmt.Sprintf("Expected status %d, got %d", scenario.ExpectedStatus, resp.StatusCode))
	}
	
	// Update response time statistics
	if result.MinResponseTime == 0 || duration < result.MinResponseTime {
		result.MinResponseTime = duration
	}
	if duration > result.MaxResponseTime {
		result.MaxResponseTime = duration
	}
	
	// Simple average calculation (in production, you'd use a more sophisticated approach)
	avg := (result.AverageResponseTime*time.Duration(result.SuccessfulRequests-1) + duration) / time.Duration(result.SuccessfulRequests)
	result.AverageResponseTime = avg
}

// printResults prints test results
func (r *LoadTestRunner) printResults(totalDuration time.Duration) {
	fmt.Printf("\n=== LOAD TEST RESULTS ===\n")
	fmt.Printf("Total Duration: %v\n", totalDuration)
	fmt.Printf("Concurrent Users: %d\n", r.config.ConcurrentUsers)
	fmt.Printf("\n")
	
	for _, result := range r.results {
		fmt.Printf("Scenario: %s\n", result.ScenarioName)
		fmt.Printf("  Total Requests: %d\n", result.TotalRequests)
		fmt.Printf("  Successful: %d\n", result.SuccessfulRequests)
		fmt.Printf("  Failed: %d\n", result.FailedRequests)
		fmt.Printf("  Success Rate: %.2f%%\n", float64(result.SuccessfulRequests)/float64(result.TotalRequests)*100)
		fmt.Printf("  Average Response Time: %v\n", result.AverageResponseTime)
		fmt.Printf("  Min Response Time: %v\n", result.MinResponseTime)
		fmt.Printf("  Max Response Time: %v\n", result.MaxResponseTime)
		fmt.Printf("  Requests/sec: %.2f\n", float64(result.TotalRequests)/totalDuration.Seconds())
		fmt.Printf("\n")
	}
}

func main() {
	// Define test scenarios
	scenarios := []TestScenario{
		{
			Name:           "Health Check",
			Endpoint:       "/health",
			Method:         "GET",
			ExpectedStatus: 200,
			Weight:         10,
		},
		{
			Name:           "User Registration",
			Endpoint:       "/api/v1/auth/register",
			Method:         "POST",
			Headers:        map[string]string{"Content-Type": "application/json"},
			Body: map[string]interface{}{
				"email":     "test@example.com",
				"name":      "Test User",
				"password":  "securepassword123",
				"user_type": "freelancer",
			},
			ExpectedStatus: 201,
			Weight:         5,
		},
		{
			Name:           "User Login",
			Endpoint:       "/api/v1/auth/login",
			Method:         "POST",
			Headers:        map[string]string{"Content-Type": "application/json"},
			Body: map[string]interface{}{
				"email":    "test@example.com",
				"password": "securepassword123",
			},
			ExpectedStatus: 200,
			Weight:         15,
		},
		{
			Name:           "Get Jobs",
			Endpoint:       "/api/v1/jobs",
			Method:         "GET",
			ExpectedStatus: 200,
			Weight:         20,
		},
		{
			Name:           "Get Recommendations",
			Endpoint:       "/api/v1/matching/recommendations/user123",
			Method:         "GET",
			Headers:        map[string]string{"Authorization": "Bearer test-token"},
			ExpectedStatus: 200,
			Weight:         25,
		},
		{
			Name:           "Calculate Match Score",
			Endpoint:       "/api/v1/matching/calculate/user123/job456",
			Method:         "GET",
			Headers:        map[string]string{"Authorization": "Bearer test-token"},
			ExpectedStatus: 200,
			Weight:         15,
		},
	}

	config := LoadTestConfig{
		BaseURL:         "http://localhost:8080",
		ConcurrentUsers: 50,
		Duration:        5 * time.Minute,
		RampUpTime:      30 * time.Second,
		ThinkTime:       1 * time.Second,
		TestScenarios:   scenarios,
	}

	runner := NewLoadTestRunner(config)
	runner.Run()
}

// PerformanceTest runs specific performance tests
func PerformanceTest() {
	fmt.Println("Running Performance Tests...")
	
	// Test matching algorithm performance
	testMatchingAlgorithmPerformance()
	
	// Test database query performance
	testDatabaseQueryPerformance()
	
	// Test cache performance
	testCachePerformance()
}

func testMatchingAlgorithmPerformance() {
	fmt.Println("Testing Matching Algorithm Performance...")
	
	// This would test the actual matching algorithm
	// For now, just a placeholder
	start := time.Now()
	
	// Simulate matching algorithm execution
	time.Sleep(100 * time.Millisecond)
	
	duration := time.Since(start)
	fmt.Printf("Matching algorithm took: %v\n", duration)
}

func testDatabaseQueryPerformance() {
	fmt.Println("Testing Database Query Performance...")
	
	// This would test actual database queries
	// For now, just a placeholder
	start := time.Now()
	
	// Simulate database query
	time.Sleep(50 * time.Millisecond)
	
	duration := time.Since(start)
	fmt.Printf("Database query took: %v\n", duration)
}

func testCachePerformance() {
	fmt.Println("Testing Cache Performance...")
	
	// This would test cache operations
	// For now, just a placeholder
	start := time.Now()
	
	// Simulate cache operation
	time.Sleep(5 * time.Millisecond)
	
	duration := time.Since(start)
	fmt.Printf("Cache operation took: %v\n", duration)
}
