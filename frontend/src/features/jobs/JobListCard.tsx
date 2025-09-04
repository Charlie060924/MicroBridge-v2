"use client";

import React, { useState } from "react";
import { 
  LucideIcon, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Settings, 
  Power, 
  Copy, 
  BarChart3, 
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { originTracking } from "@/utils/originTracking";

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
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
  onJobDelete?: (jobId: string) => void;
}

const JobListCard: React.FC<JobListCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  jobs,
  onViewJob,
  onEditJob,
  onManageJobs,
  className = "",
  onJobUpdate,
  onJobDelete
}) => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Eye Icon: View Job Posting (different behavior for drafts vs active jobs)
  const handleViewJob = (job: Job) => {
    // Set origin context for view navigation
    originTracking.setOrigin('homepage');
    
    if (job.status === 'draft') {
      // For drafts: Navigate to incomplete public view with draft warning
      router.push(`/jobs/${job.id}?draft=true`);
    } else {
      // For active jobs: Navigate to live public view
      router.push(`/jobs/${job.id}`);
    }
  };

  // Pencil Icon: Edit Job Details
  const handleEditJob = (jobId: string) => {
    // Set origin context for edit navigation
    originTracking.setOrigin('homepage');
    router.push(`/jobs/edit/${jobId}`);
  };

  // Three Dots Icon: More Options Dropdown
  const handleDropdownToggle = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === jobId ? null : jobId);
  };

  // Dropdown Menu Options
  const handleDeactivateJob = async (job: Job) => {
    setIsProcessing(job.id);
    setOpenDropdown(null);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      
      // Update local state
      if (onJobUpdate) {
        onJobUpdate(job.id, { status: newStatus });
      }
      
      console.log(`${newStatus === 'active' ? 'Activated' : 'Deactivated'} job:`, job.id);
    } catch (err) {
      console.error('Failed to update job status:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDuplicateJob = async (job: Job) => {
    setIsProcessing(job.id);
    setOpenDropdown(null);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new job ID for the copy
      const newJobId = `copy-${job.id}-${Date.now()}`;
      
      console.log('Duplicated job:', job.id, 'New ID:', newJobId);
      
      // Navigate to edit page for the new job
      router.push(`/jobs/edit/${newJobId}`);
    } catch (err) {
      console.error('Failed to duplicate job:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleViewAnalytics = (jobId: string) => {
    setOpenDropdown(null);
    router.push(`/jobs/analytics/${jobId}`);
  };

  const handleDeleteJob = (job: Job) => {
    setShowDeleteModal(job.id);
    setOpenDropdown(null);
  };

  const confirmDelete = async (jobId: string) => {
    setIsProcessing(jobId);
    setShowDeleteModal(null);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (onJobDelete) {
        onJobDelete(jobId);
      }
      
      console.log('Deleted job:', jobId);
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsProcessing(null);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        {/* Header */}
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

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
            >
              {/* Job Information */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                  <span>•</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {job.applications} applications
                  </span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-2 ml-4">
                {/* Eye Icon - View Job Posting (visible and functional for all jobs) */}
                <button
                  onClick={() => handleViewJob(job)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    job.status === 'draft'
                      ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  title={job.status === 'draft' ? 'Preview Draft Job Posting' : 'View Job Posting'}
                >
                  <Eye className="h-5 w-5" />
                </button>
                
                {/* Pencil Icon - Edit Job Details (always visible) */}
                <button
                  onClick={() => handleEditJob(job.id)}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                  title="Edit Job Details"
                >
                  <Edit className="h-5 w-5" />
                </button>
                
                {/* Three Dots Icon - More Options (always visible) */}
                <div className="relative">
                  <button
                    onClick={(e) => handleDropdownToggle(job.id, e)}
                    disabled={isProcessing === job.id}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50"
                    title="More Options"
                  >
                    {isProcessing === job.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    ) : (
                      <MoreHorizontal className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openDropdown === job.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleDeactivateJob(job)}
                          disabled={isProcessing === job.id}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Power className="h-4 w-4 mr-3" />
                          {job.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
                        </button>
                        
                        <button
                          onClick={() => handleDuplicateJob(job)}
                          disabled={isProcessing === job.id}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <Copy className="h-4 w-4 mr-3" />
                          Duplicate Posting
                        </button>
                        
                        <button
                          onClick={() => handleViewAnalytics(job.id)}
                          disabled={isProcessing === job.id}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <BarChart3 className="h-4 w-4 mr-3" />
                          View Analytics
                        </button>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        
                        <button
                          onClick={() => handleDeleteJob(job)}
                          disabled={isProcessing === job.id}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete Posting
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Jobs Link */}
        {jobs.length > 5 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              View all {jobs.length} jobs →
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => showDeleteModal && confirmDelete(showDeleteModal)}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone and will permanently remove the job from your listings."
        confirmText="Delete Job"
        cancelText="Cancel"
        type="danger"
        isLoading={isProcessing === showDeleteModal}
      />
    </>
  );
};

export default JobListCard;
