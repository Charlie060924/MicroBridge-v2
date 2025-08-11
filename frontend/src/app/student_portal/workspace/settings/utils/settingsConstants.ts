export const DEFAULT_SETTINGS = {
  account: {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "",
    bio: "Passionate software developer with expertise in React and Node.js",
  },
  notifications: {
    inApp: true,
    email: true,
    push: false,
    jobAlerts: true,
    applicationUpdates: true,
    marketing: false,
  },
  appearance: {
    theme: "system" as "light" | "dark" | "system",
    fontSize: "medium" as "small" | "medium" | "large",
    accentColor: "blue" as "blue" | "purple" | "green" | "orange" | "red",
    compactMode: false,
  },
  privacy: {
    publicProfile: true,
    twoFactorAuth: false,
    dataSharing: false,
    analytics: true,
  },
  preferences: {
    language: "en" as "en" | "es" | "fr" | "de" | "zh",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "HKD",
  },
};

export const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Small", size: "14px" },
  { value: "medium", label: "Medium", size: "16px" },
  { value: "large", label: "Large", size: "18px" },
];

export const ACCENT_COLORS = [
  { value: "blue", label: "Blue", color: "#3B82F6" },
  { value: "purple", label: "Purple", color: "#8B5CF6" },
  { value: "green", label: "Green", color: "#10B981" },
  { value: "orange", label: "Orange", color: "#F59E0B" },
  { value: "red", label: "Red", color: "#EF4444" },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
];

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "EST", label: "EST (Eastern Standard Time)" },
  { value: "PST", label: "PST (Pacific Standard Time)" },
  { value: "GMT", label: "GMT (Greenwich Mean Time)" },
  { value: "CET", label: "CET (Central European Time)" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const CURRENCY_OPTIONS = [
  { value: "HKD", label: "HKD (HK$)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
];

export const CONNECTED_ACCOUNTS = [
  { provider: "google", name: "Google", connected: true, email: "john.doe@gmail.com" },
  { provider: "github", name: "GitHub", connected: true, username: "johndoe" },
  { provider: "linkedin", name: "LinkedIn", connected: false },
];

export const DEVICE_SESSIONS = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome",
    location: "San Francisco, CA",
    lastActive: "2024-01-15T10:30:00Z",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari",
    location: "San Francisco, CA",
    lastActive: "2024-01-14T18:45:00Z",
    current: false,
  },
  {
    id: "3",
    device: "Windows PC",
    browser: "Firefox",
    location: "New York, NY",
    lastActive: "2024-01-10T14:20:00Z",
    current: false,
  },
];
