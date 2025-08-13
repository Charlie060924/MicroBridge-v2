"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Edit,
  AlertTriangle,
  X,
  Eye,
  BarChart3,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useOriginTracking } from "@/utils/originTracking";
import JobHeader from "@/components/job-details/JobHeader";
import JobDescription from "@/components/job-details/JobDescription";
import JobSkills from "@/components/job-details/JobSkills";
import JobSummary from "@/components/job-details/JobSummary";

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

const PublicJobPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getReturnUrl, getReturnText } = useOriginTracking();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyTooltip, setShowApplyTooltip] = useState(false);
  
  const isDraft = searchParams.get('draft') === 'true';
  const jobId = params.id as string;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        // Mock API call - replace with actual API
        const mockJob: Job = {
          id: jobId,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          salary: "$120,000 - $150,000",
          duration: "Full-time",
          category: "Engineering",
          description: "We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences. You will work with React, TypeScript, and modern web technologies to create scalable and maintainable applications. This role involves developing new features, fixing bugs, and optimizing performance for our web applications. You'll work closely with our design and backend teams to create seamless user experiences.",
          skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js", "Git", "REST APIs"],
          rating: 4.5,
          isBookmarked: false,
          postedDate: "2 days ago",
          deadline: "2024-02-15",
          isRemote: true,
          experienceLevel: "Senior",
          status: isDraft ? 'draft' : 'active',
          applications: 24,
          views: 156
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setJob(mockJob);
      } catch (err) {
        setError('Failed to load job posting');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isDraft]);

  const handleApplyClick = () => {
    setShowApplyTooltip(true);
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setShowApplyTooltip(false);
    }, 2000);
  };

  const handleVisitCompany = () => {
    // Navigate to company page with preview parameter
    router.push(`/employer?preview=true`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Job Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The job posting you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(getReturnUrl())}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {getReturnText()}
            </button>
            <div className="flex items-center space-x-3">
              {isDraft && (
                <Link
                  href={`/jobs/edit/${job.id}`}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </Link>
              )}
              {!isDraft && (
                <Link
                  href={`/jobs/analytics/${job.id}`}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Draft Warning */}
        {isDraft && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                  Draft Preview
                </h2>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This job posting is incomplete and not yet public
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
          {/* Main Content */}
          <div className="lg:col-span-2 overflow-hidden">
            {/* Job Header */}
            <JobHeader job={job} showRating={false} />

            {/* Job Description */}
            <JobDescription description={job.description} />

            {/* Required Skills */}
            <JobSkills skills={job.skills} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 min-w-0 overflow-hidden">
            <JobSummary job={job}>
              {/* Apply Now Button (Preview Mode) */}
              <div className="relative mb-4 w-full max-w-full">
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap max-w-full"
                >
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Apply Now</span>
                </button>
                
                {/* Tooltip */}
                {showApplyTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg animate-tooltip-fade-in animate-tooltip-bounce">
                    <div className="relative">
                      Visible to students only
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visit Company Button */}
              <button
                onClick={handleVisitCompany}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4 flex items-center justify-center whitespace-nowrap max-w-full"
              >
                <ExternalLink className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Visit Company</span>
              </button>



              {/* Preview Actions */}
              <div className="mb-4 overflow-hidden w-full max-w-full">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Preview Actions
                </h4>
                <div className="space-y-2 w-full max-w-full">
                  <button className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center min-w-0">
                    <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate min-w-0">View as Public</span>
                  </button>
                  {isDraft && (
                    <Link
                      href={`/jobs/edit/${job.id}`}
                      className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center min-w-0"
                    >
                      <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate min-w-0">Edit Job Details</span>
                    </Link>
                  )}
                </div>
              </div>
            </JobSummary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJobPage;
