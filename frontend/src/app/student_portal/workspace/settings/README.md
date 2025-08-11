# Settings Page

A comprehensive settings page for the MicroBridge dashboard with smooth animations and full dark/light theme support.

## Features

- **Account Settings**: Profile information, connected accounts, password management
- **Notification Settings**: In-app, email, push notifications with toggle switches
- **Appearance Settings**: Theme selection (light/dark/system), font size slider, compact mode
- **Privacy & Security**: Privacy toggles, 2FA, device management, session control
- **Other Settings**: Language selection, regional preferences, help & support

## File Structure

```
settings/
├── page.tsx                           # Main SettingsPage container
├── sections/                          # All modular settings sections
│   ├── AccountSettingsSection.tsx     # Profile editing, connected accounts
│   ├── NotificationSettingsSection.tsx # Notification toggles
│   ├── AppearanceSettingsSection.tsx  # Theme, font size, compact mode
│   ├── PrivacySecuritySection.tsx     # Privacy toggles, 2FA, devices
│   └── OtherSettingsSection.tsx       # Language, help, logout
├── components/                        # Shared settings-specific UI
│   ├── SettingCard.tsx                # Card with icon, title, animations
│   ├── ToggleSwitch.tsx               # Animated toggle switch
│   ├── ColorPicker.tsx                # Accent color selector (removed)
│   ├── FontSizeSlider.tsx             # Font size control with preview
│   └── LanguageSelector.tsx           # Language dropdown with flags
├── hooks/
│   └── useSettings.ts                 # Settings state management
├── utils/
│   └── settingsConstants.ts           # Default values, options
├── styles/
│   └── settings.css                   # Additional styling
└── README.md                          # This file
```

## Components

### SettingCard
Reusable card component with:
- Icon and title header
- Expand/collapse animations
- Consistent styling across all sections
- Hover effects and transitions

### ToggleSwitch
Animated toggle switch with:
- Smooth spring animations
- Multiple sizes (sm, md, lg)
- Label and description support
- Dark mode compatibility

### FontSizeSlider
Interactive font size control with:
- Draggable slider
- Visual preview
- Click-to-select options
- Real-time preview text

### LanguageSelector
Language selection dropdown with:
- Flag icons for each language
- Smooth dropdown animations
- Search functionality (ready for implementation)
- Current selection highlighting

## State Management

### useSettings Hook
Manages all settings state with:
- Local storage persistence
- Change tracking
- Reset functionality
- Loading states
- Type-safe updates

### Settings Structure
```typescript
interface Settings {
  account: {
    name: string;
    email: string;
    profilePicture: string;
    bio: string;
  };
  notifications: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
    marketing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    accentColor: 'blue' | 'purple' | 'green' | 'orange' | 'red';
    compactMode: boolean;
  };
  privacy: {
    publicProfile: boolean;
    twoFactorAuth: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
}
```

## Animations

All animations use Framer Motion with:
- Page fade-in and slide-up on mount
- Staggered children animations
- Smooth hover transitions
- Spring animations for interactive elements
- Consistent easing curves

## Theme Support

Full dark/light theme support with:
- Automatic theme detection
- Manual theme switching
- System preference following
- Consistent color schemes
- Smooth theme transitions

## Responsive Design

Mobile-first responsive design with:
- Flexible grid layouts
- Touch-friendly interactions
- Optimized spacing for mobile
- Collapsible sections on smaller screens

## Usage

The settings page is automatically integrated into the dashboard layout. Users can access it via the sidebar navigation at `/student_portal/workspace/settings`.

### Integration with Existing Layout

The page works seamlessly with:
- AppSidebar navigation
- AppHeader with theme toggle
- Existing theme context
- Responsive mobile layout

## Customization

### Adding New Settings
1. Add new fields to the Settings interface in `useSettings.ts`
2. Update `settingsConstants.ts` with default values
3. Create new section component or add to existing section
4. Update the main page to include the new section

### Styling
- All styling uses Tailwind CSS classes
- Custom CSS available in `settings.css`
- Consistent with existing dashboard design system
- Dark mode variants for all components

## Performance

- Lazy loading of sections (ready for implementation)
- Optimized animations with proper cleanup
- Efficient state updates
- Minimal re-renders with proper memoization

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support
