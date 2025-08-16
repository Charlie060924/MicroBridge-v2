import React, { useState } from 'react';
import Image from 'next/image';
import { User, Mail, Camera, Save, X, Edit3, Phone } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';
import { useSettings } from '../hooks/useSettings';

interface PersonalInfoSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
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
      title="Personal Information"
      description="Manage your basic profile information for micro-internship applications"
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
              {tempData.profilePicture ? (
                <Image 
                  src={tempData.profilePicture} 
                  alt="Profile" 
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Profile Photo
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A professional photo helps employers recognize you and builds trust
            </p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={tempData.name?.split(' ')[0] || ''}
            onChange={(e) => {
              const lastName = tempData.name?.split(' ').slice(1).join(' ') || '';
              handleInputChange('name', `${e.target.value} ${lastName}`.trim());
            }}
            disabled={!isEditing}
            placeholder="Enter your first name"
            required
          />

          <Input
            label="Last Name"
            value={tempData.name?.split(' ').slice(1).join(' ') || ''}
            onChange={(e) => {
              const firstName = tempData.name?.split(' ')[0] || '';
              handleInputChange('name', `${firstName} ${e.target.value}`.trim());
            }}
            disabled={!isEditing}
            placeholder="Enter your last name"
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={tempData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={!isEditing}
          icon={Mail}
          placeholder="your.email@university.edu.hk"
          helpText="Use your university email for verification"
          required
        />

        <Input
          label="Phone Number (Optional)"
          type="tel"
          value={tempData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          disabled={!isEditing}
          icon={Phone}
          placeholder="+852 1234 5678"
          helpText="Hong Kong mobile number format"
        />

        {/* Bio Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            About Me <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={tempData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            maxLength={300}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed resize-none"
            placeholder="Brief introduction about yourself, your interests, and what type of micro-internships you're looking for..."
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Help employers understand your background and goals
            </p>
            <span className="text-xs text-gray-400">
              {tempData.bio?.length || 0}/300
            </span>
          </div>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    icon={X}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  icon={Edit3}
                >
                  Edit Information
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default PersonalInfoSection;
