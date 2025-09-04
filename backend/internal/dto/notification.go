package dto

// CreateNotificationRequest represents the request to create a notification
type CreateNotificationRequest struct {
	UserID      string                 `json:"user_id" validate:"required"`
	Type        string                 `json:"type" validate:"required,oneof=job_match payment_received deadline_reminder system_announcement"`
	Title       string                 `json:"title" validate:"required,min=1,max=100"`
	Message     string                 `json:"message" validate:"required,min=1,max=500"`
	RelatedID   string                 `json:"related_id,omitempty"`
	RelatedType string                 `json:"related_type,omitempty" validate:"omitempty,oneof=job application project payment"`
	Priority    string                 `json:"priority" validate:"required,oneof=low medium high urgent"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// NotificationSettings represents user notification preferences
type NotificationSettings struct {
	EmailEnabled      bool `json:"email_enabled"`
	PushEnabled       bool `json:"push_enabled"`
	JobMatches        bool `json:"job_matches"`
	ApplicationUpdates bool `json:"application_updates"`
	PaymentNotifications bool `json:"payment_notifications"`
	DeadlineReminders bool `json:"deadline_reminders"`
	SystemAnnouncements bool `json:"system_announcements"`
}