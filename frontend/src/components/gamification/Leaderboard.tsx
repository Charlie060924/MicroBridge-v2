"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Flame,
  Award
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  streak: number;
  achievements: number;
  rank: number;
  change: number; // Position change from last week
  badge?: 'top1' | 'top3' | 'top10' | 'rising_star' | 'consistent';
}

interface LeaderboardProps {
  userType: 'student' | 'employer';
  currentUserId?: string;
  timeframe?: 'weekly' | 'monthly' | 'alltime';
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  userType,
  currentUserId = 'current-user',
  timeframe = 'weekly',
  className = ''
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>(timeframe);
  const [showCategory, setShowCategory] = useState<'all' | 'university' | 'industry'>('all');

  // Mock data - in real implementation, this would come from API
  const generateMockData = (): LeaderboardEntry[] => {
    const mockEntries: LeaderboardEntry[] = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        avatar: '👩‍💼',
        level: 15,
        totalXP: 12500,
        weeklyXP: 850,
        streak: 23,
        achievements: 18,
        rank: 1,
        change: 2,
        badge: 'top1'
      },
      {
        id: 'user-2',
        name: 'Marcus Johnson',
        avatar: '👨‍💻',
        level: 12,
        totalXP: 9800,
        weeklyXP: 720,
        streak: 15,
        achievements: 14,
        rank: 2,
        change: -1,
        badge: 'top3'
      },
      {
        id: 'current-user',
        name: 'You',
        avatar: '🎯',
        level: 8,
        totalXP: 6200,
        weeklyXP: 420,
        streak: 7,
        achievements: 9,
        rank: 5,
        change: 3,
        badge: 'rising_star'
      },
      {
        id: 'user-3',
        name: 'Emily Rodriguez',
        avatar: '👩‍🎓',
        level: 11,
        totalXP: 8900,
        weeklyXP: 650,
        streak: 12,
        achievements: 13,
        rank: 3,
        change: 0,
        badge: 'top3'
      },
      {
        id: 'user-4',
        name: 'David Kim',
        avatar: '👨‍🔬',
        level: 10,
        totalXP: 7800,
        weeklyXP: 580,
        streak: 19,
        achievements: 11,
        rank: 4,
        change: 1,
        badge: 'consistent'
      }
    ];

    return mockEntries.sort((a, b) => {
      switch (selectedTimeframe) {
        case 'weekly':
          return b.weeklyXP - a.weeklyXP;
        case 'monthly':
          return (b.weeklyXP * 4) - (a.weeklyXP * 4);
        default:
          return b.totalXP - a.totalXP;
      }
    }).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  };

  const leaderboardData = generateMockData();
  const currentUserEntry = leaderboardData.find(entry => entry.id === currentUserId);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500 fill-current" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 fill-current" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-500 fill-current" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getBadgeInfo = (badge?: string) => {
    switch (badge) {
      case 'top1':
        return { icon: '👑', color: 'text-yellow-500', label: 'Champion' };
      case 'top3':
        return { icon: '🥇', color: 'text-orange-500', label: 'Top Performer' };
      case 'top10':
        return { icon: '⭐', color: 'text-blue-500', label: 'Top 10' };
      case 'rising_star':
        return { icon: '🚀', color: 'text-green-500', label: 'Rising Star' };
      case 'consistent':
        return { icon: '🔥', color: 'text-red-500', label: 'Consistent' };
      default:
        return null;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center space-x-1 text-green-500">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center space-x-1 text-red-500">
          <TrendingUp className="w-3 h-3 transform rotate-180" />
          <span className="text-xs">{change}</span>
        </div>
      );
    }
    return <span className="text-xs text-gray-400">—</span>;
  };

  const getDisplayValue = (entry: LeaderboardEntry) => {
    switch (selectedTimeframe) {
      case 'weekly':
        return `${entry.weeklyXP.toLocaleString()} XP`;
      case 'monthly':
        return `${(entry.weeklyXP * 4).toLocaleString()} XP`;
      default:
        return `Level ${entry.level}`;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
              <p className="text-sm text-gray-500">
                {userType === 'student' ? 'Student' : 'Employer'} rankings
              </p>
            </div>
          </div>

          {/* Your Rank Display */}
          {currentUserEntry && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                #{currentUserEntry.rank}
              </div>
              <div className="text-xs text-gray-500">Your rank</div>
              {getChangeIndicator(currentUserEntry.change)}
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: 'weekly', label: 'This Week', icon: Calendar },
            { key: 'monthly', label: 'This Month', icon: Target },
            { key: 'alltime', label: 'All Time', icon: Star }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedTimeframe(key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTimeframe === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2">
          {['all', 'university', 'industry'].map((category) => (
            <button
              key={category}
              onClick={() => setShowCategory(category as any)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                showCategory === category
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6">
        <div className="space-y-3">
          <AnimatePresence>
            {leaderboardData.slice(0, 10).map((entry, index) => {
              const isCurrentUser = entry.id === currentUserId;
              const badgeInfo = getBadgeInfo(entry.badge);
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                    isCurrentUser 
                      ? 'border-blue-200 bg-blue-50' 
                      : entry.rank <= 3
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {entry.avatar || '👤'}
                    </div>
                    <div>
                      <div className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                        {entry.name}
                        {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                      </div>
                      
                      {/* Badge */}
                      {badgeInfo && (
                        <div className={`flex items-center space-x-1 text-xs ${badgeInfo.color}`}>
                          <span>{badgeInfo.icon}</span>
                          <span>{badgeInfo.label}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {getDisplayValue(entry)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedTimeframe === 'alltime' ? 'Level' : 'Points'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {entry.achievements}
                      </div>
                      <div className="text-xs text-gray-500">Badges</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="font-semibold text-gray-900">{entry.streak}</span>
                      </div>
                      <div className="text-xs text-gray-500">Streak</div>
                    </div>

                    <div className="text-center min-w-12">
                      {getChangeIndicator(entry.change)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Your Position (if not in top 10) */}
        {currentUserEntry && currentUserEntry.rank > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-gray-200"
          >
            <div className="text-center text-sm text-gray-500 mb-3">
              Your current position
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
              <div className="w-12 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">#{currentUserEntry.rank}</span>
              </div>
              
              <div className="flex-1 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                  {currentUserEntry.avatar}
                </div>
                <div>
                  <div className="font-semibold text-blue-700">{currentUserEntry.name}</div>
                  {getBadgeInfo(currentUserEntry.badge) && (
                    <div className={`flex items-center space-x-1 text-xs ${getBadgeInfo(currentUserEntry.badge)!.color}`}>
                      <span>{getBadgeInfo(currentUserEntry.badge)!.icon}</span>
                      <span>{getBadgeInfo(currentUserEntry.badge)!.label}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {getDisplayValue(currentUserEntry)}
                  </div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{currentUserEntry.achievements}</div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
                
                <div className="text-center">
                  {getChangeIndicator(currentUserEntry.change)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Motivational Footer */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">Keep Climbing!</span>
          </div>
          <p className="text-sm text-gray-600">
            Complete daily challenges and maintain your streak to climb the leaderboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;