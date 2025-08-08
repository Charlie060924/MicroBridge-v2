import { useState, useEffect } from 'react';
import { mockApi, Job } from '@/services/mockData';

interface UseJobsOptions {
  filters?: {
    search?: string;
    type?: string;
    location?: string;
  };
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchJobs = async (filters = options.filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getJobs(filters);
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [options.filters]);

  const refetch = () => {
    fetchJobs();
  };

  const getJob = async (id: string): Promise<Job | null> => {
    try {
      return await mockApi.getJob(id);
    } catch (err) {
      console.error('Error fetching job:', err);
      return null;
    }
  };

  return {
    jobs,
    loading,
    error,
    total,
    refetch,
    getJob,
  };
}
