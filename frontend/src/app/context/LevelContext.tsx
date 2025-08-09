"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LevelData, Achievement } from "@/types/level";
import { levelService } from "@/services/levelService";

type LevelContextType = {
  levelData: LevelData;
  gainXP: (amount: number) => void;
  unlockAchievement: (achievement: Achievement) => void;
  getTotalXP: () => number;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider = ({ children }: { children: ReactNode }) => {
  const [levelData, setLevelData] = useState<LevelData>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    achievements: [],
    totalXP: 0,
  });

  // Load initial data (from API/localStorage)
  useEffect(() => {
    const stored = levelService.getLocalLevelData();
    if (stored) setLevelData(stored);
  }, []);

  const gainXP = (amount: number) => {
    setLevelData((prev) => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNext;
      let totalXP = prev.totalXP + amount;

      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        newLevel++;
        xpToNext = Math.floor(xpToNext * 1.2); // XP requirement increases per level
      }

      const updated = { ...prev, xp: newXP, level: newLevel, xpToNext, totalXP };
      levelService.saveLocalLevelData(updated);
      return updated;
    });
  };

  const unlockAchievement = (achievement: Achievement) => {
    setLevelData((prev) => {
      if (prev.achievements.find((a) => a.id === achievement.id)) return prev;
      
      const updated = { 
        ...prev, 
        achievements: [...prev.achievements, achievement] 
      };
      
      // Award XP for achievement if specified
      if (achievement.xpReward) {
        gainXP(achievement.xpReward);
      }
      
      levelService.saveLocalLevelData(updated);
      return updated;
    });
  };

  const getTotalXP = () => {
    return levelData.totalXP;
  };

  return (
    <LevelContext.Provider value={{ levelData, gainXP, unlockAchievement, getTotalXP }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevelContext = () => {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevelContext must be used within LevelProvider");
  return ctx;
};
