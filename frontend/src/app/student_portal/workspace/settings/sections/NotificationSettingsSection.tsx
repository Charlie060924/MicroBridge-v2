import React from 'react';
import { Bell, Mail, Smartphone, Briefcase, FileText, Megaphone } from 'lucide-react';
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
      key: 'jobAlerts' as const,
      icon: Briefcase,
      title: 'Job Alerts',
      description: 'Get notified about new job opportunities',
      enabled: settings.notifications.jobAlerts,
    },
    {
      key: 'applicationUpdates' as const,
      icon: FileText,
      title: 'Application Updates',
      description: 'Receive updates about your job applications',
      enabled: settings.notifications.applicationUpdates,
    },
    {
      key: 'marketing' as const,
      icon: Megaphone,
      title: 'Marketing Communications',
      description: 'Receive promotional emails and updates',
      enabled: settings.notifications.marketing,
    },
  ];

  return (
    <SettingCard
      icon={Bell}
      title="Notification Settings"
      description="Manage how you receive notifications and updates"
    >
      <div className="space-y-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Choose which types of notifications you'd like to receive. You can change these settings at any time.
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
                Some notifications are essential for account security and cannot be disabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default NotificationSettingsSection;
