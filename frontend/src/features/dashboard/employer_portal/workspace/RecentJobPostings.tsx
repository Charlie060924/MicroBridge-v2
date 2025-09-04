"use client";

import React from "react";
import { Eye, Edit, MoreVertical, Users, Clock, MapPin, DollarSign, Calendar, Briefcase, Plus } from "lucide-react";
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

interface RecentJobPostingsProps {
  jobs: Job[];
  onViewJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
}

const RecentJobPostings: React.FC<RecentJobPostingsProps> = ({
  jobs,
  onViewJob,
  onEditJob,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 
      case 'closed':
        return 'bg-red-100 text-red-800 
      default:
        return 'bg-gray-100 text-gray-800 
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'draft':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'closed':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 ">
      <div className="p-6 border-b border-gray-200
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900
              Recent Job Postings
            </h2>
            <p className="text-gray-600
              Manage your active job listings
            </p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700  font-medium">
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No job postings yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first job posting to start attracting candidates
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900
                        {job.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1 capitalize">{job.status}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.duration}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications} applications
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {job.views} views
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Posted {formatDate(job.postedDate)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            originTracking.setOrigin('homepage');
                            onViewJob(job.id);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                          title="View Job"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            originTracking.setOrigin('homepage');
                            onEditJob(job.id);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentJobPostings;
