"use client";

import React, { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="hidden md:block text-sm font-medium">Alex Johnson</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Johnson</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">alex.johnson@example.com</p>
            </div>
            
            <Link
              href="/student_portal/workspace/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            
            <Link
              href="/student_portal/workspace/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeDropdown}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
              <Link
                href="/auth/signout"
                className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={closeDropdown}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Link>
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