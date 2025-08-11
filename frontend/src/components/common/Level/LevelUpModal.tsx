"use client";

import React from "react";
import { LevelReward, FEATURE_UNLOCKS } from "@/types/level";
import { Star, Coins, Unlock, Gift, X } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelData: LevelReward;
  newLevel: number;
}

export default function LevelUpModal({ isOpen, onClose, levelData, newLevel }: LevelUpModalProps) {
  if (!isOpen) return null;

  const getFeatureInfo = (featureId: string) => {
    return FEATURE_UNLOCKS[featureId];
  };

  const getLevelColor = (level: number) => {
    if (level < 5) return "from-yellow-400 to-orange-500";
    if (level < 10) return "from-blue-400 to-purple-500";
    if (level < 20) return "from-purple-400 to-pink-500";
    return "from-red-400 to-yellow-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className={`w-20 h-20 bg-gradient-to-br ${getLevelColor(newLevel)} rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse`}>
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{newLevel}</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Level Up!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            {levelData.title}
          </p>
        </div>

        {/* Rewards Section */}
        <div className="space-y-4 mb-6">
          {/* Career Coins */}
          {levelData.careerCoins > 0 && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Career Coins</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Added to your balance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">+{levelData.careerCoins}</p>
              </div>
            </div>
          )}

          {/* Feature Unlocks */}
          {levelData.unlocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-blue-500" />
                New Features Unlocked
              </h3>
              {levelData.unlocks.map((featureId) => {
                const feature = getFeatureInfo(featureId);
                if (!feature) return null;
                
                return (
                  <div key={featureId} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl">{feature.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{feature.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Special Rewards */}
          {levelData.specialRewards && levelData.specialRewards.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Special Rewards
              </h3>
              {levelData.specialRewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl">🎁</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {reward.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Special reward unlocked</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Level Preview */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Next Level Preview</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Level {newLevel + 1}</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {newLevel < 25 ? `${levelData.xpForThisLevel} XP needed` : 'Prestige available'}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          Continue
        </button>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
