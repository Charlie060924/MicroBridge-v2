import { api } from './api';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export interface NotificationResponse {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  metadata?: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  application_updates: boolean;
  job_matches: boolean;
  payment_notifications: boolean;
  deadline_reminders: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class NotificationService {
  // Get user notifications
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<ApiResponse<NotificationListResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (unreadOnly) {
        params.append('unread_only', 'true');
      }

      const response = await api.get(`/notifications?${params.toString()}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: (error as ApiError)?.response?.data?.error || 'Failed to get notifications'
      };
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse> {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to mark notification as read'
      };
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse> {
    try {
      await api.put('/notifications/read-all');
      return {
        success: true,
        message: 'All notifications marked as read'
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to mark all notifications as read'
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<ApiResponse> {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return {
        success: true,
        message: 'Notification deleted'
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to delete notification'
      };
    }
  }

  // Get unread count
  async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    try {
      const response = await api.get('/notifications/unread-count');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to get unread count'
      };
    }
  }

  // Get notification settings
  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    try {
      const response = await api.get('/notifications/settings');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to get notification settings'
      };
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<ApiResponse> {
    try {
      await api.put('/notifications/settings', settings);
      return {
        success: true,
        message: 'Notification settings updated'
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to update notification settings'
      };
    }
  }

  // Subscribe to real-time notifications (WebSocket)
  subscribeToNotifications(callback: (notification: NotificationResponse) => void): () => void {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll implement polling as a fallback
    const interval = setInterval(async () => {
      try {
        const response = await this.getNotifications(1, 1, true);
        if (response.success && response.data && response.data.notifications.length > 0) {
          const latestNotification = response.data.notifications[0];
          callback(latestNotification);
        }
      } catch {
        // console.error('Error polling for notifications:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Return unsubscribe function
    return () => clearInterval(interval);
  }

  // Get notification statistics
  async getNotificationStats(): Promise<ApiResponse<{
    total: number;
    unread: number;
    read: number;
    by_type: Record<string, number>;
  }>> {
    try {
      const response = await api.get('/notifications/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to get notification statistics'
      };
    }
  }

  // Create a test notification (for development)
  async createTestNotification(): Promise<ApiResponse<NotificationResponse>> {
    try {
      const response = await api.post('/notifications/test', {
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: ((error as ApiError).response)?.data?.error || 'Failed to create test notification'
      };
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
