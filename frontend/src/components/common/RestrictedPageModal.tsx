"use client";

import React from "react";
import { Lock, X, LogIn } from "lucide-react";
import { usePreviewMode } from "@/context/PreviewModeContext";
import { useRouter } from "next/navigation";
import { NavigationMemory } from "@/utils/navigationMemory";

interface RestrictedPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const RestrictedPageModal: React.FC<RestrictedPageModalProps> = ({
  isOpen,
  onClose,
  feature
}) => {
  const { previewType } = usePreviewMode();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignIn = () => {
    // Save current location for navigation memory
    NavigationMemory.saveState({
      origin: window.location.pathname,
      scrollPosition: window.scrollY,
    });

    // Navigate to sign in page
    const signInPath = previewType === 'student' ? '/auth/signin' : '/auth/employer-signin';
    router.push(signInPath);
  };

  const getFeatureMessage = () => {
    const messages = {
      current_projects: "Current Projects",
      billing: "Billing & Subscriptions",
      level_system: "Level System & Achievements",
      profile: "Profile Settings",
      default: "this feature"
    };

    return messages[feature as keyof typeof messages] || messages.default;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="h-6 w-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Feature Restricted
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please sign in to access {getFeatureMessage()}.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignIn}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestrictedPageModal;
