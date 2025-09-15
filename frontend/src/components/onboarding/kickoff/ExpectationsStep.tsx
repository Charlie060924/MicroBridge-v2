"use client";

import React, { useState } from 'react';
import { CheckCircle, Target, Plus, X } from 'lucide-react';

interface ExpectationsStepProps {
  project: any;
  onComplete: () => void;
}

export const ExpectationsStep: React.FC<ExpectationsStepProps> = ({ 
  project, 
  onComplete 
}) => {
  const [expectations, setExpectations] = useState({
    timeline: '',
    deliverables: ['Initial design mockups', 'Working prototype', 'Final deliverable with documentation'],
    communicationFrequency: 'daily',
    workingHours: 'flexible',
    revisionRounds: '3',
    successCriteria: ['Meets all specified requirements', 'Delivered on time', 'Client approval received']
  });

  const addDeliverable = () => {
    setExpectations(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const updateDeliverable = (index: number, value: string) => {
    setExpectations(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((item, i) => i === index ? value : item)
    }));
  };

  const removeDeliverable = (index: number) => {
    if (expectations.deliverables.length > 1) {
      setExpectations(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter((_, i) => i !== index)
      }));
    }
  };

  const addSuccessCriteria = () => {
    setExpectations(prev => ({
      ...prev,
      successCriteria: [...prev.successCriteria, '']
    }));
  };

  const updateSuccessCriteria = (index: number, value: string) => {
    setExpectations(prev => ({
      ...prev,
      successCriteria: prev.successCriteria.map((item, i) => i === index ? value : item)
    }));
  };

  const removeSuccessCriteria = (index: number) => {
    if (expectations.successCriteria.length > 1) {
      setExpectations(prev => ({
        ...prev,
        successCriteria: prev.successCriteria.filter((_, i) => i !== index)
      }));
    }
  };

  const isFormValid = expectations.timeline && 
    expectations.deliverables.every(d => d.trim()) &&
    expectations.successCriteria.every(s => s.trim());

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Target className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Set Clear Expectations
        </h3>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <p className="text-sm text-green-800 dark:text-green-300">
          Clear expectations help ensure project success and reduce misunderstandings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Timeline
          </label>
          <input
            type="text"
            value={expectations.timeline}
            onChange={(e) => setExpectations(prev => ({ ...prev, timeline: e.target.value }))}
            placeholder="e.g., 2 weeks, 1 month, 3-4 weeks"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Revision Rounds
          </label>
          <select
            value={expectations.revisionRounds}
            onChange={(e) => setExpectations(prev => ({ ...prev, revisionRounds: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="1">1 round</option>
            <option value="2">2 rounds</option>
            <option value="3">3 rounds</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Key Deliverables
        </label>
        <div className="space-y-2">
          {expectations.deliverables.map((deliverable, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={deliverable}
                onChange={(e) => updateDeliverable(index, e.target.value)}
                placeholder={`Deliverable ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {expectations.deliverables.length > 1 && (
                <button
                  onClick={() => removeDeliverable(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addDeliverable}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Deliverable</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Communication Frequency
          </label>
          <select
            value={expectations.communicationFrequency}
            onChange={(e) => setExpectations(prev => ({ ...prev, communicationFrequency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="daily">Daily Updates</option>
            <option value="every-other-day">Every Other Day</option>
            <option value="weekly">Weekly Check-ins</option>
            <option value="milestone">At Milestones</option>
            <option value="as-needed">As Needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Working Hours
          </label>
          <select
            value={expectations.workingHours}
            onChange={(e) => setExpectations(prev => ({ ...prev, workingHours: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="flexible">Flexible</option>
            <option value="business-hours">Business Hours (9-5 HKT)</option>
            <option value="evening">Evening Hours (6-10 PM)</option>
            <option value="weekend">Weekends Available</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Success Criteria
        </label>
        <div className="space-y-2">
          {expectations.successCriteria.map((criteria, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={criteria}
                onChange={(e) => updateSuccessCriteria(index, e.target.value)}
                placeholder={`Success criteria ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {expectations.successCriteria.length > 1 && (
                <button
                  onClick={() => removeSuccessCriteria(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSuccessCriteria}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Success Criteria</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isFormValid ? (
            <span className="text-green-600">✓ All expectations defined</span>
          ) : (
            <span>Please complete all required fields</span>
          )}
        </div>
        <button
          onClick={onComplete}
          disabled={!isFormValid}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Set Expectations</span>
        </button>
      </div>
    </div>
  );
};