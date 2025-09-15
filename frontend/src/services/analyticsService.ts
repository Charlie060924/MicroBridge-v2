"use client";

/**
 * Analytics Service for UX Improvement Tracking
 * 
 * This service tracks key metrics defined in the UX roadmap and provides
 * insights into user behavior and application performance.
 */

interface UserAction {
  action: string;
  component: string;
  page: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: number;
  page: string;
  component?: string;
}

interface ConversionEvent {
  event: string;
  stage: string;
  value?: number;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UXMetrics {
  // Phase 1 Metrics
  errorRecoveryRate: number;
  emptyStateEngagementRate: number;
  taskCompletionRate: number;
  
  // Phase 2 Metrics  
  profileCompletionRate: number;
  applicationSubmissionRate: number;
  searchEffectivenessRate: number;
  
  // Phase 3 Metrics
  dailyActiveUsers: number;
  sevenDayRetentionRate: number;
  interviewToHireRate: number;
  
  // Performance Metrics
  averagePageLoadTime: number;
  renderPerformanceScore: number;
  memoryUsageScore: number;
}

class AnalyticsService {
  private actions: UserAction[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private conversionEvents: ConversionEvent[] = [];
  private sessionStart: number = Date.now();

  // Initialize analytics
  initialize() {
    if (typeof window === 'undefined') return;
    
    // Load existing data from localStorage
    this.loadStoredData();
    
    // Set up performance observers
    this.setupPerformanceObservers();
    
    // Track page load performance
    this.trackPageLoad();
  }

  // Track user actions for UX analysis
  trackAction(
    action: string,
    component: string,
    metadata?: Record<string, any>
  ) {
    const userAction: UserAction = {
      action,
      component,
      page: window.location.pathname,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      metadata
    };

    this.actions.push(userAction);
    this.saveToStorage();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Action tracked:', userAction);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('action', userAction);
    }
  }

  // Track conversion events
  trackConversion(
    event: string,
    stage: string,
    value?: number,
    metadata?: Record<string, any>
  ) {
    const conversionEvent: ConversionEvent = {
      event,
      stage,
      value,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      metadata
    };

    this.conversionEvents.push(conversionEvent);
    this.saveToStorage();

    if (process.env.NODE_ENV === 'development') {
      console.log('💰 Conversion tracked:', conversionEvent);
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('conversion', conversionEvent);
    }
  }

  // Track performance metrics
  trackPerformance(
    metric: string,
    value: number,
    component?: string
  ) {
    const performanceMetric: PerformanceMetric = {
      metric,
      value,
      timestamp: Date.now(),
      page: window.location.pathname,
      component
    };

    this.performanceMetrics.push(performanceMetric);
    
    // Keep only last 1000 metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance tracked:', performanceMetric);
    }
  }

  // Phase 1 Critical Fixes Tracking
  trackErrorRecovery(errorType: string, recovered: boolean, component: string) {
    this.trackAction('error_recovery', component, {
      errorType,
      recovered,
      phase: 'phase_1'
    });
  }

  trackEmptyStateAction(emptyStateType: string, actionTaken: string) {
    this.trackAction('empty_state_action', 'EmptyState', {
      emptyStateType,
      actionTaken,
      phase: 'phase_1'
    });
  }

  trackTaskCompletion(taskType: string, completed: boolean, timeToComplete?: number) {
    this.trackAction('task_completion', 'TaskFlow', {
      taskType,
      completed,
      timeToComplete,
      phase: 'phase_1'
    });
  }

  // Phase 2 Verification & Discovery Tracking
  trackProfileCompletion(completionPercentage: number, section: string) {
    this.trackAction('profile_completion', 'ProfileBuilder', {
      completionPercentage,
      section,
      phase: 'phase_2'
    });
  }

  trackApplicationSubmission(jobId: string, applicationSuccess: boolean) {
    this.trackConversion('application_submitted', 'job_application', 1, {
      jobId,
      applicationSuccess,
      phase: 'phase_2'
    });
  }

  trackSearchEffectiveness(
    query: string,
    resultsCount: number,
    actionTaken: 'applied' | 'bookmarked' | 'viewed' | 'none'
  ) {
    this.trackAction('search_performed', 'SearchBar', {
      query,
      resultsCount,
      actionTaken,
      phase: 'phase_2'
    });
  }

  // Phase 3 Engagement & Personalization Tracking
  trackDailyActivity() {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('last_active_date');
    
    if (lastActive !== today) {
      this.trackAction('daily_activity', 'App', {
        date: today,
        phase: 'phase_3'
      });
      localStorage.setItem('last_active_date', today);
    }
  }

  trackFeatureUsage(featureId: string, featureType: 'gamification' | 'personalization' | 'social_proof') {
    this.trackAction('feature_used', 'FeatureSystem', {
      featureId,
      featureType,
      phase: 'phase_3'
    });
  }

  trackRecommendationInteraction(
    recommendationType: string,
    action: 'viewed' | 'clicked' | 'applied' | 'dismissed'
  ) {
    this.trackAction('recommendation_interaction', 'RecommendationEngine', {
      recommendationType,
      action,
      phase: 'phase_3'
    });
  }

  // Get comprehensive UX metrics
  getUXMetrics(): UXMetrics {
    const now = Date.now();
    const last7Days = now - (7 * 24 * 60 * 60 * 1000);
    const last24Hours = now - (24 * 60 * 60 * 1000);

    // Calculate metrics based on tracked data
    const recentActions = this.actions.filter(a => a.timestamp > last7Days);
    const dailyActions = this.actions.filter(a => a.timestamp > last24Hours);

    // Phase 1 Metrics
    const errorRecoveryActions = recentActions.filter(a => a.action === 'error_recovery');
    const errorRecoveryRate = errorRecoveryActions.length > 0 
      ? errorRecoveryActions.filter(a => a.metadata?.recovered).length / errorRecoveryActions.length * 100
      : 0;

    const emptyStateActions = recentActions.filter(a => a.action === 'empty_state_action');
    const emptyStateEngagementRate = emptyStateActions.length > 0 
      ? emptyStateActions.filter(a => a.metadata?.actionTaken !== 'none').length / emptyStateActions.length * 100
      : 0;

    const taskCompletions = recentActions.filter(a => a.action === 'task_completion');
    const taskCompletionRate = taskCompletions.length > 0
      ? taskCompletions.filter(a => a.metadata?.completed).length / taskCompletions.length * 100
      : 0;

    // Phase 2 Metrics
    const profileActions = recentActions.filter(a => a.action === 'profile_completion');
    const avgProfileCompletion = profileActions.length > 0
      ? profileActions.reduce((sum, a) => sum + (a.metadata?.completionPercentage || 0), 0) / profileActions.length
      : 0;

    const applications = this.conversionEvents.filter(e => e.event === 'application_submitted' && e.timestamp > last7Days);
    const applicationSubmissionRate = applications.length > 0
      ? applications.filter(e => e.metadata?.applicationSuccess).length / applications.length * 100
      : 0;

    const searches = recentActions.filter(a => a.action === 'search_performed');
    const searchEffectivenessRate = searches.length > 0
      ? searches.filter(a => a.metadata?.actionTaken !== 'none').length / searches.length * 100
      : 0;

    // Phase 3 Metrics
    const uniqueDailyUsers = new Set(dailyActions.map(a => a.userId).filter(Boolean)).size;
    
    // Calculate 7-day retention (simplified)
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toDateString();
    const todayUsers = new Set(dailyActions.map(a => a.userId).filter(Boolean));
    const weekAgoUsers = new Set(
      this.actions.filter(a => new Date(a.timestamp).toDateString() === sevenDaysAgo)
        .map(a => a.userId).filter(Boolean)
    );
    const retainedUsers = new Set([...todayUsers].filter(u => weekAgoUsers.has(u)));
    const sevenDayRetentionRate = weekAgoUsers.size > 0 
      ? (retainedUsers.size / weekAgoUsers.size) * 100 
      : 0;

    // Performance Metrics
    const recentPerformanceMetrics = this.performanceMetrics.filter(m => m.timestamp > last24Hours);
    const avgPageLoadTime = this.calculateAverageMetric(recentPerformanceMetrics, 'page_load_time');
    const renderPerformanceScore = this.calculatePerformanceScore(recentPerformanceMetrics, 'render_time');
    const memoryUsageScore = this.calculatePerformanceScore(recentPerformanceMetrics, 'memory_usage');

    return {
      // Phase 1 Metrics
      errorRecoveryRate,
      emptyStateEngagementRate,
      taskCompletionRate,
      
      // Phase 2 Metrics
      profileCompletionRate: avgProfileCompletion,
      applicationSubmissionRate,
      searchEffectivenessRate,
      
      // Phase 3 Metrics
      dailyActiveUsers: uniqueDailyUsers,
      sevenDayRetentionRate,
      interviewToHireRate: 0, // TODO: Implement when interview tracking is added
      
      // Performance Metrics
      averagePageLoadTime: avgPageLoadTime,
      renderPerformanceScore,
      memoryUsageScore
    };
  }

  // Generate UX improvement report
  generateUXReport(): string {
    const metrics = this.getUXMetrics();
    
    return `
# UX Improvement Metrics Report
Generated: ${new Date().toLocaleString()}

## Phase 1: Critical Fixes
- Error Recovery Rate: ${metrics.errorRecoveryRate.toFixed(1)}% (Target: 75%+)
- Empty State Engagement: ${metrics.emptyStateEngagementRate.toFixed(1)}% (Target: 50%+)
- Task Completion Rate: ${metrics.taskCompletionRate.toFixed(1)}% (Target: 80%+)

## Phase 2: Verification & Discovery
- Profile Completion Rate: ${metrics.profileCompletionRate.toFixed(1)}% (Target: 75%+)
- Application Submission Rate: ${metrics.applicationSubmissionRate.toFixed(1)}% (Target: 40%+)
- Search Effectiveness Rate: ${metrics.searchEffectivenessRate.toFixed(1)}% (Target: 70%+)

## Phase 3: Engagement & Personalization
- Daily Active Users: ${metrics.dailyActiveUsers} (Target: +60% increase)
- 7-Day Retention Rate: ${metrics.sevenDayRetentionRate.toFixed(1)}% (Target: 65%+)
- Interview-to-Hire Rate: ${metrics.interviewToHireRate.toFixed(1)}% (Target: 70%+)

## Performance Metrics
- Average Page Load Time: ${metrics.averagePageLoadTime.toFixed(2)}s (Target: <2s)
- Render Performance Score: ${metrics.renderPerformanceScore.toFixed(1)}/100 (Target: 85+)
- Memory Usage Score: ${metrics.memoryUsageScore.toFixed(1)}/100 (Target: 80+)

## Recommendations
${this.generateRecommendations(metrics)}
    `.trim();
  }

  // Helper methods
  private loadStoredData() {
    try {
      const stored = localStorage.getItem('ux_analytics_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.actions = data.actions || [];
        this.conversionEvents = data.conversionEvents || [];
        // Don't load performance metrics from storage (too volatile)
      }
    } catch (error) {
      console.warn('Failed to load analytics data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        actions: this.actions.slice(-500), // Keep last 500 actions
        conversionEvents: this.conversionEvents.slice(-100), // Keep last 100 events
        lastSaved: Date.now()
      };
      localStorage.setItem('ux_analytics_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics data to storage:', error);
    }
  }

  private getCurrentUserId(): string | undefined {
    // TODO: Integrate with actual auth system
    return localStorage.getItem('user_id') || undefined;
  }

  private setupPerformanceObservers() {
    if (typeof window === 'undefined') return;

    // Observe layout shifts
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              this.trackPerformance('cumulative_layout_shift', entry.value);
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  private trackPageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.trackPerformance('first_contentful_paint', navigation.domContentLoadedEventEnd - navigation.responseStart);
        }
      }, 0);
    });
  }

  private calculateAverageMetric(metrics: PerformanceMetric[], metricName: string): number {
    const filtered = metrics.filter(m => m.metric === metricName);
    return filtered.length > 0 
      ? filtered.reduce((sum, m) => sum + m.value, 0) / filtered.length 
      : 0;
  }

  private calculatePerformanceScore(metrics: PerformanceMetric[], metricName: string): number {
    const values = metrics.filter(m => m.metric === metricName).map(m => m.value);
    if (values.length === 0) return 100;

    // Calculate score based on targets (simplified)
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    
    if (metricName === 'render_time') {
      return Math.max(0, 100 - (avgValue - 16) * 2); // 16ms target
    }
    
    if (metricName === 'memory_usage') {
      const mb = avgValue / 1024 / 1024;
      return Math.max(0, 100 - Math.max(0, mb - 50) * 2); // 50MB baseline
    }
    
    return 100;
  }

  private generateRecommendations(metrics: UXMetrics): string {
    const recommendations: string[] = [];

    if (metrics.errorRecoveryRate < 75) {
      recommendations.push('- Improve error handling and recovery mechanisms');
    }
    
    if (metrics.emptyStateEngagementRate < 50) {
      recommendations.push('- Enhance empty state CTAs and suggestions');
    }
    
    if (metrics.profileCompletionRate < 75) {
      recommendations.push('- Simplify profile completion flow and add progress indicators');
    }
    
    if (metrics.sevenDayRetentionRate < 65) {
      recommendations.push('- Implement retention strategies and engagement features');
    }
    
    if (metrics.averagePageLoadTime > 2) {
      recommendations.push('- Optimize page load performance and implement code splitting');
    }

    return recommendations.length > 0 
      ? recommendations.join('\n') 
      : '- All metrics are meeting targets! 🎉';
  }

  private sendToAnalytics(type: string, data: any) {
    // TODO: Implement actual analytics service integration
    // Example: Google Analytics, Mixpanel, or custom analytics endpoint
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;