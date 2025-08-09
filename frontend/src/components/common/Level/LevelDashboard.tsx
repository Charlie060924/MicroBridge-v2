"use client";

import React, { useState } from "react";
import { useLevel } from "@/hooks/useLevel";
import LevelStats from "./LevelStats";
import AchievementList from "./AchievementList";
import LevelBadge from "./LevelBadge";

interface LevelDashboardProps {
  showStats?: boolean;
  showAchievements?: boolean;
  showBadge?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export default function LevelDashboard({ 
  showStats = true, 
  showAchievements = true, 
  showBadge = true,
  layout = 'vertical'
}: LevelDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements'>('stats');

  if (layout === 'horizontal') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showStats && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <LevelStats />
          </div>
        )}
        {showAchievements && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <AchievementList />
          </div>
        )}
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showBadge && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Level Badge</h3>
            <div className="flex justify-center">
              <LevelBadge variant="detailed" size="lg" />
            </div>
          </div>
        )}
        {showStats && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
            <LevelStats showTotalXP={true} showNextLevel={true} />
          </div>
        )}
        {showAchievements && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
            <AchievementList />
          </div>
        )}
      </div>
    );
  }

  // Default vertical layout with tabs
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Level Stats
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Achievements
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'stats' && showStats && (
          <LevelStats />
        )}
        {activeTab === 'achievements' && showAchievements && (
          <AchievementList />
        )}
      </div>
    </div>
  );
}
