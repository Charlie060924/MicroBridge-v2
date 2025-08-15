# UserRoleSwitcher Component

## Overview
The UserRoleSwitcher is a development-only component that allows developers to quickly switch between different mock account types for testing purposes.

## Features

### Mock Account Types
- **Student**: Authenticated student user with full student portal access
- **Employer**: Authenticated employer user with full employer portal access  
- **Preview Mode**: No authenticated user (simulates preview mode)

### UI Features
- **Floating Design**: Positioned in the top-right corner for easy access
- **Dropdown Interface**: Clean dropdown menu with role-specific icons and colors
- **Responsive**: Works on both desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Visual Feedback**: Clear indication of current role with colored indicators

### Technical Features
- **No Page Reloads**: Instant role switching via client-side state management
- **Persistent State**: Role selection persists across page navigation
- **Development Only**: Automatically hidden in production builds
- **Console Logging**: Clear console messages for debugging

## Usage

### For Developers
1. **Access**: The switcher appears as a floating button in the top-right corner (development mode only)
2. **Switch Roles**: Click the button to open the dropdown and select a role
3. **Automatic Routing**: The app automatically redirects to the appropriate portal/dashboard
4. **Debug**: Check browser console for role switching logs

### For Testing
- **Student Testing**: Switch to "Student" to test student portal features
- **Employer Testing**: Switch to "Employer" to test employer portal features
- **Preview Testing**: Switch to "Preview Mode" to test unauthenticated/preview functionality

## Technical Implementation

### Context Management
- Uses `MockAccountContext` for global state management
- Persists role selection in `localStorage`
- Integrates with existing auth system

### Routing Logic
- **Student**: Routes to `/student_portal/workspace`
- **Employer**: Routes to `/employer_portal/workspace`
- **Preview Mode**: Routes to `/` (landing page)

### State Synchronization
- Automatically clears auth tokens when switching roles
- Updates authentication state to match selected role
- Maintains consistency across all components

## Accessibility

### Keyboard Navigation
- Tab to focus the switcher button
- Enter/Space to open/close dropdown
- Arrow keys to navigate options
- Escape to close dropdown

### Screen Reader Support
- Proper ARIA labels and roles
- Descriptive text for each role option
- Clear indication of current selection

## Responsive Design

### Desktop
- Full text labels visible
- Larger dropdown menu
- Hover effects and transitions

### Mobile
- Compact button with icon only
- Smaller dropdown menu
- Touch-friendly button sizes

## Development Notes

### Environment Detection
- Only renders in `NODE_ENV === 'development'`
- Automatically disabled in production builds
- No impact on production performance

### Console Logging
- Role switching events logged with emojis
- Authentication state changes logged
- Routing decisions logged

### Integration Points
- Works with existing `useAuth` hook
- Compatible with `PreviewModeContext`
- Integrates with routing system
