"use client";

import React from "react";
import { Star, Award, Calendar, User, Briefcase } from "lucide-react";

interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    userType: string;
  };
  reviewee: {
    id: string;
    name: string;
    userType: string;
  };
  job: {
    id: string;
    title: string;
  };
  rating: number;
  comment: string;
  categoryRatings: CategoryRatings;
  overallRating: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryRatings {
  clearRequirements?: number;
  professionalism?: number;
  paymentReliability?: number;
  qualityOfWork?: number;
  communication?: number;
  timeliness?: number;
}

interface ReviewDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  badges: string[];
  userType: "student" | "employer";
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown,
  badges,
  userType,
}) => {
  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const stars = [];
    const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${
            i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const renderCategoryRating = (category: string, value: number, label: string) => {
    if (!value) return null;
    
    return (
      <div key={category} className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}:</span>
        {renderStars(value, "sm")}
        <span className="text-gray-900 dark:text-gray-100 font-medium">{value}/5</span>
      </div>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      clearRequirements: "Clear Requirements",
      professionalism: "Professionalism",
      paymentReliability: "Payment Reliability",
      qualityOfWork: "Quality of Work",
      communication: "Communication",
      timeliness: "Timeliness",
    };
    return labels[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Reviews & Ratings
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(averageRating, "md")}
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                >
                  <Award className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingBreakdown[`${stars === 5 ? "five" : stars === 4 ? "four" : stars === 3 ? "three" : stars === 2 ? "two" : "one"}Star` as keyof typeof ratingBreakdown];
            const percentage = getRatingPercentage(count);
            
            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{stars}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Reviews
        </h4>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {review.reviewer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {review.reviewer.userType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating, "sm")}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Job Info */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">{review.job.title}</span>
                  </div>
                </div>

                {/* Category Ratings */}
                {Object.entries(review.categoryRatings).some(([_, value]) => value > 0) && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Detailed Ratings
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(review.categoryRatings).map(([category, value]) =>
                        renderCategoryRating(category, value, getCategoryLabel(category))
                      )}
                    </div>
                  </div>
                )}

                {/* Comment */}
                {review.comment && (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                )}

                {/* Visibility Notice */}
                {!review.isVisible && (
                  <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      This review will be visible once both parties have submitted their reviews or after 14 days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDisplay;
