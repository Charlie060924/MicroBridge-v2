"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  TrendingUp, 
  Target, 
  Zap, 
  CheckCircle, 
  X, 
  Trash2,
  Settings,
  Calendar,
  AlertCircle,
  Star,
  Filter
} from 'lucide-react';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';
import { useAuth } from '@/hooks/useAuth';

interface SmartNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SmartNotificationPanel: React.FC<SmartNotificationPanelProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'high_priority'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time'>('priority');
  
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    hasHighPriorityNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useSmartNotifications(user?.id, {
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  });

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      switch (filter) {
        case 'unread':
          return !notification.is_read;
        case 'high_priority':
          return (notification.priority_score || 0) > 0.7;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priority_score || 0) - (a.priority_score || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const getNotificationIcon = (type: string, priorityScore?: number) => {
    const isPriority = (priorityScore || 0) > 0.7;
    const iconClass = isPriority 
      ? "h-5 w-5 text-orange-500" 
      : "h-5 w-5 text-blue-500";

    switch (type) {
      case 'job_match':
        return <Target className={iconClass} />;
      case 'application_update':
        return <CheckCircle className={iconClass} />;
      case 'deadline':
        return <Clock className={iconClass} />;
      case 'daily_digest':
        return <TrendingUp className={iconClass} />;
      case 'payment':
        return <Star className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityBadge = (priorityScore?: number) => {
    if (!priorityScore || priorityScore < 0.3) return null;

    const badgeColor = priorityScore > 0.8 
      ? 'bg-red-100 text-red-800' 
      : priorityScore > 0.6 
        ? 'bg-orange-100 text-orange-800'
        : 'bg-blue-100 text-blue-800';

    const label = priorityScore > 0.8 
      ? 'High' 
      : priorityScore > 0.6 
        ? 'Medium' 
        : 'Low';

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
        {label}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getEngagementInsight = (notification: any) => {
    if (!notification.engagement_context) return null;

    const context = notification.engagement_context;
    const activityLevel = context.user_activity_level;
    const preferredTimes = context.preferred_times;

    if (activityLevel === 'high' && preferredTimes.length > 0) {
      return (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <Zap className="h-3 w-3 mr-1" />
          Sent during your peak activity time ({preferredTimes[0]})
        </div>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 w-96 border-l border-gray-200 dark:border-gray-700 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              {hasHighPriorityNotification && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Smart Notifications
              </h2>
              <p className="text-sm text-gray-500">
                {unreadCount} unread
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="high_priority">High Priority</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="priority">Priority</option>
                <option value="time">Time</option>
              </select>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'No unread notifications' 
                  : filter === 'high_priority'
                    ? 'No high priority notifications'
                    : 'No notifications yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.priority_score)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className={`text-sm font-medium ${
                          notification.is_read 
                            ? 'text-gray-700 dark:text-gray-300' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {getPriorityBadge(notification.priority_score)}
                        </div>
                      </div>
                      <p className={`mt-1 text-sm ${
                        notification.is_read 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.created_at)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <Trash2 className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      {getEngagementInsight(notification)}
                      {notification.optimal_timing && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Optimally timed for you
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <Settings className="h-4 w-4" />
            <span>Notification Settings</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartNotificationPanel;