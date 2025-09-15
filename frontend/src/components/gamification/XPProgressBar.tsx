"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { LevelData } from '@/types/level';

interface XPProgressBarProps {
  levelData: LevelData;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
  levelData,
  showDetails = true,
  size = 'md',
  className = ''
}) => {
  const progressPercentage = (levelData.xp / levelData.xpToNext) * 100;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-sm">
            {levelData.level}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              Level {levelData.level}
            </div>
            {showDetails && (
              <div className="text-xs text-gray-500">
                {formatNumber(levelData.totalXP)} total XP
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-yellow-600">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{levelData.careerCoins} CC</span>
          </div>
          
          {levelData.prestigeLevel > 0 && (
            <div className="flex items-center space-x-1 text-purple-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">P{levelData.prestigeLevel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1 text-sm">
          <span className="text-gray-600">
            {formatNumber(levelData.xp)} / {formatNumber(levelData.xpToNext)} XP
          </span>
          <span className="text-gray-500">
            {formatNumber(levelData.xpToNext - levelData.xp)} to next level
          </span>
        </div>
        
        <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Streak Display */}
      {showDetails && levelData.streakDays > 0 && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-orange-600">
            <span>🔥</span>
            <span>{levelData.streakDays} day streak</span>
          </div>
          <div className="text-gray-500">
            Best: {levelData.totalStreakDays} days
          </div>
        </div>
      )}
    </div>
  );
};

export default XPProgressBar;