"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, Target, Zap, Shield, Star } from 'lucide-react';
import { LevelData } from '@/types/level';

interface StreakCounterProps {
  levelData: LevelData;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

interface StreakMilestone {
  days: number;
  title: string;
  icon: string;
  color: string;
  reward: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: "Getting Started", icon: "🔥", color: "text-orange-500", reward: "+5 XP bonus" },
  { days: 7, title: "Week Warrior", icon: "💪", color: "text-red-500", reward: "+10 XP bonus" },
  { days: 14, title: "Committed", icon: "🎯", color: "text-purple-500", reward: "+15 XP bonus" },
  { days: 30, title: "Monthly Master", icon: "🏆", color: "text-yellow-500", reward: "+25 XP bonus" },
  { days: 60, title: "Habit Hero", icon: "⭐", color: "text-blue-500", reward: "+35 XP bonus" },
  { days: 100, title: "Century Club", icon: "💎", color: "text-indigo-500", reward: "+50 XP bonus" },
  { days: 365, title: "Year Legend", icon: "🏅", color: "text-pink-500", reward: "Special Badge" }
];

const StreakCounter: React.FC<StreakCounterProps> = ({
  levelData,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const [currentFlame, setCurrentFlame] = useState(0);
  
  useEffect(() => {
    if (levelData.streakDays > 0) {
      const interval = setInterval(() => {
        setCurrentFlame(prev => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [levelData.streakDays]);

  const getCurrentMilestone = () => {
    return STREAK_MILESTONES
      .filter(m => levelData.streakDays >= m.days)
      .pop();
  };

  const getNextMilestone = () => {
    return STREAK_MILESTONES
      .find(m => levelData.streakDays < m.days);
  };

  const getStreakIntensity = () => {
    if (levelData.streakDays >= 100) return "legendary";
    if (levelData.streakDays >= 30) return "hot";
    if (levelData.streakDays >= 7) return "warm";
    if (levelData.streakDays >= 3) return "active";
    return "cold";
  };

  const intensityConfig = {
    cold: { color: "text-gray-400", bgColor: "bg-gray-100", glow: false },
    active: { color: "text-orange-400", bgColor: "bg-orange-50", glow: false },
    warm: { color: "text-orange-500", bgColor: "bg-orange-100", glow: true },
    hot: { color: "text-red-500", bgColor: "bg-red-100", glow: true },
    legendary: { color: "text-purple-600", bgColor: "bg-purple-100", glow: true }
  };

  const config = intensityConfig[getStreakIntensity()];
  const currentMilestone = getCurrentMilestone();
  const nextMilestone = getNextMilestone();
  
  const sizeClasses = {
    sm: { container: 'p-3', flame: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'p-4', flame: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'p-6', flame: 'w-16 h-16', text: 'text-lg' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${currentSize.container} ${className}`}>
      {/* Main Streak Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Animated Flame */}
          <div className={`${currentSize.flame} rounded-full ${config.bgColor} flex items-center justify-center relative`}>
            {config.glow && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${config.bgColor} opacity-50`}
              />
            )}
            
            <motion.div
              animate={levelData.streakDays > 0 ? { 
                scale: [1, 1.1, 1],
                rotate: [-2, 2, -2] 
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`${config.color} text-2xl relative z-10`}
            >
              {levelData.streakDays > 0 ? (
                <Flame className={`${currentSize.flame.split(' ')[0]} fill-current`} />
              ) : (
                <Flame className={`${currentSize.flame.split(' ')[0]}`} />
              )}
            </motion.div>
          </div>

          <div>
            <div className={`font-bold ${currentSize.text} text-gray-900`}>
              {levelData.streakDays} Day{levelData.streakDays !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-500">
              {levelData.streakDays > 0 ? 'Current Streak' : 'Start Your Streak!'}
            </div>
          </div>
        </div>

        {/* Best Streak Badge */}
        {levelData.totalStreakDays > levelData.streakDays && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600">
              Best: {levelData.totalStreakDays}
            </div>
            <div className="text-xs text-gray-400">days</div>
          </div>
        )}
      </div>

      {/* Current Milestone */}
      {currentMilestone && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${config.bgColor} rounded-lg p-3 mb-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentMilestone.icon}</span>
              <div>
                <div className={`font-semibold text-sm ${currentMilestone.color}`}>
                  {currentMilestone.title}
                </div>
                <div className="text-xs text-gray-500">
                  {currentMilestone.reward}
                </div>
              </div>
            </div>
            <Target className={`w-4 h-4 ${currentMilestone.color}`} />
          </div>
        </motion.div>
      )}

      {/* Progress to Next Milestone */}
      {nextMilestone && showDetails && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">
              Next: {nextMilestone.title}
            </div>
            <div className="text-xs text-gray-500">
              {nextMilestone.days - levelData.streakDays} days to go
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(levelData.streakDays / nextMilestone.days) * 100}%` 
              }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full bg-gradient-to-r ${
                getStreakIntensity() === 'legendary' 
                  ? 'from-purple-500 to-pink-500'
                  : getStreakIntensity() === 'hot'
                    ? 'from-red-500 to-orange-500'
                    : getStreakIntensity() === 'warm'
                      ? 'from-orange-500 to-yellow-500'
                      : 'from-gray-400 to-gray-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Streak Benefits */}
      {levelData.streakDays > 0 && showDetails && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-blue-500">
              <Zap className="w-3 h-3" />
              <span>+{Math.min(levelData.streakDays * 2, 50)} XP daily</span>
            </div>
            
            {levelData.streakDays >= 10 && (
              <div className="flex items-center space-x-1 text-green-500">
                <Shield className="w-3 h-3" />
                <span>Streak protection</span>
              </div>
            )}
          </div>
          
          {levelData.streakDays >= 7 && (
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span>Weekly bonus</span>
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      {levelData.streakDays === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-2"
        >
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Start your streak today! 🚀
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StreakCounter;