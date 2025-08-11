import { LevelData, LevelReward, FEATURE_UNLOCKS, LEVEL_PROGRESSION, Achievement } from "@/types/level";

const LOCAL_STORAGE_KEY = "enhanced_level_system_data";

// Configuration constants for easy balancing
export const LEVEL_CONFIG = {
  BASE_XP_REQUIREMENT: 100,
  LEVEL_MULTIPLIER: 1.2,
  PRESTIGE_XP_PER_LEVEL: 7500, // Flat XP for levels beyond 25
  STREAK_XP_BONUS: 10, // Daily XP bonus for maintaining streak
  MAX_STREAK_BONUS: 50, // Maximum daily streak bonus
};

export const enhancedLevelService = {
  // Core data management
  getLocalLevelData(): LevelData | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveLocalLevelData(data: LevelData) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  },

  // Initialize new user data
  initializeUserData(): LevelData {
    const initialData: LevelData = {
      level: 1,
      xp: 0,
      xpToNext: this.calculateXPToNext(1),
      achievements: [],
      totalXP: 0,
      careerCoins: 0,
      unlockedFeatures: ["daily_dashes", "streaks"], // Level 1 unlocks
      streakDays: 0,
      totalStreakDays: 0,
      prestigeLevel: 0,
      metaAchievements: []
    };
    this.saveLocalLevelData(initialData);
    return initialData;
  },

  // Core XP and leveling functions
  addXP(currentData: LevelData, amount: number): { newData: LevelData; levelUp: boolean; rewards?: LevelReward } {
    let newData = { ...currentData };
    let levelUp = false;
    let rewards: LevelReward | undefined;

    // Add XP
    newData.xp += amount;
    newData.totalXP += amount;

    // Check for level up
    while (newData.xp >= newData.xpToNext) {
      newData.xp -= newData.xpToNext;
      newData.level++;
      levelUp = true;

      // Get rewards for this level
      const levelReward = this.getLevelReward(newData.level);
      if (levelReward) {
        rewards = levelReward;
        
        // Add Career Coins
        newData.careerCoins += levelReward.careerCoins;
        
        // Unlock features
        levelReward.unlocks.forEach(featureId => {
          if (!newData.unlockedFeatures.includes(featureId)) {
            newData.unlockedFeatures.push(featureId);
          }
        });
      }

      // Calculate XP needed for next level
      newData.xpToNext = this.calculateXPToNext(newData.level);
    }

    this.saveLocalLevelData(newData);
    return { newData, levelUp, rewards };
  },

  addCC(currentData: LevelData, amount: number): LevelData {
    const newData = { ...currentData, careerCoins: currentData.careerCoins + amount };
    this.saveLocalLevelData(newData);
    return newData;
  },

  spendCC(currentData: LevelData, amount: number): { success: boolean; newData: LevelData } {
    if (currentData.careerCoins < amount) {
      return { success: false, newData: currentData };
    }
    
    const newData = { ...currentData, careerCoins: currentData.careerCoins - amount };
    this.saveLocalLevelData(newData);
    return { success: true, newData };
  },

  // Feature unlock management
  checkUnlocks(level: number): string[] {
    const unlocks: string[] = [];
    Object.values(FEATURE_UNLOCKS).forEach(feature => {
      if (feature.levelRequired === level) {
        unlocks.push(feature.id);
      }
    });
    return unlocks;
  },

  isFeatureUnlocked(currentData: LevelData, featureId: string): boolean {
    return currentData.unlockedFeatures.includes(featureId);
  },

  // Streak management
  updateStreak(currentData: LevelData, didActivityToday: boolean): { newData: LevelData; streakBonus: number } {
    let newData = { ...currentData };
    let streakBonus = 0;

    if (didActivityToday) {
      newData.streakDays++;
      newData.totalStreakDays = Math.max(newData.totalStreakDays, newData.streakDays);
      
      // Calculate streak bonus (capped at MAX_STREAK_BONUS)
      streakBonus = Math.min(newData.streakDays * LEVEL_CONFIG.STREAK_XP_BONUS, LEVEL_CONFIG.MAX_STREAK_BONUS);
      
      // Check for streak achievements
      if (newData.streakDays === 7 && !newData.achievements.find(a => a.id === "streaker_badge")) {
        newData.achievements.push({
          id: "streaker_badge",
          title: "Streaker",
          description: "Achieved 7-day streak",
          icon: "🔥",
          category: 'student'
        });
      }
    } else {
      // Reset streak if no activity today
      newData.streakDays = 0;
    }

    this.saveLocalLevelData(newData);
    return { newData, streakBonus };
  },

  // Achievement management
  unlockAchievement(currentData: LevelData, achievement: Achievement): { newData: LevelData; isNew: boolean } {
    const existingAchievement = currentData.achievements.find(a => a.id === achievement.id);
    if (existingAchievement) {
      return { newData: currentData, isNew: false };
    }

    const newData = { 
      ...currentData, 
      achievements: [...currentData.achievements, achievement] 
    };

    // Award XP for achievement if specified
    if (achievement.xpReward && achievement.xpReward > 0) {
      const result = this.addXP(newData, achievement.xpReward);
      return { newData: result.newData, isNew: true };
    }

    this.saveLocalLevelData(newData);
    return { newData, isNew: true };
  },

  // Prestige system
  prestigeBadges(currentData: LevelData): { newData: LevelData; success: boolean } {
    if (currentData.level < 20) {
      return { newData: currentData, success: false };
    }

    const newData = {
      ...currentData,
      prestigeLevel: currentData.prestigeLevel + 1,
      achievements: [], // Reset achievements
      // Keep level, XP, and Career Coins
    };

    this.saveLocalLevelData(newData);
    return { newData, success: true };
  },

  // Meta-achievement tracking
  checkMetaAchievements(currentData: LevelData): { newData: LevelData; newMetaAchievements: string[] } {
    const newMetaAchievements: string[] = [];
    const newData = { ...currentData };

    // Check for 365-day streak
    if (currentData.totalStreakDays >= 365 && !currentData.metaAchievements.includes("streak_365")) {
      newMetaAchievements.push("streak_365");
      newData.metaAchievements.push("streak_365");
    }

    // Note: CC spending and referral tracking would need to be implemented separately
    // as they require additional tracking mechanisms

    if (newMetaAchievements.length > 0) {
      this.saveLocalLevelData(newData);
    }

    return { newData, newMetaAchievements };
  },

  // Utility functions
  calculateXPToNext(level: number): number {
    if (level <= 25) {
      const levelData = LEVEL_PROGRESSION.find(l => l.level === level);
      if (levelData) {
        const nextLevel = LEVEL_PROGRESSION.find(l => l.level === level + 1);
        return nextLevel ? nextLevel.xpForThisLevel : LEVEL_CONFIG.PRESTIGE_XP_PER_LEVEL;
      }
    }
    
    // For levels beyond 25, use flat progression
    return LEVEL_CONFIG.PRESTIGE_XP_PER_LEVEL;
  },

  getLevelReward(level: number): LevelReward | undefined {
    return LEVEL_PROGRESSION.find(l => l.level === level);
  },

  getCurrentLevelData(currentData: LevelData): LevelReward | undefined {
    return this.getLevelReward(currentData.level);
  },

  getNextLevelData(currentData: LevelData): LevelReward | undefined {
    return this.getLevelReward(currentData.level + 1);
  },

  getProgressPercentage(currentData: LevelData): number {
    return (currentData.xp / currentData.xpToNext) * 100;
  },

  // Feature availability checks
  canAccessFeature(currentData: LevelData, featureId: string): boolean {
    const feature = FEATURE_UNLOCKS[featureId];
    if (!feature) return false;
    
    return currentData.level >= feature.levelRequired;
  },

  // Rewards store availability
  canAccessRewardsStore(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "rewards_store");
  },

  // Guild access
  canAccessGuilds(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "job_search_guilds");
  },

  // Veteran tier access
  canAccessVeteranTier(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "veteran_tier");
  },

  // Streak bonds access
  canAccessStreakBonds(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "streak_bonds");
  },

  // Reward optimizer access
  canAccessRewardOptimizer(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "reward_optimizer");
  },

  // Badge prestige access
  canAccessBadgePrestige(currentData: LevelData): boolean {
    return this.isFeatureUnlocked(currentData, "badge_prestige");
  }
};

// Legacy compatibility
export const levelService = enhancedLevelService;
