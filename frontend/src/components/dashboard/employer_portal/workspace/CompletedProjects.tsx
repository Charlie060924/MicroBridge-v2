"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Star, 
  MessageSquare, 
  Calendar,
  User,
  DollarSign,
  ExternalLink,
  Clock,
  Eye,
  Edit
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import ReviewModal, { ReviewData } from '@/components/reviews/ReviewModal';

interface CompletedProject {
  id: string;
  jobId: string;
  title: string;
  studentName: string;
  studentId: string;
  completedDate: string;
  salary: number;
  duration: string;
  hasSubmittedReview: boolean;
  hasReceivedReview: boolean;
  reviewDueDate?: string;
  reviewWindowExpired: boolean;
  studentRating?: number;
  studentComment?: string;
}

const CompletedProjects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    project: CompletedProject | null;
  }>({ isOpen: false, project: null });
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Mock data - replace with API call
  useEffect(() => {
    const mockProjects: CompletedProject[] = [
      {
        id: '1',
        jobId: 'job-1',
        title: 'Frontend Developer for E-commerce Platform',
        studentName: 'Alex Chen',
        studentId: 'student-1',
        completedDate: '2024-01-20',
        salary: 2500,
        duration: '4 weeks',
        hasSubmittedReview: true,
        hasReceivedReview: true,
        studentRating: 5,
        studentComment: 'Great communication and clear requirements. Would definitely work together again!'
      },
      {
        id: '2',
        jobId: 'job-2',
        title: 'UI/UX Design for Mobile App',
        studentName: 'Sarah Kim',
        studentId: 'student-2',
        completedDate: '2024-01-18',
        salary: 1800,
        duration: '3 weeks',
        hasSubmittedReview: false,
        hasReceivedReview: true,
        reviewDueDate: '2024-02-01',
        reviewWindowExpired: false,
        studentRating: 4,
        studentComment: 'Professional and delivered on time. Good experience overall.'
      },
      {
        id: '3',
        jobId: 'job-3',
        title: 'Backend API Development',
        studentName: 'Michael Wong',
        studentId: 'student-3',
        completedDate: '2024-01-15',
        salary: 3200,
        duration: '6 weeks',
        hasSubmittedReview: true,
        hasReceivedReview: false,
        reviewWindowExpired: true
      }
    ];

    setProjects(mockProjects);
    setIsLoading(false);
  }, []);

  const handleLeaveReview = (project: CompletedProject) => {
    setReviewModal({ isOpen: true, project });
  };

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    // Mock API call to submit review
    console.log('Submitting review:', reviewData);
    
    // Update project to show review submitted
    setProjects(prev => 
      prev.map(p => 
        p.id === reviewModal.project?.id 
          ? { ...p, hasSubmittedReview: true }
          : p
      )
    );
    
    setReviewModal({ isOpen: false, project: null });
  };

  const handleViewProject = (project: CompletedProject) => {
    router.push(`/employer_portal/workspace/projects/${project.id}`);
  };

  const handleRehire = (project: CompletedProject) => {
    // Navigate to create new job with pre-filled student info
    router.push(`/employer_portal/workspace/manage-jobs/create?rehire=${project.studentId}`);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const stars = [];
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Completed Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your completed projects and leave feedback
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {projects.length} Completed
          </Badge>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{project.studentName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Completed {new Date(project.completedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${project.salary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Status */}
            <div className="mb-4">
              {!project.hasSubmittedReview && !project.reviewWindowExpired && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                          Review Due Soon
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Please leave a review for {project.studentName}
                        </p>
                      </div>
                    </div>
                    {project.reviewDueDate && (
                      <div className="text-right">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Due: {new Date(project.reviewDueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!project.hasSubmittedReview && project.reviewWindowExpired && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Review Window Expired
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The review period has ended for this project
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {project.hasSubmittedReview && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                        Review Submitted
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Thank you for your feedback
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Review (if received) */}
            {project.hasReceivedReview && project.studentRating && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Review from {project.studentName}
                      </span>
                      {renderStars(project.studentRating, 'sm')}
                    </div>
                    {project.studentComment && (
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        "{project.studentComment}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProject(project)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRehire(project)}
                >
                  <User className="w-4 h-4 mr-1" />
                  Rehire {project.studentName}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                {!project.hasSubmittedReview && !project.reviewWindowExpired && (
                  <Button
                    size="sm"
                    onClick={() => handleLeaveReview(project)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Leave Review
                  </Button>
                )}

                {project.hasSubmittedReview && (
                  <Badge variant="outline" className="text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Review Submitted
                  </Badge>
                )}

                {project.reviewWindowExpired && !project.hasSubmittedReview && (
                  <Badge variant="outline" className="text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Review Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No completed projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete your first project to see it here and leave reviews.
          </p>
          <Button onClick={() => router.push('/employer_portal/workspace/manage-jobs')}>
            Post a Job
          </Button>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.isOpen && reviewModal.project && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, project: null })}
          onSubmit={handleReviewSubmit}
          jobTitle={reviewModal.project.title}
          revieweeName={reviewModal.project.studentName}
          reviewerRole="employer"
        />
      )}
    </div>
  );
};

export default CompletedProjects;
