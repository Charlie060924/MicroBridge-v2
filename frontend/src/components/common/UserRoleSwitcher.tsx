"use client";
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const UserRoleSwitcher: React.FC = () => {
  const { user, logout } = useAuth();

  const switchToEmployer = () => {
    localStorage.setItem('mock_user_role', 'employer');
    // Force reload to update the user context
    window.location.reload();
  };

  const switchToStudent = () => {
    localStorage.setItem('mock_user_role', 'student');
    // Force reload to update the user context
    window.location.reload();
  };

  const switchToNone = () => {
    localStorage.setItem('mock_user_role', 'none');
    // Force reload to update the user context
    window.location.reload();
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-30">
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        Current: {user?.role || 'None'}
      </div>
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={switchToStudent}
          className={`px-2 py-1 text-xs rounded ${
            user?.role === 'student'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Student
        </button>
        <button
          onClick={switchToEmployer}
          className={`px-2 py-1 text-xs rounded ${
            user?.role === 'employer'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Employer
        </button>
        <button
          onClick={switchToNone}
          className={`px-2 py-1 text-xs rounded ${
            !user
              ? 'bg-gray-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          None
        </button>
      </div>
    </div>
  );
};

export default UserRoleSwitcher;
