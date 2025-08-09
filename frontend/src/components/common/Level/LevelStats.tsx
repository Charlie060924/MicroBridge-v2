"use client";

import React from "react";
import { useLevel } from "@/hooks/useLevel";
import LevelProgressBar from "./LevelProgressBar";

interface LevelStatsProps {
  showAchievements?: boolean;
  showTotalXP?: boolean;
  showNextLevel?: boolean;
}

export default function LevelStats({ 
  showAchievements = true, 
  showTotalXP = true, 
  showNextLevel = true 
}: LevelStatsProps) {
  const { levelData, getTotalXP } = useLevel();
  
  const totalXP = getTotalXP();
  const xpToNext = levelData.xpToNext - levelData.xp;
  const percentage = (levelData.xp / levelData.xpToNext) * 100;

  return (
    <div className="space-y-4">
      {/* Level Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">⭐</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Level {levelData.level}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {levelData.level === 1 ? "Beginner" : 
           levelData.level < 5 ? "Rising Star" :
           levelData.level < 10 ? "Experienced" :
           levelData.level < 20 ? "Veteran" : "Legend"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress to Level {levelData.level + 1}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <LevelProgressBar />
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {levelData.xp} / {levelData.xpToNext} XP
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {showTotalXP && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalXP}
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-300">
              Total XP Earned
            </div>
          </div>
        )}

        {showNextLevel && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {xpToNext}
            </div>
            <div className="text-xs text-green-500 dark:text-green-300">
              XP to Next Level
            </div>
          </div>
        )}

        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {levelData.achievements.length}
          </div>
          <div className="text-xs text-purple-500 dark:text-purple-300">
            Achievements
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {Math.floor(levelData.level / 5) + 1}
          </div>
          <div className="text-xs text-orange-500 dark:text-orange-300">
            Tier
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Current Level:</span>
            <span className="font-medium">{levelData.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">XP Progress:</span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Achievements:</span>
            <span className="font-medium">{levelData.achievements.length}</span>
          </div>
          {showTotalXP && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total XP:</span>
              <span className="font-medium">{totalXP}</span>
            </div>
          )}
        </div>
      </div>

      {/* Level Rewards Preview */}
      {showNextLevel && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🎁 Level {levelData.level + 1} Rewards
          </h3>
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            <p>• Unlock new features</p>
            <p>• Access to premium content</p>
            <p>• Special achievement badge</p>
          </div>
        </div>
      )}
    </div>
  );
}
