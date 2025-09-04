"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200  p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <Icon className="h-5 w-5 text-gray-600 />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
