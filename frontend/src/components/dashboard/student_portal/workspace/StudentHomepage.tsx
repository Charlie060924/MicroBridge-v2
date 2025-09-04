"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, TrendingUp, Lock, Sparkles, MapPin, DollarSign, Clock } from "lucide-react";
import dynamic from 'next/dynamic';
import LockedFeature from "@/components/common/LockedFeature";
import { usePreviewMode } from "@/context/PreviewModeContext";
import PreviewBanner from "@/components/common/PreviewBanner";
import PreviewModeShowcase from "@/components/common/PreviewModeShowcase";

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
  ),
  ssr: false
});

const OngoingProjects = dynamic(() => import("./OngoingProjects"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
  ssr: false
});

const Recommendations = dynamic(() => import("./Recommendations"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
  ssr: false
});

const EmptyState = dynamic(() => import("./EmptyState"), {
  ssr: false
});

const JobCategoryCard = dynamic(() => import("./JobCategoryCard"), {
  loading: () => <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
  ssr: false
});

interface StudentHomepageProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const StudentHomepage: React.FC<StudentHomepageProps> = ({ user }) => {
  console.log("🎓 StudentHomepage rendering with user:", user);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real data state
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [recentlyViewedJobs, setRecentlyViewedJobs] = useState<RecentlyViewedJob[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const router = useRouter();
  const { isPreviewMode, isFeatureLocked, getDemoData } = usePreviewMode();

  // Replace the useEffect with temporary mock data to avoid API errors
  useEffect(() => {
    console.log("🎓 StudentHomepage useEffect triggered, isPreviewMode:", isPreviewMode);
    
    const fetchData = async () => {
      try {
        console.log("🎓 Fetching student homepage data");
        setError(null);
        
        // Use demo data in preview mode, fallback to temporary mock data
        let mockJobs: Job[] = [];
        let mockProjects: Project[] = [];
        let mockSkills: string[] = [];

        if (isPreviewMode) {
          const demoData = getDemoData();
          if (demoData) {
            // Convert demo jobs to Job interface format
            mockJobs = demoData.demoDataService?.getDemoJobs() || [
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
              }
            ];
            
            // Show demo projects in preview
            mockProjects = demoData.projects ? demoData.projects.map((project: any) => ({
              id: project.id,
              title: project.title,
              company: project.company,
              status: project.status === 'active' ? 'In Progress' : project.status === 'completed' ? 'Completed' : 'Pending',
              progress: project.progress,
              dueDate: project.milestones?.[project.milestones.length - 1]?.dueDate || '2024-02-01',
              startDate: '2024-01-01',
              description: project.description,
              payment: `$${project.budget}`,
              category: project.category
            })) : [];

            // Show demo skills
            mockSkills = ["React", "TypeScript", "UI/UX Design", "Python", "Node.js", "Figma"];
          } else {
            // Fallback for preview mode without demo data
            mockJobs = [
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
              }
            ];
          }
        } else {
          // Regular mode mock data for development
          mockJobs = [
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
              salary: "$35-50/hr",
              duration: "4 months",
              category: "Analytics",
              description: "Analyze data and create insights for business decisions",
              skills: ["Python", "SQL", "Tableau"],
              rating: 4.2,
              isBookmarked: false,
              postedDate: "2024-01-20",
              deadline: "2024-02-20",
              isRemote: true,
              experienceLevel: "Intermediate"
            }
          ];
        }

        // Only add fallback projects if not already set in preview mode
        if (!isPreviewMode || mockProjects.length === 0) {
          mockProjects = isPreviewMode ? [] : [
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
        }

        // Only set fallback skills if not already set in preview mode
        if (!isPreviewMode || mockSkills.length === 0) {
          mockSkills = isPreviewMode ? [] : ["React", "TypeScript", "Node.js", "Python"];
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("🎓 Setting student homepage data:", {
          jobs: mockJobs.length,
          projects: mockProjects.length,
          skills: mockSkills.length
        });

        setFeaturedJobs(mockJobs);
        setOngoingProjects(mockProjects);
        setUserSkills(mockSkills);

        // Load recently viewed jobs from localStorage
        try {
          const recentJobs = recentlyViewedJobsService.getRecentlyViewedJobs();
          if (recentJobs.length === 0) {
            // Use mock data for development if no recent jobs exist
            const mockRecentJobs = recentlyViewedJobsService.getMockRecentlyViewedJobs();
            setRecentlyViewedJobs(mockRecentJobs);
          } else {
            setRecentlyViewedJobs(recentJobs);
          }
        } catch (error) {
          console.error("🎓 Error loading recently viewed jobs:", error);
          setRecentlyViewedJobs([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching data';
        console.error('🎓 Error fetching student homepage data:', error);
        setError(errorMessage);
        
        // Set safe defaults on error
        setFeaturedJobs([]);
        setRecentlyViewedJobs([]);
        setOngoingProjects([]);
        setUserSkills([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isPreviewMode]);

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
          console.log("🎓 Avatar image failed to load, using fallback");
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
    console.log("🎓 Search triggered:", { query, location, category });
    setSearchQuery(query);
    setSearchLocation(location);
    setSearchCategory(category);
    setIsLoading(true);
    
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBookmark = useCallback((jobId: string) => {
    console.log("🎓 Bookmark toggled for job:", jobId);
  }, []);

  const handleJobClick = useCallback((job: Job) => {
    console.log("🎓 Job clicked:", job.id);
    // Add job to recently viewed when clicked
    try {
      recentlyViewedJobsService.addRecentlyViewedJob(job);
    } catch (error) {
      console.error("🎓 Error adding job to recently viewed:", error);
    }
    
    router.prefetch(`/student_portal/workspace/job-details/${job.id}`);
    router.push(`/student_portal/workspace/job-details/${job.id}`);
  }, [router]);

  const handleProjectClick = useCallback((project: Project) => {
    console.log("🎓 Project clicked:", project.id);
    router.prefetch(`/student_portal/workspace/project-details/${project.id}`);
    router.push(`/student_portal/workspace/project-details/${project.id}`);
  }, [router]);

  const handleClearFilters = useCallback(() => {
    console.log("🎓 Clearing search filters");
    setSearchQuery("");
    setSearchLocation("");
    setSearchCategory("");
  }, []);

  // Update the stats cards to use demo data in preview mode
  const statsCards = useMemo(() => {
    if (isPreviewMode) {
      const demoData = getDemoData();
      if (demoData?.stats) {
        return [
          {
            icon: <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
            bg: "bg-blue-100 dark:bg-blue-900",
            label: "Active Projects",
            value: demoData.projects.filter((p: any) => p.status === 'active').length
          },
          {
            icon: <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />,
            bg: "bg-green-100 dark:bg-green-900",
            label: "Completed",
            value: demoData.stats.projectsCompleted
          },
          {
            icon: <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
            bg: "bg-purple-100 dark:bg-purple-900",
            label: "Skills",
            value: demoData.stats.skillsVerified
          },
          {
            icon: <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
            bg: "bg-orange-100 dark:bg-orange-900",
            label: "Earnings",
            value: `$${(demoData.stats.totalEarnings / 1000).toFixed(1)}k`
          }
        ];
      }
      return [
        {
          icon: <TrendingUp className="h-6 w-6 text-gray-400" />,
          bg: "bg-gray-100 dark:bg-gray-800",
          label: "Active Projects",
          value: "—"
        },
        {
          icon: <Calendar className="h-6 w-6 text-gray-400" />,
          bg: "bg-gray-100 dark:bg-gray-800",
          label: "Completed",
          value: "—"
        },
        {
          icon: <User className="h-6 w-6 text-gray-400" />,
          bg: "bg-gray-100 dark:bg-gray-800",
          label: "Skills",
          value: "—"
        },
        {
          icon: <DollarSign className="h-6 w-6 text-gray-400" />,
          bg: "bg-gray-100 dark:bg-gray-800",
          label: "Earnings",
          value: "—"
        }
      ];
    }
    
    return [
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
    ];
  }, [ongoingProjects, userSkills, isPreviewMode]);

  // Show loading state while fetching data
  if (isDataLoading) {
    console.log("🎓 Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    console.log("🎓 Showing error state:", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Something went wrong loading the dashboard</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("🎓 Rendering main content with jobs:", featuredJobs.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Preview Banner */}
      <PreviewBanner />
      
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
                      <LockedFeature feature="bookmark_job" showOverlay={false}>
                        <JobCategoryCard
                          job={job}
                          onBookmark={handleBookmark}
                          onClick={handleJobClick}
                        />
                      </LockedFeature>
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
              <div className="space-y-6">
                {/* Recently Viewed Jobs - Always show */}
                <RecentlyViewedJobs
                  jobs={recentlyViewedJobs}
                  onBookmark={handleBookmark}
                  onJobClick={handleJobClick}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Featured Jobs in Preview Mode, Recommendations in Full Mode */}
                  <div className="lg:col-span-2">
                    {isPreviewMode ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Featured Jobs
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Popular opportunities on our platform
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {featuredJobs.slice(0, 3).map((job) => (
                            <div
                              key={job.id}
                              onClick={() => handleJobClick(job)}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-150 cursor-pointer group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors duration-150">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {job.company}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{job.duration}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {job.skills.slice(0, 3).map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Recommendations
                        jobs={featuredJobs.slice(0, 3)}
                        onBookmark={handleBookmark}
                        onJobClick={handleJobClick}
                        userSkills={userSkills}
                      />
                    )}
                  </div>

                  {/* Current Projects - Show Demo Projects in Preview Mode */}
                  <div>
                    <OngoingProjects
                      projects={ongoingProjects}
                      onProjectClick={handleProjectClick}
                    />
                  </div>
                </div>

                {/* Stats Cards */}
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

                {/* Preview Mode CTA Showcase */}
                {isPreviewMode && (
                  <PreviewModeShowcase variant="inline" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(StudentHomepage), { ssr: false });