"use client";

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  Star,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface WorkingProject {
  id: string;
  jobId: string;
  title: string;
  studentName: string;
  studentId: string;
  hireDate: string;
  status: 'in_progress' | 'submitted' | 'review_pending' | 'completed';
  progress: number;
  messagesCount: number;
  lastActivity: string;
  reviewDueDate?: string;
  hasSubmittedReview: boolean;
  salary: number;
  duration: string;
}

const WorkingProjectsSimple: React.FC = () => {
  const [projects, setProjects] = useState<WorkingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockProjects: WorkingProject[] = [
      {
        id: '1',
        jobId: 'job-1',
        title: 'Frontend Developer for E-commerce Platform',
        studentName: 'Alex Chen',
        studentId: 'student-1',
        hireDate: '2024-01-15',
        status: 'in_progress',
        progress: 65,
        messagesCount: 12,
        lastActivity: '2 hours ago',
        salary: 2500,
        duration: '4 weeks'
      },
      {
        id: '2',
        jobId: 'job-2',
        title: 'UI/UX Design for Mobile App',
        studentName: 'Sarah Kim',
        studentId: 'student-2',
        hireDate: '2024-01-10',
        status: 'submitted',
        progress: 100,
        messagesCount: 8,
        lastActivity: '1 day ago',
        salary: 1800,
        duration: '3 weeks'
      },
      {
        id: '3',
        jobId: 'job-3',
        title: 'Backend API Development',
        studentName: 'Michael Wong',
        studentId: 'student-3',
        hireDate: '2024-01-05',
        status: 'review_pending',
        progress: 100,
        messagesCount: 15,
        lastActivity: '3 days ago',
        reviewDueDate: '2024-02-05',
        hasSubmittedReview: false,
        salary: 3200,
        duration: '6 weeks'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: WorkingProject['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 
      case 'review_pending':
        return 'bg-purple-100 text-purple-800 
      case 'completed':
        return 'bg-green-100 text-green-800 
      default:
        return 'bg-gray-100 text-gray-800 
    }
  };

  const getStatusIcon = (status: WorkingProject['status']) => {
    switch (status) {
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <AlertCircle className="w-4 h-4" />;
      case 'review_pending':
        return <Star className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleMarkAsCompleted = async (project: WorkingProject) => {
    // Mock API call to mark project as completed
    setProjects(prev => 
      prev.map(p => 
        p.id === project.id 
          ? { ...p, status: 'review_pending' as const, reviewDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() }
          : p
      )
    );
    alert(`Project "${project.title}" marked as completed! Review period has started.`);
  };

  const handleLeaveReview = (project: WorkingProject) => {
    alert(`Opening review modal for "${project.title}"...\n\nThis would open the ReviewModal component.`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900
            Working Projects (Simple)
          </h1>
          <p className="text-gray-600
            Manage your active projects and track progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600
            {projects.length} Active
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-gray-200  p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(project.status)}
                      <span className="capitalize">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{project.studentName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Hired {new Date(project.hireDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${project.salary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {project.status === 'in_progress' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600
                  <span className="font-medium text-gray-900
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Review Status */}
            {project.status === 'review_pending' && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200  rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-600 />
                    <div>
                      <h4 className="text-sm font-medium text-purple-900
                        Review Period Active
                      </h4>
                      <p className="text-sm text-purple-700
                        {project.hasSubmittedReview 
                          ? 'You have submitted your review'
                          : 'Please leave a review for this project'
                        }
                      </p>
                    </div>
                  </div>
                  {project.reviewDueDate && (
                    <div className="text-right">
                      <p className="text-xs text-purple-600
                        Due: {new Date(project.reviewDueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200
              <div className="flex items-center space-x-2 text-sm text-gray-600
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{project.messagesCount} messages</span>
                </div>
                <span>•</span>
                <span>Last activity: {project.lastActivity}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Viewing messages for "${project.title}"`)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50  transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-1 inline" />
                  Messages
                </button>

                <button
                  onClick={() => alert(`Viewing project "${project.title}"`)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50  transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1 inline" />
                  View Project
                </button>

                {project.status === 'submitted' && (
                  <button
                    onClick={() => handleMarkAsCompleted(project)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                    Mark as Completed
                  </button>
                )}

                {project.status === 'review_pending' && !project.hasSubmittedReview && (
                  <button
                    onClick={() => handleLeaveReview(project)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Star className="w-4 h-4 mr-1 inline" />
                    Leave Review
                  </button>
                )}

                {project.status === 'review_pending' && project.hasSubmittedReview && (
                  <span className="px-3 py-1 text-sm border border-green-300 text-green-600 rounded-md">
                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                    Review Submitted
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No active projects
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any active projects yet. Start by posting a job and hiring a student.
          </p>
          <button
            onClick={() => alert('This would navigate to job posting page')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Post a Job
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkingProjectsSimple;



