"use client";

import React, { useState } from "react";
import { 
  TrendingUp, TrendingDown, BarChart3, Target, 
  Award, Activity
} from "lucide-react";
import ProductivityRecommendations from "./ProductivityRecommendations";

interface ProductivityData {
  todayHours: number;
  weeklyHours: number;
  averageSessionLength: number;
  focusScore: number;
  productivityTrend: 'up' | 'down' | 'stable';
  completedTasks: number;
  weeklyGoal: number;
  bestHour: string;
  distractionCount: number;
}

interface ProductivityDashboardProps {
  data: ProductivityData;
  onGoalUpdate?: (newGoal: number) => void;
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({
  data,
  onGoalUpdate
}) => {
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [newGoal, setNewGoal] = useState(data.weeklyGoal);

  const getProductivityLevel = () => {
    if (data.focusScore >= 80) return { 
      level: "Excellent", 
      color: "text-green-600", 
      bgColor: "bg-green-100 dark:bg-green-900/20" 
    };
    if (data.focusScore >= 60) return { 
      level: "Good", 
      color: "text-blue-600", 
      bgColor: "bg-blue-100 dark:bg-blue-900/20" 
    };
    if (data.focusScore >= 40) return { 
      level: "Average", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20" 
    };
    return { 
      level: "Needs Improvement", 
      color: "text-red-600", 
      bgColor: "bg-red-100 dark:bg-red-900/20" 
    };
  };

  const getTrendIcon = () => {
    switch (data.productivityTrend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const productivityLevel = getProductivityLevel();

  const insights = [
    {
      title: "Peak Hour",
      value: data.bestHour,
      description: "Your most productive time"
    },
    {
      title: "Avg Session",
      value: `${Math.round(data.averageSessionLength)}m`,
      description: "Focus session length"
    },
    {
      title: "Weekly Progress",
      value: `${Math.round((data.weeklyHours / data.weeklyGoal) * 100)}%`,
      description: "Toward your goal"
    },
    {
      title: "Tasks Done",
      value: data.completedTasks.toString(),
      description: "This week"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              {index === 0 && getTrendIcon()}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {insight.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {insight.title}
            </div>
            <div className="text-xs text-gray-500">
              {insight.description}
            </div>
          </div>
        ))}
      </div>

      {/* Productivity Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Productivity Score
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${productivityLevel.bgColor} ${productivityLevel.color}`}>
            {productivityLevel.level}
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.focusScore}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>0</span>
            <span className="font-medium">{data.focusScore}/100</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Weekly Goal
          </h3>
          <button
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        
        {showGoalEditor ? (
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
              max="168"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">hours per week</span>
            <button
              onClick={() => {
                onGoalUpdate?.(newGoal);
                setShowGoalEditor(false);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setShowGoalEditor(false)}
              className="text-gray-600 dark:text-gray-400 px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        ) : null}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {data.weeklyHours}h / {data.weeklyGoal}h
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((data.weeklyHours / data.weeklyGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0h</span>
            <span>{data.weeklyGoal}h</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <ProductivityRecommendations 
        data={data}
      />
    </div>
  );
};

export default ProductivityDashboard;