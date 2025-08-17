package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	
	"microbridge/backend/internal/database/migrations"
)

type PostgresDB struct {
	DB       *gorm.DB
	SqlDB    *sql.DB
	migrator *migrations.Migrator
}

// REPLACE your existing InitDB function with this
func NewPostgresDB(dsn string) (*PostgresDB, error) {
	// Open SQL connection first for migrations
	sqlDB, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Open GORM connection
	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize GORM: %w", err)
	}

	// Initialize migrator
	migrator := migrations.NewMigrator(sqlDB)

	return &PostgresDB{
		DB:       gormDB,
		SqlDB:    sqlDB,
		migrator: migrator,
	}, nil
}

// CRITICAL: Replace your AutoMigrate with proper migrations
func (db *PostgresDB) RunMigrations(ctx context.Context) error {
	log.Println("Running database migrations...")
	
	// This replaces your dangerous AutoMigrate calls
	if err := db.migrator.Up(ctx, 999999999999); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}
	
	log.Println("Database migrations completed successfully")
	return nil
}

func (db *PostgresDB) GetMigrationStatus(ctx context.Context) error {
	status, err := db.migrator.Status(ctx)
	if err != nil {
		return err
	}
	
	log.Println("=== Migration Status ===")
	for _, s := range status {
		applied := "❌ No"
		if s.Applied {
			applied = "✅ Yes"
		}
		log.Printf("Version %d: %s - Applied: %s", s.Version, s.Name, applied)
	}
	
	return nil
}

func (db *PostgresDB) Close() error {
	return db.SqlDB.Close()
}
