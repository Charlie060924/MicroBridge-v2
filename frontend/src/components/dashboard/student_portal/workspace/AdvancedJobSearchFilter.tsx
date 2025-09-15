'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, MapPin, DollarSign, Clock, Briefcase, Zap, Settings2 } from 'lucide-react';
import AutocompleteInput from '@/components/ui/AutocompleteInput';
import { HelpTooltip } from '@/components/ui/Tooltip';
import { SKILL_CATEGORIES, CAREER_INTERESTS, TARGET_INDUSTRIES } from '@/app/student_portal/workspace/settings/utils/studentConstants';
import { jobService, type JobFilters } from '@/services/jobService';
import { matchingService } from '@/services/matchingService';
import { useAuth } from '@/hooks/useAuth';

interface AdvancedJobSearchFilterProps {
  onSearch: (query: string, filters: JobFilters, useAI?: boolean) => void;
  onFiltersChange?: (filters: JobFilters) => void;
  className?: string;
  initialQuery?: string;
  initialFilters?: JobFilters;
}

interface SalaryRange {
  min: number;
  max: number;
}

interface ExtendedJobFilters extends JobFilters {
  salary_min?: number;
  salary_max?: number;
  work_arrangement?: string;
  duration_min?: number;
  duration_max?: number;
  keywords?: string[];
  exclude_applied?: boolean;
  sort_by?: 'relevance' | 'salary' | 'date' | 'match_score';
}

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'senior', label: 'Senior' },
  { value: 'expert', label: 'Expert' }
];

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const WORK_ARRANGEMENTS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'match_score', label: 'Best Match (AI)' },
  { value: 'date', label: 'Most Recent' },
  { value: 'salary', label: 'Highest Salary' }
];

const HK_LOCATIONS = [
  'Hong Kong Island', 'Kowloon', 'New Territories', 'Central', 'Admiralty', 
  'Wan Chai', 'Causeway Bay', 'Tsim Sha Tsui', 'Mong Kok', 'Kwun Tong',
  'Sha Tin', 'Tai Po', 'Tuen Mun', 'Remote', 'Flexible'
];

export const AdvancedJobSearchFilter: React.FC<AdvancedJobSearchFilterProps> = ({
  onSearch,
  onFiltersChange,
  className = '',
  initialQuery = '',
  initialFilters = {}
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<ExtendedJobFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useAIMatching, setUseAIMatching] = useState(true);
  const [salaryRange, setSalaryRange] = useState<SalaryRange>({
    min: filters.salary_min || 0,
    max: filters.salary_max || 50000
  });

  // Convert skill categories for autocomplete
  const skillOptions = useMemo(() => 
    SKILL_CATEGORIES.flatMap(category =>
      category.skills.map(skill => ({
        value: skill.value,
        label: skill.label,
        category: category.category
      }))
    ),
    []
  );

  const locationOptions = useMemo(() =>
    HK_LOCATIONS.map(location => ({
      value: location.toLowerCase().replace(/\s+/g, '_'),
      label: location
    })),
    []
  );

  const categoryOptions = useMemo(() =>
    CAREER_INTERESTS.map(interest => ({
      value: interest.value,
      label: interest.label
    })),
    []
  );

  const industryOptions = useMemo(() =>
    TARGET_INDUSTRIES.map(industry => ({
      value: industry.value,
      label: industry.label
    })),
    []
  );

  // Update filters when salary range changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      salary_min: salaryRange.min > 0 ? salaryRange.min : undefined,
      salary_max: salaryRange.max < 50000 ? salaryRange.max : undefined
    }));
  }, [salaryRange]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = <K extends keyof ExtendedJobFilters>(
    key: K,
    value: ExtendedJobFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(Boolean) : [];
    updateFilter('skills', skills);
  };

  const handleSearch = () => {
    const searchFilters: JobFilters = {
      ...filters,
      // Remove extended properties that aren't part of JobFilters
      salary_min: undefined,
      salary_max: undefined,
      work_arrangement: undefined,
      duration_min: undefined,
      duration_max: undefined,
      keywords: undefined,
      exclude_applied: undefined,
      sort_by: undefined
    };

    onSearch(searchQuery, searchFilters, useAIMatching);
  };

  const clearFilters = () => {
    setFilters({});
    setSalaryRange({ min: 0, max: 50000 });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.skills?.length) count++;
    if (filters.location) count++;
    if (filters.experience_level) count++;
    if (filters.job_type) count++;
    if (filters.is_remote !== undefined) count++;
    if (filters.salary_min || filters.salary_max) count++;
    return count;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for jobs, skills, or companies..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
            showAdvanced 
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* AI Matching Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useAIMatching}
              onChange={(e) => setUseAIMatching(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use AI-powered matching
            </span>
          </label>
          <HelpTooltip
            content="AI matching uses machine learning to find jobs that best match your skills, interests, and career goals, providing personalized recommendations."
            position="top"
          />
          {useAIMatching && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
              <Zap className="w-3 h-3" />
              <span>AI Enabled</span>
            </div>
          )}
        </div>
        
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Row 1: Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <AutocompleteInput
                options={categoryOptions}
                value={filters.category || ''}
                onChange={(value) => updateFilter('category', value)}
                placeholder="Select job category"
                allowFreeText={false}
                searchable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={filters.experience_level || ''}
                onChange={(e) => updateFilter('experience_level', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Any Experience</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select
                value={filters.job_type || ''}
                onChange={(e) => updateFilter('job_type', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Any Type</option>
                {JOB_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Skills and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Skills
              </label>
              <AutocompleteInput
                options={skillOptions}
                value={filters.skills?.join(', ') || ''}
                onChange={handleSkillsChange}
                placeholder="Type skills (comma separated)"
                allowFreeText={true}
                searchable={true}
                groupByCategory={true}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <AutocompleteInput
                options={locationOptions}
                value={filters.location || ''}
                onChange={(value) => updateFilter('location', value)}
                placeholder="Select location"
                allowFreeText={true}
                searchable={true}
              />
            </div>
          </div>

          {/* Row 3: Work Arrangement and Remote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Arrangement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WORK_ARRANGEMENTS.map(arrangement => (
                  <label key={arrangement.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="work_arrangement"
                      value={arrangement.value}
                      checked={filters.work_arrangement === arrangement.value}
                      onChange={(e) => updateFilter('work_arrangement', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {arrangement.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort_by || 'relevance'}
                onChange={(e) => updateFilter('sort_by', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Salary Range (HKD)
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={salaryRange.min}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={salaryRange.max}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Min: {salaryRange.min > 0 ? `HKD ${salaryRange.min.toLocaleString()}` : 'Any'}
                </span>
                <span>
                  Max: {salaryRange.max < 50000 ? `HKD ${salaryRange.max.toLocaleString()}` : 'Any'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.exclude_applied || false}
                onChange={(e) => updateFilter('exclude_applied', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Exclude jobs I've applied to
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedJobSearchFilter;