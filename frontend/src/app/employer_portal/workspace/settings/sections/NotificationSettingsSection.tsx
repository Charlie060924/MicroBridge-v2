import React from 'react';
import { Bell, Mail, Smartphone, Users, FileText, Megaphone, Calendar, BarChart3 } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import ToggleSwitch from '../components/ToggleSwitch';
import { useSettings } from '../hooks/useSettings';

const NotificationSettingsSection: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSettings('notifications', { [key]: value });
  };

  const notificationSettings = [
    {
      key: 'inApp' as const,
      icon: Bell,
      title: 'In-App Notifications',
      description: 'Receive notifications within the application',
      enabled: settings.notifications.inApp,
    },
    {
      key: 'email' as const,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: settings.notifications.email,
    },
    {
      key: 'push' as const,
      icon: Smartphone,
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: settings.notifications.push,
    },
    {
      key: 'applicationAlerts' as const,
      icon: Users,
      title: 'Application Alerts',
      description: 'Get notified when candidates apply to your jobs',
      enabled: settings.notifications.applicationAlerts,
    },
    {
      key: 'candidateUpdates' as const,
      icon: FileText,
      title: 'Candidate Updates',
      description: 'Receive updates about candidate status changes',
      enabled: settings.notifications.candidateUpdates,
    },
    {
      key: 'jobPostingReminders' as const,
      icon: Calendar,
      title: 'Job Posting Reminders',
      description: 'Get reminded about job posting deadlines and renewals',
      enabled: settings.notifications.jobPostingReminders,
    },
    {
      key: 'weeklyReports' as const,
      icon: BarChart3,
      title: 'Weekly Reports',
      description: 'Receive weekly analytics and performance reports',
      enabled: settings.notifications.weeklyReports,
    },
    {
      key: 'marketing' as const,
      icon: Megaphone,
      title: 'Marketing Communications',
      description: 'Receive promotional emails and platform updates',
      enabled: settings.notifications.marketing,
    },
  ];

  return (
    <SettingCard
      icon={Bell}
      title="Notification Settings"
      description="Manage how you receive notifications and updates about your job postings and candidates"
    >
      <div className="space-y-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Choose which types of notifications you'd like to receive for your company account. You can change these settings at any time.
        </div>

        <div className="space-y-4">
          {notificationSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {setting.title}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                
                <ToggleSwitch
                  checked={setting.enabled}
                  onChange={(checked) => handleNotificationChange(setting.key, checked)}
                  size="md"
                />
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-blue-900 dark:text-blue-100">
                Notification Preferences
              </h5>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You can customize notification frequency and timing in your device settings. 
                Application alerts and security notifications are essential and cannot be disabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default NotificationSettingsSection;
