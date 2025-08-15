"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, GraduationCap, Building, LogOut, ChevronDown } from 'lucide-react';
import { useMockAccount } from '@/context/MockAccountContext';

const UserRoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, isDevelopment } = useMockAccount();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Only show in development mode
  if (!isDevelopment) {
    return null;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'employer':
        return <Building className="h-4 w-4" />;
      case 'none':
        return <LogOut className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'employer':
        return 'Employer';
      case 'none':
        return 'Preview Mode';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      case 'employer':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'none':
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const handleRoleSelect = (role: 'student' | 'employer' | 'none') => {
    switchRole(role);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        {/* Main Button - Responsive */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
            bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200
            ${getRoleColor(currentRole)}
          `}
          aria-label="Switch mock account role"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getRoleIcon(currentRole)}
          <span className="text-xs sm:text-sm font-medium hidden md:inline">
            {getRoleLabel(currentRole)}
          </span>
          <ChevronDown 
            className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu - Responsive */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-50">
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 sm:px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                Mock Account (Dev Only)
              </div>
              
              {/* Role Options */}
              <div className="py-1">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className={`
                    w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md transition-colors
                    ${currentRole === 'student' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  role="menuitem"
                >
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Student</span>
                  {currentRole === 'student' && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>

                <button
                  onClick={() => handleRoleSelect('employer')}
                  className={`
                    w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md transition-colors
                    ${currentRole === 'employer' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  role="menuitem"
                >
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Employer</span>
                  {currentRole === 'employer' && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>

                <button
                  onClick={() => handleRoleSelect('none')}
                  className={`
                    w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md transition-colors
                    ${currentRole === 'none' 
                      ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  role="menuitem"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Preview Mode</span>
                  {currentRole === 'none' && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              </div>

              {/* Current Status */}
              <div className="px-2 sm:px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                Current: {getRoleLabel(currentRole)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleSwitcher;
