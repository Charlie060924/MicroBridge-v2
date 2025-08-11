"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, RotateCcw } from 'lucide-react';
import AccountSettingsSection from './sections/AccountSettingsSection';
import NotificationSettingsSection from './sections/NotificationSettingsSection';
import AppearanceSettingsSection from './sections/AppearanceSettingsSection';
import PrivacySecuritySection from './sections/PrivacySecuritySection';
import OtherSettingsSection from './sections/OtherSettingsSection';
import { useSettings } from './hooks/useSettings';

export default function SettingsPage() {
  const { settings, saveSettings, resetSettings, isLoading, hasChanges } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      // Show success message or toast
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message or toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      resetSettings();
    }
  };

  // Micro-animation variants matching dashboard style
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account preferences and settings
              </p>
            </div>
          </div>
          
          {/* Unsaved Changes Indicator */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full"
            >
              Unsaved Changes
            </motion.div>
          )}
        </motion.div>

        {/* Settings Sections */}
        <motion.div variants={itemVariants} className="space-y-8">
          <AccountSettingsSection onSaveAll={handleSaveAll} isSaving={isSaving} hasChanges={hasChanges} />
          <NotificationSettingsSection />
          <AppearanceSettingsSection />
          <PrivacySecuritySection />
          <OtherSettingsSection />
        </motion.div>

        {/* Bottom Actions */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Settings</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-center">
            <button className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Settings are automatically saved to your browser. For persistent storage across devices, 
              please ensure you're signed in to your account.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}