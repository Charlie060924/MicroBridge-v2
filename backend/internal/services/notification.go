package services

import (
	"errors"
	"fmt"
	"time"
	"microbridge/backend/internal/models"
	"gorm.io/gorm"
)

type NotificationService struct {
	db *gorm.DB
}

func NewNotificationService(db *gorm.DB) *NotificationService {
	return &NotificationService{db: db}
}

// CreateNotification creates a new notification for a user
func (s *NotificationService) CreateNotification(userID uint, title, message string, notificationType models.NotificationType, actionURL, actionText *string, metadata map[string]interface{}) (*models.Notification, error) {
	notification := &models.Notification{
		UserID:     userID,
		Title:      title,
		Message:    message,
		Type:       notificationType,
		IsRead:     false,
		ActionURL:  actionURL,
		ActionText: actionText,
		Metadata:   metadata,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := s.db.Create(notification).Error; err != nil {
		return nil, err
	}

	return notification, nil
}

// GetUserNotifications retrieves notifications for a specific user with pagination
func (s *NotificationService) GetUserNotifications(userID uint, page, limit int, unreadOnly bool) ([]models.Notification, int64, error) {
	var notifications []models.Notification
	var total int64

	query := s.db.Where("user_id = ?", userID)
	
	if unreadOnly {
		query = query.Where("is_read = ?", false)
	}

	// Get total count
	if err := query.Model(&models.Notification{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}

// MarkAsRead marks a specific notification as read
func (s *NotificationService) MarkAsRead(userID uint, notificationID uint) error {
	now := time.Now()
	result := s.db.Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", notificationID, userID).
		Updates(map[string]interface{}{
			"is_read":   true,
			"read_at":   &now,
			"updated_at": now,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("notification not found or not owned by user")
	}

	return nil
}

// MarkAllAsRead marks all notifications for a user as read
func (s *NotificationService) MarkAllAsRead(userID uint) error {
	now := time.Now()
	result := s.db.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Updates(map[string]interface{}{
			"is_read":   true,
			"read_at":   &now,
			"updated_at": now,
		})

	return result.Error
}

// GetUnreadCount returns the number of unread notifications for a user
func (s *NotificationService) GetUnreadCount(userID uint) (int64, error) {
	var count int64
	err := s.db.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Count(&count).Error
	return count, err
}

// DeleteNotification deletes a notification (only if owned by the user)
func (s *NotificationService) DeleteNotification(userID uint, notificationID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", notificationID, userID).
		Delete(&models.Notification{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("notification not found or not owned by user")
	}

	return nil
}

// GetNotificationSettings retrieves notification settings for a user
func (s *NotificationService) GetNotificationSettings(userID uint) (*models.NotificationSettings, error) {
	var settings models.NotificationSettings
	err := s.db.Where("user_id = ?", userID).First(&settings).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create default settings if not found
			settings = models.NotificationSettings{
				UserID:               userID,
				EmailNotifications:   true,
				PushNotifications:    true,
				JobUpdates:           true,
				PaymentNotifications: true,
				DeadlineReminders:    true,
				ProjectUpdates:       true,
				SystemNotifications:  true,
				CreatedAt:            time.Now(),
				UpdatedAt:            time.Now(),
			}
			if err := s.db.Create(&settings).Error; err != nil {
				return nil, err
			}
		} else {
			return nil, err
		}
	}
	return &settings, nil
}

// UpdateNotificationSettings updates notification settings for a user
func (s *NotificationService) UpdateNotificationSettings(userID uint, settings *models.NotificationSettings) error {
	settings.UserID = userID
	settings.UpdatedAt = time.Now()

	result := s.db.Where("user_id = ?", userID).Updates(settings)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		// Create if not exists
		settings.CreatedAt = time.Now()
		return s.db.Create(settings).Error
	}

	return nil
}

// CreateJobMatchNotification creates a notification for a new job match
func (s *NotificationService) CreateJobMatchNotification(userID uint, jobID uint, jobTitle string) error {
	actionURL := fmt.Sprintf("/student_portal/workspace/job-details/%d", jobID)
	actionText := "View Job"
	
	_, err := s.CreateNotification(
		userID,
		"New Job Match",
		fmt.Sprintf("A new micro-internship opportunity '%s' matches your skills", jobTitle),
		models.NotificationTypeSuccess,
		&actionURL,
		&actionText,
		map[string]interface{}{
			"job_id": jobID,
			"category": "job_match",
		},
	)
	return err
}

// CreatePaymentNotification creates a notification for payment received
func (s *NotificationService) CreatePaymentNotification(userID uint, amount float64, projectTitle string) error {
	actionURL := "/student_portal/workspace/applications"
	actionText := "View Details"
	
	_, err := s.CreateNotification(
		userID,
		"Payment Received",
		fmt.Sprintf("Payment of $%.2f has been processed for your completed project '%s'", amount, projectTitle),
		models.NotificationTypeSuccess,
		&actionURL,
		&actionText,
		map[string]interface{}{
			"amount": amount,
			"category": "payment",
		},
	)
	return err
}

// CreateDeadlineReminder creates a notification for upcoming deadlines
func (s *NotificationService) CreateDeadlineReminder(userID uint, projectTitle string, daysUntilDeadline int) error {
	actionURL := "/student_portal/workspace/applications"
	actionText := "View Project"
	
	_, err := s.CreateNotification(
		userID,
		"Deadline Reminder",
		fmt.Sprintf("Your project '%s' is due in %d days", projectTitle, daysUntilDeadline),
		models.NotificationTypeWarning,
		&actionURL,
		&actionText,
		map[string]interface{}{
			"days_until_deadline": daysUntilDeadline,
			"category": "deadline",
		},
	)
	return err
}
