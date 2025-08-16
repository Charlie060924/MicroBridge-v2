import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  CalendarDays, 
  MessageSquare, 
  Shield, 
  Users, 
  Star, 
  TrendingUp,
  Zap,
  Crown,
  CheckCircle,
  DollarSign,
  Clock,
  Target,
  Award,
  Building
} from 'lucide-react';

interface IconProps {
  className?: string;
}

// Feature icons for both students and employers
export const FeatureIcons = {
  // Student-focused icons
  graduationCap: (props: IconProps) => <GraduationCap {...props} />,
  star: (props: IconProps) => <Star {...props} />,
  users: (props: IconProps) => <Users {...props} />,
  trendingUp: (props: IconProps) => <TrendingUp {...props} />,
  shield: (props: IconProps) => <Shield {...props} />,
  checkCircle: (props: IconProps) => <CheckCircle {...props} />,
  award: (props: IconProps) => <Award {...props} />,
  
  // Employer-focused icons
  briefcase: (props: IconProps) => <Briefcase {...props} />,
  calendarDays: (props: IconProps) => <CalendarDays {...props} />,
  messageSquare: (props: IconProps) => <MessageSquare {...props} />,
  dollarSign: (props: IconProps) => <DollarSign {...props} />,
  building: (props: IconProps) => <Building {...props} />,
  target: (props: IconProps) => <Target {...props} />,
  
  // Plan tier icons
  zap: (props: IconProps) => <Zap {...props} />,
  crown: (props: IconProps) => <Crown {...props} />,
  clock: (props: IconProps) => <Clock {...props} />,
};

// Hong Kong specific styling utilities
export const HKLocalizedStyles = {
  studentPrimary: 'text-green-600 dark:text-green-400',
  studentSecondary: 'text-green-500',
  studentBackground: 'bg-green-50 dark:bg-green-900/20',
  studentBorder: 'border-green-200 dark:border-green-800',
  
  employerPrimary: 'text-blue-600 dark:text-blue-400',
  employerSecondary: 'text-blue-500',
  employerBackground: 'bg-blue-50 dark:bg-blue-900/20',
  employerBorder: 'border-blue-200 dark:border-blue-800',
  
  neutral: 'text-gray-600 dark:text-gray-400',
  neutralBackground: 'bg-gray-50 dark:bg-gray-800',
  neutralBorder: 'border-gray-200 dark:border-gray-700',
  
  // Rounded corners for modern Hong Kong design preference
  roundedSmall: 'rounded-lg',
  roundedMedium: 'rounded-xl',
  roundedLarge: 'rounded-2xl',
  
  // Hong Kong business-friendly shadows
  shadowLight: 'shadow-sm',
  shadowMedium: 'shadow-lg',
  shadowHeavy: 'shadow-xl',
};

export default FeatureIcons;
