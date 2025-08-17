package migrations

import (
	"context"
	"database/sql"
	"fmt"
	"sort"
	"time"
)

type Migration struct {
	Version     int64
	Name        string
	UpSQL       string
	DownSQL     string
	AppliedAt   *time.Time
	Description string
}

type MigrationStatus struct {
	Version   int64
	Name      string
	Applied   bool
	AppliedAt *time.Time
}

type Migrator struct {
	db         *sql.DB
	migrations []Migration
}

func NewMigrator(db *sql.DB) *Migrator {
	return &Migrator{
		db:         db,
		migrations: GetAllMigrations(),
	}
}

func (m *Migrator) InitSchema(ctx context.Context) error {
	query := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version BIGINT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		checksum VARCHAR(255) NOT NULL
	)`
	_, err := m.db.ExecContext(ctx, query)
	return err
}

func (m *Migrator) Up(ctx context.Context, targetVersion int64) error {
	if err := m.InitSchema(ctx); err != nil {
		return fmt.Errorf("failed to init schema: %w", err)
	}

	applied, err := m.getAppliedMigrations(ctx)
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	sort.Slice(m.migrations, func(i, j int) bool {
		return m.migrations[i].Version < m.migrations[j].Version
	})

	for _, migration := range m.migrations {
		if migration.Version > targetVersion {
			break
		}
		
		if applied[migration.Version] {
			continue
		}

		tx, err := m.db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("failed to begin transaction: %w", err)
		}

		if err := m.executeMigration(ctx, tx, migration, true); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to execute migration %d: %w", migration.Version, err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit migration %d: %w", migration.Version, err)
		}

		fmt.Printf("Applied migration %d: %s\n", migration.Version, migration.Name)
	}

	return nil
}

func (m *Migrator) Down(ctx context.Context, targetVersion int64) error {
	applied, err := m.getAppliedMigrations(ctx)
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	// Sort migrations in reverse order for rollback
	sort.Slice(m.migrations, func(i, j int) bool {
		return m.migrations[i].Version > m.migrations[j].Version
	})

	for _, migration := range m.migrations {
		if migration.Version <= targetVersion {
			continue
		}
		
		if !applied[migration.Version] {
			continue
		}

		tx, err := m.db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("failed to begin transaction: %w", err)
		}

		if err := m.executeMigration(ctx, tx, migration, false); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to rollback migration %d: %w", migration.Version, err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit rollback %d: %w", migration.Version, err)
		}

		fmt.Printf("Rolled back migration %d: %s\n", migration.Version, migration.Name)
	}

	return nil
}

func (m *Migrator) Status(ctx context.Context) ([]MigrationStatus, error) {
	applied, err := m.getAppliedMigrations(ctx)
	if err != nil {
		return nil, err
	}

	var status []MigrationStatus
	for _, migration := range m.migrations {
		s := MigrationStatus{
			Version: migration.Version,
			Name:    migration.Name,
			Applied: applied[migration.Version],
		}
		
		if s.Applied {
			s.AppliedAt = migration.AppliedAt
		}
		
		status = append(status, s)
	}

	sort.Slice(status, func(i, j int) bool {
		return status[i].Version < status[j].Version
	})

	return status, nil
}

func (m *Migrator) executeMigration(ctx context.Context, tx *sql.Tx, migration Migration, isUp bool) error {
	var query string
	if isUp {
		query = migration.UpSQL
	} else {
		query = migration.DownSQL
	}

	if _, err := tx.ExecContext(ctx, query); err != nil {
		return err
	}

	if isUp {
		_, err := tx.ExecContext(ctx, 
			"INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
			migration.Version, migration.Name, m.calculateChecksum(migration))
		return err
	} else {
		_, err := tx.ExecContext(ctx, 
			"DELETE FROM schema_migrations WHERE version = $1", 
			migration.Version)
		return err
	}
}

func (m *Migrator) getAppliedMigrations(ctx context.Context) (map[int64]bool, error) {
	applied := make(map[int64]bool)
	
	rows, err := m.db.QueryContext(ctx, "SELECT version FROM schema_migrations")
	if err != nil {
		return applied, nil // Table might not exist yet
	}
	defer rows.Close()

	for rows.Next() {
		var version int64
		if err := rows.Scan(&version); err != nil {
			return nil, err
		}
		applied[version] = true
	}

	return applied, nil
}

func (m *Migrator) calculateChecksum(migration Migration) string {
	// Simple checksum - in production use crypto/sha256
	return fmt.Sprintf("%d", len(migration.UpSQL)+len(migration.DownSQL))
}
