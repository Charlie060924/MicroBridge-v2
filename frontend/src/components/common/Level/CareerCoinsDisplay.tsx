"use client";

import React from "react";
import { Coins } from "lucide-react";

interface CareerCoinsDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export default function CareerCoinsDisplay({ 
  amount, 
  size = 'md', 
  showLabel = true, 
  variant = 'default',
  className = ''
}: CareerCoinsDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-sm',
    compact: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-md',
    detailed: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-md'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
        <Coins className={iconSizes[size]} />
        <span className="font-medium">{amount.toLocaleString()}</span>
        {showLabel && <span className="text-xs opacity-75">CC</span>}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`inline-flex items-center gap-3 ${variantClasses[variant]} ${className}`}>
        <div className="flex items-center gap-2">
          <Coins className={iconSizes[size]} />
          <div>
            <div className="font-bold">{amount.toLocaleString()}</div>
            {showLabel && <div className="text-xs opacity-90">Career Coins</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      <Coins className={iconSizes[size]} />
      <span className="font-semibold">{amount.toLocaleString()}</span>
      {showLabel && <span className="text-xs opacity-90">CC</span>}
    </div>
  );
}
