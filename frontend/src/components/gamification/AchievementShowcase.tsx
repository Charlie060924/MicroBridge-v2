"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Filter, Search } from 'lucide-react';
import { Achievement } from '@/types/level';
import { STUDENT_ACHIEVEMENTS, EMPLOYER_ACHIEVEMENTS } from '@/types/level';
import AchievementCard from './AchievementCard';
import AchievementModal from './AchievementModal';

interface AchievementShowcaseProps {
  userType: 'student' | 'employer';
  unlockedAchievements: Achievement[];
  className?: string;
}

type FilterType = 'all' | 'unlocked' | 'locked';
type CategoryType = 'all' | 'student' | 'employer' | 'general';

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  userType,
  unlockedAchievements,
  className = ''
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Get all achievements for the user type
  const allAchievements = userType === 'student' 
    ? Object.values(STUDENT_ACHIEVEMENTS)
    : Object.values(EMPLOYER_ACHIEVEMENTS);

  const unlockedIds = unlockedAchievements.map(a => a.id);

  // Filter achievements based on current filters
  const filteredAchievements = allAchievements.filter(achievement => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unlocked' && unlockedIds.includes(achievement.id)) ||
      (filter === 'locked' && !unlockedIds.includes(achievement.id));

    const matchesCategory = 
      category === 'all' || 
      achievement.category === category;

    const matchesSearch = 
      searchTerm === '' ||
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unlockedCount = allAchievements.filter(a => unlockedIds.includes(a.id)).length;
  const completionPercentage = (unlockedCount / allAchievements.length) * 100;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
              <p className="text-sm text-gray-500">
                {unlockedCount} of {allAchievements.length} unlocked ({Math.round(completionPercentage)}%)
              </p>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16" cy="16" r="12"
                fill="none" stroke="currentColor" strokeWidth="2"
                className="text-gray-200"
              />
              <motion.circle
                cx="16" cy="16" r="12"
                fill="none" stroke="currentColor" strokeWidth="2"
                className="text-yellow-500"
                initial={{ strokeDashoffset: 75.4 }}
                animate={{ 
                  strokeDashoffset: 75.4 - (75.4 * completionPercentage / 100)
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeDasharray="75.4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {(['all', 'unlocked', 'locked'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filterType === 'all' && (
                  <Filter className="w-4 h-4 inline-block mr-1" />
                )}
                {filterType === 'locked' && (
                  <Lock className="w-4 h-4 inline-block mr-1" />
                )}
                {filterType === 'unlocked' && (
                  <Trophy className="w-4 h-4 inline-block mr-1" />
                )}
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                <span className="ml-1 text-xs">
                  ({filterType === 'all' ? allAchievements.length :
                    filterType === 'unlocked' ? unlockedCount :
                    allAchievements.length - unlockedCount})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="p-6">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter settings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAchievements.map((achievement, index) => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AchievementCard
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={selectedAchievement !== null}
        onClose={() => setSelectedAchievement(null)}
        xpGained={selectedAchievement?.xpReward || 0}
      />
    </div>
  );
};

export default AchievementShowcase;