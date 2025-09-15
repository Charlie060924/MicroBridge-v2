/**
 * Million.js Configuration for MicroBridge Performance Optimization
 * 
 * This configuration file defines which components should be optimized with Million.js
 * and establishes performance monitoring guidelines for the application.
 */

// Components that should be optimized with Million.js block()
export const MILLION_OPTIMIZED_COMPONENTS = {
  // High-frequency rendering components
  highFrequency: [
    'JobList',
    'JobCard', 
    'JobCategoryCard',
    'SearchResults',
    'CandidateList',
    'CandidateCard',
    'ApplicationList',
    'ApplicationCard',
    'NotificationList',
    'NotificationItem'
  ],
  
  // Dashboard components that re-render often
  dashboards: [
    'StudentDashboard',
    'EmployerDashboard', 
    'StudentHomepage',
    'EmployerHomepage',
    'DashboardStats',
    'RecentActivity',
    'QuickActions'
  ],
  
  // Real-time or frequently updating components
  realTime: [
    'MessageList',
    'MessageItem',
    'StatusTracker',
    'ProgressBar',
    'LiveNotifications',
    'ApplicationStatusList',
    'ProjectStatusCard',
    'ActivityFeed',
    'CompetitiveElements',
    'PeerComparison',
    'SuccessStoryShowcase'
  ],
  
  // Form components with frequent updates
  forms: [
    'SkillsInput',
    'LocationSelector',
    'FilterControls',
    'SearchBar',
    'RangeSlider',
    'CategorySelector'
  ],
  
  // Calendar and scheduling components
  calendar: [
    'CalendarView',
    'AvailabilityGrid',
    'TimeSlotPicker',
    'ScheduleModal',
    'DatePicker'
  ]
};

// Components to avoid Million.js optimization
export const MILLION_AVOID_COMPONENTS = [
  // Complex state management
  'AuthProvider',
  'PreviewModeContext',
  'UserRoleProvider',
  
  // Third-party integrations
  'StripeProvider',
  'GoogleCalendarIntegration',
  'LinkedInIntegration',
  
  // Components with many useEffect hooks
  'DataFetcher',
  'APIConnector',
  'WebSocketProvider',
  
  // Error boundaries and fallback components
  'ErrorBoundary',
  'ErrorFallback',
  'LoadingFallback',
  
  // Complex animations or transitions
  'AnimatedModal',
  'TransitionWrapper',
  'GestureHandler'
];

// Performance thresholds and targets
export const PERFORMANCE_TARGETS = {
  // Rendering performance
  renderTime: {
    target: 16, // ms per frame for 60fps
    warning: 25, // ms - show warning
    critical: 50 // ms - critical performance issue
  },
  
  // Bundle size limits
  bundleSize: {
    maxIncrease: 15, // % maximum bundle size increase
    warningThreshold: 10 // % warning threshold
  },
  
  // Memory usage
  memoryUsage: {
    targetReduction: 25, // % target memory reduction
    warningIncrease: 10 // % warning if memory increases
  },
  
  // User experience metrics
  userExperience: {
    firstContentfulPaint: 1.5, // seconds
    largestContentfulPaint: 2.5, // seconds
    timeToInteractive: 3.0 // seconds
  }
};

// Component-specific optimization settings
export const COMPONENT_OPTIMIZATION_CONFIG = {
  'JobList': {
    optimizeFor: 'scrolling',
    virtualization: true,
    batchSize: 20,
    expectedUpdates: 'high'
  },
  
  'StudentDashboard': {
    optimizeFor: 'initialLoad',
    lazyLoad: ['charts', 'analytics'],
    cacheStrategy: 'aggressive',
    expectedUpdates: 'medium'
  },
  
  'SearchResults': {
    optimizeFor: 'filtering',
    debounceMs: 300,
    virtualScrolling: true,
    expectedUpdates: 'very-high'
  },
  
  'MessageList': {
    optimizeFor: 'realtime',
    maxItems: 100,
    autoScroll: true,
    expectedUpdates: 'constant'
  },
  
  'CalendarView': {
    optimizeFor: 'interactions',
    gestureHandling: 'optimized',
    renderStrategy: 'viewport-only',
    expectedUpdates: 'medium'
  },
  
  // Phase 3 Engagement & Personalization Components
  'ActivityFeed': {
    optimizeFor: 'realtime',
    maxItems: 20,
    autoRefresh: true,
    expectedUpdates: 'constant',
    animationOptimization: 'high'
  },
  
  'CompetitiveElements': {
    optimizeFor: 'interactions',
    tabSwitching: 'optimized',
    leaderboardUpdates: 'realtime',
    expectedUpdates: 'high',
    cacheStrategy: 'aggressive'
  },
  
  'SuccessStoryShowcase': {
    optimizeFor: 'carousel',
    autoPlay: true,
    lazyLoadImages: true,
    expectedUpdates: 'low',
    transitionOptimization: 'smooth'
  },
  
  'PeerComparison': {
    optimizeFor: 'dataVisualization',
    chartRendering: 'optimized',
    metricUpdates: 'medium',
    expectedUpdates: 'medium',
    anonymization: 'performance-optimized'
  }
};

// Development vs Production configuration
export const ENVIRONMENT_CONFIG = {
  development: {
    enableProfiling: true,
    showPerformanceWarnings: true,
    detailedLogging: true,
    hotReload: true
  },
  
  production: {
    enableProfiling: false,
    showPerformanceWarnings: false,
    detailedLogging: false,
    compressionLevel: 'maximum'
  }
};

// Feature flags for Million.js integration
export const MILLION_FEATURE_FLAGS = {
  enableBlockOptimization: true,
  enableAutomaticOptimization: false, // Manual control preferred
  enablePerformanceMonitoring: true,
  enableBundleAnalysis: true,
  enableMemoryProfiling: process.env.NODE_ENV === 'development'
};

export default {
  optimizedComponents: MILLION_OPTIMIZED_COMPONENTS,
  avoidComponents: MILLION_AVOID_COMPONENTS,
  performanceTargets: PERFORMANCE_TARGETS,
  componentConfig: COMPONENT_OPTIMIZATION_CONFIG,
  environmentConfig: ENVIRONMENT_CONFIG,
  featureFlags: MILLION_FEATURE_FLAGS
};