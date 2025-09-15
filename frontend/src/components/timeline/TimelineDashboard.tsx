'use client';
import React, { useState } from 'react';
import { Calendar, Clock, BarChart3, TrendingUp } from 'lucide-react';
import TimelineManager from './TimelineManager';
import SmartDeadlineTracker from './SmartDeadlineTracker';

interface TimelineDashboardProps {
  className?: string;
}

interface TimelineStats {
  totalProjects: number;
  activeProjects: number;
  upcomingDeadlines: number;
  completionRate: number;
  avgProjectDuration: number;
  earnedThisMonth: number;
}

export const TimelineDashboard: React.FC<TimelineDashboardProps> = ({
  className = ''
}) => {
  const [selectedView, setSelectedView] = useState<'timeline' | 'calendar'>('timeline');

  // Mock stats - would come from API in real implementation
  const stats: TimelineStats = {
    totalProjects: 12,
    activeProjects: 3,
    upcomingDeadlines: 5,
    completionRate: 87,
    avgProjectDuration: 14,
    earnedThisMonth: 2400
  };

  const handleNotificationClick = (notification: any) => {
    // Handle notification click - could navigate to project details
    console.log('Notification clicked:', notification);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.totalProjects}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.activeProjects}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.upcomingDeadlines}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.completionRate}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.avgProjectDuration}d
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            HK${stats.earnedThisMonth}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Manager - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('timeline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'timeline'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Timeline View
              </button>
              <button
                onClick={() => setSelectedView('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'calendar'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Calendar View
              </button>
            </div>
          </div>

          {selectedView === 'timeline' ? (
            <TimelineManager />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Calendar view integration coming soon
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Will integrate with existing calendar components
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Smart Deadline Tracker - Takes up 1 column */}
        <div className="lg:col-span-1">
          <SmartDeadlineTracker 
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Add Milestone</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Update Progress</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineDashboard;