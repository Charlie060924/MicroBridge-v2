"use client";

import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface MeetingScheduleStepProps {
  project: any;
  onComplete: () => void;
}

export const MeetingScheduleStep: React.FC<MeetingScheduleStepProps> = ({ 
  project, 
  onComplete 
}) => {
  const [meetingData, setMeetingData] = useState({
    date: '',
    time: '',
    platform: 'zoom',
    notes: '',
    agenda: ['Project overview and requirements', 'Timeline and milestones discussion', 'Communication preferences']
  });

  const handleAgendaChange = (index: number, value: string) => {
    setMeetingData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const addAgendaItem = () => {
    setMeetingData(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const removeAgendaItem = (index: number) => {
    setMeetingData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = meetingData.date && meetingData.time;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Schedule Your Kickoff Meeting
        </h3>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Project:</strong> {project.title}
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Employer:</strong> {project.employer || 'Employer Name'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Date
          </label>
          <input
            type="date"
            value={meetingData.date}
            onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meeting Time
          </label>
          <input
            type="time"
            value={meetingData.time}
            onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Platform
        </label>
        <select
          value={meetingData.platform}
          onChange={(e) => setMeetingData(prev => ({ ...prev, platform: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="zoom">Zoom</option>
          <option value="teams">Microsoft Teams</option>
          <option value="meet">Google Meet</option>
          <option value="phone">Phone Call</option>
          <option value="in-person">In Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meeting Agenda
        </label>
        <div className="space-y-2">
          {meetingData.agenda.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleAgendaChange(index, e.target.value)}
                placeholder={`Agenda item ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {meetingData.agenda.length > 1 && (
                <button
                  onClick={() => removeAgendaItem(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addAgendaItem}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Agenda Item
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Notes
        </label>
        <textarea
          value={meetingData.notes}
          onChange={(e) => setMeetingData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any specific topics you'd like to discuss or questions you have..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-24"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isFormValid ? (
            <span className="text-green-600">✓ Ready to schedule</span>
          ) : (
            <span>Please fill in the date and time</span>
          )}
        </div>
        <button
          onClick={onComplete}
          disabled={!isFormValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Clock className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>
    </div>
  );
};