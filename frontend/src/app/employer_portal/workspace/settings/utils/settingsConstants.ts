export const DEFAULT_SETTINGS = {
  account: {
    companyName: "Acme Corporation",
    contactEmail: "hr@acme.com",
    contactPerson: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    companyLogo: "",
    industry: "Technology",
    companySize: "50-200",
    website: "https://acme.com",
  },
  notifications: {
    inApp: true,
    email: true,
    push: false,
    applicationAlerts: true,
    candidateUpdates: true,
    jobPostingReminders: true,
    marketing: false,
    weeklyReports: true,
  },
  appearance: {
    theme: "system" as "light" | "dark" | "system",
    fontSize: "medium" as "small" | "medium" | "large",
    accentColor: "blue" as "blue" | "purple" | "green" | "orange" | "red",
    compactMode: false,
  },
  privacy: {
    publicCompanyProfile: true,
    twoFactorAuth: false,
    dataSharing: false,
    analytics: true,
    showContactInfo: true,
  },
  preferences: {
    language: "en" as "en" | "es" | "fr" | "de" | "zh",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "HKD",
    jobPostingDefaults: {
      autoApprove: false,
      requireCoverLetter: true,
      allowRemote: true,
      defaultLocation: "Hong Kong",
    },
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
  { value: "HKT", label: "HKT (Hong Kong Time)" },
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

export const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

export const INDUSTRY_OPTIONS = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Retail", label: "Retail" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Consulting", label: "Consulting" },
  { value: "Other", label: "Other" },
];

export const CONNECTED_ACCOUNTS = [
  { provider: "google", name: "Google", connected: true, email: "hr@acme.com" },
  { provider: "linkedin", name: "LinkedIn", connected: true, company: "Acme Corporation" },
  { provider: "github", name: "GitHub", connected: false },
];

export const DEVICE_SESSIONS = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome",
    location: "Hong Kong",
    lastActive: "2024-01-15T10:30:00Z",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari",
    location: "Hong Kong",
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
