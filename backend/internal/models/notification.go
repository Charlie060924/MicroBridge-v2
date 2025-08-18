package models

import (
	"encoding/json"
	"fmt"
	"time"
)

type NotificationType string

const (
	NotificationTypeInfo    NotificationType = "info"
	NotificationTypeSuccess NotificationType = "success"
	NotificationTypeWarning NotificationType = "warning"
	NotificationTypeError   NotificationType = "error"
)

type Notification struct {
	ID          uint             `json:"id" gorm:"primaryKey"`
	UserID      uint             `json:"user_id" gorm:"not null;index"`
	Title       string           `json:"title" gorm:"not null"`
	Message     string           `json:"message" gorm:"not null"`
	Type        NotificationType `json:"type" gorm:"not null;default:'info'"`
	IsRead      bool             `json:"is_read" gorm:"default:false"`
	ActionURL   *string          `json:"action_url,omitempty"`
	ActionText  *string          `json:"action_text,omitempty"`
	Metadata    JSON             `json:"metadata,omitempty" gorm:"type:jsonb"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	ReadAt      *time.Time       `json:"read_at,omitempty"`
	
	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type NotificationSettings struct {
	ID                    uint   `json:"id" gorm:"primaryKey"`
	UserID                uint   `json:"user_id" gorm:"not null;uniqueIndex"`
	EmailNotifications    bool   `json:"email_notifications" gorm:"default:true"`
	PushNotifications     bool   `json:"push_notifications" gorm:"default:true"`
	JobUpdates            bool   `json:"job_updates" gorm:"default:true"`
	PaymentNotifications  bool   `json:"payment_notifications" gorm:"default:true"`
	DeadlineReminders     bool   `json:"deadline_reminders" gorm:"default:true"`
	ProjectUpdates        bool   `json:"project_updates" gorm:"default:true"`
	SystemNotifications   bool   `json:"system_notifications" gorm:"default:true"`
	DoNotDisturbStart     *string `json:"do_not_disturb_start,omitempty" gorm:"type:time"`
	DoNotDisturbEnd       *string `json:"do_not_disturb_end,omitempty" gorm:"type:time"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
	
	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// JSON type for storing flexible metadata
type JSON map[string]interface{}

func (j JSON) Value() (interface{}, error) {
	return j, nil
}

func (j *JSON) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return fmt.Errorf("cannot scan %T into JSON", value)
	}
}
