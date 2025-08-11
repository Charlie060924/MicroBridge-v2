import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, X, Edit3, Key, Link } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import { CONNECTED_ACCOUNTS } from '../utils/settingsConstants';
import { useSettings } from '../hooks/useSettings';

interface AccountSettingsSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({ 
  onSaveAll, 
  isSaving = false, 
  hasChanges = false 
}) => {
  const { settings, updateSettings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(settings.account);

  const handleSave = () => {
    updateSettings('account', tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(settings.account);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof typeof settings.account, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SettingCard
      icon={User}
      title="Account Settings"
      description="Manage your profile information and connected accounts"
    >
      <div className="space-y-8">
        {/* Profile Information */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Profile Information
          </h4>
          
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {tempData.profilePicture ? (
                    <img 
                      src={tempData.profilePicture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a profile picture to personalize your account
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={tempData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={tempData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Connected Accounts
          </h4>
          
          <div className="space-y-3">
            {CONNECTED_ACCOUNTS.map((account) => (
              <div
                key={account.provider}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Link className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {account.name}
                    </p>
                    {account.connected && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {account.email || account.username}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.connected 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {account.connected ? 'Connected' : 'Not Connected'}
                  </span>
                  
                  <button className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Password Change */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Security
          </h4>
          
          <button className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Key className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            
            {/* Save All Button */}
            {onSaveAll && (
              <button
                onClick={onSaveAll}
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save All'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default AccountSettingsSection;
