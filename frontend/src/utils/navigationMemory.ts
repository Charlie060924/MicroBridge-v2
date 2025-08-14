// Navigation memory utility for preserving state between page navigations

export interface NavigationState {
  origin: string;
  scrollPosition: number;
  activeTab?: string;
  searchTerm?: string;
  filters?: Record<string, any>;
  landingPageOrigin?: 'student' | 'employer';
  previewMode?: boolean;
}

export class NavigationMemory {
  private static readonly STORAGE_KEY = 'navigationMemory';
  private static readonly LANDING_ORIGIN_KEY = 'landingPageOrigin';

  /**
   * Save navigation state before navigating away
   */
  static saveState(state: NavigationState): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  }

  /**
   * Retrieve and clear navigation state
   */
  static getState(): NavigationState | null {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        sessionStorage.removeItem(this.STORAGE_KEY);
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to retrieve navigation state:', error);
    }
    return null;
  }

  /**
   * Save landing page origin for proper routing after login
   */
  static saveLandingOrigin(origin: 'student' | 'employer'): void {
    try {
      sessionStorage.setItem(this.LANDING_ORIGIN_KEY, origin);
    } catch (error) {
      console.warn('Failed to save landing origin:', error);
    }
  }

  /**
   * Get landing page origin
   */
  static getLandingOrigin(): 'student' | 'employer' | null {
    try {
      const origin = sessionStorage.getItem(this.LANDING_ORIGIN_KEY);
      return origin as 'student' | 'employer' | null;
    } catch (error) {
      console.warn('Failed to get landing origin:', error);
    }
    return null;
  }

  /**
   * Clear landing page origin
   */
  static clearLandingOrigin(): void {
    try {
      sessionStorage.removeItem(this.LANDING_ORIGIN_KEY);
    } catch (error) {
      console.warn('Failed to clear landing origin:', error);
    }
  }

  /**
   * Save billing-specific navigation state
   */
  static saveBillingState(activeTab: string, scrollPosition: number, searchTerm?: string): void {
    this.saveState({
      origin: '/billing',
      scrollPosition,
      activeTab,
      searchTerm
    });
  }

  /**
   * Restore scroll position with a delay to ensure content is loaded
   */
  static restoreScrollPosition(scrollPosition: number, delay: number = 100): void {
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, delay);
  }

  /**
   * Check if we're returning from a specific origin
   */
  static isReturningFrom(origin: string): boolean {
    const state = this.getState();
    return state?.origin === origin;
  }

  /**
   * Get the active tab from stored state
   */
  static getActiveTab(): string | undefined {
    const state = this.getState();
    return state?.activeTab;
  }

  /**
   * Get the search term from stored state
   */
  static getSearchTerm(): string | undefined {
    const state = this.getState();
    return state?.searchTerm;
  }

  /**
   * Clear all navigation state
   */
  static clear(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.LANDING_ORIGIN_KEY);
    } catch (error) {
      console.warn('Failed to clear navigation state:', error);
    }
  }
}
