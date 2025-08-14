# Preview Mode Implementation

## Overview

This document outlines the implementation of a comprehensive preview mode system for both Student and Employer portals in the MicroBridge platform.

## Features Implemented

### 1. Preview Mode Context (`PreviewModeContext.tsx`)
- **Authentication Integration**: Automatically exits preview mode when user is authenticated
- **Session Persistence**: Maintains preview state across page refreshes using sessionStorage
- **Feature Locking**: Comprehensive list of locked features for both student and employer portals
- **Smart Routing**: Routes authenticated users directly to appropriate portals

### 2. Preview Banner (`PreviewBanner.tsx`)
- **Fixed Positioning**: Top-fixed banner that doesn't interfere with content
- **Dismissible**: Users can close the banner without exiting preview mode
- **Clear Messaging**: "You are not signed in — Sign in to unlock full features"
- **Smooth Transitions**: Fade-in/out animations for better UX

### 3. Landing Page Integration
- **Origin Tracking**: Saves landing page origin (student/employer) for proper post-login routing
- **Smart Button Text**: Changes based on authentication status
- **Seamless Navigation**: Authenticated users go directly to dashboards, others enter preview mode

### 4. Portal-Specific Preview Behavior

#### Student Portal Preview Mode:
- **Hidden Features**:
  - Personalized job recommendations (algorithm-based)
  - Current projects tracking
  - Billing and subscription management
  - Level system and achievements
  - Profile editing capabilities
  - Application management

- **Available Features**:
  - Public job listings browsing
  - Static "recent jobs" section
  - Generic featured categories
  - Search functionality
  - Job details viewing (read-only)

#### Employer Portal Preview Mode:
- **Hidden Features**:
  - Candidate recommendations
  - Job management tools
  - Billing and analytics
  - Application management
  - Company profile editing

- **Available Features**:
  - Public job listings browser
  - Static example analytics snapshot
  - Generic "post a job" form preview
  - Platform overview and statistics

### 5. Enhanced User Experience

#### Smooth Transitions
- **LockedFeature Component**: Hover effects and smooth fade/slide transitions
- **Interactive Elements**: Scale animations on hover for better feedback
- **Loading States**: Proper loading indicators during state transitions

#### Navigation Memory
- **Origin Tracking**: Remembers which landing page user came from
- **Post-Login Routing**: Automatically routes to correct portal after authentication
- **Scroll Position**: Preserves scroll position when returning from locked features

## Technical Implementation

### Key Components

1. **PreviewModeContext**: Central state management for preview mode
2. **PreviewBanner**: Fixed banner component for preview mode indication
3. **LockedFeature**: Wrapper component for restricted features with smooth transitions
4. **NavigationMemory**: Utility for tracking user navigation and preferences

### Routing Logic

```typescript
// Landing page → "Get Started" button
if (isAuthenticated) {
  // Go directly to appropriate portal
  router.push(basePath);
} else {
  // Enter preview mode
  enterPreviewMode(type);
}

// Post-login routing
const landingOrigin = NavigationMemory.getLandingOrigin();
if (landingOrigin) {
  const basePath = landingOrigin === 'employer' ? '/employer_portal/workspace' : '/student_portal/workspace';
  router.push(basePath);
}
```

### Feature Locking System

```typescript
const lockedFeatures = {
  student: [
    'apply_job',
    'bookmark_job',
    'personalized_recommendations',
    'current_projects',
    'billing',
    'level_system',
    // ... more features
  ],
  employer: [
    'post_job',
    'candidate_recommendations',
    'job_management',
    'analytics',
    // ... more features
  ]
};
```

## Usage Examples

### Entering Preview Mode
```typescript
const { enterPreviewMode } = usePreviewMode();
enterPreviewMode('student'); // or 'employer'
```

### Checking if Feature is Locked
```typescript
const { isFeatureLocked } = usePreviewMode();
const isLocked = isFeatureLocked('apply_job');
```

### Using LockedFeature Component
```typescript
<LockedFeature feature="apply_job" showOverlay={true}>
  <ApplyButton />
</LockedFeature>
```

## Benefits

1. **User Engagement**: Allows users to explore the platform before committing
2. **Reduced Friction**: No immediate signup requirement for basic exploration
3. **Better Conversion**: Users can see value before creating accounts
4. **Clear Value Proposition**: Preview mode showcases platform capabilities
5. **Seamless Onboarding**: Smooth transition from preview to full access

## Future Enhancements

1. **Analytics Tracking**: Track preview mode usage and conversion rates
2. **A/B Testing**: Test different preview mode configurations
3. **Progressive Disclosure**: Gradually unlock more features based on user actions
4. **Social Proof**: Show testimonials or success stories in preview mode
5. **Guided Tours**: Interactive walkthroughs for new users

## Testing

To test the preview mode:

1. **Student Preview**: Visit `/student_portal/workspace?preview=true&type=student`
2. **Employer Preview**: Visit `/employer_portal/workspace?preview=true&type=employer`
3. **Landing Page Flow**: Click "Get Started" on respective landing pages
4. **Authentication Flow**: Sign in/up and verify proper routing

## Browser Compatibility

- Modern browsers with ES6+ support
- SessionStorage for state persistence
- CSS transitions and transforms for animations
- Responsive design for mobile and desktop

## Performance Considerations

- Lazy loading of preview mode components
- Minimal impact on bundle size
- Efficient state management with React Context
- Optimized re-renders with proper memoization
