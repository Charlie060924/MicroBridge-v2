"use client";

import React from "react";
import { FEATURE_UNLOCKS, FeatureUnlock } from "@/types/level";
import { Lock, Unlock, Users, Trophy, Shield, Bot, Star } from "lucide-react";

interface FeatureUnlocksProps {
  currentLevel: number;
  unlockedFeatures: string[];
  showLocked?: boolean;
  maxFeatures?: number;
}

export default function FeatureUnlocks({ 
  currentLevel, 
  unlockedFeatures, 
  showLocked = true, 
  maxFeatures = 6 
}: FeatureUnlocksProps) {
  const getFeatureIcon = (category: string) => {
    switch (category) {
      case 'social': return <Users className="w-4 h-4" />;
      case 'premium': return <Trophy className="w-4 h-4" />;
      case 'cosmetic': return <Star className="w-4 h-4" />;
      default: return <Unlock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'social': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'premium': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'cosmetic': return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const features = Object.values(FEATURE_UNLOCKS)
    .filter(feature => {
      if (showLocked) return true;
      return unlockedFeatures.includes(feature.id);
    })
    .sort((a, b) => a.levelRequired - b.levelRequired)
    .slice(0, maxFeatures);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {showLocked ? 'Available Features' : 'Unlocked Features'}
      </h3>
      
      <div className="grid gap-3">
        {features.map((feature) => {
          const isUnlocked = unlockedFeatures.includes(feature.id);
          const canUnlock = currentLevel >= feature.levelRequired;
          
          return (
            <div
              key={feature.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isUnlocked
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : canUnlock
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isUnlocked
                    ? 'bg-green-500 text-white'
                    : canUnlock
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {isUnlocked ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{feature.icon}</span>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                      {feature.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFeatureIcon(feature.category)}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Level {feature.levelRequired}
                      </span>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="text-right">
                        {canUnlock ? (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            Ready to unlock!
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {feature.levelRequired - currentLevel} levels away
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {features.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No features available yet.</p>
          <p className="text-sm">Keep leveling up to unlock new features!</p>
        </div>
      )}
    </div>
  );
}
