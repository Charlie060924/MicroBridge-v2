# Landing Pages Implementation with Role-Based Rendering

## Overview

This document outlines the implementation of explicit role-based rendering for both Student and Employer landing pages, with comprehensive origin tracking and preview mode detection.

## Landing Page Structure

### 1. General Landing Page (`/`)
- **Purpose**: Main entry point for all users
- **Features**: 
  - Generic content for both students and employers
  - Role selection through UI
  - Navigation to specific landing pages
- **Origin Tracking**: No specific origin set (users choose their path)

### 2. Student Landing Page (`/student`)
- **Purpose**: Dedicated landing page for students
- **Features**:
  - Student-specific content and messaging
  - Explicit role-based rendering with `variant="student"`
  - Automatic origin tracking for post-login routing
- **Origin Tracking**: Automatically sets `student` origin

### 3. Employer Landing Page (`/employer`)
- **Purpose**: Dedicated landing page for employers
- **Features**:
  - Employer-specific content and messaging
  - Explicit role-based rendering with `variant="employer"`
  - Automatic origin tracking for post-login routing
- **Origin Tracking**: Automatically sets `employer` origin

## Key Components

### 1. LandingNavigation Component
- **Location**: `frontend/src/components/common/LandingNavigation.tsx`
- **Features**:
  - Clear navigation between student and employer sections
  - Active state indication based on current page
  - Responsive design for mobile and desktop
  - Authentication-aware button states

### 2. Enhanced PreviewModeContext
- **Location**: `frontend/src/context/PreviewModeContext.tsx`
- **New Features**:
  - `currentLandingPage` state tracking
  - Automatic origin detection based on pathname
  - Smart exit routing based on landing page context
  - Enhanced preview mode detection

### 3. Role-Specific Auth Pages
- **Student Auth**: `/auth/signin` and `/auth/signup` (default)
- **Employer Auth**: `/auth/employer-signin` and `/auth/employer-signup`
- **Features**:
  - Automatic role setting before redirect
  - Origin tracking preservation
  - Seamless user experience

## Implementation Details

### Origin Tracking Flow

```typescript
// 1. User visits landing page
useEffect(() => {
  if (pathname === '/student') {
    NavigationMemory.saveLandingOrigin('student');
  } else if (pathname === '/employer') {
    NavigationMemory.saveLandingOrigin('employer');
  }
}, [pathname]);

// 2. User clicks "Get Started"
const handleGetStarted = () => {
  if (isAuthenticated) {
    // Go directly to appropriate portal
    const basePath = isEmployer ? '/employer_portal/workspace' : '/student_portal/workspace';
    router.push(basePath);
  } else {
    // Enter preview mode with origin tracking
    enterPreviewMode(isEmployer ? "employer" : "student");
  }
};

// 3. Post-login routing
const landingOrigin = NavigationMemory.getLandingOrigin();
if (landingOrigin) {
  const basePath = landingOrigin === 'employer' ? '/employer_portal/workspace' : '/student_portal/workspace';
  router.push(basePath);
}
```

### Role-Based Rendering

```typescript
// Hero component with explicit variants
<Hero variant="student" />  // Student-specific content
<Hero variant="employer" /> // Employer-specific content
<Hero />                    // General content (default)

// Features component with variants
<Features variant="student" />  // Student-focused features
<Features variant="employer" /> // Employer-focused features
<Features />                    // General features (default)
```

### Navigation Structure

```typescript
// LandingNavigation component
const isStudentPage = pathname === '/student' || currentLandingPage === 'student';
const isEmployerPage = pathname === '/employer' || currentLandingPage === 'employer';
const isGeneralPage = pathname === '/' || currentLandingPage === 'general';

// Active state styling
className={`px-3 py-2 rounded-md text-sm font-medium ${
  isStudentPage
    ? 'text-blue-600 bg-blue-50' // Active state
    : 'text-gray-600 hover:text-gray-900' // Default state
}`}
```

## User Experience Flow

### 1. Landing Page Selection
```
User visits / → Sees general content → Chooses role
User visits /student → Sees student-specific content
User visits /employer → Sees employer-specific content
```

### 2. Preview Mode Entry
```
User clicks "Get Started" → Enters preview mode → Sees restricted portal
User clicks "Sign Up" → Goes to auth with role pre-set
User clicks "Sign In" → Goes to auth with role pre-set
```

### 3. Post-Authentication Routing
```
User completes auth → System checks landing origin → Routes to correct portal
Student origin → /student_portal/workspace
Employer origin → /employer_portal/workspace
```

## Technical Benefits

### 1. Clear Separation of Concerns
- **Student content**: Focused on finding opportunities and building skills
- **Employer content**: Focused on hiring talent and project management
- **General content**: Balanced overview for undecided users

### 2. Improved SEO
- **Dedicated URLs**: `/student` and `/employer` for better search targeting
- **Specific metadata**: Role-appropriate titles and descriptions
- **Structured content**: Clear content hierarchy for search engines

### 3. Enhanced User Experience
- **Reduced friction**: Users land on relevant content immediately
- **Clear navigation**: Easy switching between student and employer sections
- **Consistent branding**: Unified design language across all landing pages

### 4. Better Analytics
- **Role-based tracking**: Clear user intent from landing page
- **Conversion optimization**: Separate funnels for students and employers
- **A/B testing**: Independent testing of student vs employer content

## File Structure

```
frontend/src/app/(site)/
├── page.tsx                    # General landing page
├── student/
│   └── page.tsx               # Student landing page
├── employer/
│   └── page.tsx               # Employer landing page
├── auth/
│   ├── signin/
│   │   └── page.tsx           # General signin
│   ├── signup/
│   │   └── page.tsx           # General signup
│   ├── employer-signin/
│   │   └── page.tsx           # Employer signin redirect
│   └── employer-signup/
│       └── page.tsx           # Employer signup redirect
└── landing-layout.tsx         # Shared layout with navigation

frontend/src/components/common/
├── LandingNavigation.tsx      # Navigation component
├── PreviewBanner.tsx          # Preview mode banner
└── LockedFeature.tsx          # Feature restriction component

frontend/src/context/
└── PreviewModeContext.tsx     # Enhanced preview mode context

frontend/src/utils/
└── navigationMemory.ts        # Origin tracking utility
```

## Testing Scenarios

### 1. Landing Page Navigation
- [ ] `/` → General content with role selection
- [ ] `/student` → Student-specific content
- [ ] `/employer` → Employer-specific content
- [ ] Navigation between pages works correctly

### 2. Origin Tracking
- [ ] Student page sets `student` origin
- [ ] Employer page sets `employer` origin
- [ ] General page doesn't set specific origin
- [ ] Origin persists through auth flow

### 3. Preview Mode
- [ ] Student preview shows student portal restrictions
- [ ] Employer preview shows employer portal restrictions
- [ ] Preview banner appears correctly
- [ ] Exit preview returns to correct landing page

### 4. Authentication Flow
- [ ] Student signup/signin routes to student portal
- [ ] Employer signup/signin routes to employer portal
- [ ] Role is set correctly in localStorage
- [ ] Post-login routing works as expected

## Future Enhancements

### 1. Content Personalization
- **Dynamic content**: Show different content based on user behavior
- **Progressive disclosure**: Gradually reveal more features
- **Social proof**: Role-specific testimonials and case studies

### 2. Advanced Analytics
- **Funnel tracking**: Detailed conversion analysis
- **User segmentation**: Behavior-based user groups
- **Performance optimization**: A/B testing framework

### 3. Enhanced Navigation
- **Breadcrumbs**: Clear navigation hierarchy
- **Search functionality**: Content search across landing pages
- **Mobile optimization**: Improved mobile navigation experience

## Performance Considerations

- **Lazy loading**: Components load only when needed
- **Code splitting**: Separate bundles for different landing pages
- **Caching strategy**: Optimized caching for static content
- **Image optimization**: Responsive images for different screen sizes

## Browser Compatibility

- **Modern browsers**: Full feature support
- **Progressive enhancement**: Graceful degradation for older browsers
- **Mobile-first**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 AA compliance
