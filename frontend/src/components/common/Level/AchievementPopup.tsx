"use client";

import React, { useEffect, useState } from "react";
import { Achievement } from "@/types/level";

type Props = {
  achievement: Achievement | null;
};

export default function AchievementPopup({ achievement }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  if (!achievement || !visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce max-w-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div>
          <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
          <p className="font-semibold">{achievement.title}</p>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
