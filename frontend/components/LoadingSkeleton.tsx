"use client";

interface LoadingSkeletonProps {
  height?: string;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  height = 'h-96', 
  className = '' 
}) => {
  return (
    <div className={`w-full ${height} bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg ${className}`}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
