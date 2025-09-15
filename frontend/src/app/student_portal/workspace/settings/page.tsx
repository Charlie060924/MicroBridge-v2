"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, RotateCcw, LogOut } from 'lucide-react';
import PersonalInfoSection from './sections/PersonalInfoSection';
import SecurityAccountSection from './sections/SecurityAccountSection';
import NotificationSettingsSection from './sections/NotificationSettingsSection';
import AppearanceSettingsSection from './sections/AppearanceSettingsSection';
import HelpSupportSection from './sections/HelpSupportSection';
import { useSettings } from './hooks/useSettings';
import { useSettingsShortcuts } from '@/hooks/useKeyboardShortcuts';
import StickyActionBar, { SettingsActionBar } from '@/components/common/StickyActionBar';
import { animations } from '@/components/ui/Animations';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

// Import Phase 2 VerificationDiscoveryHub
import dynamic from 'next/dynamic';
const VerificationDiscoveryHub = dynamic(() => import("@/components/common/VerificationDiscoveryHub"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
  ssr: false
});

export default function SettingsPage() {
  const { settings, saveSettings, resetSettings, isLoading, hasChanges, isSettingsLoaded } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      // Show success message or toast
    } catch (error) {
      // console.error('Failed to save settings:', error);
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

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out? You will be redirected to the preview mode.')) {
      logout();
      router.push('/');
    }
  };

  // Keyboard shortcuts
  useSettingsShortcuts({
    onSave: handleSaveAll,
    onReset: handleReset,
    onClose: () => window.history.back()
  });

  // Simplified animations for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account, security, and platform preferences
              </p>
            </div>
          </div>
          
          {/* Unsaved Changes Indicator */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full border border-yellow-200 dark:border-yellow-800"
            >
              Unsaved Changes
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions Banner */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your profile and explore opportunities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => router.push('/student_portal/workspace/profile')}
                variant="secondary"
                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => router.push('/student_portal/workspace/jobs')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Browse Jobs
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Phase 2: Verification & Discovery Hub */}
        <motion.div variants={itemVariants}>
          <VerificationDiscoveryHub userType="student" />
        </motion.div>

        {/* Settings Sections */}
        {isSettingsLoaded ? (
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Basic account information and contact details
                </p>
              </div>
              <PersonalInfoSection onSaveAll={handleSaveAll} isSaving={isSaving} hasChanges={hasChanges} />
            </div>

          {/* Account & Security */}
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Account & Security
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security and privacy settings
              </p>
            </div>
            <SecurityAccountSection onSaveAll={handleSaveAll} isSaving={isSaving} hasChanges={hasChanges} />
          </div>

          {/* Notifications */}
          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Notifications
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control how you receive updates and alerts
              </p>
            </div>
            <NotificationSettingsSection />
          </div>

          {/* Appearance */}
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Appearance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize the look and feel of your interface
              </p>
            </div>
            <AppearanceSettingsSection />
          </div>

          {/* Help & Support */}
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Help & Support
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get help and learn about our policies
              </p>
            </div>
            <HelpSupportSection onSaveAll={handleSaveAll} isSaving={isSaving} hasChanges={hasChanges} />
          </div>
        </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Actions */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-center space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Actions
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Reset Button */}
                <Button
                  onClick={handleReset}
                  disabled={isLoading}
                  variant="secondary"
                  icon={RotateCcw}
                  className="w-full sm:w-auto"
                >
                  Reset All Settings
                </Button>

                {/* Sign Out Button */}
                <Button
                  onClick={handleSignOut}
                  icon={LogOut}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  Sign Out
                </Button>
              </div>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your settings are automatically saved. For any issues, visit our{' '}
                  <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Help Centre
                  </a>{' '}
                  or contact support.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  MicroBridge - Connecting Hong Kong students with opportunities
                </p>
              </div>
            </div>
          </div>
        </motion.div>
       </motion.div>
       
       {/* Sticky Action Bar */}
       <SettingsActionBar
         isVisible={hasChanges}
         onSave={handleSaveAll}
         onReset={handleReset}
         isSaving={isSaving}
         hasChanges={hasChanges}
       />
     </div>
   );
 }