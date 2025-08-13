// Navigation memory utility for preserving state between page navigations

export interface NavigationState {
  origin: string;
  scrollPosition: number;
  activeTab?: string;
  searchTerm?: string;
  filters?: Record<string, any>;
}

export class NavigationMemory {
  private static readonly STORAGE_KEY = 'navigationMemory';

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
    } catch (error) {
      console.warn('Failed to clear navigation state:', error);
    }
  }
}
