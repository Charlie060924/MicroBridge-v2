import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_SETTINGS } from '../utils/settingsConstants';

export type Settings = typeof DEFAULT_SETTINGS;

// Debounce function for localStorage writes
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Optimize localStorage read with useMemo
  const savedSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem('microbridge-settings');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to parse saved settings:', error);
      return null;
    }
  }, []);

  // Load settings from localStorage on mount (optimized)
  useEffect(() => {
    const loadSettings = async () => {
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
      }
      setIsLoading(false);
      setIsSettingsLoaded(true);
    };
    
    loadSettings();
  }, [savedSettings]);

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((settingsToSave: Settings) => {
      try {
        localStorage.setItem('microbridge-settings', JSON.stringify(settingsToSave));
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }, 500),
    []
  );

  // Save settings to localStorage with debouncing
  useEffect(() => {
    if (isSettingsLoaded && !isLoading) {
      debouncedSave(settings);
    }
  }, [settings, isLoading, isSettingsLoaded, debouncedSave]);

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
    isSettingsLoaded,
  };
};
