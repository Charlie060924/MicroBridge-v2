"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Settings, Save, X } from 'lucide-react';
import { notificationService, NotificationSettings } from '@/services/notificationService';

interface NotificationPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: NotificationSettings) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    application_updates: true,
    job_recommendations: true,
    marketing_emails: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current settings
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentSettings = await notificationService.getNotificationSettings();
      setSettings(currentSettings);
    } catch (err) {
      console.error('Failed to load notification settings:', err);
      setError('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await notificationService.updateNotificationSettings(settings);
      setSuccess(true);
      onSave?.(settings);
      
      // Auto-hide success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = () => {
    setSettings({
      email_notifications: true,
      push_notifications: true,
      application_updates: true,
      job_recommendations: true,
      marketing_emails: true
    });
  };

  const handleDeselectAll = () => {
    setSettings({
      email_notifications: false,
      push_notifications: false,
      application_updates: false,
      job_recommendations: false,
      marketing_emails: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600 />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-500
                  Manage how you receive notifications
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 settings...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200  rounded-md">
                  <p className="text-sm text-red-700
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200  rounded-md">
                  <p className="text-sm text-green-700
                    Settings saved successfully!
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 Actions</h3>
                  <p className="text-sm text-gray-500
                    Enable or disable all notifications
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enable All
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Disable All
                  </button>
                </div>
              </div>

              {/* Notification Channels */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notification Channels
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600 />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-500
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications}
                        onChange={() => handleToggle('email_notifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Smartphone className="h-5 w-5 text-green-600 />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900
                          Push Notifications
                        </h4>
                        <p className="text-sm text-gray-500
                          Receive push notifications in browser
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.push_notifications}
                        onChange={() => handleToggle('push_notifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notification Types
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Bell className="h-5 w-5 text-purple-600 />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900
                          Application Updates
                        </h4>
                        <p className="text-sm text-gray-500
                          Status changes, feedback, and interview scheduling
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.application_updates}
                        onChange={() => handleToggle('application_updates')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Bell className="h-5 w-5 text-orange-600 />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900
                          Job Recommendations
                        </h4>
                        <p className="text-sm text-gray-500
                          New job matches and personalized recommendations
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.job_recommendations}
                        onChange={() => handleToggle('job_recommendations')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Mail className="h-5 w-5 text-red-600 />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900
                          Marketing Emails
                        </h4>
                        <p className="text-sm text-gray-500
                          Newsletters, updates, and promotional content
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketing_emails}
                        onChange={() => handleToggle('marketing_emails')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300  rounded-lg hover:bg-gray-50  transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
