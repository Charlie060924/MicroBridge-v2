"use client";

import React from 'react';
import { BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface MilestoneStatsProps {
  totalMilestones: number;
  completedMilestones: number;
  totalEstimatedHours: number;
  progressPercentage: number;
}

export const MilestoneStats: React.FC<MilestoneStatsProps> = ({
  totalMilestones,
  completedMilestones,
  totalEstimatedHours,
  progressPercentage
}) => {
  const statItems = [
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      label: 'Total Milestones',
      value: totalMilestones,
      color: 'text-blue-600'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'Completed',
      value: completedMilestones,
      color: 'text-green-600'
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      label: 'Est. Hours',
      value: `${totalEstimatedHours}h`,
      color: 'text-purple-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      label: 'Progress',
      value: `${progressPercentage}%`,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {item.icon}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          </div>
          <div className={`text-lg font-bold mt-1 ${item.color}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};