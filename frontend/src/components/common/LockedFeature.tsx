"use client";

import React, { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { usePreviewMode } from "@/context/PreviewModeContext";
import { useRouter } from "next/navigation";
import { NavigationMemory } from "@/utils/navigationMemory";

interface LockedFeatureProps {
  feature: string;
  children?: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
  message?: string;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({
  feature,
  children,
  className = "",
  showOverlay = true,
  message
}) => {
  const { isPreviewMode, previewType, isFeatureLocked } = usePreviewMode();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const isLocked = isFeatureLocked(feature);

  if (!isPreviewMode || !isLocked) {
    return <div className={className}>{children}</div>;
  }

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

  const getDefaultMessage = () => {
    const messages = {
      apply_job: "Sign in to apply for this job",
      bookmark_job: "Sign in to bookmark this job",
      send_message: "Sign in to send messages",
      update_profile: "Sign in to update your profile",
      view_applications: "Sign in to view applications",
      earn_points: "Sign in to earn points",
      access_premium_features: "Sign in to access premium features",
      post_job: "Sign in to post a job",
      view_applications_employer: "Sign in to view applications",
      update_company_profile: "Sign in to update company profile",
      access_analytics: "Sign in to access analytics",
      recommended_jobs: "Sign in to see personalized job recommendations",
      ongoing_projects: "Sign in to view your current projects",
      candidate_recommendations: "Sign in to view candidate recommendations",
      job_management: "Sign in to manage your job postings",
      analytics: "Sign in to access analytics dashboard"
    };

    return message || messages[feature as keyof typeof messages] || "Sign in to use this feature";
  };

  if (showOverlay) {
    return (
      <div 
        className={`relative ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        <div className={`absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
        }`}>
          <div className="text-center p-4 transform transition-all duration-300 ease-in-out">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2 transition-transform duration-300 ease-in-out hover:scale-110" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {getDefaultMessage()}
            </p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-md ${className}`}>
      <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-transform duration-300 ease-in-out hover:scale-110" />
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {getDefaultMessage()}
      </p>
      <button
        onClick={handleSignIn}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </button>
    </div>
  );
};

export default LockedFeature;
