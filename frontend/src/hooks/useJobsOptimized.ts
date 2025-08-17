import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
}

interface JobFilters {
  location?: string;
  category?: string;
  experience?: string;
  salary?: string;
}

// Query Keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: JobFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

// API Functions
const fetchJobs = async (filters?: JobFilters): Promise<Job[]> => {
  const params = new URLSearchParams();
  if (filters?.location) params.append('location', filters.location);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.experience) params.append('experience', filters.experience);
  if (filters?.salary) params.append('salary', filters.salary);

  const response = await api.get(`/jobs?${params.toString()}`);
  return response.data;
};

const fetchJob = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Hooks
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: jobKeys.list(filters || {}),
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => fetchJob(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: Omit<Job, 'id' | 'postedDate'>) => {
      const response = await api.post('/jobs', jobData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...jobData }: Partial<Job> & { id: string }) => {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update cache directly for optimistic updates
      queryClient.setQueryData(jobKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// Prefetch hook for better UX
export function usePrefetchJob(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: jobKeys.detail(id),
      queryFn: () => fetchJob(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

