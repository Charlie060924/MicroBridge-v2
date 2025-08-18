"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { useUser } from "@/hooks/useUser";
import { reviewService } from "@/services/reviewService";

interface LeaveReviewButtonProps {
  jobId: string;
  revieweeId: string;
  revieweeName: string;
  jobTitle: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const LeaveReviewButton: React.FC<LeaveReviewButtonProps> = ({
  jobId,
  revieweeId,
  revieweeName,
  jobTitle,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const { user } = useUser();
  const { openReviewModal, checkReviewEligibility } = useReviews();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check eligibility when component mounts
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setIsLoading(true);
        const eligibility = await checkReviewEligibility(jobId);
        setIsEligible(eligibility.eligible);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        setIsEligible(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && jobId) {
      checkEligibility();
    }
  }, [jobId, user, checkReviewEligibility]);

  const handleClick = () => {
    if (isEligible) {
      openReviewModal(jobId, revieweeId, revieweeName, jobTitle);
    }
  };

  // Don't render if user is not eligible or still loading
  if (isLoading || isEligible === false) {
    return null;
  }

  // Don't render if user is reviewing themselves
  if (user?.id === revieweeId) {
    return null;
  }

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonClasses()}
      disabled={isLoading}
    >
      <Star className="h-4 w-4" />
      <span>Leave Review</span>
    </button>
  );
};

export default LeaveReviewButton;
