"use client";

import React, { useState } from 'react';
import ReviewModal from '@/components/reviews/ReviewModal';

const ReviewDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewerRole, setReviewerRole] = useState<'employer' | 'student'>('employer');

  const handleReviewSubmit = async (reviewData: any) => {
    console.log('Review submitted:', reviewData);
    alert(`Review submitted successfully!\n\nRating: ${reviewData.rating}/5\nComment: ${reviewData.comment}\nAnonymous: ${reviewData.anonymous}\nCategory Ratings: ${JSON.stringify(reviewData.categoryRatings, null, 2)}`);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Review System Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test the review modal with different scenarios
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Review Modal Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reviewer Role
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={reviewerRole === 'employer'}
                      onChange={(e) => setReviewerRole(e.target.value as 'employer' | 'student')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Employer</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={reviewerRole === 'student'}
                      onChange={(e) => setReviewerRole(e.target.value as 'employer' | 'student')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Student</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Open Review Modal
            </button>
            
            <button
              onClick={() => {
                console.log('Review system demo loaded');
                alert('Review system demo is ready! Click "Open Review Modal" to test.');
              }}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Check Console
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              What to Test:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Star ratings (1-5 stars)</li>
              <li>• Category-specific ratings (different for employer vs student)</li>
              <li>• Comment field (10-1000 characters)</li>
              <li>• Anonymous review option</li>
              <li>• Form validation</li>
              <li>• Double-blind information display</li>
              <li>• Submit and see results in console/alert</li>
            </ul>
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
          jobTitle="Frontend Developer for E-commerce Platform"
          revieweeName="Alex Chen"
          reviewerRole={reviewerRole}
        />
      </div>
    </div>
  );
};

export default ReviewDemo;
