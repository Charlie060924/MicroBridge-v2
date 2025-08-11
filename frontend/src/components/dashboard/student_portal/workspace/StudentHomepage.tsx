"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, TrendingUp } from "lucide-react";
import dynamic from 'next/dynamic';

// Import types from the components that define them
import { Job } from "./JobCategoryCard";
import { Project } from "./OngoingProjects";
import { RecentlyViewedJob, recentlyViewedJobsService } from "@/services/recentlyViewedJobsService";

const SearchBar = dynamic(() => import("./SearchBar_and_Filter/SearchBar"), {
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: false
});

const RecentlyViewedJobs = dynamic(() => import("./RecentlyViewedJobs"), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      ))}
    </div>
  )
});

const OngoingProjects = dynamic(() => import("./OngoingProjects"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});

const Recommendations = dynamic(() => import("./Recommendations"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});

const EmptyState = dynamic(() => import("./EmptyState"));

const JobCategoryCard = dynamic(() => import("./JobCategoryCard"), {
  loading: () => <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
});

interface StudentHomepageProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const StudentHomepage: React.FC<StudentHomepageProps> = ({ user }) => {
  console.log("StudentHomepage rendering with user:", user);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Real data state
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<RecentlyViewedJob[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const router = useRouter();

  // Replace the useEffect with temporary mock data to avoid API errors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Temporary mock data until your API is ready
        const mockJobs: Job[] = [
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
          }
        ];

        const mockProjects: Project[] = [
          {
            id: "1",
            title: "E-commerce Website",
            company: "StartupXYZ",
            status: "In Progress",
            progress: 75,
            dueDate: "2024-03-01",
            startDate: "2024-01-01",
            description: "Building a modern e-commerce platform",
            payment: "$2,500",
            category: "Web Development"
          },
          {
            id: "2",
            title: "Mobile App Design",
            company: "AppCorp",
            status: "Review",
            progress: 90,
            dueDate: "2024-02-15",
            startDate: "2024-01-15",
            description: "Designing user interface for mobile application",
            payment: "$1,800",
            category: "Design"
          }
        ];

        const mockSkills = ["React", "TypeScript", "Node.js", "Python"];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setFeaturedJobs(mockJobs);
        setOngoingProjects(mockProjects);
        setUserSkills(mockSkills);

        // Load recently viewed jobs from localStorage
        const recentJobs = recentlyViewedJobsService.getRecentlyViewedJobs();
        if (recentJobs.length === 0) {
          // Use mock data for development if no recent jobs exist
          const mockRecentJobs = recentlyViewedJobsService.getMockRecentlyViewedJobs();
          setRecentlyViewedJobs(mockRecentJobs);
        } else {
          setRecentlyViewedJobs(recentJobs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFeaturedJobs([]);
        setRecentlyViewedJobs([]);
        setOngoingProjects([]);
        setUserSkills([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update the filtered jobs to use real data
  const filteredJobs = useMemo(() => {
    if (!searchQuery && !searchLocation && !searchCategory) return [];
    
    return featuredJobs.filter(job => {
      const matchesQuery = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = !searchLocation || 
        job.location.toLowerCase().includes(searchLocation.toLowerCase());
      
      const matchesCategory = !searchCategory || 
        job.category === searchCategory;
      
      return matchesQuery && matchesLocation && matchesCategory;
    });
  }, [searchQuery, searchLocation, searchCategory, featuredJobs]);

  // Memoized greeting
  const greeting = useMemo(() => {
    const currentTime = new Date();
    return currentTime.getHours() < 12 ? "Good morning" : 
           currentTime.getHours() < 17 ? "Good afternoon" : "Good evening";
  }, []);

  // Memoized user avatar with error handling
  const userAvatar = useMemo(() => {
    if (!user) return <User className="h-6 w-6 text-white" />;
    
    return user.avatar ? (
      <img 
        src={user.avatar} 
        alt={user.name} 
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : (
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
        <User className="h-6 w-6 text-white" />
      </div>
    );
  }, [user]);

  // Optimized event handlers
  const handleSearch = useCallback((query: string, location: string, category: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
    setSearchCategory(category);
    setIsLoading(true);
    
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBookmark = useCallback((jobId: string) => {
    // Optimized bookmark handler
    console.log("Bookmark toggled for job:", jobId);
  }, []);

  const handleJobClick = useCallback((job: Job) => {
    // Add job to recently viewed when clicked
    recentlyViewedJobsService.addRecentlyViewedJob(job);
    
    router.prefetch(`/student_portal/workspace/job-details/${job.id}`);
    router.push(`/student_portal/workspace/job-details/${job.id}`);
  }, [router]);

  const handleProjectClick = useCallback((project: Project) => {
    router.prefetch(`/student_portal/workspace/project-details/${project.id}`);
    router.push(`/student_portal/workspace/project-details/${project.id}`);
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSearchLocation("");
    setSearchCategory("");
  }, []);

  // Update the stats cards to use real data
  const statsCards = useMemo(() => [
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-900",
      label: "Active Projects",
      value: ongoingProjects.length
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />,
      bg: "bg-green-100 dark:bg-green-900",
      label: "Completed",
      value: 12 // This could also come from API
    },
    {
      icon: <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-900",
      label: "Skills",
      value: userSkills.length
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      bg: "bg-orange-100 dark:bg-orange-900",
      label: "Earnings",
      value: "$2.4k" // This could also come from API
    }
  ], [ongoingProjects, userSkills]);

  // Show loading state while fetching data
  if (isDataLoading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Rendering main content with jobs:", featuredJobs.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {userAvatar}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {greeting}, {user?.name || "Student"}! 👋
                </h1>
                                 <p className="text-gray-600 dark:text-gray-400">
                   Ready to explore new micro-internship opportunities?
                 </p>
                 <div className="mt-4">
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Content Based on Search Results */}
        {!isLoading && (
          <>
            {filteredJobs.length > 0 ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results ({filteredJobs.length})
                  </h2>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Clear filters
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map(job => (
                    <div key={job.id} className="w-full">
                      <JobCategoryCard
                        job={job}
                        onBookmark={handleBookmark}
                        onClick={handleJobClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : searchQuery || searchLocation || searchCategory ? (
              <EmptyState 
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <div className="space-y-8">
                {/* Step 2: Replace Featured Jobs with Recently Viewed Jobs */}
                <RecentlyViewedJobs
                  jobs={recentlyViewedJobs}
                  onBookmark={handleBookmark}
                  onJobClick={handleJobClick}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Step 2: Replace Ongoing Projects with Recommended Jobs */}
                  <div className="lg:col-span-2">
                    <Recommendations
                      jobs={featuredJobs.slice(0, 3)}
                      onBookmark={handleBookmark}
                      onJobClick={handleJobClick}
                      userSkills={userSkills}
                    />
                  </div>

                  {/* Step 2: Replace Recommended Jobs with Ongoing Projects */}
                  <div>
                    <OngoingProjects
                      projects={ongoingProjects}
                      onProjectClick={handleProjectClick}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {statsCards.map((stat, index) => (
                    <div key={`stat-${stat.label}-${index}`} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className={`p-2 ${stat.bg} rounded-lg`}>
                          {stat.icon}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(StudentHomepage), { ssr: false });