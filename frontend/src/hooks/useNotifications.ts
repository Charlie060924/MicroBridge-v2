import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService, Notification, NotificationSettings } from '@/services/notificationService';

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialPage?: number;
  initialLimit?: number;
}

// Default state to prevent undefined access
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  total: 0,
  canLoadMore: false
};

const DEFAULT_SETTINGS: NotificationSettings = {
  email_notifications: true,
  push_notifications: true,
  application_updates: true,
  job_recommendations: true,
  marketing_emails: false
};

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  console.log('🔔 useNotifications hook initialized with options:', options);
  
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

  // Fetch notifications with comprehensive error handling
  const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
    console.log('🔔 Fetching notifications:', { page, limit, unreadOnly });
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications(page, limit, unreadOnly);
      console.log('🔔 Notifications response:', response);
      
      // Safe access to response data
      const safeNotifications = response?.notifications || [];
      const safePagination = response?.pagination || { page, limit, total: 0 };
      
      setNotifications(safeNotifications);
      setPagination(safePagination);
      
      console.log('🔔 Set notifications:', safeNotifications.length, 'pagination:', safePagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      console.error('🔔 Error fetching notifications:', err);
      setError(errorMessage);
      
      // Set safe defaults on error
      setNotifications([]);
      setPagination({ page, limit, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count with error handling
  const fetchUnreadCount = useCallback(async () => {
    console.log('🔔 Fetching unread count');
    try {
      const response = await notificationService.getUnreadCount();
      const count = response?.unread_count || 0;
      console.log('🔔 Unread count:', count);
      setUnreadCount(count);
    } catch (err) {
      console.error('🔔 Error fetching unread count:', err);
      setUnreadCount(0);
    }
  }, []);

  // Fetch notification settings with error handling
  const fetchSettings = useCallback(async () => {
    console.log('🔔 Fetching notification settings');
    try {
      const userSettings = await notificationService.getNotificationSettings();
      console.log('🔔 Settings response:', userSettings);
      setSettings(userSettings || DEFAULT_SETTINGS);
    } catch (err) {
      console.error('🔔 Error fetching notification settings:', err);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Mark notification as read with error handling
  const markAsRead = useCallback(async (notificationId: number) => {
    console.log('🔔 Marking notification as read:', notificationId);
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
      console.log('🔔 Successfully marked notification as read');
    } catch (err) {
      console.error('🔔 Error marking notification as read:', err);
      throw err;
    }
  }, []);

  // Mark all notifications as read with error handling
  const markAllAsRead = useCallback(async () => {
    console.log('🔔 Marking all notifications as read');
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
      console.log('🔔 Successfully marked all notifications as read');
    } catch (err) {
      console.error('🔔 Error marking all notifications as read:', err);
      throw err;
    }
  }, []);

  // Delete notification with error handling
  const deleteNotification = useCallback(async (notificationId: number) => {
    console.log('🔔 Deleting notification:', notificationId);
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update unread count if notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      console.log('🔔 Successfully deleted notification');
    } catch (err) {
      console.error('🔔 Error deleting notification:', err);
      throw err;
    }
  }, [notifications]);

  // Update notification settings with error handling
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    console.log('🔔 Updating notification settings:', newSettings);
    try {
      await notificationService.updateNotificationSettings(newSettings);
      
      // Update local state
      if (settings) {
        setSettings({ ...settings, ...newSettings });
      }
      console.log('🔔 Successfully updated notification settings');
    } catch (err) {
      console.error('🔔 Error updating notification settings:', err);
      throw err;
    }
  }, [settings]);

  // Refresh data with error handling
  const refresh = useCallback(async () => {
    console.log('🔔 Refreshing notifications data');
    try {
      await Promise.all([
        fetchNotifications(pagination.page, pagination.limit),
        fetchUnreadCount()
      ]);
      console.log('🔔 Successfully refreshed notifications data');
    } catch (err) {
      console.error('🔔 Error refreshing notifications data:', err);
    }
  }, [fetchNotifications, fetchUnreadCount, pagination.page, pagination.limit]);

  // Setup auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      console.log('🔔 Setting up auto-refresh interval:', refreshInterval);
      intervalRef.current = setInterval(refresh, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          console.log('🔔 Clearing auto-refresh interval');
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refresh]);

  // Initial data fetch
  useEffect(() => {
    console.log('🔔 Initializing notifications data');
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchNotifications(initialPage, initialLimit),
          fetchUnreadCount(),
          fetchSettings()
        ]);
        console.log('🔔 Successfully initialized notifications data');
      } catch (err) {
        console.error('🔔 Error initializing notifications data:', err);
      }
    };

    initializeData();
  }, [fetchNotifications, fetchUnreadCount, fetchSettings, initialPage, initialLimit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        console.log('🔔 Cleaning up notifications hook');
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Safe return object with defaults
  const safePagination = {
    ...DEFAULT_PAGINATION,
    ...pagination,
    canLoadMore: (pagination.page * pagination.limit) < pagination.total
  };

  const returnValue = {
    // State with safe defaults
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
    loading: loading || false,
    error: error || null,
    pagination: safePagination,
    settings: settings || DEFAULT_SETTINGS,
    
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    fetchSettings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    refresh,
    
    // Utilities with safe defaults
    hasUnread: (unreadCount || 0) > 0,
    totalNotifications: pagination.total || 0
  };

  console.log('🔔 useNotifications returning:', {
    notificationsCount: returnValue.notifications.length,
    unreadCount: returnValue.unreadCount,
    loading: returnValue.loading,
    error: returnValue.error,
    pagination: returnValue.pagination
  });

  return returnValue;
};
