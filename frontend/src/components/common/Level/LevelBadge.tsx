"use client";

import React from "react";
import { useLevel } from "@/hooks/useLevel";

interface LevelBadgeProps {
  showXP?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
}

export default function LevelBadge({ 
  showXP = true, 
  size = 'md', 
  variant = 'default' 
}: LevelBadgeProps) {
  const { levelData } = useLevel();
  
  const percentage = (levelData.xp / levelData.xpToNext) * 100;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    default: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    compact: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    detailed: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}>
        <span className="font-medium">Lv.{levelData.level}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`inline-flex items-center gap-2 rounded-lg ${sizeClasses[size]} ${variantClasses[variant]} shadow-sm`}>
        <div className="flex items-center gap-1">
          <span className="text-lg">⭐</span>
          <span className="font-bold">Level {levelData.level}</span>
        </div>
        {showXP && (
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs opacity-90">{levelData.xp}/{levelData.xpToNext}</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <span className="font-medium">Level {levelData.level}</span>
      {showXP && (
        <span className="text-xs opacity-75">
          {levelData.xp}/{levelData.xpToNext} XP
        </span>
      )}
    </div>
  );
}
