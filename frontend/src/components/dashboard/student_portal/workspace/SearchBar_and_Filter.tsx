
'use client';
import React, { useState, useCallback } from 'react';
import AdvancedJobSearchFilter from './AdvancedJobSearchFilter';
import { jobService, type JobFilters } from '@/services/jobService';
import { matchingService } from '@/services/matchingService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface SearchBarAndFilterProps {
  onJobsUpdate?: (jobs: any[], totalCount: number, isAIRecommendations?: boolean) => void;
  className?: string;
}

export default function SearchBar_and_Filter({ onJobsUpdate, className = '' }: SearchBarAndFilterProps) {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (
    query: string,
    filters: JobFilters,
    useAI: boolean = false
  ) => {
    setIsSearching(true);
    
    try {
      let result;
      
      if (useAI && user?.id) {
        // Use AI-powered matching for personalized results
        const aiResult = await matchingService.getAIJobRecommendations(user.id, {
          limit: 50,
          include_explanations: true,
          include_skill_analysis: true
        });
        
        if (aiResult.success && aiResult.data) {
          // Transform AI recommendations to job format
          const jobs = aiResult.data.recommendations.map(rec => ({
            id: rec.job_id,
            match_score: rec.final_score,
            confidence: rec.confidence_level,
            explanation: rec.explanation,
            skill_gap_analysis: rec.skill_gap_analysis,
            // Additional job details would be fetched separately
          }));
          
          onJobsUpdate?.(jobs, aiResult.data.total_count, true);
          toast.success(`Found ${jobs.length} AI-matched opportunities`);
        } else {
          throw new Error(aiResult.message || 'AI matching failed');
        }
      } else {
        // Use traditional search/filter
        if (query.trim()) {
          result = await jobService.searchJobs(query, filters, 1, 50);
        } else {
          result = await jobService.listJobs(filters, 1, 50);
        }
        
        if (result.success && result.data) {
          onJobsUpdate?.(result.data.jobs, result.data.pagination.total, false);
          toast.success(`Found ${result.data.jobs.length} jobs`);
        } else {
          throw new Error(result.message || 'Search failed');
        }
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || 'Search failed. Please try again.');
      onJobsUpdate?.([], 0, false);
    } finally {
      setIsSearching(false);
    }
  }, [user, onJobsUpdate]);

  const handleFiltersChange = useCallback((filters: JobFilters) => {
    // Optional: Auto-search when filters change
    // Uncomment if you want real-time filtering
    // handleSearch('', filters, false);
  }, []);

  return (
    <div className={className}>
      <AdvancedJobSearchFilter
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
      />
      
      {isSearching && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Searching for opportunities...</span>
          </div>
        </div>
      )}
    </div>
  );
}
