'use client';
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  X,
  Settings,
  Zap
} from 'lucide-react';
import { JobEvent, CalendarService } from '@/app/student_portal/workspace/calendar/calendarService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface DeadlineNotification {
  id: string;
  type: 'urgent' | 'reminder' | 'upcoming';
  title: string;
  message: string;
  deadline: Date;
  jobEvent: JobEvent;
  isRead: boolean;
  createdAt: Date;
}

interface SmartDeadlineTrackerProps {
  className?: string;
  onNotificationClick?: (notification: DeadlineNotification) => void;
}

export const SmartDeadlineTracker: React.FC<SmartDeadlineTrackerProps> = ({
  className = '',
  onNotificationClick
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DeadlineNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    urgentThreshold: 1, // days
    reminderThreshold: 3, // days
    upcomingThreshold: 7, // days
    enableEmailNotifications: true,
    enablePushNotifications: true,
    workingHoursOnly: true
  });

  useEffect(() => {
    generateSmartNotifications();
    
    // Set up real-time updates
    const interval = setInterval(generateSmartNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notificationSettings]);

  const generateSmartNotifications = async () => {
    try {
      setLoading(true);
      const events = await CalendarService.fetchJobEvents(user?.id || '');
      const now = new Date();
      const generatedNotifications: DeadlineNotification[] = [];

      events.forEach(event => {
        const deadline = new Date(event.extendedProps.deadline);
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Skip completed projects
        if (event.extendedProps.status === 'Completed') return;

        // Generate notifications based on thresholds
        if (daysUntil <= 0) {
          generatedNotifications.push({
            id: `urgent-${event.id}`,
            type: 'urgent',
            title: 'Overdue Project!',
            message: `${event.title} was due ${Math.abs(daysUntil)} days ago`,
            deadline,
            jobEvent: event,
            isRead: false,
            createdAt: now
          });
        } else if (daysUntil <= notificationSettings.urgentThreshold) {
          generatedNotifications.push({
            id: `urgent-${event.id}`,
            type: 'urgent',
            title: 'Urgent Deadline',
            message: `${event.title} is due ${daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`}`,
            deadline,
            jobEvent: event,
            isRead: false,
            createdAt: now
          });
        } else if (daysUntil <= notificationSettings.reminderThreshold) {
          generatedNotifications.push({
            id: `reminder-${event.id}`,
            type: 'reminder',
            title: 'Deadline Reminder',
            message: `${event.title} is due in ${daysUntil} days`,
            deadline,
            jobEvent: event,
            isRead: false,
            createdAt: now
          });
        } else if (daysUntil <= notificationSettings.upcomingThreshold) {
          generatedNotifications.push({
            id: `upcoming-${event.id}`,
            type: 'upcoming',
            title: 'Upcoming Deadline',
            message: `${event.title} is due in ${daysUntil} days`,
            deadline,
            jobEvent: event,
            isRead: false,
            createdAt: now
          });
        }
      });

      // Sort by priority (urgent first, then by deadline)
      const sortedNotifications = generatedNotifications.sort((a, b) => {
        const priorityOrder = { urgent: 3, reminder: 2, upcoming: 1 };
        if (a.type !== b.type) {
          return priorityOrder[b.type] - priorityOrder[a.type];
        }
        return a.deadline.getTime() - b.deadline.getTime();
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Failed to generate notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'upcoming':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'reminder':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'upcoming':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Deadline Alerts
            </h3>
            {urgentCount > 0 && (
              <span className="flex items-center space-x-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                <span>{urgentCount} urgent</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notification Settings</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Urgent alerts (days)</span>
              <input
                type="number"
                value={notificationSettings.urgentThreshold}
                onChange={(e) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  urgentThreshold: parseInt(e.target.value) 
                }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700"
                min="0"
                max="7"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Reminder alerts (days)</span>
              <input
                type="number"
                value={notificationSettings.reminderThreshold}
                onChange={(e) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  reminderThreshold: parseInt(e.target.value) 
                }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700"
                min="1"
                max="14"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Upcoming alerts (days)</span>
              <input
                type="number"
                value={notificationSettings.upcomingThreshold}
                onChange={(e) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  upcomingThreshold: parseInt(e.target.value) 
                }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              All caught up! No upcoming deadlines.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  onNotificationClick?.(notification);
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.jobEvent.extendedProps.company}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {notification.deadline.toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDeadlineTracker;