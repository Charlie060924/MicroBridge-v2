import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { mockCandidates, Candidate } from '@/data/mockCandidates';

// Types
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
  candidateName: string;
  matchScore: number;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedDate: string;
}

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  averageTimeToFill: number;
  totalViews: number;
  shortlistedCandidates: number;
  savedCandidates: number;
}

interface ReportData {
  jobPerformance: any[];
  funnelData: any[];
  sourceData: any[];
  timeToFill: any[];
  demographics: any[];
  roi: any[];
}

// Mock API functions (replace with real API calls)
const mockApi = {
  // Candidates
  getCandidates: async (filters?: any): Promise<Candidate[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCandidates;
  },

  // Jobs
  getJobs: async (filters?: any): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: "1",
        title: "Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$80-120k",
        duration: "Full-time",
        category: "Development",
        description: "Build responsive web applications",
        skills: ["React", "TypeScript", "CSS"],
        rating: 4.5,
        isBookmarked: false,
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        isRemote: true,
        experienceLevel: "Mid-level",
        status: "active",
        applications: 25,
        views: 150
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "DesignStudio",
        location: "New York, NY",
        salary: "$70-100k",
        duration: "Full-time",
        category: "Design",
        description: "Create beautiful user interfaces",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        rating: 4.8,
        isBookmarked: true,
        postedDate: "2024-01-10",
        deadline: "2024-02-10",
        isRemote: false,
        experienceLevel: "Senior",
        status: "active",
        applications: 18,
        views: 120
      }
    ];
  },

  // Applications
  getApplications: async (): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: "1",
        jobTitle: "Frontend Developer",
        candidateName: "John Doe",
        matchScore: 92,
        status: "pending",
        appliedDate: "2024-01-20"
      },
      {
        id: "2",
        jobTitle: "UI/UX Designer",
        candidateName: "Jane Smith",
        matchScore: 88,
        status: "reviewed",
        appliedDate: "2024-01-18"
      }
    ];
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      totalJobs: 15,
      activeJobs: 8,
      totalApplications: 45,
      pendingApplications: 12,
      averageTimeToFill: 14,
      totalViews: 234,
      shortlistedCandidates: 5,
      savedCandidates: 3
    };
  },

  // Reports
  getReportData: async (): Promise<ReportData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      jobPerformance: [],
      funnelData: [],
      sourceData: [],
      timeToFill: [],
      demographics: [],
      roi: []
    };
  }
};

// Query Keys
export const employerQueryKeys = {
  all: ['employer'] as const,
  candidates: () => [...employerQueryKeys.all, 'candidates'] as const,
  jobs: () => [...employerQueryKeys.all, 'jobs'] as const,
  applications: () => [...employerQueryKeys.all, 'applications'] as const,
  dashboard: () => [...employerQueryKeys.all, 'dashboard'] as const,
  reports: () => [...employerQueryKeys.all, 'reports'] as const,
  stats: () => [...employerQueryKeys.all, 'stats'] as const,
};

// Hooks
export const useCandidates = (filters?: any) => {
  return useQuery({
    queryKey: employerQueryKeys.candidates(),
    queryFn: () => mockApi.getCandidates(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useJobs = (filters?: any) => {
  return useQuery({
    queryKey: employerQueryKeys.jobs(),
    queryFn: () => mockApi.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (jobs can change frequently)
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useApplications = () => {
  return useQuery({
    queryKey: employerQueryKeys.applications(),
    queryFn: () => mockApi.getApplications(),
    staleTime: 1 * 60 * 1000, // 1 minute (applications change frequently)
    cacheTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: employerQueryKeys.stats(),
    queryFn: () => mockApi.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useReportData = () => {
  return useQuery({
    queryKey: employerQueryKeys.reports(),
    queryFn: () => mockApi.getReportData(),
    staleTime: 10 * 60 * 1000, // 10 minutes (reports don't change often)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Parallel data fetching for dashboard
export const useEmployerDashboardData = () => {
  const statsQuery = useDashboardStats();
  const jobsQuery = useJobs();
  const applicationsQuery = useApplications();
  const candidatesQuery = useCandidates();

  return {
    stats: statsQuery.data,
    jobs: jobsQuery.data,
    applications: applicationsQuery.data,
    candidates: candidatesQuery.data,
    isLoading: statsQuery.isLoading || jobsQuery.isLoading || applicationsQuery.isLoading || candidatesQuery.isLoading,
    isError: statsQuery.isError || jobsQuery.isError || applicationsQuery.isError || candidatesQuery.isError,
    error: statsQuery.error || jobsQuery.error || applicationsQuery.error || candidatesQuery.error,
  };
};

// Prefetch hooks for better UX
export const usePrefetchEmployerData = () => {
  const queryClient = useQueryClient();
  
  const prefetchCandidates = () => {
    queryClient.prefetchQuery({
      queryKey: employerQueryKeys.candidates(),
      queryFn: () => mockApi.getCandidates(),
    });
  };
  
  const prefetchJobs = () => {
    queryClient.prefetchQuery({
      queryKey: employerQueryKeys.jobs(),
      queryFn: () => mockApi.getJobs(),
    });
  };
  
  const prefetchApplications = () => {
    queryClient.prefetchQuery({
      queryKey: employerQueryKeys.applications(),
      queryFn: () => mockApi.getApplications(),
    });
  };
  
  const prefetchReports = () => {
    queryClient.prefetchQuery({
      queryKey: employerQueryKeys.reports(),
      queryFn: () => mockApi.getReportData(),
    });
  };
  
  const prefetchDashboard = () => {
    queryClient.prefetchQuery({
      queryKey: employerQueryKeys.stats(),
      queryFn: () => mockApi.getDashboardStats(),
    });
  };
  
  return {
    prefetchCandidates,
    prefetchJobs,
    prefetchApplications,
    prefetchReports,
    prefetchDashboard,
  };
};

// Mutations for data updates
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: Partial<Job>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return jobData;
    },
    onSuccess: () => {
      // Invalidate and refetch jobs
      queryClient.invalidateQueries({ queryKey: employerQueryKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: employerQueryKeys.stats() });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: Partial<Application>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return applicationData;
    },
    onSuccess: () => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: employerQueryKeys.applications() });
      queryClient.invalidateQueries({ queryKey: employerQueryKeys.stats() });
    },
  });
};
