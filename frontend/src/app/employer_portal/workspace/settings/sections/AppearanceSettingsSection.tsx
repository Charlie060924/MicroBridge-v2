import React from 'react';
import { Palette, Type, Moon, Sun, Monitor } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import ToggleSwitch from '../components/ToggleSwitch';
import FontSizeSlider from '../components/FontSizeSlider';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '@/context/ThemeContext';

const AppearanceSettingsSection: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings('appearance', { theme: newTheme });
    if (newTheme !== 'system') {
      // Update the actual theme context
      if (newTheme !== theme) {
        toggleTheme();
      }
    }
  };

  const handleFontSizeChange = (size: string) => {
    updateSettings('appearance', { fontSize: size as 'small' | 'medium' | 'large' });
  };

  const handleCompactModeChange = (enabled: boolean) => {
    updateSettings('appearance', { compactMode: enabled });
  };

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Clean, bright interface',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Follows your device settings',
    },
  ];

  return (
    <SettingCard
      icon={Palette}
      title="Appearance Settings"
      description="Customize the look and feel of your employer dashboard"
    >
      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Theme
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = settings.appearance.theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <FontSizeSlider
            fontSize={settings.appearance.fontSize}
            onFontSizeChange={handleFontSizeChange}
            label="Font Size"
            description="Adjust the size of text throughout the application"
          />
        </div>

        {/* Compact Mode */}
        <div>
          <ToggleSwitch
            checked={settings.appearance.compactMode}
            onChange={handleCompactModeChange}
            label="Compact Mode"
            description="Reduce spacing and padding for a more condensed layout"
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">
            Preview
          </h5>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This is how your employer dashboard will look with the current settings.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current theme: {settings.appearance.theme}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default AppearanceSettingsSection;
