// Review service for API calls
// This service handles all review-related API interactions

import { mockReviewService } from './mockReviewService';

// Types for review data
export interface ReviewData {
  reviewerId: string;
  revieweeId: string;
  jobId: string;
  rating: number;
  comment?: string;
  categoryRatings: CategoryRatings;
}

export interface CategoryRatings {
  // For students reviewing employers
  clearRequirements?: number;
  professionalism?: number;
  paymentReliability?: number;
  
  // For employers reviewing students
  qualityOfWork?: number;
  communication?: number;
  timeliness?: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  jobId: string;
  rating: number;
  comment: string;
  categoryRatings: CategoryRatings;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
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
    company: string;
  };
}

export interface UserReviewsResponse {
  userId: string;
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  badges: string[];
  reviews: Review[];
}

export interface JobCompletionResponse {
  jobId: string;
  status: string;
  message: string;
}

export interface ReviewEligibilityResponse {
  eligible: boolean;
  reason?: string;
  jobId?: string;
}

// Use mock service for frontend testing
// In production, this would be replaced with actual API calls
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'; // Unused for now

class ReviewService {
  // Get reviews for a specific user
  async getUserReviews(userId: string, limit: number = 10, offset: number = 0): Promise<UserReviewsResponse> {
    try {
      // Use mock service for frontend testing
      const response = await mockReviewService.getUserReviews(userId, limit, offset);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch reviews');
      }
      
      return response.data;
    } catch {
      // console.error('Error fetching user reviews:', error);
      // Re-throw error for handling upstream
    }
  }

  // Create a new review
  async createReview(reviewData: ReviewData): Promise<Review> {
    try {
      // Use mock service for frontend testing
      const response = await mockReviewService.createReview(reviewData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create review');
      }
      
      return response.data;
    } catch {
      // console.error('Error creating review:', error);
      // Re-throw error for handling upstream
    }
  }

  // Complete a job
  async completeJob(jobId: string): Promise<JobCompletionResponse> {
    try {
      // Use mock service for frontend testing
      const response = await mockReviewService.completeJob(jobId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete job');
      }
      
      return response.data;
    } catch {
      // console.error('Error completing job:', error);
      // Re-throw error for handling upstream
    }
  }

  // Check review eligibility
  async checkReviewEligibility(jobId: string): Promise<ReviewEligibilityResponse> {
    try {
      // Use mock service for frontend testing
      const response = await mockReviewService.checkReviewEligibility(jobId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to check eligibility');
      }
      
      return response.data;
    } catch {
      // console.error('Error checking review eligibility:', error);
      // Re-throw error for handling upstream
    }
  }

  // Get review statistics for a user
  async getUserReviewStats(userId: string): Promise<UserReviewsResponse> {
    try {
      // Use mock service for frontend testing
      const response = await mockReviewService.getUserReviewStats(userId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch review stats');
      }
      
      return response.data;
    } catch {
      // console.error('Error fetching review stats:', error);
      // Re-throw error for handling upstream
    }
  }

  // Get a specific review by ID
  async getReviewById(_reviewId: string): Promise<Review> {
    try {
      // For mock service, we'll need to find the review in the mock data
      // This is a simplified implementation
      throw new Error('getReviewById not implemented in mock service');
    } catch {
      // console.error('Error fetching review by ID:', error);
      // Re-throw error for handling upstream
    }
  }

  // Update a review
  async updateReview(_reviewId: string, _reviewData: Partial<ReviewData>): Promise<Review> {
    try {
      // For mock service, we'll need to implement this
      throw new Error('updateReview not implemented in mock service');
    } catch {
      // console.error('Error updating review:', error);
      // Re-throw error for handling upstream
    }
  }

  // Delete a review
  async deleteReview(_reviewId: string): Promise<void> {
    try {
      // For mock service, we'll need to implement this
      throw new Error('deleteReview not implemented in mock service');
    } catch {
      // console.error('Error deleting review:', error);
      // Re-throw error for handling upstream
    }
  }
}

export const reviewService = new ReviewService();
