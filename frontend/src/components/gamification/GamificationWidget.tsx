"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LevelData } from '@/types/level';

// Import gamification components
import XPProgressBar from './XPProgressBar';
import StreakCounter from './StreakCounter';
import DailyChallenges from './DailyChallenges';

interface GamificationWidgetProps {
  levelData: LevelData;
  userType: 'student' | 'employer';
  layout?: 'horizontal' | 'vertical' | 'compact';
  showChallenges?: boolean;
  className?: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  levelData,
  userType,
  layout = 'horizontal',
  showChallenges = true,
  className = ''
}) => {
  if (layout === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {levelData.level}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Level {levelData.level}</div>
              <div className="text-xs text-gray-500">{levelData.careerCoins} CC</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {levelData.streakDays > 0 && (
              <div className="flex items-center space-x-1 text-orange-600">
                <span className="text-sm">🔥</span>
                <span className="text-sm font-medium">{levelData.streakDays}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              {Math.round((levelData.xp / levelData.xpToNext) * 100)}% to next
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
        <XPProgressBar levelData={levelData} size="md" />
        <StreakCounter levelData={levelData} size="md" />
        {showChallenges && (
          <div className="md:col-span-2">
            <DailyChallenges userType={userType} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <XPProgressBar levelData={levelData} size="lg" />
      <StreakCounter levelData={levelData} size="md" />
      {showChallenges && <DailyChallenges userType={userType} />}
    </div>
  );
};

export default GamificationWidget;