// Mock Review Service for frontend testing
// This simulates the complete review workflow without backend dependencies

import { ReviewData, CategoryRatings } from '@/components/reviews/ReviewModal';

export interface MockReview {
  id: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  categoryRatings: CategoryRatings;
  anonymous: boolean;
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

export interface MockJob {
  id: string;
  title: string;
  status: 'draft' | 'posted' | 'hired' | 'in_progress' | 'submitted' | 'review_pending' | 'completed' | 'disputed' | 'archived';
  employerId: string;
  hiredStudentId?: string;
  reviewDueDate?: string;
  completedAt?: string;
}

export interface MockUser {
  id: string;
  name: string;
  userType: 'student' | 'employer';
  averageRating: number;
  totalReviews: number;
}

// In-memory storage for mock data
class MockReviewService {
  private reviews: MockReview[] = [];
  private jobs: MockJob[] = [];
  private users: MockUser[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock users
    this.users = [
      {
        id: 'employer-1',
        name: 'TechCorp Inc.',
        userType: 'employer',
        averageRating: 4.8,
        totalReviews: 15
      },
      {
        id: 'student-1',
        name: 'Alex Chen',
        userType: 'student',
        averageRating: 4.9,
        totalReviews: 8
      },
      {
        id: 'student-2',
        name: 'Sarah Kim',
        userType: 'student',
        averageRating: 4.7,
        totalReviews: 12
      },
      {
        id: 'student-3',
        name: 'Michael Wong',
        userType: 'student',
        averageRating: 4.6,
        totalReviews: 5
      }
    ];

    // Mock jobs
    this.jobs = [
      {
        id: 'job-1',
        title: 'Frontend Developer for E-commerce Platform',
        status: 'completed',
        employerId: 'employer-1',
        hiredStudentId: 'student-1',
        completedAt: '2024-01-20T00:00:00Z',
        reviewDueDate: '2024-02-03T00:00:00Z'
      },
      {
        id: 'job-2',
        title: 'UI/UX Design for Mobile App',
        status: 'review_pending',
        employerId: 'employer-1',
        hiredStudentId: 'student-2',
        completedAt: '2024-01-18T00:00:00Z',
        reviewDueDate: '2024-02-01T00:00:00Z'
      },
      {
        id: 'job-3',
        title: 'Backend API Development',
        status: 'completed',
        employerId: 'employer-1',
        hiredStudentId: 'student-3',
        completedAt: '2024-01-15T00:00:00Z',
        reviewDueDate: '2024-01-29T00:00:00Z'
      }
    ];

    // Mock reviews
    this.reviews = [
      {
        id: 'review-1',
        jobId: 'job-1',
        reviewerId: 'employer-1',
        revieweeId: 'student-1',
        rating: 5,
        comment: 'Excellent work quality and communication. Alex delivered beyond expectations and was very professional throughout the project.',
        categoryRatings: {
          qualityOfWork: 5,
          communication: 5,
          timeliness: 5
        },
        anonymous: false,
        isVisible: true,
        createdAt: '2024-01-22T10:30:00Z',
        updatedAt: '2024-01-22T10:30:00Z',
        reviewer: this.users[0],
        reviewee: this.users[1],
        job: {
          id: 'job-1',
          title: 'Frontend Developer for E-commerce Platform',
          company: 'TechCorp Inc.'
        }
      },
      {
        id: 'review-2',
        jobId: 'job-1',
        reviewerId: 'student-1',
        revieweeId: 'employer-1',
        rating: 5,
        comment: 'Great communication and clear requirements. Would definitely work together again!',
        categoryRatings: {
          clearRequirements: 5,
          professionalism: 5,
          paymentReliability: 5
        },
        anonymous: false,
        isVisible: true,
        createdAt: '2024-01-23T14:15:00Z',
        updatedAt: '2024-01-23T14:15:00Z',
        reviewer: this.users[1],
        reviewee: this.users[0],
        job: {
          id: 'job-1',
          title: 'Frontend Developer for E-commerce Platform',
          company: 'TechCorp Inc.'
        }
      }
    ];
  }

  // Get reviews for a specific user
  async getUserReviews(userId: string, limit = 10, offset = 0): Promise<{
    reviews: MockReview[];
    total: number;
    averageRating: number;
    totalReviews: number;
  }> {
    const userReviews = this.reviews.filter(
      review => review.revieweeId === userId && review.isVisible
    );

    const total = userReviews.length;
    const paginatedReviews = userReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);

    const averageRating = userReviews.length > 0
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0;

    return {
      reviews: paginatedReviews,
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: total
    };
  }

  // Get reviews for a specific job
  async getJobReviews(jobId: string): Promise<MockReview[]> {
    return this.reviews.filter(review => review.jobId === jobId && review.isVisible);
  }

  // Check if user has already reviewed a job
  async hasUserReviewedJob(jobId: string, userId: string): Promise<boolean> {
    return this.reviews.some(review => 
      review.jobId === jobId && 
      review.reviewerId === userId
    );
  }

  // Create a new review
  async createReview(reviewData: ReviewData): Promise<MockReview> {
    const job = this.jobs.find(j => j.id === reviewData.jobId);
    const reviewer = this.users.find(u => u.id === reviewData.reviewerId);
    const reviewee = this.users.find(u => u.id === reviewData.revieweeId);

    if (!job || !reviewer || !reviewee) {
      throw new Error('Invalid job, reviewer, or reviewee');
    }

    // Check if user already reviewed this job
    const existingReview = this.reviews.find(r => 
      r.jobId === reviewData.jobId && r.reviewerId === reviewData.reviewerId
    );

    if (existingReview) {
      throw new Error('User has already reviewed this job');
    }

    const newReview: MockReview = {
      id: `review-${Date.now()}`,
      jobId: reviewData.jobId,
      reviewerId: reviewData.reviewerId,
      revieweeId: reviewData.revieweeId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      categoryRatings: reviewData.categoryRatings,
      anonymous: reviewData.anonymous,
      isVisible: false, // Start as hidden for double-blind
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewer: {
        id: reviewer.id,
        name: reviewData.anonymous ? 'Anonymous' : reviewer.name,
        userType: reviewer.userType
      },
      reviewee: {
        id: reviewee.id,
        name: reviewee.name,
        userType: reviewee.userType
      },
      job: {
        id: job.id,
        title: job.title,
        company: 'TechCorp Inc.'
      }
    };

    this.reviews.push(newReview);

    // Check if both parties have reviewed (double-blind logic)
    await this.updateReviewVisibility(reviewData.jobId);

    return newReview;
  }

  // Update review visibility based on double-blind rules
  private async updateReviewVisibility(jobId: string): Promise<void> {
    const jobReviews = this.reviews.filter(r => r.jobId === jobId);
    const job = this.jobs.find(j => j.id === jobId);

    if (!job) return;

    // If both parties have reviewed, make reviews visible
    if (jobReviews.length >= 2) {
      jobReviews.forEach(review => {
        review.isVisible = true;
        review.updatedAt = new Date().toISOString();
      });
    }

    // If 14 days have passed since completion, make single reviews visible
    if (job.completedAt && job.reviewDueDate) {
      const dueDate = new Date(job.reviewDueDate);
      const now = new Date();

      if (now > dueDate) {
        jobReviews.forEach(review => {
          review.isVisible = true;
          review.updatedAt = new Date().toISOString();
        });
      }
    }
  }

  // Mark job as completed (triggers review period)
  async completeJob(jobId: string, userId: string): Promise<MockJob> {
    const job = this.jobs.find(j => j.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    // Check if user is authorized to complete this job
    if (job.employerId !== userId && job.hiredStudentId !== userId) {
      throw new Error('Not authorized to complete this job');
    }

    // Update job status
    job.status = 'review_pending';
    job.completedAt = new Date().toISOString();
    job.reviewDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    return job;
  }

  // Get working projects for an employer
  async getWorkingProjects(employerId: string): Promise<MockJob[]> {
    return this.jobs.filter(job => 
      job.employerId === employerId && 
      ['in_progress', 'submitted', 'review_pending'].includes(job.status)
    );
  }

  // Get completed projects for an employer
  async getCompletedProjects(employerId: string): Promise<MockJob[]> {
    return this.jobs.filter(job => 
      job.employerId === employerId && 
      job.status === 'completed'
    );
  }

  // Get user review statistics
  async getUserReviewStats(userId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: { [key: number]: number };
  }> {
    const userReviews = this.reviews.filter(
      review => review.revieweeId === userId && review.isVisible
    );

    const averageRating = userReviews.length > 0
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
      : 0;

    const ratingBreakdown: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      ratingBreakdown[i] = userReviews.filter(review => review.rating === i).length;
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: userReviews.length,
      ratingBreakdown
    };
  }

  // Update a review (within edit window)
  async updateReview(reviewId: string, reviewData: ReviewData, userId: string): Promise<MockReview> {
    const review = this.reviews.find(r => r.id === reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.reviewerId !== userId) {
      throw new Error('Not authorized to update this review');
    }

    if (review.isVisible) {
      throw new Error('Cannot update visible review');
    }

    // Check if within 24-hour edit window
    const createdAt = new Date(review.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      throw new Error('Edit window has expired');
    }

    // Update review
    review.rating = reviewData.rating;
    review.comment = reviewData.comment;
    review.categoryRatings = reviewData.categoryRatings;
    review.anonymous = reviewData.anonymous;
    review.updatedAt = new Date().toISOString();

    return review;
  }

  // Delete a review
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    const review = this.reviews[reviewIndex];

    if (review.reviewerId !== userId) {
      throw new Error('Not authorized to delete this review');
    }

    if (review.isVisible) {
      throw new Error('Cannot delete visible review');
    }

    this.reviews.splice(reviewIndex, 1);
  }

  // Flag a review for moderation
  async flagReview(_reviewId: string, _reason: string): Promise<void> {
    // In a real implementation, this would create a moderation ticket
    // console.log(`Review ${_reviewId} flagged for moderation: ${_reason}`);
  }

  // Get pending reviews for a user
  async getPendingReviews(userId: string): Promise<MockJob[]> {
    return this.jobs.filter(job => {
      const hasReviewed = this.reviews.some(r => 
        r.jobId === job.id && r.reviewerId === userId
      );
      
      return (job.employerId === userId || job.hiredStudentId === userId) &&
             job.status === 'review_pending' &&
             !hasReviewed;
    });
  }
}

// Export singleton instance
export const mockReviewService = new MockReviewService();
