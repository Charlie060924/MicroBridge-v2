"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, ExternalLink, DollarSign, Eye, FolderOpen } from "lucide-react";
import { workingProjectsService, WorkingProject, WorkingProjectsResponse } from "@/services/workingProjectsService";



const WorkingProjects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<WorkingProject[]>([]);
  const [stats, setStats] = useState<WorkingProjectsResponse['stats']>({
    inProgress: 0,
    review: 0,
    completed: 0,
    overdue: 0,
    pendingPayment: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch from API first, fallback to mock data
        let response: WorkingProjectsResponse;
        try {
          response = await workingProjectsService.getWorkingProjects();
        } catch (apiError) {
          // API not available, using mock data
          response = workingProjectsService.getMockWorkingProjectsResponse();
        }

        setProjects(response.projects);
        setStats(response.stats);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
      month: "short",
      day: "numeric",
      year: "numeric",
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

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.status.toLowerCase() === filter.toLowerCase();
  });

  const handleProjectClick = (project: WorkingProject) => {
    // Navigate to project details page
    router.push(`/student_portal/workspace/project-details/${project.id}`);
  };

  const handleViewProject = (e: React.MouseEvent, projectUrl?: string) => {
    e.stopPropagation();
    if (projectUrl) {
      window.open(projectUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <FolderOpen className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          No Working Projects
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          You don't have any active projects at the moment. Start by applying to available micro-internship opportunities.
        </p>
        <button
          onClick={() => router.push('/student_portal/workspace/jobs')}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <Eye className="h-4 w-4" />
          <span>Browse Available Jobs</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Working Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Track your ongoing micro-internship projects and billing status
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {projects.length} total projects
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Projects</option>
              <option value="in progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

                 {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
             <div className="flex items-center">
               <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
               <div className="ml-3">
                 <p className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</p>
                 <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                   {stats.inProgress}
                 </p>
               </div>
             </div>
           </div>
           <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
             <div className="flex items-center">
               <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
               <div className="ml-3">
                 <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Review</p>
                 <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                   {stats.review}
                 </p>
               </div>
             </div>
           </div>
           <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
             <div className="flex items-center">
               <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
               <div className="ml-3">
                 <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                 <p className="text-lg font-bold text-green-900 dark:text-green-100">
                   {stats.completed}
                 </p>
               </div>
             </div>
           </div>
           <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
             <div className="flex items-center">
               <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
               <div className="ml-3">
                 <p className="text-sm font-medium text-red-600 dark:text-red-400">Pending Payment</p>
                 <p className="text-lg font-bold text-red-900 dark:text-red-100">
                   {stats.pendingPayment}
                 </p>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.company}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </span>
                {project.projectUrl && (
                  <button
                    onClick={(e) => handleViewProject(e, project.projectUrl)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="View Project"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Project Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Started: {formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span className={project.status === "Overdue" ? "text-red-600 dark:text-red-400" : ""}>
                  {getDaysRemaining(project.dueDate)}
                </span>
              </div>
            </div>

            {/* Payment and Billing Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Payment: <span className="font-medium text-gray-900 dark:text-white">{project.payment}</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {project.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Billing Status:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillingStatusColor(
                    project.billingStatus
                  )}`}
                >
                  {getBillingStatusIcon(project.billingStatus)}
                  <span className="ml-1">{project.billingStatus}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {filter} projects
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have any projects with the selected status.
          </p>
          <button
            onClick={() => setFilter("all")}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all projects
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkingProjects;
