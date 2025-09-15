"use client";

import React from "react";
import { Award, AlertTriangle } from "lucide-react";

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

interface Recommendation {
  type: 'success' | 'warning' | 'urgent' | 'tip';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

interface ProductivityRecommendationsProps {
  data: ProductivityData;
}

const ProductivityRecommendations: React.FC<ProductivityRecommendationsProps> = ({
  data
}) => {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    if (data.distractionCount > 5) {
      recommendations.push({
        type: 'warning',
        message: "Consider using focus tools to reduce distractions",
        priority: 'high'
      });
    }
    
    if (data.averageSessionLength < 25) {
      recommendations.push({
        type: 'tip',
        message: "Try the Pomodoro technique for longer focus sessions",
        priority: 'medium'
      });
    }
    
    if (data.focusScore < 60) {
      recommendations.push({
        type: 'warning',
        message: "Schedule breaks between intensive work periods",
        priority: 'high'
      });
    }
    
    if (data.weeklyHours < data.weeklyGoal * 0.5) {
      recommendations.push({
        type: 'urgent',
        message: "You're behind on your weekly goal. Consider adjusting your schedule",
        priority: 'high'
      });
    }
    
    if (data.productivityTrend === 'down') {
      recommendations.push({
        type: 'tip',
        message: "Your productivity is declining. Review what's changed in your routine",
        priority: 'medium'
      });
    }
    
    if (data.focusScore >= 80) {
      recommendations.push({
        type: 'success',
        message: "Excellent focus! Keep up the great work",
        priority: 'low'
      });
    }
    
    return recommendations;
  };

  const getRecommendationStyle = (type: Recommendation['type']) => {
    const styles = {
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      urgent: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      tip: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    };
    return styles[type] || styles.tip;
  };

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'success':
        return <Award className="h-5 w-5 text-green-600" />;
      case 'warning':
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
    }
  };

  const recommendations = generateRecommendations();

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Productivity Recommendations
        </h3>
        <div className="text-center py-4">
          <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Great job! No specific recommendations at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2" />
        Productivity Recommendations
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 p-3 border rounded-lg ${getRecommendationStyle(recommendation.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(recommendation.type)}
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">
                {recommendation.message}
              </span>
              {recommendation.priority === 'high' && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    High Priority
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium">
            Start Focus Session
          </button>
          <button className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium">
            View Detailed Stats
          </button>
          <button className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium">
            Export Report
          </button>
          <button className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-sm font-medium">
            Schedule Break
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductivityRecommendations;