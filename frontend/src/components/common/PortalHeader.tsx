"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Settings, 
  HelpCircle,
  ChevronDown,
  Star,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface PortalHeaderProps {
  userType: 'student' | 'employer';
  userName?: string;
  userLevel?: number;
  userPoints?: number;
  notifications?: number;
  className?: string;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({
  userType,
  userName = "User",
  userLevel = 1,
  userPoints = 0,
  notifications = 0,
  className = ''
}) => {
  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getLevelColor = () => {
    if (userLevel >= 5) return 'text-warning bg-warning';
    if (userLevel >= 3) return 'text-secondary bg-secondary';
    return 'text-primary bg-primary';
  };

  const getRoleSpecificContent = () => {
    if (userType === 'student') {
      return {
        roleIcon: User,
        roleLabel: 'Student',
        accentColor: 'text-secondary',
        dashboardTitle: 'Student Dashboard',
        primaryAction: {
          label: 'Find Projects',
          href: '/student_portal/workspace/jobs'
        },
        secondaryAction: {
          label: 'My Applications',
          href: '/student_portal/workspace/applications'
        }
      };
    }
    
    return {
      roleIcon: Briefcase,
      roleLabel: 'Employer',
      accentColor: 'text-warning',
      dashboardTitle: 'Employer Dashboard', 
      primaryAction: {
        label: 'Post Project',
        href: '/employer_portal/workspace/post-job'
      },
      secondaryAction: {
        label: 'View Candidates',
        href: '/employer_portal/workspace/candidates'
      }
    };
  };

  const roleContent = getRoleSpecificContent();
  const RoleIcon = roleContent.roleIcon;

  return (
    <header className={`bg-white border-b border-gray-100 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Greeting & User Info */}
          <div className="flex items-center space-x-4">
            {/* User Avatar & Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neutral-light rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold text-black">
                    {getUserGreeting()}, {userName}!
                  </h1>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor()} bg-opacity-10`}>
                    <Star className="w-3 h-3 mr-1" />
                    Level {userLevel}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-waterloo">
                  <div className="flex items-center">
                    <RoleIcon className="w-4 h-4 mr-1" />
                    {roleContent.roleLabel}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {userPoints.toLocaleString()} points
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Actions & Navigation */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href={roleContent.primaryAction.href}
                className="btn-primary px-4 py-2 text-sm"
              >
                {roleContent.primaryAction.label}
              </a>
              <a
                href={roleContent.secondaryAction.href}
                className="btn-outline px-4 py-2 text-sm"
              >
                {roleContent.secondaryAction.label}
              </a>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {notifications > 9 ? '9+' : notifications}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Help */}
            <a
              href="/help"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help Center"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </a>

            {/* Settings Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="md:hidden mt-4 flex space-x-3">
          <a
            href={roleContent.primaryAction.href}
            className="btn-primary flex-1 text-center py-2 text-sm"
          >
            {roleContent.primaryAction.label}
          </a>
          <a
            href={roleContent.secondaryAction.href}
            className="btn-outline flex-1 text-center py-2 text-sm"
          >
            {roleContent.secondaryAction.label}
          </a>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;