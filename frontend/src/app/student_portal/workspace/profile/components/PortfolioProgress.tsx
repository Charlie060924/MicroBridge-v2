import React from 'react';

interface PortfolioProgressProps {
  totalProjects: number;
  featuredProjects: number;
}

const PortfolioProgress: React.FC<PortfolioProgressProps> = ({
  totalProjects,
  featuredProjects
}) => {
  const portfolioCompletionPercentage = Math.min(100, (totalProjects / 5) * 100);

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900 dark:text-blue-100">
          Portfolio Completion
        </h4>
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {Math.round(portfolioCompletionPercentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${portfolioCompletionPercentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-300">
        <span>{totalProjects} Projects</span>
        <span>{featuredProjects} Featured</span>
      </div>
    </div>
  );
};

export default PortfolioProgress;