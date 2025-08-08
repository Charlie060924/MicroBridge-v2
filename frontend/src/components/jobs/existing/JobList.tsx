"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Bookmark, BookmarkPlus, MapPin, DollarSign, Clock, Star, CheckCircle } from "lucide-react";
import { Job } from "@/components/dashboard/student_portal/workspace/JobCategoryCard";
import { useRouter } from "next/navigation";
import { useDebounce, useMemoizedSearch, useOptimizedPagination, usePerformanceMonitor } from "@/utils/performance";

// Memoized Job Card Component
const JobCard = React.memo(({ 
  job, 
  onBookmark, 
  onJobClick, 
  onApplyNow 
}: {
  job: Job;
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
  onApplyNow: (job: Job) => void;
}) => {
  const getExperienceColor = useCallback((level: string) => {
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
  }, []);

  return (
    <div
      onClick={() => onJobClick(job)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
            {job.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {job.company}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(job.id);
          }}
          className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
        >
          {job.isBookmarked ? (
            <Bookmark className="h-5 w-5 text-primary fill-primary" />
          ) : (
            <BookmarkPlus className="h-5 w-5 text-gray-400 hover:text-primary" />
          )}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="flex items-center">
            {job.location}
            {job.isRemote && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                Remote
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{job.duration}</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-1 text-yellow-400" />
          <span>{job.rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={`${job.id}-skill-${index}`}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
        <span className={`px-3 py-1 text-xs rounded-full ${getExperienceColor(job.experienceLevel)}`}>
          {job.experienceLevel}
        </span>
      </div>

      {/* Apply Now Button */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJobClick(job);
            }}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyNow(job);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
});

JobCard.displayName = 'JobCard';

// Loading Skeleton Component
const JobCardSkeleton = React.memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
));

JobCardSkeleton.displayName = 'JobCardSkeleton';

const JobList = () => {
  usePerformanceMonitor('JobList');
  
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Mock data - replace with actual API call
  const mockJobs: Job[] = useMemo(() => [
    {
      id: "1",
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Remote",
      salary: "$25-35/hr",
      duration: "3 months",
      category: "Development",
      description: "Build responsive web applications using modern technologies",
      skills: ["React", "TypeScript", "CSS"],
      rating: 4.5,
      isBookmarked: false,
      postedDate: "2024-01-15",
      deadline: "2024-02-15",
      isRemote: true,
      experienceLevel: "Intermediate"
    },
    {
      id: "2",
      title: "UI/UX Designer",
      company: "DesignStudio",
      location: "New York, NY",
      salary: "$30-45/hr",
      duration: "2 months",
      category: "Design",
      description: "Create beautiful and intuitive user interfaces",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      rating: 4.8,
      isBookmarked: true,
      postedDate: "2024-01-10",
      deadline: "2024-02-10",
      isRemote: false,
      experienceLevel: "Entry"
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "DataCorp",
      location: "San Francisco, CA",
      salary: "$40-60/hr",
      duration: "4 months",
      category: "Data Science",
      description: "Analyze large datasets and create insightful reports",
      skills: ["Python", "SQL", "Tableau"],
      rating: 4.2,
      isBookmarked: false,
      postedDate: "2024-01-12",
      deadline: "2024-03-12",
      isRemote: true,
      experienceLevel: "Advanced"
    },
    {
      id: "4",
      title: "Content Writer",
      company: "ContentHub",
      location: "Remote",
      salary: "$20-30/hr",
      duration: "2 months",
      category: "Content Creation",
      description: "Create engaging content for blogs, social media, and marketing materials",
      skills: ["Copywriting", "SEO", "Social Media"],
      rating: 4.6,
      isBookmarked: false,
      postedDate: "2024-01-14",
      deadline: "2024-03-14",
      isRemote: true,
      experienceLevel: "Entry"
    },
    {
      id: "5",
      title: "Marketing Specialist",
      company: "GrowthCo",
      location: "Los Angeles, CA",
      salary: "$35-50/hr",
      duration: "3 months",
      category: "Marketing",
      description: "Develop and execute marketing campaigns for digital products",
      skills: ["Digital Marketing", "Google Ads", "Analytics"],
      rating: 4.4,
      isBookmarked: false,
      postedDate: "2024-01-13",
      deadline: "2024-04-13",
      isRemote: false,
      experienceLevel: "Intermediate"
    },
    {
      id: "6",
      title: "Backend Developer",
      company: "CodeCraft",
      location: "Remote",
      salary: "$45-65/hr",
      duration: "4 months",
      category: "Development",
      description: "Build scalable backend services and APIs",
      skills: ["Node.js", "Python", "PostgreSQL"],
      rating: 4.7,
      isBookmarked: true,
      postedDate: "2024-01-11",
      deadline: "2024-05-11",
      isRemote: true,
      experienceLevel: "Advanced"
    },
    {
      id: "7",
      title: "Graphic Designer",
      company: "CreativeStudio",
      location: "Chicago, IL",
      salary: "$25-40/hr",
      duration: "2 months",
      category: "Design",
      description: "Create visual designs for branding and marketing materials",
      skills: ["Adobe Creative Suite", "Illustration", "Branding"],
      rating: 4.3,
      isBookmarked: false,
      postedDate: "2024-01-16",
      deadline: "2024-03-16",
      isRemote: false,
      experienceLevel: "Intermediate"
    },
    {
      id: "8",
      title: "Product Manager",
      company: "InnovateTech",
      location: "Austin, TX",
      salary: "$50-70/hr",
      duration: "6 months",
      category: "Product Management",
      description: "Lead product development from concept to launch",
      skills: ["Product Strategy", "User Research", "Agile"],
      rating: 4.9,
      isBookmarked: false,
      postedDate: "2024-01-09",
      deadline: "2024-07-09",
      isRemote: false,
      experienceLevel: "Advanced"
    }
  ], []);

  useEffect(() => {
    // Simulate API call with loading state
    const fetchJobs = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setJobs(mockJobs);
      setLoading(false);
    };

    fetchJobs();
  }, [mockJobs]);

  // Memoized filtered and sorted jobs
  const filteredJobs = useMemoizedSearch(jobs, debouncedSearchTerm, ['title', 'company', 'description', 'skills']);

  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];
    switch (sortBy) {
      case "salary-high":
        return sorted.sort((a, b) => {
          const aSalary = parseInt(a.salary.match(/\d+/)?.[0] || "0");
          const bSalary = parseInt(b.salary.match(/\d+/)?.[0] || "0");
          return bSalary - aSalary;
        });
      case "salary-low":
        return sorted.sort((a, b) => {
          const aSalary = parseInt(a.salary.match(/\d+/)?.[0] || "0");
          const bSalary = parseInt(b.salary.match(/\d+/)?.[0] || "0");
          return aSalary - bSalary;
        });
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
  }, [filteredJobs, sortBy]);

  // Optimized pagination
  const {
    currentPage,
    paginatedItems,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  } = useOptimizedPagination(sortedJobs, 10);

  const handleBookmark = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  }, []);

  const handleJobClick = useCallback((job: Job) => {
    router.push(`/student_portal/workspace/job-details/${job.id}`);
  }, [router]);

  const handleApplyNow = useCallback((job: Job) => {
    router.push(`/student_portal/workspace/job-details/${job.id}`);
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Available Jobs ({sortedJobs.length})
        </h2>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {/* Sort Dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedItems.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onBookmark={handleBookmark}
            onJobClick={handleJobClick}
            onApplyNow={handleApplyNow}
          />
        ))}
      </div>

      {/* Optimized Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={prevPage}
            disabled={!hasPrevPage}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ??
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            ??
          </button>
        </div>
      )}
    </div>
  );
};

export default JobList; 