"use client";

import React, { useState } from 'react';
import ReviewModal from '@/components/reviews/ReviewModal';
import { useCreateReview, useUserReviews, useWorkingProjects } from '@/hooks/useReviewSystem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const TestReviewSystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Review System Test Page
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review Modal Test */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Review Modal Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test the review modal with different scenarios
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedProject({
                      id: 'test-1',
                      title: 'Frontend Developer for E-commerce Platform',
                      studentName: 'Alex Chen'
                    });
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Test Review Modal (Employer → Student)
                </button>
                
                <button
                  onClick={() => {
                    setSelectedProject({
                      id: 'test-2',
                      title: 'UI/UX Design Project',
                      studentName: 'Sarah Kim'
                    });
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Test Review Modal (Student → Employer)
                </button>
              </div>
            </div>

            {/* Working Projects Test */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Working Projects Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test the working projects component with mock data
              </p>
              
              <WorkingProjectsTest />
            </div>

            {/* User Reviews Test */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                User Reviews Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test fetching and displaying user reviews
              </p>
              
              <UserReviewsTest />
            </div>

            {/* Review Stats Test */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Review Statistics Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test review statistics and analytics
              </p>
              
              <ReviewStatsTest />
            </div>
          </div>

          {/* Review Modal */}
          {isModalOpen && selectedProject && (
            <ReviewModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedProject(null);
              }}
              onSubmit={async (reviewData) => {
                console.log('Review submitted:', reviewData);
                alert('Review submitted successfully! Check console for details.');
                setIsModalOpen(false);
                setSelectedProject(null);
              }}
              jobTitle={selectedProject.title}
              revieweeName={selectedProject.studentName}
              reviewerRole="employer"
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
};

// Working Projects Test Component
const WorkingProjectsTest = () => {
  const { data: projects, isLoading, error } = useWorkingProjects('employer-1');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Found {projects?.length || 0} working projects
      </div>
      {projects?.map((project: any) => (
        <div key={project.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="font-medium text-gray-900 dark:text-white">
            {project.title}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Status: {project.status}
          </div>
        </div>
      ))}
    </div>
  );
};

// User Reviews Test Component
const UserReviewsTest = () => {
  const { data: reviews, isLoading, error } = useUserReviews('student-1', 5, 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading reviews: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {reviews?.totalReviews || 0} total reviews, 
        Average: {reviews?.averageRating || 0}/5
      </div>
      {reviews?.reviews?.slice(0, 3).map((review: any) => (
        <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-gray-900 dark:text-white">
              {review.job.title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {review.rating}/5 ⭐
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            "{review.comment.substring(0, 100)}..."
          </div>
        </div>
      ))}
    </div>
  );
};

// Review Stats Test Component
const ReviewStatsTest = () => {
  const { data: stats, isLoading, error } = useUserReviewStats('student-1');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading stats: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.averageRating || 0}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Average Rating
          </div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats?.totalReviews || 0}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Total Reviews
          </div>
        </div>
      </div>
      
      {stats?.ratingBreakdown && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Rating Breakdown:
          </div>
          {Object.entries(stats.ratingBreakdown).map(([rating, count]) => (
            <div key={rating} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {rating} ⭐
              </span>
              <span className="text-gray-900 dark:text-white">
                {count} reviews
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestReviewSystem;
