"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Eye, User, ChevronLeft } from 'lucide-react';
import { mockCandidates, Candidate } from '@/data/mockCandidates';
import Link from 'next/link';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [starredCandidates, setStarredCandidates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load starred candidates from localStorage
  useEffect(() => {
    const savedStarred = localStorage.getItem('starredCandidates');
    if (savedStarred) {
      setStarredCandidates(new Set(JSON.parse(savedStarred)));
    }
  }, []);

  // Load candidates data
  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setIsLoading(false);
    };

    loadCandidates();
  }, []);

  // Filter candidates based on search and filters
  useEffect(() => {
    let filtered = candidates;

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

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, selectedRole, selectedLocation]);

  const handleStarToggle = (candidateId: string) => {
    const newStarred = new Set(starredCandidates);
    if (newStarred.has(candidateId)) {
      newStarred.delete(candidateId);
    } else {
      newStarred.add(candidateId);
    }
    setStarredCandidates(newStarred);
    localStorage.setItem('starredCandidates', JSON.stringify([...newStarred]));
  };

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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
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
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No candidates found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {candidate.profilePicture ? (
                        <img
                          src={candidate.profilePicture}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidate.headline}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStarToggle(candidate.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        starredCandidates.has(candidate.id)
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title={starredCandidates.has(candidate.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star 
                        className={`h-4 w-4 transition-all duration-200 ${
                          starredCandidates.has(candidate.id) ? 'fill-current' : ''
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Match Score</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore}%
                    </span>
                  </div>

                  {/* Location and Availability */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {candidate.availability}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                          index === 0 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : index === 1
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                        +{candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Salary and Actions */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Expected Salary</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatSalary(candidate.expectedSalary)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      href={`/employer_portal/workspace/candidates/${candidate.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;