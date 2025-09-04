"use client";

import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-white';
      case 'success':
        return 'bg-success text-white';
      case 'warning':
        return 'bg-warning text-black';
      case 'error':
        return 'bg-error text-white';
      case 'info':
        return 'bg-info text-white';
      case 'outline':
        return 'border border-primary text-primary bg-transparent';
      default:
        return 'bg-primary text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${getVariantClasses()} ${getSizeClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge };
export default Badge;
export type { BadgeProps };