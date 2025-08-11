import React from 'react';
import { Settings, Globe, HelpCircle, FileText, DollarSign, Shield } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import LanguageSelector from '../components/LanguageSelector';
import { CURRENCY_OPTIONS } from '../utils/settingsConstants';
import { useSettings } from '../hooks/useSettings';

const OtherSettingsSection: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handlePreferenceChange = (key: keyof typeof settings.preferences, value: string) => {
    updateSettings('preferences', { [key]: value });
  };

  return (
    <SettingCard
      icon={Settings}
      title="Other Settings"
      description="Language, regional settings, and help options"
    >
      <div className="space-y-8">
        {/* Language Settings */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Language & Region
          </h4>
          
          <div className="space-y-6">
            <LanguageSelector
              selectedLanguage={settings.preferences.language}
              onLanguageChange={(language) => handlePreferenceChange('language', language)}
              label="Language"
              description="Choose your preferred language for the interface"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Help & Support
          </h4>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Help Center
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find answers to common questions
                  </p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Documentation
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Read our detailed guides and tutorials
                  </p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Contact Support
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get in touch with our support team
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Account Actions
          </h4>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Terms of Service
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Read our terms and conditions
                  </p>
                </div>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Privacy Policy
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Learn about our privacy practices
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

export default OtherSettingsSection;
