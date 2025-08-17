import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

// Types
interface Settings {
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
  education: {
    university: string;
    major: string;
    yearOfStudy: number;
    gpa?: number;
    graduationDate?: string;
  };
  career: {
    careerStatement: string;
    interests: string[];
    targetIndustries: string[];
    availability: string;
    salaryExpectation?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'connections';
      showContactInfo: boolean;
    };
  };
}

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  personal: () => [...settingsKeys.all, 'personal'] as const,
  education: () => [...settingsKeys.all, 'education'] as const,
  career: () => [...settingsKeys.all, 'career'] as const,
  preferences: () => [...settingsKeys.all, 'preferences'] as const,
};

// Default settings
const DEFAULT_SETTINGS: Settings = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  },
  education: {
    university: '',
    major: '',
    yearOfStudy: 1,
    gpa: undefined,
    graduationDate: '',
  },
  career: {
    careerStatement: '',
    interests: [],
    targetIndustries: [],
    availability: '',
    salaryExpectation: '',
  },
  preferences: {
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
    },
  },
};

// Non-blocking localStorage functions
const readSettings = (): Settings | null => {
  try {
    const stored = localStorage.getItem('microbridge-settings');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to read settings:', error);
    return null;
  }
};

const writeSettings = (settings: Settings): void => {
  try {
    localStorage.setItem('microbridge-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to write settings:', error);
  }
};

// Debounced write function
const createDebouncedWrite = (delay: number = 500) => {
  let timeout: NodeJS.Timeout;
  return (settings: Settings) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => writeSettings(settings), delay);
  };
};

// Hooks
export function useSettings() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const debouncedWrite = useCallback(createDebouncedWrite(500), []);

  // Load settings on mount (non-blocking)
  useEffect(() => {
    const loadSettings = () => {
      const saved = readSettings();
      if (saved) {
        setLocalSettings({ ...DEFAULT_SETTINGS, ...saved });
      }
      setIsLoaded(true);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSettings);
    } else {
      setTimeout(loadSettings, 0);
    }
  }, []);

  // Debounced save
  useEffect(() => {
    if (isLoaded) {
      debouncedWrite(localSettings);
    }
  }, [localSettings, isLoaded, debouncedWrite]);

  const updateSettings = useCallback(<K extends keyof Settings>(
    section: K,
    updates: Partial<Settings[K]>
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setLocalSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('microbridge-settings');
  }, []);

  return {
    settings: localSettings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
}

// Section-specific hooks for better performance
export function usePersonalSettings() {
  const { settings, updateSettings, isLoaded } = useSettings();
  
  return {
    personal: settings.personal,
    updatePersonal: (updates: Partial<Settings['personal']>) => 
      updateSettings('personal', updates),
    isLoaded,
  };
}

export function useEducationSettings() {
  const { settings, updateSettings, isLoaded } = useSettings();
  
  return {
    education: settings.education,
    updateEducation: (updates: Partial<Settings['education']>) => 
      updateSettings('education', updates),
    isLoaded,
  };
}

export function useCareerSettings() {
  const { settings, updateSettings, isLoaded } = useSettings();
  
  return {
    career: settings.career,
    updateCareer: (updates: Partial<Settings['career']>) => 
      updateSettings('career', updates),
    isLoaded,
  };
}

export function usePreferencesSettings() {
  const { settings, updateSettings, isLoaded } = useSettings();
  
  return {
    preferences: settings.preferences,
    updatePreferences: (updates: Partial<Settings['preferences']>) => 
      updateSettings('preferences', updates),
    isLoaded,
  };
}

// Lazy loading for large data (schools, majors, etc.)
export function useOptionsData() {
  return useQuery({
    queryKey: ['options'],
    queryFn: async () => {
      // Simulate API call for options data
      const response = await fetch('/api/options');
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (options don't change often)
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
}

// Mutations for server-side settings sync
export function useSyncSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Settings) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate any cached settings data
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}

// Settings validation
export function useSettingsValidation() {
  const { settings } = useSettings();
  
  const validation = {
    personal: {
      isValid: !!settings.personal.name && !!settings.personal.email,
      missing: [] as string[],
    },
    education: {
      isValid: !!settings.education.university && !!settings.education.major,
      missing: [] as string[],
    },
    career: {
      isValid: !!settings.career.careerStatement && settings.career.interests.length > 0,
      missing: [] as string[],
    },
    overall: {
      isValid: false,
      completion: 0,
    },
  };

  // Calculate missing fields
  if (!settings.personal.name) validation.personal.missing.push('name');
  if (!settings.personal.email) validation.personal.missing.push('email');
  if (!settings.education.university) validation.education.missing.push('university');
  if (!settings.education.major) validation.education.missing.push('major');
  if (!settings.career.careerStatement) validation.career.missing.push('career statement');
  if (settings.career.interests.length === 0) validation.career.missing.push('interests');

  // Calculate overall completion
  const totalSections = 3;
  const completedSections = [
    validation.personal.isValid,
    validation.education.isValid,
    validation.career.isValid,
  ].filter(Boolean).length;

  validation.overall.completion = Math.round((completedSections / totalSections) * 100);
  validation.overall.isValid = completedSections === totalSections;

  return validation;
}

