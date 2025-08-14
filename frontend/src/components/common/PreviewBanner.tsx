"use client";

import React, { useState, useEffect } from "react";
import { usePreviewMode } from "@/context/PreviewModeContext";
import { X, AlertCircle } from "lucide-react";

const PreviewBanner: React.FC = () => {
  const { isPreviewMode, previewType, exitPreviewMode } = usePreviewMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isPreviewMode);
  }, [isPreviewMode]);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    // Don't exit preview mode, just hide the banner
  };

  const handleSignIn = () => {
    const signInPath = previewType === 'student' ? '/auth/signin' : '/auth/employer-signin';
    window.location.href = signInPath;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              You are not signed in —{" "}
              <button
                onClick={handleSignIn}
                className="underline hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
              >
                Sign in to unlock full features
              </button>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exitPreviewMode}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            >
              Exit Preview
            </button>
            <button
              onClick={handleClose}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewBanner;
