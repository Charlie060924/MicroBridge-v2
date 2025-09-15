"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp, 
  Bookmark,
  Star,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronDown,
  Zap,
  Target
} from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'skill' | 'company' | 'location' | 'job_title' | 'trending';
  category?: string;
  count?: number;
}

interface SavedSearch {
  id: string;
  query: string;
  filters: any;
  name: string;
  created: string;
}

interface SmartSearchBarProps {
  onSearch: (query: string, filters?: any) => void;
  onSaveSearch?: (search: SavedSearch) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onSearch,
  onSaveSearch,
  placeholder = "Search for jobs, skills, or companies...",
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    salary: [0, 100000],
    jobType: 'all',
    experienceLevel: 'all',
    remote: false
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, this would come from API
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'React Developer', type: 'job_title', count: 24 },
    { id: '2', text: 'Frontend Engineer', type: 'job_title', count: 18 },
    { id: '3', text: 'JavaScript', type: 'skill', count: 156 },
    { id: '4', text: 'TypeScript', type: 'skill', count: 89 },
    { id: '5', text: 'Google', type: 'company', count: 8 },
    { id: '6', text: 'San Francisco', type: 'location', count: 45 },
    { id: '7', text: 'Remote Work', type: 'trending', count: 234 },
    { id: '8', text: 'AI/ML Engineer', type: 'trending', count: 67 }
  ];

  const trendingSearches = [
    'AI Developer',
    'Remote Frontend',
    'Full Stack Engineer',
    'Data Scientist'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 || true); // Show suggestions always for demo
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      
      onSearch(searchQuery, filters);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'skill':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'company':
        return <Briefcase className="w-4 h-4 text-green-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-red-500" />;
      case 'job_title':
        return <Target className="w-4 h-4 text-purple-500" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Main Search Input */}
        <div className="flex items-center p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 bg-transparent"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              showFilters 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              showFilters ? 'rotate-180' : ''
            }`} />
          </button>
          
          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="ml-3 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 p-4 bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="City, State, or Remote"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="all">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="all">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote Only</span>
                  </label>
                </div>
                
                <button className="text-sm text-primary hover:text-primary-hover font-medium">
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smart Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                {savedSearches.length > 0 && (
                  <button className="text-xs text-primary hover:text-primary-hover font-medium">
                    View all saved
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((trend, index) => (
                  <motion.button
                    key={trend}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick({ id: trend, text: trend, type: 'trending' })}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <TrendingUp className="w-3 h-3 text-orange-500" />
                    <span>{trend}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="max-h-60 overflow-y-auto">
              {query.length > 0 ? (
                <>
                  {filteredSuggestions.length > 0 ? (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                        Suggestions
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            {getSuggestionIcon(suggestion.type)}
                            <span className="text-gray-900">{suggestion.text}</span>
                          </div>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {suggestion.count} jobs
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No suggestions found</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                        Recent Searches
                      </div>
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={search}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick({ id: search, text: search, type: 'skill' })}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{search}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Saved Searches */}
                  {savedSearches.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                        Saved Searches
                      </div>
                      {savedSearches.slice(0, 3).map((search, index) => (
                        <motion.button
                          key={search.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick({ id: search.id, text: search.query, type: 'skill' })}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <Bookmark className="w-4 h-4 text-primary" />
                            <div>
                              <span className="text-gray-900 block">{search.name}</span>
                              <span className="text-xs text-gray-500">{search.query}</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearchBar;