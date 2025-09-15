import { useState, useEffect, useCallback } from 'react';
import { smartNotificationService } from '@/services/smartNotificationService';
import { NotificationResponse } from '@/services/notificationService';
import analyticsService from '@/services/analyticsService';

interface SmartNotification extends NotificationResponse {
  priority_score?: number;
  optimal_timing?: string;
  engagement_context?: {
    user_activity_level: 'low' | 'medium' | 'high';
    preferred_times: string[];
    interaction_history: {
      job_views_today: number;
      applications_today: number;
      last_active: string;
    };
  };
}

interface UseSmartNotificationsReturn {
  notifications: SmartNotification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  hasHighPriorityNotification: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  processScheduledNotifications: () => Promise<void>;
  createJobRecommendationNotification: (
    jobId: string, 
    jobTitle: string, 
    matchScore: number, 
    matchReasons: string[]
  ) => Promise<void>;
  createApplicationStatusNotification: (
    applicationId: string, 
    status: 'accepted' | 'rejected' | 'interview' | 'completed',
    jobTitle: string
  ) => Promise<void>;
}

export const useSmartNotifications = (
  userId?: string,
  options?: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    processScheduled?: boolean;
  }
): UseSmartNotificationsReturn => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const smartNotifications = await smartNotificationService.getSmartNotifications(1, 50);
      setNotifications(smartNotifications);
      
      const unread = smartNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);

      analyticsService.trackAction('smart_notifications_refreshed', 'useSmartNotifications', {
        count: smartNotifications.length,
        unread_count: unread
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching smart notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      // This would call the existing notification service
      const notification = notifications.find(n => n.id === id);
      if (notification) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        analyticsService.trackAction('notification_marked_read', 'useSmartNotifications', {
          notification_id: id,
          notification_type: notification.type,
          priority_score: notification.priority_score
        });
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);

      analyticsService.trackAction('all_notifications_marked_read', 'useSmartNotifications', {
        count: notifications.filter(n => !n.is_read).length
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      analyticsService.trackAction('notification_deleted', 'useSmartNotifications', {
        notification_id: id,
        notification_type: notification?.type
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  }, [notifications]);

  const processScheduledNotifications = useCallback(async () => {
    try {
      await smartNotificationService.processScheduledNotifications();
      await refreshNotifications(); // Refresh to show any newly sent notifications
    } catch (err) {
      console.error('Error processing scheduled notifications:', err);
    }
  }, [refreshNotifications]);

  const createJobRecommendationNotification = useCallback(async (
    jobId: string, 
    jobTitle: string, 
    matchScore: number, 
    matchReasons: string[]
  ) => {
    if (!userId) return;

    try {
      await smartNotificationService.createJobRecommendationNotification(
        userId, 
        jobId, 
        jobTitle, 
        matchScore, 
        matchReasons
      );
      await refreshNotifications();
    } catch (err) {
      console.error('Error creating job recommendation notification:', err);
      setError('Failed to create job recommendation notification');
    }
  }, [userId, refreshNotifications]);

  const createApplicationStatusNotification = useCallback(async (
    applicationId: string, 
    status: 'accepted' | 'rejected' | 'interview' | 'completed',
    jobTitle: string
  ) => {
    if (!userId) return;

    try {
      await smartNotificationService.createApplicationStatusNotification(
        userId, 
        applicationId, 
        status, 
        jobTitle
      );
      await refreshNotifications();
    } catch (err) {
      console.error('Error creating application status notification:', err);
      setError('Failed to create application status notification');
    }
  }, [userId, refreshNotifications]);

  // Calculate if there's a high priority notification
  const hasHighPriorityNotification = notifications.some(
    n => !n.is_read && (n.priority_score || 0) > 0.8
  );

  // Auto-refresh notifications
  useEffect(() => {
    if (userId && options?.autoRefresh !== false) {
      refreshNotifications();
      
      const interval = setInterval(
        refreshNotifications, 
        options?.refreshInterval || 60000 // Default 1 minute
      );
      
      return () => clearInterval(interval);
    }
  }, [userId, refreshNotifications, options?.autoRefresh, options?.refreshInterval]);

  // Process scheduled notifications
  useEffect(() => {
    if (options?.processScheduled !== false) {
      const interval = setInterval(
        processScheduledNotifications,
        300000 // Check every 5 minutes
      );
      
      return () => clearInterval(interval);
    }
  }, [processScheduledNotifications, options?.processScheduled]);

  // Track hook usage
  useEffect(() => {
    if (userId) {
      analyticsService.trackAction('smart_notifications_hook_mounted', 'useSmartNotifications', {
        user_id: userId,
        auto_refresh: options?.autoRefresh !== false,
        refresh_interval: options?.refreshInterval || 60000
      });
    }
  }, [userId, options?.autoRefresh, options?.refreshInterval]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    hasHighPriorityNotification,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    processScheduledNotifications,
    createJobRecommendationNotification,
    createApplicationStatusNotification
  };
};