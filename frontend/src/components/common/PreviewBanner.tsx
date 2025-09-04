"use client";

import React, { useState, useEffect } from "react";
import { usePreviewMode } from "@/context/PreviewModeContext";
import { X, Sparkles, ArrowRight } from "lucide-react";

const PreviewBanner: React.FC = () => {
  const { isPreviewMode, previewType, exitPreviewMode, getDemoData, getABTestVariation } = usePreviewMode();
  const [isVisible, setIsVisible] = useState(false);
  
  const demoData = getDemoData();
  const ctaButton = getABTestVariation('ctaButton');

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

  const handleSignUp = () => {
    // Track conversion
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'preview_banner_signup_clicked', {
        preview_type: previewType,
        cta_variant: ctaButton
      });
    }

    const signUpPath = previewType === 'student' ? '/auth/signup?role=student&from=banner' : '/auth/employer-signup?from=banner';
    window.location.href = signUpPath;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-yellow-300 mr-3 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium">
                You're in preview mode — {demoData?.cta?.secondary || 'Sign up to unlock all features'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSignUp}
              className="bg-white text-primary font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm flex items-center"
            >
              {ctaButton || 'Sign Up Free'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
            <button
              onClick={exitPreviewMode}
              className="text-xs text-white/80 hover:text-white transition-colors px-2"
            >
              Exit Preview
            </button>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1"
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
