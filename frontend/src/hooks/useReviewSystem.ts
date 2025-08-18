import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockReviewService, MockReview, MockJob } from '@/services/mockReviewService';
import { ReviewData } from '@/components/reviews/ReviewModal';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  user: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
  job: (jobId: string) => [...reviewKeys.all, 'job', jobId] as const,
  stats: (userId: string) => [...reviewKeys.all, 'stats', userId] as const,
  pending: (userId: string) => [...reviewKeys.all, 'pending', userId] as const,
  workingProjects: (employerId: string) => [...reviewKeys.all, 'working', employerId] as const,
  completedProjects: (employerId: string) => [...reviewKeys.all, 'completed', employerId] as const,
};

// Hook to get user reviews
export const useUserReviews = (userId: string, limit = 10, offset = 0) => {
  return useQuery({
    queryKey: reviewKeys.user(userId),
    queryFn: () => mockReviewService.getUserReviews(userId, limit, offset),
    enabled: !!userId,
  });
};

// Hook to get job reviews
export const useJobReviews = (jobId: string) => {
  return useQuery({
    queryKey: reviewKeys.job(jobId),
    queryFn: () => mockReviewService.getJobReviews(jobId),
    enabled: !!jobId,
  });
};

// Hook to get user review stats
export const useUserReviewStats = (userId: string) => {
  return useQuery({
    queryKey: reviewKeys.stats(userId),
    queryFn: () => mockReviewService.getUserReviewStats(userId),
    enabled: !!userId,
  });
};

// Hook to check if user has reviewed a job
export const useHasUserReviewedJob = (jobId: string, userId: string) => {
  return useQuery({
    queryKey: [...reviewKeys.job(jobId), 'hasReviewed', userId],
    queryFn: () => mockReviewService.hasUserReviewedJob(jobId, userId),
    enabled: !!jobId && !!userId,
  });
};

// Hook to get working projects
export const useWorkingProjects = (employerId: string) => {
  return useQuery({
    queryKey: reviewKeys.workingProjects(employerId),
    queryFn: () => mockReviewService.getWorkingProjects(employerId),
    enabled: !!employerId,
  });
};

// Hook to get completed projects
export const useCompletedProjects = (employerId: string) => {
  return useQuery({
    queryKey: reviewKeys.completedProjects(employerId),
    queryFn: () => mockReviewService.getCompletedProjects(employerId),
    enabled: !!employerId,
  });
};

// Hook to get pending reviews
export const usePendingReviews = (userId: string) => {
  return useQuery({
    queryKey: reviewKeys.pending(userId),
    queryFn: () => mockReviewService.getPendingReviews(userId),
    enabled: !!userId,
  });
};

// Hook to create a review with optimistic updates
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: ReviewData) => mockReviewService.createReview(reviewData),
    onMutate: async (newReview) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: reviewKeys.user(newReview.revieweeId) });
      await queryClient.cancelQueries({ queryKey: reviewKeys.stats(newReview.revieweeId) });

      // Snapshot the previous value
      const previousUserReviews = queryClient.getQueryData(reviewKeys.user(newReview.revieweeId));
      const previousStats = queryClient.getQueryData(reviewKeys.stats(newReview.revieweeId));

      // Optimistically update user reviews
      queryClient.setQueryData(reviewKeys.user(newReview.revieweeId), (old: any) => {
        if (!old) return old;
        
        const newReviewWithData: MockReview = {
          id: `temp-${Date.now()}`,
          jobId: newReview.jobId,
          reviewerId: newReview.reviewerId,
          revieweeId: newReview.revieweeId,
          rating: newReview.rating,
          comment: newReview.comment,
          categoryRatings: newReview.categoryRatings,
          anonymous: newReview.anonymous,
          isVisible: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reviewer: {
            id: newReview.reviewerId,
            name: newReview.anonymous ? 'Anonymous' : 'You',
            userType: 'employer'
          },
          reviewee: {
            id: newReview.revieweeId,
            name: 'Student',
            userType: 'student'
          },
          job: {
            id: newReview.jobId,
            title: 'Project',
            company: 'Company'
          }
        };

        return {
          ...old,
          reviews: [newReviewWithData, ...old.reviews],
          total: old.total + 1,
          totalReviews: old.totalReviews + 1
        };
      });

      // Optimistically update stats
      queryClient.setQueryData(reviewKeys.stats(newReview.revieweeId), (old: any) => {
        if (!old) return old;
        
        const newTotalReviews = old.totalReviews + 1;
        const newTotalRating = (old.averageRating * old.totalReviews) + newReview.rating;
        const newAverageRating = newTotalRating / newTotalReviews;

        return {
          ...old,
          averageRating: Math.round(newAverageRating * 10) / 10,
          totalReviews: newTotalReviews,
          ratingBreakdown: {
            ...old.ratingBreakdown,
            [newReview.rating]: (old.ratingBreakdown[newReview.rating] || 0) + 1
          }
        };
      });

      return { previousUserReviews, previousStats };
    },
    onError: (err, newReview, context) => {
      // Rollback on error
      if (context?.previousUserReviews) {
        queryClient.setQueryData(reviewKeys.user(newReview.revieweeId), context.previousUserReviews);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(reviewKeys.stats(newReview.revieweeId), context.previousStats);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: reviewKeys.user(variables.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats(variables.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.job(variables.jobId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.pending(variables.reviewerId) });
    },
  });
};

// Hook to complete a job
export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, userId }: { jobId: string; userId: string }) => 
      mockReviewService.completeJob(jobId, userId),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: reviewKeys.workingProjects(variables.userId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.completedProjects(variables.userId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.pending(variables.userId) });
    },
  });
};

// Hook to update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData, userId }: { 
      reviewId: string; 
      reviewData: ReviewData; 
      userId: string; 
    }) => mockReviewService.updateReview(reviewId, reviewData, userId),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: reviewKeys.user(variables.reviewData.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats(variables.reviewData.revieweeId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.job(variables.reviewData.jobId) });
    },
  });
};

// Hook to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, userId }: { reviewId: string; userId: string }) => 
      mockReviewService.deleteReview(reviewId, userId),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

// Hook to flag a review
export const useFlagReview = () => {
  return useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason: string }) => 
      mockReviewService.flagReview(reviewId, reason),
  });
};

// Prefetch hook for better UX
export const usePrefetchReviews = () => {
  const queryClient = useQueryClient();

  const prefetchUserReviews = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: reviewKeys.user(userId),
      queryFn: () => mockReviewService.getUserReviews(userId),
    });
  };

  const prefetchJobReviews = (jobId: string) => {
    queryClient.prefetchQuery({
      queryKey: reviewKeys.job(jobId),
      queryFn: () => mockReviewService.getJobReviews(jobId),
    });
  };

  const prefetchWorkingProjects = (employerId: string) => {
    queryClient.prefetchQuery({
      queryKey: reviewKeys.workingProjects(employerId),
      queryFn: () => mockReviewService.getWorkingProjects(employerId),
    });
  };

  return {
    prefetchUserReviews,
    prefetchJobReviews,
    prefetchWorkingProjects,
  };
};
