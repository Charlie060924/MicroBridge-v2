"use client";

import React from "react";
import { useLevel } from "@/hooks/useLevel";
import { STUDENT_ACHIEVEMENTS, EMPLOYER_ACHIEVEMENTS } from "@/types/level";

export default function AchievementList() {
  const { levelData } = useLevel();

  // Get all available achievements
  const allAchievements = { ...STUDENT_ACHIEVEMENTS, ...EMPLOYER_ACHIEVEMENTS };
  
  // Check which achievements are unlocked
  const unlockedAchievements = levelData.achievements;
  const unlockedIds = unlockedAchievements.map(a => a.id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
      
      {unlockedAchievements.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-gray-500 dark:text-gray-400">No achievements yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Complete actions to unlock achievements!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 dark:text-green-200">{achievement.title}</h4>
                <p className="text-sm text-green-600 dark:text-green-300">{achievement.description}</p>
                {achievement.xpReward && (
                  <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                    +{achievement.xpReward} XP
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show upcoming achievements */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upcoming Achievements</h4>
        <div className="space-y-2">
          {Object.values(allAchievements)
            .filter(achievement => !unlockedIds.includes(achievement.id))
            .slice(0, 3) // Show only first 3 upcoming
            .map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60">
                <div className="text-lg text-gray-400">{achievement.icon}</div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-600 dark:text-gray-400">{achievement.title}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
