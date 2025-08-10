import { api } from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  read_at?: string;
}

export interface NotificationSettings {
  id: number;
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  job_updates: boolean;
  payment_notifications: boolean;
  deadline_reminders: boolean;
  project_updates: boolean;
  system_notifications: boolean;
  do_not_disturb_start?: string;
  do_not_disturb_end?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}

class NotificationService {
  // Get notifications with pagination and filtering
  async getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<NotificationResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(unreadOnly && { unread_only: 'true' })
    });

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.unread_count;
  }

  // Mark a specific notification as read
  async markAsRead(notificationId: number): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }

  // Delete a notification
  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  // Get notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await api.get<NotificationSettings>('/notifications/settings');
    return response.data;
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    await api.put('/notifications/settings', settings);
  }

  // Create a new notification (for admin/automated use)
  async createNotification(notification: {
    user_id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
    action_text?: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> {
    const response = await api.post<Notification>('/notifications', notification);
    return response.data;
  }

  // Helper method to format time ago
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }

  // Helper method to get notification icon based on type
  getNotificationIcon(type: string) {
    switch (type) {
      case "success":
        return { className: "w-2 h-2 bg-green-500 rounded-full" };
      case "warning":
        return { className: "w-2 h-2 bg-yellow-500 rounded-full" };
      case "error":
        return { className: "w-2 h-2 bg-red-500 rounded-full" };
      default:
        return { className: "w-2 h-2 bg-blue-500 rounded-full" };
    }
  }
}

export const notificationService = new NotificationService();
