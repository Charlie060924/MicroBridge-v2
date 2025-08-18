"use client";

import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Clock, Shield, Check } from 'lucide-react';
import Button from '@/components/common/ui/Button';
import Badge from '@/components/common/ui/Badge';

export interface ReviewData {
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  categoryRatings: CategoryRatings;
  anonymous: boolean;
}

export interface CategoryRatings {
  // For students reviewing employers
  clearRequirements?: number;
  professionalism?: number;
  paymentReliability?: number;
  
  // For employer reviews (reviewing students)
  qualityOfWork?: number;
  communication?: number;
  timeliness?: number;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => Promise<void>;
  jobTitle: string;
  revieweeName: string;
  reviewerRole: 'student' | 'employer';
  isLoading?: boolean;
  existingReview?: ReviewData | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
  revieweeName,
  reviewerRole,
  isLoading = false,
  existingReview = null
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>(
    existingReview?.categoryRatings || {}
  );
  const [anonymous, setAnonymous] = useState(existingReview?.anonymous || false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showCategories, setShowCategories] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
        setCategoryRatings(existingReview.categoryRatings);
        setAnonymous(existingReview.anonymous);
      } else {
        setRating(0);
        setComment('');
        setCategoryRatings({});
        setAnonymous(false);
      }
    }
  }, [isOpen, existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const reviewData: ReviewData = {
      jobId: existingReview?.jobId || '',
      reviewerId: existingReview?.reviewerId || '',
      revieweeId: existingReview?.revieweeId || '',
      rating,
      comment,
      categoryRatings,
      anonymous
    };

    await onSubmit(reviewData);
  };

  const getCategoryLabels = () => {
    if (reviewerRole === 'student') {
      return [
        { key: 'clearRequirements', label: 'Clear Requirements', icon: '📋' },
        { key: 'professionalism', label: 'Professionalism', icon: '👔' },
        { key: 'paymentReliability', label: 'Payment Reliability', icon: '💰' }
      ];
    } else {
      return [
        { key: 'qualityOfWork', label: 'Quality of Work', icon: '✨' },
        { key: 'communication', label: 'Communication', icon: '💬' },
        { key: 'timeliness', label: 'Timeliness', icon: '⏰' }
      ];
    }
  };

  const updateCategoryRating = (category: string, value: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const renderStars = (value: number, onChange: (rating: number) => void, size: 'sm' | 'md' = 'md') => {
    const stars = [];
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`${starSize} transition-colors ${
            i <= (hoveredRating || value) ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      );
    }
    
    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave a Review
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {revieweeName} — {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center space-x-2">
              {renderStars(rating, setRating)}
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <button
              type="button"
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Detailed Ratings {showCategories ? '(Optional)' : ''}
              <span className={`ml-2 transition-transform ${showCategories ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showCategories && (
              <div className="mt-4 space-y-4 pl-6">
                {getCategoryLabels().map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(
                        categoryRatings[key as keyof CategoryRatings] || 0,
                        (value) => updateCategoryRating(key, value),
                        'sm'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Share your experience working together..."
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
              Submit anonymously
            </label>
            <Shield className="w-4 h-4 text-gray-400" />
          </div>

          {/* Double-blind Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Double-blind Review System
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your review will be hidden until both parties submit their reviews or 14 days pass. 
                  This helps ensure honest feedback and reduces retaliation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || isLoading}
              loading={isLoading}
            >
              {existingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
