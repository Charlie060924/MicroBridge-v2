"use client";

import React from "react";
import { Star, Award } from "lucide-react";
import { useUserReviews } from "@/hooks/useReviews";
import ReviewDisplay from "./ReviewDisplay";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface ReviewsSectionProps {
  userId: string;
  userType: "student" | "employer";
  showHeader?: boolean;
  className?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  userId,
  userType,
  showHeader = true,
  className = "",
}) => {
  const { userReviews, isLoading, error } = useUserReviews(userId);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-32 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Failed to load reviews</p>
      </div>
    );
  }

  if (!userReviews) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No reviews available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reviews & Ratings
          </h2>
          
          {/* Average Rating Badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">
              {userReviews.averageRating.toFixed(1)} ({userReviews.totalReviews})
            </span>
          </div>
        </div>
      )}

      {/* Badges */}
      {userReviews.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {userReviews.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full"
            >
              <Award className="h-3 w-3" />
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Reviews Display */}
      <ReviewDisplay
        reviews={userReviews.reviews}
        averageRating={userReviews.averageRating}
        totalReviews={userReviews.totalReviews}
        ratingBreakdown={userReviews.ratingBreakdown}
        badges={userReviews.badges}
        userType={userType}
      />
    </div>
  );
};

export default ReviewsSection;
