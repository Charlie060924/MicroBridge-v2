"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Bookmark, 
  BookmarkPlus,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Job } from "@/components/dashboard/student_portal/workspace/JobCategoryCard";

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

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {job.company}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(job.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {job.rating}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-3" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Posted {job.postedDate}</span>
                </div>
              </div>

              {/* Experience Level */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(
                    job.experienceLevel
                  )}`}
                >
                  {job.experienceLevel} Level
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Deadline: {job.deadline}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
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

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Job Summary
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Individual Project</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{job.isRemote ? "Remote" : "On-site"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Start: Immediate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 