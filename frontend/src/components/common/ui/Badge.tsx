import React from 'react';

interface BadgeProps {
  variant?: 'pending' | 'secured' | 'released' | 'completed' | 'failed' | 'processing' | 'default';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = ""
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    secured: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    released: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
