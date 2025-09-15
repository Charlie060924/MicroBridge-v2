"use client";

import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { MilestoneStats } from './milestones/MilestoneStats';
import { AddMilestoneForm } from './milestones/AddMilestoneForm';
import { MilestoneList } from './milestones/MilestoneList';

interface ProjectMilestonePlannerProps {
  project: any;
  onClose: () => void;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedHours: number;
  dependencies: string[];
}

const ProjectMilestonePlanner: React.FC<ProjectMilestonePlannerProps> = ({
  project,
  onClose
}) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString()
    };
    setMilestones(prev => [...prev, newMilestone]);
    setShowAddForm(false);
  };

  const handleUpdateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const totalEstimatedHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Milestone Planning: {project.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Break down your project into manageable milestones
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <MilestoneStats
            totalMilestones={milestones.length}
            completedMilestones={completedMilestones}
            totalEstimatedHours={totalEstimatedHours}
            progressPercentage={Math.round(progressPercentage)}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Add New Milestone */}
          <div className="mb-6">
            <AddMilestoneForm
              showForm={showAddForm}
              onShowForm={setShowAddForm}
              onAddMilestone={handleAddMilestone}
            />
          </div>

          {/* Milestones List */}
          <MilestoneList
            milestones={milestones}
            onUpdateMilestone={handleUpdateMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            showAddForm={showAddForm}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Milestones
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestonePlanner;