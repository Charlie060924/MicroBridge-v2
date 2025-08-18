package database

import (
	"context"
	"fmt"
	"microbridge/backend/internal/database/migrations"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database interface for database operations
type Database interface {
	DB() *gorm.DB
	Close() error
	RunMigrations(ctx context.Context) error
	GetMigrationStatus(ctx context.Context) error
}

// PostgresDB implements the Database interface
type PostgresDB struct {
	db *gorm.DB
}

// NewPostgresDB creates a new PostgreSQL database connection
func NewPostgresDB(dsn string) (Database, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get the underlying sql.DB object
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return &PostgresDB{db: db}, nil
}

// DB returns the underlying GORM database instance
func (p *PostgresDB) DB() *gorm.DB {
	return p.db
}

// Close closes the database connection
func (p *PostgresDB) Close() error {
	sqlDB, err := p.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// RunMigrations runs all database migrations
func (p *PostgresDB) RunMigrations(ctx context.Context) error {
	// Get all migrations
	migrationList := migrations.GetAllMigrations()

	// Create migrations table if it doesn't exist
	if err := p.db.Exec(`
		CREATE TABLE IF NOT EXISTS migrations (
			id SERIAL PRIMARY KEY,
			version BIGINT UNIQUE NOT NULL,
			name VARCHAR(255) NOT NULL,
			description TEXT,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`).Error; err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Run each migration
	for _, migration := range migrationList {
		// Check if migration already applied
		var count int64
		p.db.Model(&struct {
			Version int64 `gorm:"column:version"`
		}{}).Where("version = ?", migration.Version).Count(&count)

		if count == 0 {
			// Run the migration
			if err := p.db.Exec(migration.UpSQL).Error; err != nil {
				return fmt.Errorf("failed to run migration %s (version %d): %w", migration.Name, migration.Version, err)
			}

			// Record the migration
			if err := p.db.Exec(`
				INSERT INTO migrations (version, name, description) 
				VALUES (?, ?, ?)
			`, migration.Version, migration.Name, migration.Description).Error; err != nil {
				return fmt.Errorf("failed to record migration %s: %w", migration.Name, err)
			}

			fmt.Printf("✅ Applied migration: %s (version %d)\n", migration.Name, migration.Version)
		} else {
			fmt.Printf("⏭️  Skipped migration: %s (version %d) - already applied\n", migration.Name, migration.Version)
		}
	}

	return nil
}

// GetMigrationStatus shows the status of all migrations
func (p *PostgresDB) GetMigrationStatus(ctx context.Context) error {
	var appliedMigrations []struct {
		Version     int64     `gorm:"column:version"`
		Name        string    `gorm:"column:name"`
		AppliedAt   time.Time `gorm:"column:applied_at"`
	}

	if err := p.db.Table("migrations").Order("version").Find(&appliedMigrations).Error; err != nil {
		return fmt.Errorf("failed to get migration status: %w", err)
	}

	fmt.Printf("\n📊 Migration Status:\n")
	fmt.Printf("Applied migrations: %d\n", len(appliedMigrations))
	for _, migration := range appliedMigrations {
		fmt.Printf("  - %s (v%d) - %s\n", migration.Name, migration.Version, migration.AppliedAt.Format("2006-01-02 15:04:05"))
	}

	return nil
}
