"use client";

import React from 'react';
import { Target, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import { Milestone } from '../ProjectMilestonePlanner';

interface MilestoneListProps {
  milestones: Milestone[];
  onUpdateMilestone: (id: string, updates: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
  showAddForm: boolean;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  onUpdateMilestone,
  onDeleteMilestone,
  showAddForm
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  if (milestones.length === 0 && !showAddForm) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Milestones Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Break down your project into manageable milestones to track progress effectively.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div 
          key={milestone.id} 
          className={`bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all duration-200 ${
            isOverdue(milestone.dueDate, milestone.status) 
              ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' 
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              {getStatusIcon(milestone.status)}
              <div className="flex-1">
                <h4 className={`font-medium ${
                  milestone.status === 'completed' 
                    ? 'text-gray-600 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {milestone.title}
                </h4>
                {milestone.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDeleteMilestone(milestone.id)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete milestone"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(milestone.priority)}`}>
                {milestone.priority.charAt(0).toUpperCase() + milestone.priority.slice(1)}
              </div>
              
              <div className={`flex items-center text-sm ${
                isOverdue(milestone.dueDate, milestone.status) 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatDate(milestone.dueDate)}</span>
                {isOverdue(milestone.dueDate, milestone.status) && (
                  <span className="ml-1 text-xs font-medium">(Overdue)</span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>{milestone.estimatedHours}h</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={milestone.status}
                onChange={(e) => onUpdateMilestone(milestone.id, { status: e.target.value as any })}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {milestone.status === 'completed' && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Milestone completed successfully!</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};