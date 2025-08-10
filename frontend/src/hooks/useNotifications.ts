import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, Notification, NotificationSettings } from '@/services/notificationService';

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialPage?: number;
  initialLimit?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    initialPage = 1,
    initialLimit = 20
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0
  });
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications(page, limit, unreadOnly);
      setNotifications(response.notifications);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Fetch notification settings
  const fetchSettings = useCallback(async () => {
    try {
      const userSettings = await notificationService.getNotificationSettings();
      setSettings(userSettings);
    } catch (err) {
      console.error('Error fetching notification settings:', err);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString()
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update unread count if notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, [notifications]);

  // Update notification settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      await notificationService.updateNotificationSettings(newSettings);
      
      // Update local state
      if (settings) {
        setSettings({ ...settings, ...newSettings });
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
      throw err;
    }
  }, [settings]);

  // Refresh data
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNotifications(pagination.page, pagination.limit),
      fetchUnreadCount()
    ]);
  }, [fetchNotifications, fetchUnreadCount, pagination.page, pagination.limit]);

  // Setup auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(refresh, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refresh]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchNotifications(initialPage, initialLimit),
        fetchUnreadCount(),
        fetchSettings()
      ]);
    };

    initializeData();
  }, [fetchNotifications, fetchUnreadCount, fetchSettings, initialPage, initialLimit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    pagination: {
      ...pagination,
      canLoadMore: pagination.page * pagination.limit < pagination.total
    },
    settings,
    
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    fetchSettings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    refresh,
    
    // Utilities
    hasUnread: unreadCount > 0,
    totalNotifications: pagination.total
  };
};
