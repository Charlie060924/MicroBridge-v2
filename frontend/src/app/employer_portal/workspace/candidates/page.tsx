"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Star, MapPin, Clock, Eye, User, ChevronLeft } from 'lucide-react';
import { useCandidates } from '@/hooks/useEmployerData';
import { VirtualizedCandidateList } from '@/components/virtualized/VirtualizedCandidateList';
import { CandidatesSkeleton } from '@/components/skeletons/EmployerSkeletons';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CandidatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [starredCandidates, setStarredCandidates] = useState<Set<string>>(new Set());

  // Use React Query for data fetching
  const { data: candidates = [], isLoading, error } = useCandidates();

  // Load starred candidates from localStorage
  useEffect(() => {
    const savedStarred = localStorage.getItem('starredCandidates');
    if (savedStarred) {
      setStarredCandidates(new Set(JSON.parse(savedStarred)));
    }
  }, []);

  // Memoized filtered candidates
  const filteredCandidates = useMemo(() => {
    let filtered: typeof candidates = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(candidate =>
        candidate.headline.toLowerCase().includes(selectedRole.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    return filtered;
  }, [candidates, searchTerm, selectedRole, selectedLocation]);

  const handleStarToggle = useCallback((candidateId: string) => {
    const newStarred = new Set(starredCandidates);
    if (newStarred.has(candidateId)) {
      newStarred.delete(candidateId);
    } else {
      newStarred.add(candidateId);
    }
    setStarredCandidates(newStarred);
    localStorage.setItem('starredCandidates', JSON.stringify([...newStarred]));
  }, [starredCandidates]);

  const handleCandidateClick = useCallback((candidate: any) => {
    // Navigate to candidate detail page
    window.location.href = `/employer_portal/workspace/candidates/${candidate.id}`;
  }, []);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (isLoading) {
    return <CandidatesSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading candidates</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/employer_portal/workspace"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Browse Candidates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find the perfect candidate for your team
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="engineer">Engineer</option>
              <option value="scientist">Scientist</option>
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Locations</option>
              <option value="san francisco">San Francisco</option>
              <option value="new york">New York</option>
              <option value="austin">Austin</option>
              <option value="seattle">Seattle</option>
              <option value="denver">Denver</option>
              <option value="boston">Boston</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <AnimatePresence mode="wait">
          {filteredCandidates.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No candidates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="candidates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px]"
            >
              <VirtualizedCandidateList
                candidates={filteredCandidates}
                starredCandidates={starredCandidates}
                onStarToggle={handleStarToggle}
                onCandidateClick={handleCandidateClick}
                height={600}
                itemHeight={200}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CandidatesPage;
