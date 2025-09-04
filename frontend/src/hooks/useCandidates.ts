import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Types
interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  location: string;
  matchScore: number;
  education: string;
  availability: string;
  hourlyRate: string;
  lastActive: string;
  avatar?: string;
}

interface CandidateFilters {
  search?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  availability?: string;
}

interface CandidatesResponse {
  candidates: Candidate[];
  nextCursor?: string;
  total: number;
}

// Query Keys
export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: (filters: CandidateFilters) => [...candidateKeys.lists(), filters] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
  starred: () => [...candidateKeys.all, 'starred'] as const,
};

// API Functions
const fetchCandidates = async (filters: CandidateFilters, cursor?: string): Promise<CandidatesResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.location) params.append('location', filters.location);
  if (filters.experience) params.append('experience', filters.experience);
  if (filters.availability) params.append('availability', filters.availability);
  if (filters.skills?.length) params.append('skills', filters.skills.join(','));
  if (cursor) params.append('cursor', cursor);

  const response = await api.get(`/candidates?${params.toString()}`);
  return response.data;
};

const fetchCandidate = async (id: string): Promise<Candidate> => {
  const response = await api.get(`/candidates/${id}`);
  return response.data;
};

// Hooks
export function useCandidates(filters: CandidateFilters = {}) {
  return useInfiniteQuery({
    queryKey: candidateKeys.list(filters),
    queryFn: ({ pageParam }) => fetchCandidates(filters, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: candidateKeys.detail(id),
    queryFn: () => fetchCandidate(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function useStarCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ candidateId, starred }: { candidateId: string; starred: boolean }) => {
      const response = await api.post(`/candidates/${candidateId}/star`, { starred });
      return response.data;
    },
    onMutate: async ({ candidateId, starred }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: candidateKeys.detail(candidateId) });
      
      // Snapshot previous value
      const previousCandidate = queryClient.getQueryData(candidateKeys.detail(candidateId));
      
      // Optimistically update
      queryClient.setQueryData(candidateKeys.detail(candidateId), (old: Candidate | undefined) => {
        if (!old) return old;
        return { ...old, starred };
      });
      
      return { previousCandidate };
    },
    onError: (err, { candidateId }, context) => {
      // Rollback on error
      if (context?.previousCandidate) {
        queryClient.setQueryData(candidateKeys.detail(candidateId), context.previousCandidate);
      }
    },
    onSettled: (data, error, { candidateId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(candidateId) });
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}

export function useShortlistCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ candidateId, shortlisted }: { candidateId: string; shortlisted: boolean }) => {
      const response = await api.post(`/candidates/${candidateId}/shortlist`, { shortlisted });
      return response.data;
    },
    onMutate: async ({ candidateId, shortlisted }) => {
      await queryClient.cancelQueries({ queryKey: candidateKeys.detail(candidateId) });
      
      const previousCandidate = queryClient.getQueryData(candidateKeys.detail(candidateId));
      
      queryClient.setQueryData(candidateKeys.detail(candidateId), (old: Candidate | undefined) => {
        if (!old) return old;
        return { ...old, shortlisted };
      });
      
      return { previousCandidate };
    },
    onError: (err, { candidateId }, context) => {
      if (context?.previousCandidate) {
        queryClient.setQueryData(candidateKeys.detail(candidateId), context.previousCandidate);
      }
    },
    onSettled: (data, error, { candidateId }) => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.detail(candidateId) });
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
    },
  });
}

// Prefetch hook for better UX
export function usePrefetchCandidate(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: candidateKeys.detail(id),
      queryFn: () => fetchCandidate(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}


