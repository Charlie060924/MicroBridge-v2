"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LevelData, Achievement, LevelReward } from "@/types/level";
import { enhancedLevelService } from "@/services/levelService";

type LevelContextType = {
  levelData: LevelData;
  gainXP: (amount: number) => void;
  addCC: (amount: number) => void;
  spendCC: (amount: number) => boolean;
  unlockAchievement: (achievement: Achievement) => void;
  updateStreak: (didActivityToday: boolean) => void;
  prestigeBadges: () => boolean;
  getTotalXP: () => number;
  getProgressPercentage: () => number;
  getCurrentLevelData: () => LevelReward | undefined;
  getNextLevelData: () => LevelReward | undefined;
  isFeatureUnlocked: (featureId: string) => boolean;
  canAccessFeature: (featureId: string) => boolean;
  canAccessRewardsStore: () => boolean;
  canAccessGuilds: () => boolean;
  canAccessVeteranTier: () => boolean;
  canAccessStreakBonds: () => boolean;
  canAccessRewardOptimizer: () => boolean;
  canAccessBadgePrestige: () => boolean;
  initializeUserData: () => void;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider = ({ children }: { children: ReactNode }) => {
  const [levelData, setLevelData] = useState<LevelData | null>(null);

  // Load initial data (from API/localStorage)
  useEffect(() => {
    const stored = enhancedLevelService.getLocalLevelData();
    if (stored) {
      setLevelData(stored);
    } else {
      // Initialize new user data if none exists
      const initialData = enhancedLevelService.initializeUserData();
      setLevelData(initialData);
    }
  }, []);

  const gainXP = (amount: number) => {
    if (!levelData) return;
    
    const result = enhancedLevelService.addXP(levelData, amount);
    setLevelData(result.newData);
    
    // Handle level up rewards
    if (result.levelUp && result.rewards) {
      // You could trigger a level up modal here
      console.log(`Level up! Reached level ${result.newData.level}`);
      console.log(`Rewards: ${result.rewards.careerCoins} CC, Unlocks: ${result.rewards.unlocks.join(', ')}`);
    }
  };

  const addCC = (amount: number) => {
    if (!levelData) return;
    const newData = enhancedLevelService.addCC(levelData, amount);
    setLevelData(newData);
  };

  const spendCC = (amount: number): boolean => {
    if (!levelData) return false;
    const result = enhancedLevelService.spendCC(levelData, amount);
    if (result.success) {
      setLevelData(result.newData);
    }
    return result.success;
  };

  const unlockAchievement = (achievement: Achievement) => {
    if (!levelData) return;
    const result = enhancedLevelService.unlockAchievement(levelData, achievement);
    setLevelData(result.newData);
    
    if (result.isNew) {
      console.log(`Achievement unlocked: ${achievement.title}`);
    }
  };

  const updateStreak = (didActivityToday: boolean) => {
    if (!levelData) return;
    const result = enhancedLevelService.updateStreak(levelData, didActivityToday);
    setLevelData(result.newData);
    
    if (result.streakBonus > 0) {
      console.log(`Streak bonus: +${result.streakBonus} XP`);
    }
  };

  const prestigeBadges = (): boolean => {
    if (!levelData) return false;
    const result = enhancedLevelService.prestigeBadges(levelData);
    if (result.success) {
      setLevelData(result.newData);
      console.log(`Prestige level increased to ${result.newData.prestigeLevel}`);
    }
    return result.success;
  };

  const getTotalXP = () => {
    return levelData?.totalXP || 0;
  };

  const getProgressPercentage = () => {
    if (!levelData) return 0;
    return enhancedLevelService.getProgressPercentage(levelData);
  };

  const getCurrentLevelData = () => {
    if (!levelData) return undefined;
    return enhancedLevelService.getCurrentLevelData(levelData);
  };

  const getNextLevelData = () => {
    if (!levelData) return undefined;
    return enhancedLevelService.getNextLevelData(levelData);
  };

  const isFeatureUnlocked = (featureId: string): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.isFeatureUnlocked(levelData, featureId);
  };

  const canAccessFeature = (featureId: string): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessFeature(levelData, featureId);
  };

  const canAccessRewardsStore = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessRewardsStore(levelData);
  };

  const canAccessGuilds = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessGuilds(levelData);
  };

  const canAccessVeteranTier = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessVeteranTier(levelData);
  };

  const canAccessStreakBonds = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessStreakBonds(levelData);
  };

  const canAccessRewardOptimizer = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessRewardOptimizer(levelData);
  };

  const canAccessBadgePrestige = (): boolean => {
    if (!levelData) return false;
    return enhancedLevelService.canAccessBadgePrestige(levelData);
  };

  const initializeUserData = () => {
    const initialData = enhancedLevelService.initializeUserData();
    setLevelData(initialData);
  };

  // Don't render until we have level data
  if (!levelData) {
    return <div>Loading level system...</div>;
  }

  return (
    <LevelContext.Provider value={{ 
      levelData, 
      gainXP, 
      addCC, 
      spendCC, 
      unlockAchievement, 
      updateStreak, 
      prestigeBadges,
      getTotalXP, 
      getProgressPercentage,
      getCurrentLevelData,
      getNextLevelData,
      isFeatureUnlocked,
      canAccessFeature,
      canAccessRewardsStore,
      canAccessGuilds,
      canAccessVeteranTier,
      canAccessStreakBonds,
      canAccessRewardOptimizer,
      canAccessBadgePrestige,
      initializeUserData
    }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => {
  const context = useContext(LevelContext);
  if (context === undefined) {
    throw new Error('useLevel must be used within a LevelProvider');
  }
  return context;
};
