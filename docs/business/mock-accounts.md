# Mock Accounts Guide for Testing Preview Mode

## Overview
This guide explains how to use the mock accounts to test the preview mode functionality in the MicroBridge platform.

## Available Mock Roles

### 1. Student Role
- **User**: John Doe (john.doe@example.com)
- **Purpose**: Test student portal features and authenticated student experience
- **How to activate**: Click "Set Student" in the signin page or use the role switcher

### 2. Employer Role
- **User**: Jane Smith (jane.smith@example.com)
- **Purpose**: Test employer portal features and authenticated employer experience
- **How to activate**: Click "Set Employer" in the signin page or use the role switcher

### 3. None Role (Preview Mode)
- **User**: No authenticated user
- **Purpose**: Test preview mode functionality with limited features
- **How to activate**: Click "Set None (Preview)" in the signin page or use the role switcher

## Testing Preview Mode

### Method 1: Using URL Parameters
1. **Student Preview Mode**: Visit `/student_portal/workspace?preview=true&type=student`
2. **Employer Preview Mode**: Visit `/employer_portal/workspace?preview=true&type=employer`

### Method 2: Using Landing Pages
1. Go to `/student` or `/employer` landing page
2. Click "Get Started" button
3. This will automatically enter preview mode for the respective portal

### Method 3: Testing with Mock Roles
1. Use the role switcher to set "Student" or "Employer" role
2. Navigate to the respective portal
3. Compare the full functionality with preview mode

## Preview Mode Features

### Student Portal Preview Mode
**Hidden Features:**
- Personalized job recommendations
- Current projects tracking
- Billing and subscription management
- Level system and achievements
- Profile editing capabilities
- Application management

**Available Features:**
- Public job listings browsing
- Static "recent jobs" section
- Generic featured categories
- Search functionality
- Job details viewing (read-only)

### Employer Portal Preview Mode
**Hidden Features:**
- Candidate recommendations
- Job posting capabilities
- Job management tools
- Analytics and reporting
- Billing management

**Available Features:**
- Public job listings viewing
- Basic search functionality
- Company information display

## Development Tools

### Role Switcher
- **Location**: Fixed bottom-right corner (development mode only)
- **Function**: Quickly switch between mock roles without signing out
- **Usage**: Click on the desired role (Student, Employer, or None)

### Quick Test Buttons
- **Location**: Signin page (development mode only)
- **Function**: Pre-fill credentials and set user role
- **Usage**: Click the appropriate button before signing in

## Testing Scenarios

### Scenario 1: Preview Mode vs Authenticated User
1. Set role to "None" for preview mode
2. Navigate to student portal and note limited functionality
3. Switch role to "Student" for full functionality
4. Compare the experiences

### Scenario 2: Student vs Employer Experience
1. Set role to "Student" and explore student portal
2. Switch role to "Employer" and explore employer portal
3. Compare the different experiences and features

### Scenario 3: Cross-Portal Testing
1. Test student preview mode (role: "None")
2. Test employer preview mode (role: "None")
3. Switch to appropriate authenticated roles
4. Compare preview vs authenticated experiences

## Notes
- All mock roles use the same password: `password`
- The preview mode automatically exits when a user is authenticated
- Mock data is consistent across all roles for testing purposes
- The role switcher only appears in development mode
- Preview mode state persists across page refreshes using sessionStorage
- Setting role to "None" simulates preview mode (no authenticated user)
