import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, ReviewData, UserReviewsResponse, JobCompletionResponse } from '@/services/reviewService';
import { useUser } from './useUser';

export const useReviews = (userId?: string) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState<{
    jobId: string;
    revieweeId: string;
    revieweeName: string;
    jobTitle: string;
  } | null>(null);

  // Query for user reviews
  const {
    data: userReviews,
    isLoading: isLoadingReviews,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => reviewService.getUserReviews(userId!),
    enabled: !!userId,
  });

  // Mutation for creating a review
  const createReviewMutation = useMutation({
    mutationFn: (reviewData: ReviewData) => reviewService.createReview(reviewData),
    onSuccess: () => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsReviewModalOpen(false);
      setSelectedJobForReview(null);
    },
  });

  // Mutation for completing a job
  const completeJobMutation = useMutation({
    mutationFn: (jobId: string) => reviewService.completeJob(jobId),
    onSuccess: (data: JobCompletionResponse) => {
      // If review is required, open the review modal
      if (data.requiresReview) {
        // You might need to fetch job details to get reviewee info
        // For now, we'll assume the job completion response includes this info
        console.log('Job completed, review required:', data);
      }
    },
  });

  // Mutation for checking review eligibility
  const checkEligibilityMutation = useMutation({
    mutationFn: (jobId: string) => reviewService.checkReviewEligibility(jobId),
  });

  // Open review modal for a specific job
  const openReviewModal = useCallback((jobId: string, revieweeId: string, revieweeName: string, jobTitle: string) => {
    setSelectedJobForReview({
      jobId,
      revieweeId,
      revieweeName,
      jobTitle,
    });
    setIsReviewModalOpen(true);
  }, []);

  // Close review modal
  const closeReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    setSelectedJobForReview(null);
  }, []);

  // Submit a review
  const submitReview = useCallback((reviewData: ReviewData) => {
    createReviewMutation.mutate(reviewData);
  }, [createReviewMutation]);

  // Complete a job
  const completeJob = useCallback((jobId: string) => {
    completeJobMutation.mutate(jobId);
  }, [completeJobMutation]);

  // Check if user can review a job
  const checkReviewEligibility = useCallback((jobId: string) => {
    return checkEligibilityMutation.mutateAsync(jobId);
  }, [checkEligibilityMutation]);

  return {
    // Data
    userReviews,
    isLoadingReviews,
    reviewsError,
    
    // Modal state
    isReviewModalOpen,
    selectedJobForReview,
    
    // Mutations
    createReviewMutation,
    completeJobMutation,
    checkEligibilityMutation,
    
    // Actions
    openReviewModal,
    closeReviewModal,
    submitReview,
    completeJob,
    checkReviewEligibility,
    refetchReviews,
  };
};

// Hook for managing a single user's reviews
export const useUserReviews = (userId: string) => {
  const {
    data: userReviews,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userReviews', userId],
    queryFn: () => reviewService.getUserReviews(userId),
    enabled: !!userId,
  });

  return {
    userReviews,
    isLoading,
    error,
    refetch,
  };
};

// Hook for review statistics
export const useReviewStats = (userId: string) => {
  const {
    data: reviewStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reviewStats', userId],
    queryFn: () => reviewService.getUserReviewStats(userId),
    enabled: !!userId,
  });

  return {
    reviewStats,
    isLoading,
    error,
  };
};
