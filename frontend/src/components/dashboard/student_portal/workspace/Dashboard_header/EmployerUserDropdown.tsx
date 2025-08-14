"use client";

import React, { useState } from "react";
import { User, Settings, LogOut, ChevronDown, HelpCircle, TrendingUp, Star, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLevel } from "@/hooks/useLevel";
import { useAuth } from "@/hooks/useAuth";
import { usePreviewMode } from "@/context/PreviewModeContext";

export default function EmployerUserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { levelData } = useLevel();
  const router = useRouter();
  const { logout } = useAuth();
  const { enterPreviewMode } = usePreviewMode();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    closeDropdown();
    logout();
    // Redirect to employer preview mode homepage
    enterPreviewMode("employer");
  };

  // Calculate progress percentage
  const progressPercentage = Math.min((levelData.xp / levelData.xpToNext) * 100, 100);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-2">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Jane Smith</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Employer</p>
              
              {/* Level Progress Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Level {levelData.level}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {levelData.xp}/{levelData.xpToNext} XP
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {/* Clickable Level System Link */}
                <Link
                  href="/employer_portal/workspace/levels"
                  className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  onClick={closeDropdown}
                >
                  <Star className="w-3 h-3" />
                  <span>View Level System</span>
                </Link>
              </div>
            </div>
            
            <Link
              href="/employer_portal/workspace/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            
            <Link
              href="/subscription"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              <FileText className="h-4 w-4 mr-2" />
              Subscription
            </Link>
            
            <Link
              href="/employer_portal/workspace/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
              <Link
                href="/help"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={closeDropdown}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </div>
  );
}
