package testutils

import (
	"log"
	"microbridge/backend/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func SetupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("Failed to connect to test database: %v", err)
	}

	// Run migrations
	err = db.AutoMigrate(
		&models.User{},
		&models.Job{},
		&models.Application{},
		&models.Notification{},
		&models.Project{},
		&models.Employer{},
		&models.Match{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate test database: %v", err)
	}

	return db
}

func CleanupTestDB(db *gorm.DB) {
	sqlDB, _ := db.DB()
	if sqlDB != nil {
		sqlDB.Close()
	}
}
