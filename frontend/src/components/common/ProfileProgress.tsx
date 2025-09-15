'use client';
import React from 'react';
import { CheckCircle, Circle, Target, TrendingUp } from 'lucide-react';

export interface ProfileSection {
  id: string;
  name: string;
  completed: boolean;
  weight: number; // 0-100 points
  items: {
    id: string;
    name: string;
    completed: boolean;
    required: boolean;
  }[];
}

interface ProfileProgressProps {
  sections: ProfileSection[];
  className?: string;
  showDetails?: boolean;
  targetScore?: number;
}

export const ProfileProgress: React.FC<ProfileProgressProps> = ({
  sections,
  className = '',
  showDetails = true,
  targetScore = 80
}) => {
  // Calculate overall completion
  const totalPossiblePoints = sections.reduce((sum, section) => sum + section.weight, 0);
  const completedPoints = sections.reduce((sum, section) => {
    if (section.completed) return sum + section.weight;
    
    const completedItems = section.items.filter(item => item.completed).length;
    const totalItems = section.items.length;
    const sectionProgress = totalItems > 0 ? (completedItems / totalItems) : 0;
    
    return sum + (section.weight * sectionProgress);
  }, 0);

  const completionPercentage = totalPossiblePoints > 0 ? (completedPoints / totalPossiblePoints) * 100 : 0;
  const isTargetMet = completionPercentage >= targetScore;

  // Calculate next recommended actions
  const incompleteRequiredItems = sections
    .flatMap(section => 
      section.items
        .filter(item => !item.completed && item.required)
        .map(item => ({ ...item, sectionName: section.name }))
    )
    .slice(0, 3);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isTargetMet ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'}`}>
            {isTargetMet ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isTargetMet ? 'Great job! Your profile is comprehensive.' : `${Math.round(targetScore - completionPercentage)}% away from target`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${isTargetMet ? 'text-green-600' : 'text-blue-600'}`}>
            {Math.round(completionPercentage)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(completedPoints)} / {totalPossiblePoints} pts
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Target: {targetScore}%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                isTargetMet ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
          {/* Target indicator */}
          <div 
            className="absolute top-0 w-0.5 h-3 bg-gray-400 dark:bg-gray-500"
            style={{ left: `${targetScore}%` }}
          />
        </div>
      </div>

      {/* Section Breakdown */}
      {showDetails && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Profile Sections
          </h4>
          
          <div className="grid gap-3">
            {sections.map((section) => {
              const completedItems = section.items.filter(item => item.completed).length;
              const totalItems = section.items.length;
              const sectionProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
              
              return (
                <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full ${
                      section.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                      : sectionProgress > 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-600'
                    }`}>
                      {section.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {section.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {completedItems} of {totalItems} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round(sectionProgress)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {section.weight} pts
                      </div>
                    </div>
                    <div className="w-12 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          section.completed ? 'bg-green-500' 
                          : sectionProgress > 0 ? 'bg-yellow-500' 
                          : 'bg-gray-300'
                        }`}
                        style={{ width: `${Math.min(sectionProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Actions */}
      {incompleteRequiredItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Recommended Next Steps
            </h4>
          </div>
          <div className="space-y-2">
            {incompleteRequiredItems.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Complete <strong>{item.name}</strong> in {item.sectionName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Message */}
      {isTargetMet && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Excellent profile completion!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your comprehensive profile will help employers find and connect with you more effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;