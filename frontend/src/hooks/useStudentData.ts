"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

// Types
interface BillingData {
  invoices: Array<{
    id: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: string;
    description: string;
  }>;
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
}

interface WorkingProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  earnings: number;
  employer: string;
  progress: number;
}

interface LevelData {
  level: number;
  xp: number;
  careerCoins: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    xpReward: number;
  }>;
  nextLevelXP: number;
  progressPercentage: number;
}

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'employers_only';
    showEarnings: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

// Billing Queries
export const useBillingData = () => {
  return useQuery({
    queryKey: ['billing'],
    queryFn: async (): Promise<BillingData> => {
      const response = await api.get('/student/billing');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Working Projects Queries
export const useWorkingProjects = () => {
  return useQuery({
    queryKey: ['working-projects'],
    queryFn: async (): Promise<WorkingProject[]> => {
      const response = await api.get('/student/working-projects');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (projects can change frequently)
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Level System Queries
export const useLevelData = () => {
  return useQuery({
    queryKey: ['level-data'],
    queryFn: async (): Promise<LevelData> => {
      const response = await api.get('/student/level-data');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (level data doesn't change often)
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Settings Queries
export const useSettingsData = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<SettingsData> => {
      const response = await api.get('/student/settings');
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (settings don't change often)
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};

// Settings Mutations
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<SettingsData>) => {
      const response = await api.put('/student/settings', settings);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Parallel Data Fetching Hook
export const useStudentDashboardData = () => {
  const billingQuery = useBillingData();
  const projectsQuery = useWorkingProjects();
  const levelQuery = useLevelData();
  
  return {
    billing: billingQuery.data,
    projects: projectsQuery.data,
    level: levelQuery.data,
    isLoading: billingQuery.isLoading || projectsQuery.isLoading || levelQuery.isLoading,
    isError: billingQuery.isError || projectsQuery.isError || levelQuery.isError,
    error: billingQuery.error || projectsQuery.error || levelQuery.error,
  };
};

// Optimistic Updates for Level System
export const useGainXP = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ xp, reason }: { xp: number; reason: string }) => {
      const response = await api.post('/student/gain-xp', { xp, reason });
      return response.data;
    },
    onMutate: async ({ xp }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['level-data'] });
      
      // Snapshot the previous value
      const previousLevelData = queryClient.getQueryData(['level-data']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['level-data'], (old: LevelData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          xp: old.xp + xp,
          progressPercentage: Math.min(100, ((old.xp + xp) / old.nextLevelXP) * 100),
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousLevelData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLevelData) {
        queryClient.setQueryData(['level-data'], context.previousLevelData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['level-data'] });
    },
  });
};

// Prefetch hooks for better UX
export const usePrefetchStudentData = () => {
  const queryClient = useQueryClient();
  
  const prefetchBilling = () => {
    queryClient.prefetchQuery({
      queryKey: ['billing'],
      queryFn: async () => {
        const response = await api.get('/student/billing');
        return response.data;
      },
    });
  };
  
  const prefetchProjects = () => {
    queryClient.prefetchQuery({
      queryKey: ['working-projects'],
      queryFn: async () => {
        const response = await api.get('/student/working-projects');
        return response.data;
      },
    });
  };
  
  const prefetchLevelData = () => {
    queryClient.prefetchQuery({
      queryKey: ['level-data'],
      queryFn: async () => {
        const response = await api.get('/student/level-data');
        return response.data;
      },
    });
  };
  
  const prefetchSettings = () => {
    queryClient.prefetchQuery({
      queryKey: ['settings'],
      queryFn: async () => {
        const response = await api.get('/student/settings');
        return response.data;
      },
    });
  };
  
  return {
    prefetchBilling,
    prefetchProjects,
    prefetchLevelData,
    prefetchSettings,
  };
};
