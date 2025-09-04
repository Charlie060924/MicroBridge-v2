"use client";

import React from 'react';
import { CheckCircle, Clock, AlertCircle, Edit, Trash2, Calendar } from 'lucide-react';
import { Milestone } from '@/hooks/useMilestones';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit?: (milestone: Milestone) => void;
  onDelete?: (milestoneId: string) => void;
  onComplete?: (milestoneId: string) => void;
  onStatusChange?: (milestoneId: string, status: Milestone['status']) => void;
  isEditable?: boolean;
  showActions?: boolean;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onEdit,
  onDelete,
  onComplete,
  onStatusChange,
  isEditable = false,
  showActions = true
}) => {
  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const isOverdue = new Date(milestone.dueDate) < new Date() && milestone.status !== 'completed';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = (newStatus: Milestone['status']) => {
    if (onStatusChange) {
      onStatusChange(milestone.id, newStatus);
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all duration-200 ${
      isOverdue ? 'border-red-300 : 'border-gray-200 
    } ${milestone.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          {getStatusIcon(milestone.status)}
          <div className="flex-1">
            <h3 className={`font-semibold text-sm ${
              milestone.status === 'completed' 
                ? 'text-gray-600 line-through' 
                : 'text-gray-900
            }`}>
              {milestone.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {milestone.description}
            </p>
          </div>
        </div>
        
        {showActions && isEditable && (
          <div className="flex items-center space-x-1">
            {milestone.status !== 'completed' && (
              <button
                onClick={() => onComplete?.(milestone.id)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                title="Mark as completed"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onEdit?.(milestone)}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
              title="Edit milestone"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete?.(milestone.id)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Delete milestone"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
            {getStatusText(milestone.status)}
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500
            <Calendar className="h-3 w-3" />
            <span>Due: {formatDate(milestone.dueDate)}</span>
          </div>
        </div>

        {milestone.completedDate && (
          <div className="text-xs text-gray-500
            Completed: {formatDate(milestone.completedDate)}
          </div>
        )}
      </div>

      {isOverdue && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200  rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-700
              This milestone is overdue
            </span>
          </div>
        </div>
      )}

      {isEditable && onStatusChange && (
        <div className="mt-3 pt-3 border-t border-gray-200
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500
            <select
              value={milestone.status}
              onChange={(e) => handleStatusChange(e.target.value as Milestone['status'])}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white  text-gray-900 
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;
