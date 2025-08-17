package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"
	
	_ "github.com/lib/pq"
	"microbridge/backend/internal/config"
	"microbridge/backend/internal/database/migrations"
)

func main() {
	var (
		action        = flag.String("action", "up", "Migration action: up, down, status")
		targetVersion = flag.String("version", "", "Target version for migration")
	)
	flag.Parse()
	
	cfg := config.Load()
	
	db, err := sql.Open("postgres", cfg.Database.URL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	
	migrator := migrations.NewMigrator(db)
	ctx := context.Background()
	
	switch *action {
	case "up":
		target := int64(999999999999) // Default to latest
		if *targetVersion != "" {
			target, err = strconv.ParseInt(*targetVersion, 10, 64)
			if err != nil {
				log.Fatalf("Invalid version: %v", err)
			}
		}
		
		if err := migrator.Up(ctx, target); err != nil {
			log.Fatalf("Migration up failed: %v", err)
		}
		fmt.Println("Migrations completed successfully")
		
	case "down":
		if *targetVersion == "" {
			log.Fatal("Target version required for down migration")
		}
		
		target, err := strconv.ParseInt(*targetVersion, 10, 64)
		if err != nil {
			log.Fatalf("Invalid version: %v", err)
		}
		
		if err := migrator.Down(ctx, target); err != nil {
			log.Fatalf("Migration down failed: %v", err)
		}
		fmt.Println("Rollback completed successfully")
		
	case "status":
		status, err := migrator.Status(ctx)
		if err != nil {
			log.Fatalf("Failed to get migration status: %v", err)
		}
		
		fmt.Println("Migration Status:")
		fmt.Println("Version\t\tName\t\t\tApplied")
		fmt.Println("-------\t\t----\t\t\t-------")
		for _, s := range status {
			applied := "No"
			if s.Applied {
				applied = "Yes"
			}
			fmt.Printf("%d\t%s\t\t%s\n", s.Version, s.Name, applied)
		}
		
	default:
		log.Fatalf("Unknown action: %s", *action)
	}
}
