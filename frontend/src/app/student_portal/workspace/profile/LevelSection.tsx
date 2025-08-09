"use client";

import React from "react";
import { useLevel } from "@/hooks/useLevel";
import { Star, Trophy, TrendingUp, Zap } from "lucide-react";

export default function LevelSection() {
  const { levelData, getTotalXP } = useLevel();
  
  const totalXP = getTotalXP();
  const xpToNext = levelData.xpToNext - levelData.xp;
  const percentage = (levelData.xp / levelData.xpToNext) * 100;

  const getLevelTitle = (level: number) => {
    if (level === 1) return "Beginner";
    if (level < 5) return "Rising Star";
    if (level < 10) return "Experienced";
    if (level < 20) return "Veteran";
    return "Legend";
  };

  const getLevelColor = (level: number) => {
    if (level < 5) return "from-yellow-400 to-orange-500";
    if (level < 10) return "from-blue-400 to-purple-500";
    if (level < 20) return "from-purple-400 to-pink-500";
    return "from-red-400 to-yellow-500";
  };

  return (
    <div className="space-y-6">
      {/* Level Header */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${getLevelColor(levelData.level)} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-900 dark:text-white">{levelData.level}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Level {levelData.level}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          {getLevelTitle(levelData.level)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress to Level {levelData.level + 1}</span>
          <span className="font-medium text-gray-900 dark:text-white">{Math.round(percentage)}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {levelData.xp} / {levelData.xpToNext} XP
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {totalXP}
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-300 font-medium">
            Total XP
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl text-center border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {xpToNext}
          </div>
          <div className="text-xs text-green-500 dark:text-green-300 font-medium">
            XP to Next
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl text-center border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {levelData.achievements.length}
          </div>
          <div className="text-xs text-purple-500 dark:text-purple-300 font-medium">
            Achievements
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl text-center border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {Math.floor(levelData.level / 5) + 1}
          </div>
          <div className="text-xs text-orange-500 dark:text-orange-300 font-medium">
            Tier
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {levelData.achievements.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {levelData.achievements.slice(-3).map((achievement, index) => (
              <div key={achievement.id} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">{achievement.icon || "🏆"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {achievement.description}
                  </p>
                </div>
                {achievement.xpReward && (
                  <div className="text-xs font-medium text-green-600 dark:text-green-400">
                    +{achievement.xpReward} XP
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Level Preview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Level {levelData.level + 1} Rewards
        </h3>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <p>• Unlock new features</p>
          <p>• Access to premium content</p>
          <p>• Special achievement badge</p>
        </div>
      </div>
    </div>
  );
}
