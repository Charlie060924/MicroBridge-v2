"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Code, 
  PenTool, 
  BarChart2, 
  Type,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "development", label: "Development", icon: <Code className="h-4 w-4" /> },
  { value: "design", label: "Design", icon: <PenTool className="h-4 w-4" /> },
  { value: "marketing", label: "Marketing", icon: <BarChart2 className="h-4 w-4" /> },
  { value: "content", label: "Content", icon: <Type className="h-4 w-4" /> },
  { value: "data", label: "Data Science", icon: <BarChart2 className="h-4 w-4" /> }
];

const DURATIONS = [
  { value: "1-2", label: "1-2 months" },
  { value: "2-3", label: "2-3 months" },
  { value: "3-6", label: "3-6 months" },
  { value: "6+", label: "6+ months" }
];

const SALARY_RANGES = [
  { value: "0-25", label: "$0 - $25/hr" },
  { value: "25-50", label: "$25 - $50/hr" },
  { value: "50-75", label: "$50 - $75/hr" },
  { value: "75+", label: "$75+/hr" }
];

const JOB_LEVELS = [
  { value: "beginner", label: "Beginner", icon: <Star className="h-4 w-4" /> },
  { value: "intermediate", label: "Intermediate", icon: <Award className="h-4 w-4" /> },
  { value: "advanced", label: "Advanced", icon: <Star className="h-4 w-4 fill-current" /> },
  { value: "expert", label: "Expert", icon: <Award className="h-4 w-4 fill-current" /> }
];

const POPULAR_SKILLS = [
  "JavaScript", "React", "Node.js", "Python", "TypeScript", "SQL",
  "HTML/CSS", "Java", "AWS", "Docker", "Git", "MongoDB",
  "GraphQL", "Vue.js", "Angular", "PHP", "C++", "Ruby",
  "Figma", "Photoshop", "UI/UX", "SEO", "Google Analytics"
];

const JobSearchAndFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  // Initialize from URL params on component mount
  useEffect(() => {
    const currentSearchQuery = searchParams.get('q') || "";
    const currentLocation = searchParams.get('location') || "";
    const currentCategories = searchParams.getAll('category');
    const currentDuration = searchParams.get('duration') || "";
    const currentSalary = searchParams.get('salary') || "";
    const currentLevel = searchParams.get('level') || "";
    const currentSkills = searchParams.getAll('skill');

    setSearchQuery(currentSearchQuery);
    setLocation(currentLocation);
    setSelectedCategories(currentCategories);
    setSelectedDuration(currentDuration);
    setSelectedSalary(currentSalary);
    setSelectedLevel(currentLevel);
    setSelectedSkills(currentSkills);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (location.trim()) params.set('location', location.trim());
    selectedCategories.forEach(cat => params.append('category', cat));
    if (selectedDuration) params.set('duration', selectedDuration);
    if (selectedSalary) params.set('salary', selectedSalary);
    if (selectedLevel) params.set('level', selectedLevel);
    selectedSkills.forEach(skill => params.append('skill', skill));
    
    const queryString = params.toString();
    const newURL = queryString ? `/student_portal/workspace/jobs?${queryString}` : '/student_portal/workspace/jobs';
    
    router.replace(newURL);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category];
      return newCategories;
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      const newSkills = prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill];
      return newSkills;
    });
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(prev => prev === filterName ? null : filterName);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setSelectedCategories([]);
    setSelectedDuration("");
    setSelectedSalary("");
    setSelectedLevel("");
    setSelectedSkills([]);
    router.replace('/student_portal/workspace/jobs');
  };

  const clearIndividualFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories(prev => prev.filter(cat => cat !== value));
        break;
      case 'skill':
        setSelectedSkills(prev => prev.filter(skill => skill !== value));
        break;
      case 'duration':
        setSelectedDuration("");
        break;
      case 'salary':
        setSelectedSalary("");
        break;
      case 'level':
        setSelectedLevel("");
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Search & Filters
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, company, or skills..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <button
            type="button"
            onClick={() => toggleFilter('category')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
          >
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Category</span>
              {selectedCategories.length > 0 && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </div>
            {expandedFilter === 'category' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedFilter === 'category' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <motion.button
                      key={category.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCategory(category.value)}
                      className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                        selectedCategories.includes(category.value)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-3">{category.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duration Filter */}
        <div>
          <button
            type="button"
            onClick={() => toggleFilter('duration')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Duration</span>
              {selectedDuration && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  1
                </span>
              )}
            </div>
            {expandedFilter === 'duration' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedFilter === 'duration' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-2">
                  {DURATIONS.map(duration => (
                    <motion.button
                      key={duration.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDuration(selectedDuration === duration.value ? "" : duration.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        selectedDuration === duration.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {duration.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Salary Range Filter */}
        <div>
          <button
            type="button"
            onClick={() => toggleFilter('salary')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
          >
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Salary Range</span>
              {selectedSalary && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  1
                </span>
              )}
            </div>
            {expandedFilter === 'salary' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedFilter === 'salary' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                <div className="space-y-2">
                  {SALARY_RANGES.map(salary => (
                    <motion.button
                      key={salary.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSalary(selectedSalary === salary.value ? "" : salary.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        selectedSalary === salary.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {salary.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skills Filter */}
        <div>
          <button
            type="button"
            onClick={() => toggleFilter('skills')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
          >
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-gray-900 dark:text-white">Skills Required</span>
              {selectedSkills.length > 0 && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {selectedSkills.length}
                </span>
              )}
            </div>
            {expandedFilter === 'skills' ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedFilter === 'skills' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                {/* Add Custom Skill */}
                <form onSubmit={addCustomSkill} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python, Figma)"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {customSkill.trim() && (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Add
                      </motion.button>
                    )}
                  </div>
                </form>

                {/* Popular Skills */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SKILLS.filter(skill => !selectedSkills.includes(skill)).slice(0, 12).map(skill => (
                      <motion.button
                        key={skill}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSkill(skill)}
                        className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs"
                        >
                          <span>{skill}</span>
                          <button 
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="ml-2 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </button>

        {/* Clear Filters */}
        {(searchQuery || location || selectedCategories.length > 0 || selectedDuration || selectedSalary || selectedSkills.length > 0) && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Clear All Filters
          </button>
        )}
      </form>
    </div>
  );
};

export default JobSearchAndFilters;