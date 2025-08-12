"use client";

import React from "react";
import { LucideIcon, Eye, Edit, MoreHorizontal, Settings } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: string;
  status: 'active' | 'draft' | 'closed';
  applications: number;
  views: number;
}

interface JobListCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  jobs: Job[];
  onViewJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onManageJobs?: () => void;
  className?: string;
}

const JobListCard: React.FC<JobListCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  jobs,
  onViewJob,
  onEditJob,
  onManageJobs,
  className = ""
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {onManageJobs && (
          <button
            onClick={onManageJobs}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Manage Jobs"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Jobs
          </button>
        )}
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 5).map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {job.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.salary}</span>
                <span>•</span>
                <span>{job.applications} applications</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onViewJob(job.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="View job"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEditJob(job.id)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit job"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            View all {jobs.length} jobs →
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListCard;
