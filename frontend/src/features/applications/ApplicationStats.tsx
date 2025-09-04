"use client";

import React from "react";
import { FileText, Clock, CheckCircle, AlertCircle, Users, TrendingUp } from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  matchScore: number;
  skills: string[];
}

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  averageTimeToFill: number;
  totalViews: number;
}

interface ApplicationStatsProps {
  applications: Application[];
  stats: Stats;
  onViewApplications: () => void;
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({
  applications,
  stats,
  onViewApplications,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'reviewed':
        return <FileText className="h-3 w-3" />;
      case 'shortlisted':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <AlertCircle className="h-3 w-3" />;
      case 'hired':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Application Stats
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recent applications and insights
            </p>
          </div>
          <button 
            onClick={onViewApplications}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalApplications}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Applications
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendingApplications}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pending Review
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Applications
          </h3>
          
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No applications yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </span>
                      <span className={`text-xs font-medium ${getMatchScoreColor(application.matchScore)}`}>
                        {application.matchScore}% match
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(application.appliedDate)}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {application.applicantName}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {application.jobTitle}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {application.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.skills.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        +{application.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {applications.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onViewApplications}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Applications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStats;
