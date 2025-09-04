import React, { useState } from 'react';
import { Shield, Key, LogOut, Smartphone, AlertTriangle, Eye, Activity } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import ToggleSwitch from '../components/ToggleSwitch';
import Button from '@/components/ui/button';
import { useSettings } from '../hooks/useSettings';

interface SecurityAccountSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

// Mock data for active sessions
const MOCK_SESSIONS = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome 120",
    location: "Hong Kong",
    lastActive: "2024-01-15T10:30:00Z",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari Mobile",
    location: "Hong Kong",
    lastActive: "2024-01-14T18:45:00Z",
    current: false,
  }
];

const SecurityAccountSection: React.FC<SecurityAccountSectionProps> = ({ 
  onSaveAll, 
  isSaving = false, 
  hasChanges = false 
}) => {
  const { settings, updateSettings } = useSettings();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  const handleSignOutAllDevices = () => {
    if (confirm('This will sign you out from all devices. You will need to log in again on each device. Continue?')) {
      // Handle sign out from all devices
      // console.log('Signing out from all devices...');
    }
  };

  return (
    <SettingCard
      icon={Shield}
      title="Security & Account"
      description="Manage your account security and privacy settings"
    >
      <div className="space-y-8">
        {/* Account Security */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Security
          </h4>
          
          <div className="space-y-4">
            {/* Password Change */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Password
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last changed 30 days ago
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="secondary"
                size="sm"
              >
                Change
              </Button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.privacy.twoFactorAuth}
                  onChange={(checked) => handlePrivacyChange('twoFactorAuth', checked)}
                />
              </div>
              
              {!settings.privacy.twoFactorAuth && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                        Recommended for Students
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Protect your profile and application data with 2FA
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
              description="Allow employers to find and view your profile"
            />
            
            <ToggleSwitch
              checked={settings.privacy.dataSharing}
              onChange={(checked) => handlePrivacyChange('dataSharing', checked)}
              label="Analytics & Improvement"
              description="Help us improve the platform with anonymous usage data"
            />
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Active Sessions
          </h4>
          
          <div className="space-y-3">
            {MOCK_SESSIONS.map((session) => (
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
                    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
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
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
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
                  Monitor your account access and revoke sessions from unfamiliar devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Management Actions */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Device Management
          </h4>
          
          <button 
            onClick={handleSignOutAllDevices}
            className="w-full flex items-center justify-between p-4 text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Sign Out All Devices
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Sign out from all devices except this one for security
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </SettingCard>
  );
};

export default SecurityAccountSection;
