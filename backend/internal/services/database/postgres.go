package database

import (
"fmt"
"log"
"os"

"microbridge/backend/internal/models"
"gorm.io/driver/postgres"
"gorm.io/gorm"
"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() (*gorm.DB, error) {
dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Hong_Kong",
os.Getenv("DB_HOST"),
os.Getenv("DB_USERNAME"),
os.Getenv("DB_PASSWORD"),
os.Getenv("DB_NAME"),
os.Getenv("DB_PORT"),
)

db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
Logger: logger.Default.LogMode(logger.Info),
})
if err != nil {
return nil, fmt.Errorf("failed to connect to database: %v", err)
}

// Auto migrate models
err = db.AutoMigrate(
&models.User{},
&models.Job{},
&models.Application{},
)
if err != nil {
return nil, fmt.Errorf("failed to migrate database: %v", err)
}

DB = db
log.Println(" Database connected and migrated successfully")
return db, nil
}
