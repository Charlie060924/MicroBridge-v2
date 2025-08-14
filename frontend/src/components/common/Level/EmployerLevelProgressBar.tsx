"use client";

import React from "react";
import { useEmployerLevel } from "@/hooks/useEmployerLevel";

interface EmployerLevelProgressBarProps {
  showLabel?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export default function EmployerLevelProgressBar({ 
  showLabel = true, 
  showPercentage = true,
  className = ""
}: EmployerLevelProgressBarProps) {
  const { levelData } = useEmployerLevel();
  const percentage = (levelData.xp / levelData.xpToNext) * 100;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Level {levelData.level}</span>
          <span className="text-gray-600 dark:text-gray-400">{levelData.xp}/{levelData.xpToNext} XP</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(percentage)}% to next level
        </div>
      )}
    </div>
  );
}
