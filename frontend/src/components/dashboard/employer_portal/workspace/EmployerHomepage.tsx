"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Briefcase, Users, Clock, Plus, Eye, BarChart3, Lock } from "lucide-react";
import dynamic from 'next/dynamic';
import { originTracking } from "@/utils/originTracking";
import { usePreviewMode } from "@/context/PreviewModeContext";
import LockedFeature from "@/components/common/LockedFeature";
import PreviewBanner from "@/components/common/PreviewBanner";
import PreviewModeShowcase from "@/components/common/PreviewModeShowcase";

// Import types
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

import { Candidate } from '@/data/mockCandidates';

// Import Phase 2 VerificationDiscoveryHub
const VerificationDiscoveryHub = dynamic(() => import("@/components/common/VerificationDiscoveryHub"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
  ssr: false
});

// Dynamic imports for components with error boundaries
const RecommendedCandidates = dynamic(() => import("./RecommendedCandidates"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: false
});

const StatCard = dynamic(() => import("./StatCard"), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: false
});

const JobListCard = dynamic(() => import("./JobListCard"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: false
});

const JobPostingPerformance = dynamic(() => import("./JobPostingPerformance"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
  ssr: false
});

interface EmployerHomepageProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    company?: string;
    role?: string;
  };
}

const EmployerHomepage: React.FC<EmployerHomepageProps> = ({ user }) => {
  console.log("🏢 EmployerHomepage rendering with user:", user);
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real data state
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    averageTimeToFill: 0,
    totalViews: 0,
    shortlistedCandidates: 0,
    savedCandidates: 0
  });

  const router = useRouter();
  const { isPreviewMode, isFeatureLocked, getDemoData } = usePreviewMode();

  // Replace the useEffect with temporary mock data to avoid API errors
  useEffect(() => {
    console.log("🏢 EmployerHomepage useEffect triggered, isPreviewMode:", isPreviewMode);
    
    const fetchData = async () => {
      try {
        console.log("🏢 Fetching employer homepage data");
        setError(null);
        
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
            experienceLevel: "Intermediate",
            status: 'active',
            applications: 12,
            views: 45
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
            experienceLevel: "Entry",
            status: 'active',
            applications: 8,
            views: 32
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
            experienceLevel: "Intermediate",
            status: 'draft',
            applications: 0,
            views: 0
          }
        ];

        const mockApplications: Application[] = isPreviewMode ? [] : [
          {
            id: "1",
            jobTitle: "Frontend Developer",
            applicantName: "John Doe",
            applicantEmail: "john.doe@email.com",
            appliedDate: "2024-01-16",
            status: 'pending',
            matchScore: 85,
            skills: ["React", "TypeScript", "CSS", "Node.js"]
          },
          {
            id: "2",
            jobTitle: "UI/UX Designer",
            applicantName: "Jane Smith",
            applicantEmail: "jane.smith@email.com",
            appliedDate: "2024-01-12",
            status: 'reviewed',
            matchScore: 92,
            skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
          },
          {
            id: "3",
            jobTitle: "Frontend Developer",
            applicantName: "Mike Johnson",
            applicantEmail: "mike.johnson@email.com",
            appliedDate: "2024-01-14",
            status: 'shortlisted',
            matchScore: 78,
            skills: ["React", "JavaScript", "HTML", "CSS"]
          }
        ];

        let mockCandidates: Candidate[] = [];
        
        if (isPreviewMode) {
          const demoData = getDemoData();
          // Use mock candidates data or fallback to empty array
          mockCandidates = demoData ? [] : []; // Will show demo candidates with CTA
        } else {
          mockCandidates = [
            {
            id: "1",
            name: "Sarah Wilson",
            headline: "Senior Frontend Developer",
            location: "San Francisco, CA",
            availability: "Available immediately",
            contact: {
              email: "sarah.wilson@email.com",
              phone: "+1 (415) 555-0123"
            },
            education: {
              degree: "Bachelor of Science in Computer Science",
              institution: "Stanford University",
              graduationYear: 2019
            },
            experience: [
              {
                title: "Senior Frontend Developer",
                company: "TechCorp Inc.",
                duration: "2021 - Present",
                bulletPoints: [
                  "Led development of responsive web applications using React and TypeScript",
                  "Improved application performance by 40% through code optimization",
                  "Mentored 3 junior developers and conducted code reviews"
                ]
              }
            ],
            skills: [
              { name: "React", level: "Expert" },
              { name: "TypeScript", level: "Advanced" },
              { name: "Next.js", level: "Advanced" }
            ],
            languages: ["English", "Spanish"],
            expectedSalary: {
              min: 120000,
              max: 150000,
              currency: "USD"
            },
            bio: "Passionate frontend developer with 5+ years of experience building scalable web applications.",
            profilePicture: "/images/user/user-01.png",
            matchScore: 95
          },
          {
            id: "2",
            name: "Alex Chen",
            headline: "UI/UX Designer",
            location: "New York, NY",
            availability: "Available in 2 weeks",
            contact: {
              email: "alex.chen@email.com",
              phone: "+1 (212) 555-0456"
            },
            education: {
              degree: "Bachelor of Fine Arts in Design",
              institution: "Parsons School of Design",
              graduationYear: 2020
            },
            experience: [
              {
                title: "UI/UX Designer",
                company: "Design Studio Pro",
                duration: "2020 - Present",
                bulletPoints: [
                  "Designed user interfaces for mobile and web applications",
                  "Conducted user research and usability testing",
                  "Created design systems and component libraries"
                ]
              }
            ],
            skills: [
              { name: "Figma", level: "Expert" },
              { name: "Adobe XD", level: "Advanced" },
              { name: "Prototyping", level: "Expert" }
            ],
            languages: ["English", "Mandarin"],
            expectedSalary: {
              min: 80000,
              max: 110000,
              currency: "USD"
            },
            bio: "Creative UI/UX designer focused on creating meaningful user experiences.",
            profilePicture: "/images/user/user-02.png",
            matchScore: 88
          },
          {
            id: "3",
            name: "David Brown",
            headline: "Full Stack Developer",
            location: "Austin, TX",
            availability: "Available immediately",
            contact: {
              email: "david.brown@email.com",
              phone: "+1 (512) 555-0789"
            },
            education: {
              degree: "Master of Science in Software Engineering",
              institution: "University of Texas",
              graduationYear: 2018
            },
            experience: [
              {
                title: "Full Stack Developer",
                company: "Innovation Labs",
                duration: "2018 - Present",
                bulletPoints: [
                  "Developed full-stack applications using React, Node.js, and PostgreSQL",
                  "Implemented CI/CD pipelines and automated testing",
                  "Led technical architecture decisions for new features"
                ]
              }
            ],
            skills: [
              { name: "React", level: "Advanced" },
              { name: "Node.js", level: "Expert" },
              { name: "Python", level: "Advanced" }
            ],
            languages: ["English", "French"],
            expectedSalary: {
              min: 100000,
              max: 130000,
              currency: "USD"
            },
            bio: "Full stack developer with expertise in modern web technologies.",
            profilePicture: "/images/user/user-03.png",
            matchScore: 82
          }
          ];
        }

        let mockStats;
        if (isPreviewMode) {
          const demoData = getDemoData();
          if (demoData?.stats) {
            mockStats = {
              totalJobs: demoData.stats.jobsPosted,
              activeJobs: demoData.stats.activeProjects,
              totalApplications: demoData.stats.applicationsReceived,
              pendingApplications: Math.floor(demoData.stats.applicationsReceived * 0.3),
              averageTimeToFill: demoData.stats.avgTimeToHire,
              totalViews: demoData.stats.applicationsReceived * 3,
              shortlistedCandidates: demoData.stats.candidatesInterviewed,
              savedCandidates: Math.floor(demoData.stats.candidatesInterviewed * 0.8)
            };
          } else {
            mockStats = {
              totalJobs: 0,
              activeJobs: 0,
              totalApplications: 0,
              pendingApplications: 0,
              averageTimeToFill: 0,
              totalViews: 0,
              shortlistedCandidates: 0,
              savedCandidates: 0
            };
          }
        } else {
          mockStats = {
            totalJobs: 15,
            activeJobs: 8,
            totalApplications: 45,
            pendingApplications: 12,
            averageTimeToFill: 14,
            totalViews: 234,
            shortlistedCandidates: 5,
            savedCandidates: 3
          };
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("🏢 Setting employer homepage data:", {
          jobs: mockJobs.length,
          applications: mockApplications.length,
          candidates: mockCandidates.length,
          stats: mockStats
        });

        setRecentJobs(mockJobs);
        setApplications(mockApplications);
        setRecommendedCandidates(mockCandidates);
        setStats(mockStats);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching data';
        console.error('🏢 Error fetching employer homepage data:', error);
        setError(errorMessage);
        
        // Set safe defaults on error
        setRecentJobs([]);
        setApplications([]);
        setRecommendedCandidates([]);
        setStats({
          totalJobs: 0,
          activeJobs: 0,
          totalApplications: 0,
          pendingApplications: 0,
          averageTimeToFill: 0,
          totalViews: 0,
          shortlistedCandidates: 0,
          savedCandidates: 0
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isPreviewMode]);

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
          console.log("🏢 Avatar image failed to load, using fallback");
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : (
      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
        <User className="h-6 w-6 text-white" />
      </div>
    );
  }, [user]);

  // Event handlers
  const handlePostJob = useCallback(() => {
    console.log("🏢 Post job button clicked");
    router.push('/employer_portal/workspace/post-job');
  }, [router]);

  const handleManageJobs = useCallback(() => {
    console.log("🏢 Manage jobs button clicked");
    router.push('/employer_portal/workspace/manage-jobs');
  }, [router]);

  const handleViewApplications = useCallback(() => {
    console.log("🏢 View applications button clicked");
    router.push('/employer_portal/workspace/applications');
  }, [router]);

  const handleViewCandidates = useCallback(() => {
    console.log("🏢 View candidates button clicked");
    router.push('/employer_portal/workspace/candidates');
  }, [router]);

  // Show loading state while fetching data
  if (isDataLoading) {
    console.log("🏢 Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    console.log("🏢 Showing error state:", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Something went wrong loading the dashboard</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("🏢 Rendering main content with jobs:", recentJobs.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Preview Banner */}
      <PreviewBanner />
      
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {userAvatar}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {greeting}, {user?.name || "Employer"}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.company ? `${user.company} • ${user.role || 'Recruiter'}` : 'Ready to find the perfect candidates?'}
                </p>
              </div>
            </div>
            {/* Primary Action - Post a Job */}
            <LockedFeature feature="post_job" showOverlay={false}>
              <button
                onClick={handlePostJob}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Post a Job
              </button>
            </LockedFeature>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Eye}
            value={stats.totalViews}
            label="Total Views"
            change={isPreviewMode ? undefined : "+15% this week"}
            changeType="positive"
          />
          <StatCard
            icon={Users}
            value={stats.totalApplications}
            label="Total Applications"
            change={isPreviewMode ? undefined : `+${stats.pendingApplications} today`}
            changeType="positive"
          />
          <StatCard
            icon={FileText}
            value={stats.pendingApplications}
            label="Pending Review"
            change={isPreviewMode ? undefined : `+${stats.pendingApplications} today`}
            changeType="positive"
          />
          <StatCard
            icon={Briefcase}
            value={stats.activeJobs}
            label="Active Job Postings"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Postings and Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Job Postings */}
            <JobListCard
              title="Recent Job Postings"
              subtitle="Your latest job listings and their performance"
              icon={Briefcase}
              jobs={recentJobs}
              onViewJob={(jobId) => {
                originTracking.setOrigin('homepage');
                router.push(`/jobs/${jobId}`);
              }}
              onEditJob={(jobId) => {
                originTracking.setOrigin('homepage');
                router.push(`/jobs/edit/${jobId}`);
              }}
              onManageJobs={handleManageJobs}
            />

            {/* Job Posting Performance - directly underneath Recent Job Postings */}
            <JobPostingPerformance
              title="Job Posting Performance"
              subtitle="Track posting effectiveness with applications and conversion rates"
              icon={BarChart3}
            />
          </div>

          {/* Right Column - Recommended Candidates */}
          <div>
            {isPreviewMode ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Candidate Recommendations
                  </h3>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Sign in to view personalized candidate recommendations based on your job requirements.
                </p>
              </div>
            ) : (
              <RecommendedCandidates 
                candidates={recommendedCandidates}
              />
            )}
          </div>
        </div>

        {/* Phase 2: Verification & Discovery Hub */}
        <div className="mt-8 mb-8">
          <VerificationDiscoveryHub userType="employer" />
        </div>

        {/* Preview Mode CTA Showcase */}
        {isPreviewMode && (
          <div className="mt-8">
            <PreviewModeShowcase variant="inline" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerHomepage;
