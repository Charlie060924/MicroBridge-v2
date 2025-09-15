"use client";

import React, { useState, useEffect } from "react";
import { Clock, PlayCircle, PauseCircle } from "lucide-react";
import TimeEntriesList from "./TimeEntriesList";

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  task: string;
  description: string;
  category: 'development' | 'research' | 'communication' | 'testing' | 'documentation';
}

interface TimeTrackerProps {
  onTimeEntryComplete?: (entry: TimeEntry) => void;
  onProgressUpdate?: (todayHours: number) => void;
  dailyGoal?: number;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  onTimeEntryComplete,
  onProgressUpdate,
  dailyGoal = 8
}) => {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentTask, setCurrentTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TimeEntry['category']>('development');
  const [todayHours, setTodayHours] = useState(0);

  const startTimer = () => {
    if (currentTask.trim()) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        startTime: new Date(),
        duration: 0,
        task: currentTask,
        description: taskDescription,
        category: selectedCategory
      };
      setActiveTimer(newEntry);
      setCurrentTask("");
      setTaskDescription("");
    }
  };

  const stopTimer = () => {
    if (activeTimer) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - activeTimer.startTime.getTime()) / 1000 / 60);
      
      const completedEntry = {
        ...activeTimer,
        endTime,
        duration
      };
      
      setTimeEntries(prev => [completedEntry, ...prev]);
      setActiveTimer(null);
      onTimeEntryComplete?.(completedEntry);
      calculateTodayHours([completedEntry, ...timeEntries]);
    }
  };

  const calculateTodayHours = (entries: TimeEntry[]) => {
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
      entry.startTime.toDateString() === today
    );
    const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    setTodayHours(hours);
    onProgressUpdate?.(hours);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = () => {
    const progress = (todayHours / dailyGoal) * 100;
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-green-500";
    if (progress >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  useEffect(() => {
    calculateTodayHours(timeEntries);
  }, [timeEntries]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (prev) {
            const duration = Math.round((new Date().getTime() - prev.startTime.getTime()) / 1000 / 60);
            return { ...prev, duration };
          }
          return prev;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Daily Progress */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Time Tracking
        </h3>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {todayHours}h / {dailyGoal}h
          </div>
          <div className={`text-sm ${getProgressColor()}`}>
            {Math.round((todayHours / dailyGoal) * 100)}% of daily goal
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min((todayHours / dailyGoal) * 100, 100)}%` }}
        />
      </div>

      {/* Active Timer */}
      {activeTimer ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-900 dark:text-green-100">
                {activeTimer.task}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                {activeTimer.description}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {activeTimer.category} • {formatDuration(activeTimer.duration)}
              </div>
            </div>
            <button
              onClick={stopTimer}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <PauseCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="What are you working on?"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <textarea
            placeholder="Task description (optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
          />
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TimeEntry['category'])}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="development">Development</option>
              <option value="research">Research</option>
              <option value="communication">Communication</option>
              <option value="testing">Testing</option>
              <option value="documentation">Documentation</option>
            </select>
            <button
              onClick={startTimer}
              disabled={!currentTask.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Start Timer</span>
            </button>
          </div>
        </div>
      )}

      {/* Today's Entries */}
      <TimeEntriesList 
        entries={timeEntries.filter(e => e.startTime.toDateString() === new Date().toDateString())}
        maxDisplay={3}
      />
    </div>
  );
};

export default TimeTracker;