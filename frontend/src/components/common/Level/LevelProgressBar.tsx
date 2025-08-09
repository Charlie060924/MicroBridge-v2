"use client";

import React from "react";
import { useLevel } from "@/hooks/useLevel";

export default function LevelProgressBar() {
  const { levelData } = useLevel();
  const percentage = (levelData.xp / levelData.xpToNext) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-lg p-2">
      <div className="flex justify-between text-sm mb-1">
        <span>Level {levelData.level}</span>
        <span>{levelData.xp}/{levelData.xpToNext} XP</span>
      </div>
      <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
        <div
          className="h-3 bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
