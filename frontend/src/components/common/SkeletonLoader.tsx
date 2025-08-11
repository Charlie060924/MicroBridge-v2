import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
  spacing?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
  spacing = 4
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse';
  
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
    card: 'rounded-lg',
    avatar: 'rounded-full',
    button: 'rounded-lg'
  };

  const skeletonVariants = {
    animate: {
      background: [
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
      ]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  };

  const style = {
    width: width,
    height: height || (variant === 'text' ? '1rem' : variant === 'avatar' ? '2.5rem' : 'auto')
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={{ 
              ...style, 
              width: index === lines - 1 ? '60%' : '100%' 
            }}
            variants={skeletonVariants}
            animate="animate"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
      variants={skeletonVariants}
      animate="animate"
    />
  );
};

// Predefined skeleton components for common use cases
export const JobCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="40%" />
      </div>
      <Skeleton variant="circular" width="2rem" height="2rem" />
    </div>
    <Skeleton variant="text" lines={2} />
    <div className="flex items-center space-x-2">
      <Skeleton variant="rectangular" width="4rem" height="1.5rem" />
      <Skeleton variant="rectangular" width="6rem" height="1.5rem" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton variant="avatar" width="4rem" height="4rem" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton variant="rectangular" height="2rem" />
      <Skeleton variant="rectangular" height="2rem" />
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="circular" width="2rem" height="2rem" />
    </div>
    <Skeleton variant="text" width="30%" />
    <Skeleton variant="rectangular" height="3rem" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Header */}
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" width="90%" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
