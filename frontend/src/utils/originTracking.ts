export type OriginPage = 'homepage' | 'manage-jobs';

export interface OriginContext {
  page: OriginPage;
  timestamp: number;
}

/**
 * Utility functions for tracking navigation origin
 */
export const originTracking = {
  /**
   * Store origin information in sessionStorage
   */
  setOrigin: (origin: OriginPage): void => {
    const originContext: OriginContext = {
      page: origin,
      timestamp: Date.now()
    };
    sessionStorage.setItem('jobNavigationOrigin', JSON.stringify(originContext));
    console.log('Origin tracking set:', originContext);
  },

  /**
   * Get origin information from sessionStorage
   */
  getOrigin: (): OriginContext | null => {
    try {
      const stored = sessionStorage.getItem('jobNavigationOrigin');
      if (!stored) {
        console.log('No origin tracking found');
        return null;
      }
      
      const originContext: OriginContext = JSON.parse(stored);
      
      // Check if the origin is still valid (within 1 hour)
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - originContext.timestamp > oneHour) {
        console.log('Origin tracking expired, clearing');
        sessionStorage.removeItem('jobNavigationOrigin');
        return null;
      }
      
      console.log('Origin tracking found:', originContext);
      return originContext;
    } catch (error) {
      console.error('Error parsing origin context:', error);
      sessionStorage.removeItem('jobNavigationOrigin');
      return null;
    }
  },

  /**
   * Clear origin information
   */
  clearOrigin: (): void => {
    sessionStorage.removeItem('jobNavigationOrigin');
    console.log('Origin tracking cleared');
  },

  /**
   * Get the appropriate return URL based on origin
   */
  getReturnUrl: (origin: OriginPage | null): string => {
    switch (origin) {
      case 'homepage':
        return '/employer_portal/workspace';
      case 'manage-jobs':
        return '/employer_portal/workspace/manage-jobs';
      default:
        return '/employer_portal/workspace/manage-jobs'; // fallback
    }
  },

  /**
   * Get display text for the return button
   */
  getReturnText: (origin: OriginPage | null): string => {
    switch (origin) {
      case 'homepage':
        return 'Back to Dashboard';
      case 'manage-jobs':
        return 'Back to Manage Jobs';
      default:
        return 'Back to Manage Jobs'; // fallback
    }
  }
};

/**
 * Hook for managing origin tracking in components
 */
export const useOriginTracking = () => {
  const setOrigin = (origin: OriginPage) => {
    originTracking.setOrigin(origin);
  };

  const getOrigin = () => {
    return originTracking.getOrigin();
  };

  const clearOrigin = () => {
    originTracking.clearOrigin();
  };

  const getReturnUrl = () => {
    const origin = getOrigin();
    const url = originTracking.getReturnUrl(origin?.page || null);
    console.log('Return URL:', url, 'for origin:', origin?.page);
    return url;
  };

  const getReturnText = () => {
    const origin = getOrigin();
    const text = originTracking.getReturnText(origin?.page || null);
    console.log('Return text:', text, 'for origin:', origin?.page);
    return text;
  };

  return {
    setOrigin,
    getOrigin,
    clearOrigin,
    getReturnUrl,
    getReturnText
  };
};
