import { useLevelContext } from "@/app/context/LevelContext";

export const useLevel = () => {
  const { levelData, gainXP, unlockAchievement, getTotalXP } = useLevelContext();
  return { levelData, gainXP, unlockAchievement, getTotalXP };
};
