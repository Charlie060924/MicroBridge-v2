import { useState, useEffect } from 'react';
import { mockApi, Job } from '@/services/mockData';

interface Match {
  id: string;
  job: Job;
  score: number;
  matchReason: string;
}

export function useMatching() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Simulate matching algorithm
        const { jobs } = await mockApi.getJobs();
        
        // Create mock matches with scores
        const mockMatches: Match[] = jobs.slice(0, 5).map((job, index) => ({
          id: `match-${job.id}`,
          job,
          score: Math.floor(Math.random() * 40) + 60, // 60-100 score
          matchReason: [
            'Skills match your profile',
            'Location preferences align',
            'Experience level matches',
            'Company culture fits',
            'Salary expectations match'
          ][index % 5]
        }));

        // Sort by score
        mockMatches.sort((a, b) => b.score - a.score);
        
        setMatches(mockMatches);
      } catch (err) {
        setError('Failed to fetch matches');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const refreshMatches = async () => {
    setLoading(true);
    try {
      const { jobs } = await mockApi.getJobs();
      
      const mockMatches: Match[] = jobs.slice(0, 5).map((job, index) => ({
        id: `match-${job.id}`,
        job,
        score: Math.floor(Math.random() * 40) + 60,
        matchReason: [
          'Skills match your profile',
          'Location preferences align',
          'Experience level matches',
          'Company culture fits',
          'Salary expectations match'
        ][index % 5]
      }));

      mockMatches.sort((a, b) => b.score - a.score);
      setMatches(mockMatches);
    } catch (err) {
      setError('Failed to refresh matches');
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    loading,
    error,
    refreshMatches,
  };
}
