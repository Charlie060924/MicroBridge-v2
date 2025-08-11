"use client";

import React, { useState } from "react";
import { Star, Trophy, TrendingUp, Zap, Coins, Unlock, Flame, Gift, Users, Bot, Shield, ChevronDown } from "lucide-react";
import { useLevel } from "@/hooks/useLevel";
import CareerCoinsDisplay from "@/components/common/Level/CareerCoinsDisplay";
import FeatureUnlocks from "@/components/common/Level/FeatureUnlocks";
import LevelUpModal from "@/components/common/Level/LevelUpModal";
import RewardsStore from "@/components/common/Level/RewardsStore";
import { LEVEL_PROGRESSION, FEATURE_UNLOCKS } from "@/types/level";

function LevelSystemHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Level System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress, earn rewards, and unlock new features
          </p>
        </div>
      </div>
    </div>
  );
}

function LevelOverview() {
  const { 
    levelData, 
    getTotalXP, 
    getProgressPercentage, 
    getCurrentLevelData,
    getNextLevelData,
    canAccessRewardsStore
  } = useLevel();
  
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showRewardsStore, setShowRewardsStore] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);
  
  const totalXP = getTotalXP();
  const progressPercentage = getProgressPercentage();
  const currentLevelData = getCurrentLevelData();
  const nextLevelData = getNextLevelData();

  const getLevelTitle = (level: number) => {
    if (level === 1) return "Newcomer";
    if (level < 5) return "Getting Started";
    if (level < 10) return "Rising Star";
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      {/* Level Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className={`w-24 h-24 bg-gradient-to-br ${getLevelColor(levelData.level)} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
            <Star className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{levelData.level}</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Level {levelData.level}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
          {currentLevelData?.title || getLevelTitle(levelData.level)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress to Level {levelData.level + 1}</span>
          <span className="font-medium text-gray-900 dark:text-white">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {levelData.xp} / {levelData.xpToNext} XP
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total XP</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalXP.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{levelData.achievements.length}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{levelData.streakDays} days</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Unlock className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Features</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{levelData.unlockedFeatures.length}</p>
        </div>
      </div>

      {/* Career Coins Display */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Career Coins</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {canAccessRewardsStore() ? 'Available to spend in Rewards Store' : 'Unlock at Level 2'}
            </p>
          </div>
          <CareerCoinsDisplay 
            amount={levelData.careerCoins} 
            variant="detailed" 
            size="lg"
          />
        </div>
        
        {canAccessRewardsStore() && (
          <button
            onClick={() => setShowRewardsStore(true)}
            className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
          >
            Open Rewards Store
          </button>
        )}
      </div>

      {/* Next Level Preview */}
      {nextLevelData && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Next Level Preview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Level {nextLevelData.level}</span>
              <span className="font-medium text-gray-900 dark:text-white">{nextLevelData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Career Coins</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">+{nextLevelData.careerCoins}</span>
            </div>
            {nextLevelData.unlocks.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Features</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{nextLevelData.unlocks.length}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          levelData={levelUpData.levelData}
          newLevel={levelUpData.newLevel}
        />
      )}

      {/* Rewards Store Modal */}
      <RewardsStore 
        isOpen={showRewardsStore} 
        onClose={() => setShowRewardsStore(false)} 
      />
    </div>
  );
}

function LevelProgression() {
  const { levelData } = useLevel();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const getLevelColor = (level: number) => {
    if (level < 5) return "from-yellow-400 to-orange-500";
    if (level < 10) return "from-blue-400 to-purple-500";
    if (level < 20) return "from-purple-400 to-pink-500";
    return "from-red-400 to-yellow-500";
  };

  const getLevelStatus = (level: number) => {
    if (level < levelData.level) return "completed";
    if (level === levelData.level) return "current";
    return "locked";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Level Progression
      </h3>
      
      <div className="space-y-4">
        {LEVEL_PROGRESSION.map((level) => {
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gray-400'
                }`}>
                  {isCompleted ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <Star className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Level {level.level} - {level.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {level.totalXPNeeded} XP needed • +{level.careerCoins} CC
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {level.unlocks.length > 0 && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {level.unlocks.length} features
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      selectedLevel === level.level ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedLevel === level.level && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    {level.unlocks.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Unlock className="w-4 h-4 text-blue-500" />
                          Features Unlocked
                        </h5>
                        <div className="space-y-2">
                          {level.unlocks.map((featureId) => {
                            const feature = FEATURE_UNLOCKS[featureId];
                            if (!feature) return null;
                            
                            return (
                              <div key={featureId} className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{feature.icon}</span>
                                <span className="text-gray-700 dark:text-gray-300">{feature.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {level.specialRewards && level.specialRewards.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-500" />
                          Special Rewards
                        </h5>
                        <div className="space-y-2">
                          {level.specialRewards.map((reward, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-lg">🎁</span>
                              <span className="text-gray-700 dark:text-gray-300 capitalize">
                                {reward.replace(/_/g, ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
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
  const { levelData } = useLevel();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Available Features
      </h3>
      
      <FeatureUnlocks 
        currentLevel={levelData.level}
        unlockedFeatures={levelData.unlockedFeatures}
        showLocked={true}
        maxFeatures={12}
      />
    </div>
  );
}

export default function LevelSystemPage() {
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
