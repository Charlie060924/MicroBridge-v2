"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  task: string;
  description: string;
  category: 'development' | 'research' | 'communication' | 'testing' | 'documentation';
}

interface TimeEntriesListProps {
  entries: TimeEntry[];
  maxDisplay?: number;
  showDate?: boolean;
}

const TimeEntriesList: React.FC<TimeEntriesListProps> = ({
  entries,
  maxDisplay = 5,
  showDate = false
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCategoryColor = (category: TimeEntry['category']) => {
    const colors = {
      development: 'text-blue-600',
      research: 'text-purple-600',
      communication: 'text-green-600',
      testing: 'text-orange-600',
      documentation: 'text-yellow-600'
    };
    return colors[category] || 'text-gray-600';
  };

  if (entries.length === 0) {
    return (
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center py-4">
          <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No time entries yet today
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {showDate ? 'Time Entries' : `Today's Sessions`} ({entries.length})
        </h4>
        {entries.length > maxDisplay && (
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        )}
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {entries.slice(0, maxDisplay).map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h5 className="font-medium text-gray-900 dark:text-white truncate">
                  {entry.task}
                </h5>
                <span className={`text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 ${getCategoryColor(entry.category)}`}>
                  {entry.category}
                </span>
              </div>
              
              {entry.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                  {entry.description}
                </p>
              )}
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>
                  {showDate 
                    ? entry.startTime.toLocaleDateString() + ' ' + entry.startTime.toLocaleTimeString()
                    : entry.startTime.toLocaleTimeString()
                  }
                </span>
                {entry.endTime && (
                  <>
                    <span>→</span>
                    <span>{entry.endTime.toLocaleTimeString()}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDuration(entry.duration)}
                </div>
                <div className="text-xs text-gray-500">
                  {entry.duration >= 60 ? 'Long session' : 'Quick task'}
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
      
      {entries.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Total time: {formatDuration(entries.reduce((sum, entry) => sum + entry.duration, 0))}
            </span>
            <span className="text-gray-500">
              {entries.length} session{entries.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeEntriesList;