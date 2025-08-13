import React from "react";
import { Users, Globe, Calendar } from "lucide-react";

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
  status?: 'active' | 'draft' | 'closed';
  applications?: number;
  views?: number;
}

interface JobSummaryProps {
  job: Job;
  children?: React.ReactNode;
}

const JobSummary: React.FC<JobSummaryProps> = ({ job, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-8 overflow-hidden w-full max-w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Job Summary
      </h3>
      
      <div className="overflow-x-hidden w-full max-w-full">
        {children}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 overflow-hidden">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Job Details
        </h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center min-w-0">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate min-w-0">Individual Project</span>
          </div>
          <div className="flex items-center min-w-0">
            <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate min-w-0">{job.isRemote ? "Remote" : "On-site"}</span>
          </div>
          <div className="flex items-center min-w-0">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate min-w-0">Start: Immediate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSummary;
