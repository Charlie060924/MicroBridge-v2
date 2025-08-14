"use client";

import React, { useState, useEffect } from "react";
import { Star, Trophy, TrendingUp, Coins, Unlock, Gift, Shield, ChevronDown } from "lucide-react";
import { useEmployerLevel } from "@/hooks/useEmployerLevel";
import { EMPLOYER_LEVEL_PROGRESSION, EMPLOYER_FEATURE_UNLOCKS } from "@/types/employerLevel";

function LevelSystemHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employer Level System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your hiring progress, earn rewards, and unlock new features
          </p>
        </div>
      </div>
    </div>
  );
}

function LevelOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to use the employer level hook, but handle errors gracefully
  let levelData: any = null;
  let getTotalXP: any = () => 0;
  let getProgressPercentage: any = () => 0;
  let getCurrentLevelData: any = () => null;
  let getNextLevelData: any = () => null;
  let getEmployerLevelTitle: any = () => "Loading...";
  let getEmployerLevelColor: any = () => "from-green-400 to-blue-500";

  try {
    const levelHook = useEmployerLevel();
    levelData = levelHook.levelData;
    getTotalXP = levelHook.getTotalXP;
    getProgressPercentage = levelHook.getProgressPercentage;
    getCurrentLevelData = levelHook.getCurrentLevelData;
    getNextLevelData = levelHook.getNextLevelData;
    getEmployerLevelTitle = levelHook.getEmployerLevelTitle;
    getEmployerLevelColor = levelHook.getEmployerLevelColor;
  } catch (err) {
    setError("Failed to load level data");
    console.error("Level hook error:", err);
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <div className="animate-pulse">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !levelData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Level System Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load level data. Please try refreshing the page."}
          </p>
        </div>
      </div>
    );
  }

  const totalXP = getTotalXP();
  const progressPercentage = getProgressPercentage();
  const currentLevelData = getCurrentLevelData();
  const nextLevelData = getNextLevelData();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      {/* Current Level Display */}
      <div className="text-center mb-6">
        <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${getEmployerLevelColor(levelData.level)} rounded-full flex items-center justify-center`}>
          <span className="text-2xl font-bold text-white">{levelData.level}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getEmployerLevelTitle(levelData.level)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLevelData?.title || "Level " + levelData.level}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress to Level {levelData.level + 1}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {levelData.xp} / {levelData.xpToNext} XP
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalXP}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{levelData.careerCoins}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Career Coins</div>
        </div>
      </div>

      {/* Next Level Preview */}
      {nextLevelData && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Next Level: {nextLevelData.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {nextLevelData.xpForThisLevel} XP needed
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Coins className="w-4 h-4" />
            <span>+{nextLevelData.careerCoins} Career Coins</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LevelProgression() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const getLevelColor = (level: number) => {
    if (level < 5) return "from-green-400 to-blue-500";
    if (level < 10) return "from-blue-400 to-purple-500";
    if (level < 20) return "from-purple-400 to-pink-500";
    return "from-red-400 to-yellow-500";
  };

  const getLevelStatus = (level: number) => {
    // For now, assume all levels are completed for demo purposes
    return "completed";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Level Progression
      </h3>
      
      <div className="space-y-4">
        {EMPLOYER_LEVEL_PROGRESSION.slice(0, 10).map((level) => {
          const status = getLevelStatus(level.level);
          const isCompleted = status === "completed";
          const isCurrent = status === "current";
          const isLocked = status === "locked";
          
          return (
            <div
              key={level.level}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : isCurrent
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                  ${isCompleted 
                    ? `bg-gradient-to-br ${getLevelColor(level.level)}` 
                    : isCurrent 
                    ? `bg-gradient-to-br ${getLevelColor(level.level)}`
                    : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <Star className="w-6 h-6 text-white" />
                  ) : (
                    <Shield className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Level {level.level} - {level.title}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {level.totalXPNeeded} XP
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      +{level.careerCoins} CC
                    </span>
                    {level.unlocks.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Unlock className="w-4 h-4" />
                        {level.unlocks.length} unlock{level.unlocks.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedLevel === level.level ? 'rotate-180' : ''
                  }`}
                />
              </div>
              
              {selectedLevel === level.level && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {level.unlocks.map((unlockId) => {
                      const unlock = EMPLOYER_FEATURE_UNLOCKS[unlockId];
                      return unlock ? (
                        <div key={unlockId} className="flex items-center gap-2 text-sm">
                          <span className="text-lg">{unlock.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {unlock.name}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {unlock.description}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {level.specialRewards && level.specialRewards.length > 0 && (
                      <div className="pt-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Special Rewards:
                        </div>
                        {level.specialRewards.map((reward, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Gift className="w-4 h-4" />
                            {reward}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureUnlocksSection() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Feature Unlocks
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(EMPLOYER_FEATURE_UNLOCKS).slice(0, 6).map(([id, feature]) => (
          <div key={id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Level {feature.levelRequired} required
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EmployerLevelSystemPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LevelSystemHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Level Overview */}
          <div className="lg:col-span-1">
            <LevelOverview />
          </div>
          
          {/* Right Column - Progression & Features */}
          <div className="lg:col-span-2 space-y-8">
            <LevelProgression />
            <FeatureUnlocksSection />
          </div>
        </div>
      </div>
    </div>
  );
}
