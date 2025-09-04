// Preview Mode A/B Testing Analytics Service
// Tracks preview mode interactions and conversion metrics

interface PreviewAnalyticsEvent {
  event: string;
  previewType: 'student' | 'employer' | null;
  variation?: string | number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PreviewSession {
  sessionId: string;
  previewType: 'student' | 'employer' | null;
  startTime: number;
  endTime?: number;
  events: PreviewAnalyticsEvent[];
  converted: boolean;
  abTestVariations: Record<string, string | number>;
}

class PreviewAnalyticsService {
  private sessionId: string;
  private session: PreviewSession | null = null;
  private events: PreviewAnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    if (typeof window !== 'undefined') {
      // Try to restore session from sessionStorage
      const savedSession = sessionStorage.getItem('preview_analytics_session');
      if (savedSession) {
        try {
          this.session = JSON.parse(savedSession);
          return;
        } catch (error) {
          console.warn('Failed to restore preview analytics session:', error);
        }
      }
    }

    // Create new session
    this.session = {
      sessionId: this.sessionId,
      previewType: null,
      startTime: Date.now(),
      events: [],
      converted: false,
      abTestVariations: {}
    };
  }

  private saveSession() {
    if (typeof window !== 'undefined' && this.session) {
      sessionStorage.setItem('preview_analytics_session', JSON.stringify(this.session));
    }
  }

  // Start tracking a preview session
  startPreviewSession(previewType: 'student' | 'employer') {
    if (!this.session) return;

    this.session.previewType = previewType;
    this.session.startTime = Date.now();
    
    // Assign A/B test variations
    this.assignABTestVariations();

    this.trackEvent('preview_session_started', {
      previewType,
      variations: this.session.abTestVariations
    });

    this.saveSession();
  }

  // End preview session
  endPreviewSession() {
    if (!this.session) return;

    this.session.endTime = Date.now();
    
    this.trackEvent('preview_session_ended', {
      duration: this.session.endTime - this.session.startTime,
      eventsCount: this.session.events.length,
      converted: this.session.converted
    });

    this.saveSession();
    this.sendAnalyticsData();
  }

  // Track conversion event
  trackConversion(conversionType: string, metadata?: Record<string, any>) {
    if (!this.session) return;

    this.session.converted = true;
    
    this.trackEvent('conversion', {
      conversionType,
      ...metadata
    });

    this.saveSession();
    this.sendAnalyticsData(); // Send immediately on conversion
  }

  // Track generic event
  trackEvent(eventName: string, metadata?: Record<string, any>) {
    if (!this.session) return;

    const event: PreviewAnalyticsEvent = {
      event: eventName,
      previewType: this.session.previewType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata
    };

    this.session.events.push(event);
    this.events.push(event);

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter_1: this.session.previewType,
        custom_parameter_2: this.sessionId,
        ...metadata
      });
    }

    this.saveSession();
  }

  // Assign A/B test variations
  private assignABTestVariations() {
    if (!this.session) return;

    // Simple random assignment for now
    // In production, you might want more sophisticated assignment logic
    const variations = {
      heroMessage: Math.floor(Math.random() * 3), // 0, 1, or 2
      ctaButton: Math.floor(Math.random() * 3),
      socialProof: Math.floor(Math.random() * 3)
    };

    this.session.abTestVariations = variations;
  }

  // Get current A/B test variation
  getABTestVariation(element: string): number {
    return this.session?.abTestVariations[element] || 0;
  }

  // Track specific preview interactions
  trackDemoDataViewed(dataType: string) {
    this.trackEvent('demo_data_viewed', { dataType });
  }

  trackFeatureInteraction(feature: string) {
    this.trackEvent('feature_interaction', { feature });
  }

  trackCtaClicked(ctaType: string, location: string) {
    this.trackEvent('cta_clicked', { ctaType, location });
  }

  trackTimeSpent() {
    if (!this.session) return;

    const timeSpent = Date.now() - this.session.startTime;
    this.trackEvent('time_spent_update', { timeSpent });
  }

  // Send analytics data to backend or analytics service
  private async sendAnalyticsData() {
    if (!this.session || this.session.events.length === 0) return;

    try {
      // In a real implementation, you would send this to your analytics backend
      console.log('Preview Analytics Data:', {
        session: this.session,
        conversionRate: this.session.converted ? 1 : 0,
        totalEvents: this.session.events.length,
        sessionDuration: (this.session.endTime || Date.now()) - this.session.startTime
      });

      // Example: Send to your analytics API
      // await fetch('/api/preview-analytics', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(this.session)
      // });

      // Clear events after successful send
      this.session.events = [];
      this.saveSession();
    } catch (error) {
      console.error('Failed to send preview analytics:', error);
    }
  }

  // Get current session stats
  getSessionStats() {
    if (!this.session) return null;

    return {
      sessionId: this.session.sessionId,
      previewType: this.session.previewType,
      startTime: this.session.startTime,
      duration: Date.now() - this.session.startTime,
      eventCount: this.session.events.length,
      converted: this.session.converted,
      variations: this.session.abTestVariations
    };
  }

  // Generate analytics report (for testing/debugging)
  generateReport() {
    if (!this.session) return null;

    const duration = (this.session.endTime || Date.now()) - this.session.startTime;
    
    return {
      sessionId: this.session.sessionId,
      previewType: this.session.previewType,
      duration: duration,
      durationMinutes: Math.round(duration / 60000),
      eventCount: this.session.events.length,
      converted: this.session.converted,
      conversionRate: this.session.converted ? 100 : 0,
      abTestVariations: this.session.abTestVariations,
      events: this.session.events.map(event => ({
        event: event.event,
        timestamp: new Date(event.timestamp).toISOString(),
        metadata: event.metadata
      })),
      recommendations: this.generateRecommendations()
    };
  }

  private generateRecommendations() {
    if (!this.session) return [];

    const recommendations = [];
    const duration = (this.session.endTime || Date.now()) - this.session.startTime;

    if (duration < 30000) { // Less than 30 seconds
      recommendations.push('User left quickly - consider improving initial value proposition');
    }

    if (this.session.events.filter(e => e.event === 'cta_clicked').length === 0) {
      recommendations.push('No CTA clicks - consider making CTAs more prominent');
    }

    if (this.session.events.filter(e => e.event === 'demo_data_viewed').length > 5) {
      recommendations.push('High demo data engagement - user seems interested');
    }

    return recommendations;
  }
}

// Export singleton instance
export const previewAnalytics = new PreviewAnalyticsService();

// Export types for external use
export type { PreviewAnalyticsEvent, PreviewSession };