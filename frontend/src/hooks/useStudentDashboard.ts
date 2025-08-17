import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  matchScore: number;
  status: 'active' | 'applied' | 'saved';
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  appliedDate: string;
  lastUpdated: string;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  skills: string[];
  education: string;
  availability: string;
}

interface DashboardStats {
  totalJobs: number;
  appliedJobs: number;
  savedJobs: number;
  pendingApplications: number;
  interviewsScheduled: number;
  profileCompletion: number;
}

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  jobs: () => [...dashboardKeys.all, 'jobs'] as const,
  applications: () => [...dashboardKeys.all, 'applications'] as const,
  profile: () => [...dashboardKeys.all, 'profile'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recommendations: () => [...dashboardKeys.all, 'recommendations'] as const,
};

// API Functions
const fetchJobs = async (): Promise<Job[]> => {
  const response = await api.get('/jobs/recommended');
  return response.data;
};

const fetchApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications');
  return response.data;
};

const fetchProfile = async (): Promise<StudentProfile> => {
  const response = await api.get('/profile');
  return response.data;
};

const fetchStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

const fetchRecommendations = async (): Promise<Job[]> => {
  const response = await api.get('/jobs/recommendations');
  return response.data;
};

// Hooks
export function useJobs() {
  return useQuery({
    queryKey: dashboardKeys.jobs(),
    queryFn: fetchJobs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useApplications() {
  return useQuery({
    queryKey: dashboardKeys.applications(),
    queryFn: fetchApplications,
    staleTime: 1 * 60 * 1000, // 1 minute (applications change frequently)
    cacheTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true, // Keep applications fresh
  });
}

export function useProfile() {
  return useQuery({
    queryKey: dashboardKeys.profile(),
    queryFn: fetchProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes (profile doesn't change often)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function useStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: dashboardKeys.recommendations(),
    queryFn: fetchRecommendations,
    staleTime: 15 * 60 * 1000, // 15 minutes (recommendations are expensive to compute)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

// Mutations
export function useSaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ jobId, saved }: { jobId: string; saved: boolean }) => {
      const response = await api.post(`/jobs/${jobId}/save`, { saved });
      return response.data;
    },
    onMutate: async ({ jobId, saved }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: dashboardKeys.jobs() });
      await queryClient.cancelQueries({ queryKey: dashboardKeys.recommendations() });
      
      // Snapshot previous values
      const previousJobs = queryClient.getQueryData(dashboardKeys.jobs());
      const previousRecommendations = queryClient.getQueryData(dashboardKeys.recommendations());
      
      // Optimistically update jobs
      queryClient.setQueryData(dashboardKeys.jobs(), (old: Job[] | undefined) => {
        if (!old) return old;
        return old.map(job => 
          job.id === jobId ? { ...job, status: saved ? 'saved' : 'active' } : job
        );
      });
      
      // Optimistically update recommendations
      queryClient.setQueryData(dashboardKeys.recommendations(), (old: Job[] | undefined) => {
        if (!old) return old;
        return old.map(job => 
          job.id === jobId ? { ...job, status: saved ? 'saved' : 'active' } : job
        );
      });
      
      return { previousJobs, previousRecommendations };
    },
    onError: (err, { jobId }, context) => {
      // Rollback on error
      if (context?.previousJobs) {
        queryClient.setQueryData(dashboardKeys.jobs(), context.previousJobs);
      }
      if (context?.previousRecommendations) {
        queryClient.setQueryData(dashboardKeys.recommendations(), context.previousRecommendations);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: dashboardKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.recommendations() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.post(`/jobs/${jobId}/apply`);
      return response.data;
    },
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: dashboardKeys.jobs() });
      await queryClient.cancelQueries({ queryKey: dashboardKeys.applications() });
      
      const previousJobs = queryClient.getQueryData(dashboardKeys.jobs());
      const previousApplications = queryClient.getQueryData(dashboardKeys.applications());
      
      // Optimistically update jobs
      queryClient.setQueryData(dashboardKeys.jobs(), (old: Job[] | undefined) => {
        if (!old) return old;
        return old.map(job => 
          job.id === jobId ? { ...job, status: 'applied' } : job
        );
      });
      
      // Optimistically add to applications
      queryClient.setQueryData(dashboardKeys.applications(), (old: Application[] | undefined) => {
        if (!old) return old;
        const job = queryClient.getQueryData(dashboardKeys.jobs())?.find(j => j.id === jobId);
        if (!job) return old;
        
        const newApplication: Application = {
          id: `temp-${Date.now()}`,
          jobId,
          jobTitle: job.title,
          company: job.company,
          status: 'pending',
          appliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        
        return [newApplication, ...old];
      });
      
      return { previousJobs, previousApplications };
    },
    onError: (err, jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(dashboardKeys.jobs(), context.previousJobs);
      }
      if (context?.previousApplications) {
        queryClient.setQueryData(dashboardKeys.applications(), context.previousApplications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.applications() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
    },
  });
}

// Prefetch hooks for better UX
export function usePrefetchJob(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['job', id],
      queryFn: async () => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

