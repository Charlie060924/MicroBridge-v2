import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../utils/settingsConstants';

export type Settings = typeof DEFAULT_SETTINGS;

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('microbridge-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('microbridge-settings', JSON.stringify(settings));
      setHasChanges(false);
    }
  }, [settings, isLoading]);

  const updateSettings = <K extends keyof Settings>(
    section: K,
    updates: Partial<Settings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasChanges(true);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(false);
  };

  const saveSettings = async () => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setHasChanges(false);
    return true;
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    saveSettings,
    isLoading,
    hasChanges,
  };
};
