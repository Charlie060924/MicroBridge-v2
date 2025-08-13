"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkPlus,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Job } from "@/components/dashboard/student_portal/workspace/JobCategoryCard";
import JobHeader from "@/components/job-details/JobHeader";
import JobDescription from "@/components/job-details/JobDescription";
import JobSkills from "@/components/job-details/JobSkills";
import JobSummary from "@/components/job-details/JobSummary";

const JobDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const jobId = params.jobId as string;

  // Mock job data - replace with actual API call
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$25-35/hour",
      duration: "3-6 months",
      category: "Web Development",
      description: "Build responsive web applications using React and TypeScript. You'll work closely with our design and backend teams to create seamless user experiences. This role involves developing new features, fixing bugs, and optimizing performance for our web applications.",
      skills: ["React", "TypeScript", "CSS", "JavaScript", "Git", "REST APIs"],
      rating: 4.5,
      isBookmarked: false,
      postedDate: "2 days ago",
      deadline: "2024-02-15",
      isRemote: true,
      experienceLevel: "Entry"
    },
    {
      id: "2",
      title: "Data Analysis Assistant",
      company: "DataFlow Analytics",
      location: "Remote",
      salary: "$20-30/hour",
      duration: "2-4 months",
      category: "Data Science",
      description: "Analyze customer data and create insightful reports. You'll work with large datasets to identify trends, create visualizations, and provide actionable insights to stakeholders.",
      skills: ["Python", "Pandas", "SQL", "Excel", "Tableau", "Statistics"],
      rating: 4.2,
      isBookmarked: true,
      postedDate: "1 week ago",
      deadline: "2024-02-20",
      isRemote: true,
      experienceLevel: "Entry"
    },
    {
      id: "3",
      title: "UI/UX Design Intern",
      company: "Creative Studio",
      location: "New York, NY",
      salary: "$30-40/hour",
      duration: "4-6 months",
      category: "Design",
      description: "Design user interfaces and improve user experience. You'll create wireframes, prototypes, and high-fidelity designs while collaborating with developers to ensure seamless implementation.",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
      rating: 4.7,
      isBookmarked: false,
      postedDate: "3 days ago",
      deadline: "2024-02-18",
      isRemote: false,
      experienceLevel: "Intermediate"
    },
    {
      id: "4",
      title: "Content Marketing Assistant",
      company: "Growth Marketing Co.",
      location: "Austin, TX",
      salary: "$18-25/hour",
      duration: "3-5 months",
      category: "Marketing",
      description: "Create engaging content for social media and blogs. You'll develop content strategies, write compelling copy, and manage social media campaigns to increase brand awareness and engagement.",
      skills: ["Content Writing", "Social Media", "SEO", "Copywriting", "Analytics", "Creative Design"],
      rating: 4.0,
      isBookmarked: false,
      postedDate: "5 days ago",
      deadline: "2024-02-25",
      isRemote: true,
      experienceLevel: "Entry"
    }
  ];

  useEffect(() => {
    const fetchJob = async () => {
      const foundJob = mockJobs.find(j => j.id === jobId);
      setJob(foundJob || null);
      setIsBookmarked(foundJob?.isBookmarked || false);
      setIsLoading(false);
    };

    fetchJob();
  }, [jobId]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    // Navigate to application form
    router.push(`/student_portal/workspace/apply/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
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
              onClick={() => router.back()}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Jobs
            </button>
            <button
              onClick={handleBookmark}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isBookmarked ? (
                <Bookmark className="h-6 w-6 text-primary fill-primary" />
              ) : (
                <BookmarkPlus className="h-6 w-6 text-gray-400 hover:text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <JobHeader job={job} showRating={true} />

            {/* Job Description */}
            <JobDescription description={job.description} />

            {/* Required Skills */}
            <JobSkills skills={job.skills} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <JobSummary job={job}>
              <button
                onClick={handleApply}
                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-4 flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Apply Now
              </button>

              <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-4 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit Company
              </button>
            </JobSummary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 