import { useLevel } from './useLevel';
import { EMPLOYER_LEVEL_PROGRESSION, EMPLOYER_FEATURE_UNLOCKS, EMPLOYER_ACHIEVEMENTS } from '@/types/employerLevel';

export const useEmployerLevel = () => {
  const levelContext = useLevel();
  
  // Override the getCurrentLevelData and getNextLevelData to use employer progression
  const getCurrentLevelData = () => {
    const currentLevel = EMPLOYER_LEVEL_PROGRESSION.find(level => level.level === levelContext.levelData.level);
    return currentLevel || null;
  };

  const getNextLevelData = () => {
    const nextLevel = EMPLOYER_LEVEL_PROGRESSION.find(level => level.level === levelContext.levelData.level + 1);
    return nextLevel || null;
  };

  // Check if a specific employer feature is unlocked
  const isEmployerFeatureUnlocked = (featureId: string): boolean => {
    const feature = EMPLOYER_FEATURE_UNLOCKS[featureId];
    if (!feature) return false;
    return levelContext.levelData.level >= feature.levelRequired;
  };

  // Get employer-specific achievement data
  const getEmployerAchievement = (achievementId: string) => {
    return EMPLOYER_ACHIEVEMENTS[achievementId as keyof typeof EMPLOYER_ACHIEVEMENTS];
  };

  // Check if an employer achievement is unlocked
  const isEmployerAchievementUnlocked = (achievementId: string): boolean => {
    return levelContext.levelData.achievements.some(achievement => achievement.id === achievementId);
  };

  // Get employer level title
  const getEmployerLevelTitle = (level: number): string => {
    if (level === 1) return "New Employer";
    if (level < 5) return "Getting Started";
    if (level < 10) return "Active Recruiter";
    if (level < 20) return "Hiring Veteran";
    return "Hiring Legend";
  };

  // Get employer level color scheme
  const getEmployerLevelColor = (level: number): string => {
    if (level < 5) return "from-green-400 to-blue-500";
    if (level < 10) return "from-blue-400 to-purple-500";
    if (level < 20) return "from-purple-400 to-pink-500";
    return "from-red-400 to-yellow-500";
  };

  return {
    ...levelContext,
    getCurrentLevelData,
    getNextLevelData,
    isEmployerFeatureUnlocked,
    getEmployerAchievement,
    isEmployerAchievementUnlocked,
    getEmployerLevelTitle,
    getEmployerLevelColor,
    employerLevelProgression: EMPLOYER_LEVEL_PROGRESSION,
    employerFeatureUnlocks: EMPLOYER_FEATURE_UNLOCKS,
    employerAchievements: EMPLOYER_ACHIEVEMENTS
  };
};
