"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, X, ExternalLink, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notificationService";
import Link from "next/link";

export default function NotificationDropdown() {
  console.log('🔔 NotificationDropdown component rendering');
  
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  } = useNotifications({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    initialLimit: 10
  });

  // Debug logging for component state
  useEffect(() => {
    console.log('🔔 NotificationDropdown state update:', {
      notificationsCount: notifications?.length || 0,
      unreadCount,
      loading,
      error,
      pagination: pagination || {},
      isOpen
    });
  }, [notifications, unreadCount, loading, error, pagination, isOpen]);

  // Safe initialization check
  useEffect(() => {
    if (!loading && !isInitialized) {
      console.log('🔔 NotificationDropdown initialized');
      setIsInitialized(true);
    }
  }, [loading, isInitialized]);

  const toggleDropdown = () => {
    console.log('🔔 Toggling notification dropdown, current state:', isOpen);
    setIsOpen(!isOpen);
    if (!isOpen) {
      console.log('🔔 Refreshing notifications on dropdown open');
      refresh(); // Refresh notifications when opening
    }
  };

  const closeDropdown = () => {
    console.log('🔔 Closing notification dropdown');
    setIsOpen(false);
  };

  const handleMarkAsRead = async (id: number) => {
    console.log('🔔 Marking notification as read:', id);
    try {
      await markAsRead(id);
      console.log('🔔 Successfully marked notification as read');
    } catch (error) {
      console.error('🔔 Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    console.log('🔔 Marking all notifications as read');
    try {
      await markAllAsRead();
      console.log('🔔 Successfully marked all notifications as read');
    } catch (error) {
      console.error('🔔 Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    console.log('🔔 Deleting notification:', id);
    try {
      await deleteNotification(id);
      console.log('🔔 Successfully deleted notification');
    } catch (error) {
      console.error('🔔 Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    try {
      const iconConfig = notificationService.getNotificationIcon(type);
      return <div className={iconConfig.className}></div>;
    } catch (error) {
      console.error('🔔 Error getting notification icon for type:', type, error);
      return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  // Safe access to notifications array
  const safeNotifications = notifications || [];
  const safeUnreadCount = unreadCount || 0;
  const safeLoading = loading || false;
  const safeError = error || null;

  console.log('🔔 NotificationDropdown render with safe values:', {
    notificationsCount: safeNotifications.length,
    unreadCount: safeUnreadCount,
    loading: safeLoading,
    error: safeError
  });

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-11 h-11 text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 hover:bg-gray-100    
      >
        <Bell className="h-5 w-5" />
        {safeUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
            {safeUnreadCount > 9 ? "9+" : safeUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200  z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200
            <h3 className="text-lg font-semibold text-gray-900
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {safeUnreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 "
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={closeDropdown}
                className="text-gray-400 hover:text-gray-600
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {safeLoading ? (
              <div className="p-4 text-center text-gray-500
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading notifications...
              </div>
            ) : safeError ? (
              <div className="p-4 text-center text-red-500
                {safeError}
              </div>
            ) : safeNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200
                {safeNotifications.map((notification) => {
                  // Safe access to notification properties
                  const safeNotification = {
                    id: notification?.id || 0,
                    title: notification?.title || 'Unknown',
                    message: notification?.message || '',
                    type: notification?.type || 'default',
                    is_read: notification?.is_read || false,
                    created_at: notification?.created_at || new Date().toISOString(),
                    action_url: notification?.action_url || '',
                    action_text: notification?.action_text || ''
                  };

                  return (
                    <div
                      key={safeNotification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !safeNotification.is_read ? "bg-blue-50 : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(safeNotification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !safeNotification.is_read 
                                ? "text-gray-900 
                                : "text-gray-700
                            }`}>
                              {safeNotification.title}
                            </p>
                            <div className="flex items-center space-x-1">
                              {safeNotification.action_url && safeNotification.action_text && (
                                <Link
                                  href={safeNotification.action_url}
                                  className="text-blue-600 hover:text-blue-800 "
                                  onClick={closeDropdown}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              )}
                              <button
                                onClick={() => handleMarkAsRead(safeNotification.id)}
                                className="text-gray-400 hover:text-gray-600
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNotification(safeNotification.id)}
                                className="text-gray-400 hover:text-red-600
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {safeNotification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notificationService.formatTimeAgo(safeNotification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200
            <Link
              href="/student_portal/workspace/notifications"
              className="block w-full text-center text-sm text-blue-600 hover:text-blue-800  font-medium"
              onClick={closeDropdown}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </div>
  );
}
