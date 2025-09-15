"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Milestone } from '../ProjectMilestonePlanner';

interface AddMilestoneFormProps {
  showForm: boolean;
  onShowForm: (show: boolean) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
}

export const AddMilestoneForm: React.FC<AddMilestoneFormProps> = ({
  showForm,
  onShowForm,
  onAddMilestone
}) => {
  const [newMilestone, setNewMilestone] = useState<Omit<Milestone, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    estimatedHours: 8,
    dependencies: []
  });

  const handleSubmit = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      onAddMilestone(newMilestone);
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        estimatedHours: 8,
        dependencies: []
      });
    }
  };

  const handleCancel = () => {
    onShowForm(false);
    setNewMilestone({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      estimatedHours: 8,
      dependencies: []
    });
  };

  const isFormValid = newMilestone.title.trim() && newMilestone.dueDate;

  if (!showForm) {
    return (
      <button
        onClick={() => onShowForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Add New Milestone</span>
      </button>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">Add New Milestone</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Milestone Title*
          </label>
          <input
            type="text"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Complete wireframes"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date*
          </label>
          <input
            type="date"
            value={newMilestone.dueDate}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={newMilestone.description}
          onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what needs to be accomplished..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={newMilestone.priority}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, priority: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estimated Hours
          </label>
          <input
            type="number"
            value={newMilestone.estimatedHours}
            onChange={(e) => setNewMilestone(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
            min="1"
            max="40"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isFormValid ? (
            <span className="text-green-600">✓ Ready to add milestone</span>
          ) : (
            <span>Please fill in title and due date</span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Milestone
          </button>
        </div>
      </div>
    </div>
  );
};