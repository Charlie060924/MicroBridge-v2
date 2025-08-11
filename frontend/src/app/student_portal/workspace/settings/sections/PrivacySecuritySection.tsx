import React from 'react';
import { Shield, Eye, Smartphone, Activity, LogOut, AlertTriangle } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import ToggleSwitch from '../components/ToggleSwitch';
import { DEVICE_SESSIONS } from '../utils/settingsConstants';
import { useSettings } from '../hooks/useSettings';

const PrivacySecuritySection: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: boolean) => {
    updateSettings('privacy', { [key]: value });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <SettingCard
      icon={Shield}
      title="Privacy & Security"
      description="Manage your privacy settings and account security"
    >
      <div className="space-y-8">
        {/* Privacy Settings */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Privacy Settings
          </h4>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.privacy.publicProfile}
              onChange={(checked) => handlePrivacyChange('publicProfile', checked)}
              label="Public Profile"
              description="Allow others to view your profile information"
            />
            
            <ToggleSwitch
              checked={settings.privacy.dataSharing}
              onChange={(checked) => handlePrivacyChange('dataSharing', checked)}
              label="Data Sharing"
              description="Share anonymous usage data to improve our services"
            />
            
            <ToggleSwitch
              checked={settings.privacy.analytics}
              onChange={(checked) => handlePrivacyChange('analytics', checked)}
              label="Analytics"
              description="Help us improve by sharing usage analytics"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Security Settings
          </h4>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.privacy.twoFactorAuth}
              onChange={(checked) => handlePrivacyChange('twoFactorAuth', checked)}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
            
            {!settings.privacy.twoFactorAuth && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-yellow-900 dark:text-yellow-100">
                      Enable Two-Factor Authentication
                    </h5>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Protect your account with an additional security layer. 
                      We recommend enabling this feature for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device Management */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Active Sessions
          </h4>
          
          <div className="space-y-3">
            {DEVICE_SESSIONS.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border ${
                  session.current
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.device}
                        </p>
                        {session.current && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.browser} • {session.location}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Last active: {formatLastActive(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  
                  {!session.current && (
                    <button className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">
                  Session Management
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You can revoke access from any device that's not currently active. 
                  This will immediately log out that device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Actions
          </h4>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">
                    Sign Out All Devices
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This will log you out from all devices
                  </p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Download My Data
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get a copy of all your data
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default PrivacySecuritySection;
