"use client";

import React from "react";
import { Plus, FileText, Briefcase, Users, ArrowRight } from "lucide-react";

interface PrimaryActionCardProps {
  hasActiveJobs: boolean;
  onPostJob: () => void;
  onCheckApplications: () => void;
  onManageJobs: () => void;
  onBrowseCandidates: () => void;
}

const PrimaryActionCard: React.FC<PrimaryActionCardProps> = ({
  hasActiveJobs,
  onPostJob,
  onCheckApplications,
  onManageJobs,
  onBrowseCandidates,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {hasActiveJobs ? "Check New Applications" : "Post a New Job"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {hasActiveJobs 
            ? "Review the latest applications for your active job postings" 
            : "Get started by creating your first job posting to attract top talent"
          }
        </p>
      </div>

      {/* Primary CTA */}
      <div className="flex justify-center mb-6">
        <button
          onClick={hasActiveJobs ? onCheckApplications : onPostJob}
          className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {hasActiveJobs ? (
            <>
              <FileText className="h-6 w-6 mr-3" />
              Check New Applications
            </>
          ) : (
            <>
              <Plus className="h-6 w-6 mr-3" />
              Post a New Job
            </>
          )}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onManageJobs}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Manage Existing Jobs
        </button>
        <button
          onClick={onBrowseCandidates}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Users className="h-4 w-4 mr-2" />
          Browse Candidates
        </button>
        {hasActiveJobs && (
          <button
            onClick={onPostJob}
            className="inline-flex items-center px-4 py-2 text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </button>
        )}
      </div>
    </div>
  );
};

export default PrimaryActionCard;
