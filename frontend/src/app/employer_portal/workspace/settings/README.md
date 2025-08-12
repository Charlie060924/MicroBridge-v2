# Employer Portal Settings

This directory contains the enhanced settings page for the employer portal, adapted from the student portal settings with employer-specific functionality.

## Structure

```
settings/
├── page.tsx                           # Main settings page
├── hooks/
│   └── useSettings.ts                 # Settings management hook
├── utils/
│   └── settingsConstants.ts           # Default settings and options
├── components/
│   ├── SettingCard.tsx                # Reusable settings card component
│   ├── ToggleSwitch.tsx               # Toggle switch component
│   ├── FontSizeSlider.tsx             # Font size slider component
│   └── LanguageSelector.tsx           # Language selection component
├── sections/
│   ├── AccountSettingsSection.tsx     # Company account settings
│   ├── NotificationSettingsSection.tsx # Notification preferences
│   ├── AppearanceSettingsSection.tsx  # UI appearance settings
│   ├── PrivacySecuritySection.tsx     # Privacy and security settings
│   └── OtherSettingsSection.tsx       # Language, region, and other settings
└── README.md                          # This file
```

## Features

### Account Settings
- Company profile management (name, contact info, logo, industry, size)
- Connected accounts (Google, LinkedIn, GitHub)
- Security settings (password change, 2FA)

### Notification Settings
- In-app notifications
- Email notifications
- Push notifications
- Application alerts
- Candidate updates
- Job posting reminders
- Weekly reports
- Marketing communications

### Appearance Settings
- Theme selection (Light, Dark, System)
- Font size adjustment
- Compact mode toggle
- Live preview

### Privacy & Security
- Company profile visibility
- Contact information display
- Two-factor authentication
- Data sharing preferences
- Analytics settings
- Active session management
- Account actions (sign out all devices, download data, manage team)

### Other Settings
- Language selection
- Timezone settings
- Date format preferences
- Currency selection
- Job posting defaults:
  - Auto-approve applications
  - Require cover letters
  - Allow remote work
  - Default location
- Help & support links
- Legal documents

## Usage

The settings are automatically saved to localStorage and can be accessed throughout the application using the `useSettings` hook:

```typescript
import { useSettings } from './hooks/useSettings';

const { settings, updateSettings, saveSettings } = useSettings();
```

## Employer-Specific Adaptations

1. **Company-focused**: All settings are adapted for company accounts rather than individual users
2. **Job posting defaults**: Added settings for default job posting preferences
3. **Team management**: Includes options for managing team members
4. **Employer notifications**: Notification settings specific to employer needs (applications, candidates, etc.)
5. **Company privacy**: Privacy settings focused on company profile visibility and contact information

## Dependencies

- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- React hooks for state management

## Local Storage

Settings are stored in localStorage under the key `microbridge-employer-settings` to avoid conflicts with student settings.
