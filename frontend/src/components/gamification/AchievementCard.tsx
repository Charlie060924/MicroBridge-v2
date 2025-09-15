"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Achievement } from '@/types/level';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked?: boolean;
  isNew?: boolean;
  progress?: number; // 0-100 for progress-based achievements
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked = false,
  isNew = false,
  progress,
  size = 'md',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`relative bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all duration-200 ${
        isUnlocked 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      } ${onClick ? 'hover:shadow-md' : ''}`}
    >
      {/* New Achievement Indicator */}
      {isNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">!</span>
        </motion.div>
      )}

      {/* Achievement Icon */}
      <div className="flex flex-col items-center space-y-3">
        <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative ${
          isUnlocked 
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {/* Glow effect for unlocked achievements */}
          {isUnlocked && (
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping" />
          )}
          
          <span className={`${iconSizes[size]} relative z-10`}>
            {achievement.icon || '🏆'}
          </span>
        </div>

        {/* Achievement Info */}
        <div className="text-center">
          <h3 className={`font-semibold text-sm ${
            isUnlocked ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {achievement.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-tight">
            {achievement.description}
          </p>
          
          {/* XP Reward */}
          {achievement.xpReward && achievement.xpReward > 0 && (
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-yellow-600">
                {achievement.xpReward} XP
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar (for progress-based achievements) */}
        {progress !== undefined && !isUnlocked && (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          {isUnlocked ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : progress !== undefined ? (
            <Clock className="w-4 h-4 text-gray-400" />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;