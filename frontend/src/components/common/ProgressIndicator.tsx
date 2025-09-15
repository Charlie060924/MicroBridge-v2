'use client';
import React from 'react';

export interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
  showLabels?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  className = '',
  showLabels = true,
  variant = 'horizontal'
}) => {
  const completedCount = steps.filter(step => step.completed).length;
  const currentStepIndex = steps.findIndex(step => step.current);
  const progressPercentage = ((completedCount + (currentStepIndex >= 0 ? 0.5 : 0)) / steps.length) * 100;

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300
                ${step.completed 
                  ? 'bg-primary border-primary text-white' 
                  : step.current
                    ? 'border-primary text-primary bg-white'
                    : 'border-stroke text-gray-400 bg-gray-50 dark:bg-gray-700 dark:border-strokedark'
                }
              `}>
                {step.completed ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-px h-8 mt-2 ${
                  step.completed ? 'bg-primary' : 'bg-stroke dark:bg-strokedark'
                }`} />
              )}
            </div>
            {showLabels && (
              <div className={`flex-1 ${
                step.completed ? 'text-black dark:text-white' 
                : step.current ? 'text-primary font-medium' 
                : 'text-gray-500'
              }`}>
                {step.label}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStepIndex >= 0 ? currentStepIndex + 1 : completedCount} of {steps.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 mb-2
              ${step.completed 
                ? 'bg-primary border-primary text-white transform scale-110' 
                : step.current
                  ? 'border-primary text-primary bg-white animate-pulse'
                  : 'border-stroke text-gray-400 bg-gray-50 dark:bg-gray-700 dark:border-strokedark'
              }
            `}>
              {step.completed ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {showLabels && (
              <span className={`text-xs text-center max-w-20 ${
                step.completed ? 'text-black dark:text-white font-medium' 
                : step.current ? 'text-primary font-medium' 
                : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;