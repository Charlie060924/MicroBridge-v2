"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle, 
  ExternalLink, 
  DollarSign, 
  ArrowLeft,
  User,
  Building,
  FileText,
  Tag
} from "lucide-react";
import { workingProjectsService, WorkingProject } from "@/services/workingProjectsService";

const ProjectDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<WorkingProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        let projectData: WorkingProject;
        
        try {
          projectData = await workingProjectsService.getWorkingProjectById(projectId);
        } catch (apiError) {
          console.log('API not available, using mock data');
          const mockProjects = workingProjectsService.getMockWorkingProjects();
          projectData = mockProjects.find(p => p.id === projectId) || mockProjects[0];
        }
        
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <PlayCircle className="h-4 w-4" />;
      case "Review":
        return <AlertCircle className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };

  const getBillingStatusColor = (billingStatus: string) => {
    switch (billingStatus) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getBillingStatusIcon = (billingStatus: string) => {
    switch (billingStatus) {
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const handleViewProject = () => {
    if (project?.projectUrl) {
      window.open(project.projectUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || "Project not found"}
          </h2>
          <button
            onClick={() => router.push('/student_portal/workspace/working_projects')}
            className="text-primary hover:text-primary/80"
          >
            Back to Working Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/student_portal/workspace/working_projects')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {project.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {getStatusIcon(project.status)}
                <span className="ml-1">{project.status}</span>
              </span>
              {project.projectUrl && (
                <button
                  onClick={handleViewProject}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Project</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Progress
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Completion</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {project.progress < 100 ? (
                    <span>Work in progress - {100 - project.progress}% remaining</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">Project completed!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Start Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Due Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(project.dueDate)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    project.status === "Overdue" ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {getDaysRemaining(project.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                    <p className="font-medium text-gray-900 dark:text-white">{project.company}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                    <p className="font-medium text-gray-900 dark:text-white">{project.payment}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Billing Status
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillingStatusColor(
                    project.billingStatus
                  )}`}
                >
                  {getBillingStatusIcon(project.billingStatus)}
                  <span className="ml-1">{project.billingStatus}</span>
                </span>
              </div>
              {project.billingStatus === "Pending" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Payment will be processed upon project completion
                </p>
              )}
              {project.billingStatus === "Paid" && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  Payment has been successfully processed
                </p>
              )}
              {project.billingStatus === "Overdue" && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Payment is overdue. Please contact support.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {project.status === "In Progress" && (
                  <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Update Progress
                  </button>
                )}
                {project.status === "In Progress" && project.progress >= 90 && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Submit for Review
                  </button>
                )}
                <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Contact Employer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
