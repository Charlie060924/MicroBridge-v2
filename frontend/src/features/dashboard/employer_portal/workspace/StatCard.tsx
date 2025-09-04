"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  change,
  changeType = 'neutral',
  className = ""
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600
      case 'negative':
        return 'text-red-600
      default:
        return 'text-gray-600
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200  p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-gray-100 rounded-lg">
            <Icon className="h-6 w-6 text-gray-600 />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900
              {value}
            </p>
            {change && (
              <p className={`text-xs font-medium ${getChangeColor()}`}>
                {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
