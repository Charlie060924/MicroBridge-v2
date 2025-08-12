import React, { useState } from 'react';
import Image from 'next/image';
import { Building2, Mail, Camera, Save, X, Edit3, Key, Link, Eye, Phone, Globe, Users } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import { CONNECTED_ACCOUNTS, COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from '../utils/settingsConstants';
import { useSettings } from '../hooks/useSettings';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';
import { useProfileShortcuts } from '@/hooks/useKeyboardShortcuts';

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
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    updateSettings('account', tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(settings.account);
    setIsEditing(false);
  };

  // Keyboard shortcuts for profile editing
  useProfileShortcuts({
    onSave: handleSave,
    onCancel: handleCancel,
    onPreview: () => setShowPreview(true)
  });

  const handleInputChange = (field: keyof typeof settings.account, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SettingCard
        icon={Building2}
        title="Company Account Settings"
        description="Manage your company profile information and connected accounts"
      >
        <div className="space-y-8">
          {/* Company Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Company Information
            </h4>
            
            <div className="space-y-6">
              {/* Company Logo */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    {tempData.companyLogo ? (
                      <Image 
                        src={tempData.companyLogo} 
                        alt="Company Logo" 
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload your company logo to enhance your brand presence
                  </p>
                </div>
              </div>

              {/* Company Name */}
              <Input
                label="Company Name"
                value={tempData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                disabled={!isEditing}
                data-action="edit-profile"
              />

              {/* Contact Person */}
              <Input
                label="Contact Person"
                value={tempData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                disabled={!isEditing}
              />

              {/* Contact Email */}
              <Input
                label="Contact Email"
                type="email"
                value={tempData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                disabled={!isEditing}
                icon={Mail}
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                type="tel"
                value={tempData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={!isEditing}
                icon={Phone}
              />

              {/* Website */}
              <Input
                label="Company Website"
                type="url"
                value={tempData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
                icon={Globe}
              />

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={tempData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Size
                </label>
                <select
                  value={tempData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {COMPANY_SIZE_OPTIONS.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
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
                          {account.email || account.company}
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

          {/* Security */}
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
                    <Button
                      onClick={handleSave}
                      icon={Save}
                      data-action="save"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="secondary"
                      icon={X}
                      data-action="cancel"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="secondary"
                      icon={Edit3}
                      data-action="edit-profile"
                    >
                      Edit Company Profile
                    </Button>
                    <Button
                      onClick={() => setShowPreview(true)}
                      variant="outline"
                      icon={Eye}
                    >
                      Preview
                    </Button>
                  </>
                )}
              </div>
              
              {/* Save All Button */}
              {onSaveAll && (
                <Button
                  onClick={onSaveAll}
                  disabled={isSaving || !hasChanges}
                  loading={isSaving}
                  icon={Save}
                  data-action="save"
                >
                  {isSaving ? 'Saving...' : 'Save All'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SettingCard>
      
      {/* Company Profile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Company Profile Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  {tempData.companyLogo ? (
                    <Image 
                      src={tempData.companyLogo} 
                      alt="Company Logo" 
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {tempData.companyName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tempData.industry} • {tempData.companySize} employees
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Contact:</strong> {tempData.contactPerson}</p>
                <p><strong>Email:</strong> {tempData.contactEmail}</p>
                <p><strong>Phone:</strong> {tempData.phoneNumber}</p>
                {tempData.website && (
                  <p><strong>Website:</strong> {tempData.website}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => {
                  setShowPreview(false);
                  setIsEditing(true);
                }}
                variant="secondary"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettingsSection;
