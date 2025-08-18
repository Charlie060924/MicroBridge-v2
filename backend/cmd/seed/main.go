package main

import (
	"context"
	"fmt"
	"log"
	"microbridge/backend/config"
	"microbridge/backend/internal/database"
	"microbridge/backend/internal/models"
	"microbridge/backend/internal/testutils"
	"os"

	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Hong_Kong",
		cfg.Database.Host, cfg.Database.User, cfg.Database.Password, 
		cfg.Database.DBName, cfg.Database.Port, cfg.Database.SSLMode,
	)
	
	db, err := database.NewPostgresDB(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations first
	ctx := context.Background()
	if err := db.RunMigrations(ctx); err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	// Check if we should clear existing data
	if len(os.Args) > 1 && os.Args[1] == "--clear" {
		if err := clearExistingData(db.DB()); err != nil {
			log.Fatalf("Failed to clear existing data: %v", err)
		}
		fmt.Println("✅ Cleared existing data")
	}

	// Create mock data
	mockData, err := testutils.CreateMockReviewData()
	if err != nil {
		log.Fatalf("Failed to create mock data: %v", err)
	}

	// Seed the database
	if err := seedDatabase(db.DB(), mockData); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	fmt.Println("✅ Database seeded successfully!")
	fmt.Printf("📊 Seeded %d users, %d jobs, %d applications, and %d reviews\n", 
		len(mockData.Students)+len(mockData.Employers),
		len(mockData.Jobs),
		len(mockData.Applications),
		len(mockData.Reviews))
	
	fmt.Println("\n🎯 Test Users:")
	fmt.Println("  Students:")
	for _, student := range mockData.Students {
		fmt.Printf("    - %s (%s) - %s\n", student.Name, student.ID, student.Email)
	}
	fmt.Println("  Employers:")
	for _, employer := range mockData.Employers {
		fmt.Printf("    - %s (%s) - %s\n", employer.Name, employer.ID, employer.Email)
	}
	
	fmt.Println("\n💼 Completed Jobs:")
	for i, job := range mockData.CompletedJobs {
		fmt.Printf("    %d. %s at %s (ID: %s)\n", i+1, job.Title, job.Company, job.ID)
	}
	
	fmt.Println("\n⭐ Reviews Summary:")
	reviewCounts := make(map[string]int)
	for _, review := range mockData.Reviews {
		user := getUserByID(mockData, review.RevieweeID)
		if user != nil {
			reviewCounts[user.Name]++
		}
	}
	for userName, count := range reviewCounts {
		fmt.Printf("    - %s: %d reviews\n", userName, count)
	}
}

func clearExistingData(db *gorm.DB) error {
	// Clear data in reverse order of dependencies
	tables := []string{"reviews", "applications", "jobs", "users"}
	
	for _, table := range tables {
		if err := db.Exec(fmt.Sprintf("DELETE FROM %s", table)).Error; err != nil {
			return fmt.Errorf("failed to clear table %s: %v", table, err)
		}
	}
	
	return nil
}

func seedDatabase(db *gorm.DB, mockData *testutils.MockReviewData) error {
	// Create users (students and employers)
	allUsers := append(mockData.Students, mockData.Employers...)
	for _, user := range allUsers {
		if err := db.Create(user).Error; err != nil {
			return fmt.Errorf("failed to create user %s: %v", user.Name, err)
		}
	}
	fmt.Println("✅ Created users")

	// Create jobs
	for _, job := range mockData.Jobs {
		if err := db.Create(job).Error; err != nil {
			return fmt.Errorf("failed to create job %s: %v", job.Title, err)
		}
	}
	fmt.Println("✅ Created jobs")

	// Create applications
	for _, app := range mockData.Applications {
		if err := db.Create(app).Error; err != nil {
			return fmt.Errorf("failed to create application %s: %v", app.ID, err)
		}
	}
	fmt.Println("✅ Created applications")

	// Create completed jobs
	for _, job := range mockData.CompletedJobs {
		if err := db.Create(job).Error; err != nil {
			return fmt.Errorf("failed to create completed job %s: %v", job.Title, err)
		}
	}
	fmt.Println("✅ Created completed jobs")

	// Create reviews
	for _, review := range mockData.Reviews {
		if err := db.Create(review).Error; err != nil {
			return fmt.Errorf("failed to create review %s: %v", review.ID, err)
		}
	}
	fmt.Println("✅ Created reviews")

	return nil
}

func getUserByID(mockData *testutils.MockReviewData, userID string) *models.User {
	// Check students
	for _, student := range mockData.Students {
		if student.ID == userID {
			return student
		}
	}
	
	// Check employers
	for _, employer := range mockData.Employers {
		if employer.ID == userID {
			return employer
		}
	}
	
	return nil
}
