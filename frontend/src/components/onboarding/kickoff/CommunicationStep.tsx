"use client";

import React, { useState } from 'react';
import { MessageSquare, Clock, Globe, CheckCircle } from 'lucide-react';

interface CommunicationStepProps {
  project: any;
  onComplete: () => void;
}

export const CommunicationStep: React.FC<CommunicationStepProps> = ({ 
  project, 
  onComplete 
}) => {
  const [commPrefs, setCommPrefs] = useState({
    primaryMethod: 'slack',
    secondaryMethod: 'email',
    frequency: 'daily',
    timezone: 'Asia/Hong_Kong',
    availableHours: {
      start: '09:00',
      end: '18:00'
    },
    responseTime: '4-hours',
    urgentContact: '',
    preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    escalationProcess: 'email-then-phone'
  });

  const communicationMethods = [
    { value: 'slack', label: 'Slack', icon: '💬' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
    { value: 'teams', label: 'Microsoft Teams', icon: '🔗' },
    { value: 'discord', label: 'Discord', icon: '🎮' },
    { value: 'phone', label: 'Phone Call', icon: '📞' }
  ];

  const timezones = [
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Singapore',
    'America/New_York',
    'Europe/London',
    'UTC'
  ];

  const days = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const handleDayToggle = (day: string) => {
    setCommPrefs(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const isFormValid = commPrefs.primaryMethod && commPrefs.frequency && commPrefs.timezone;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Communication Preferences
        </h3>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <p className="text-sm text-purple-800 dark:text-purple-300">
          Set up clear communication channels to ensure smooth project collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Communication Method
          </label>
          <select
            value={commPrefs.primaryMethod}
            onChange={(e) => setCommPrefs(prev => ({ ...prev, primaryMethod: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {communicationMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.icon} {method.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secondary Method (Backup)
          </label>
          <select
            value={commPrefs.secondaryMethod}
            onChange={(e) => setCommPrefs(prev => ({ ...prev, secondaryMethod: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {communicationMethods
              .filter(method => method.value !== commPrefs.primaryMethod)
              .map(method => (
                <option key={method.value} value={method.value}>
                  {method.icon} {method.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Update Frequency
          </label>
          <select
            value={commPrefs.frequency}
            onChange={(e) => setCommPrefs(prev => ({ ...prev, frequency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="real-time">Real-time</option>
            <option value="daily">Daily</option>
            <option value="every-other-day">Every Other Day</option>
            <option value="weekly">Weekly</option>
            <option value="milestone">At Milestones</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expected Response Time
          </label>
          <select
            value={commPrefs.responseTime}
            onChange={(e) => setCommPrefs(prev => ({ ...prev, responseTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="immediate">Within 1 hour</option>
            <option value="4-hours">Within 4 hours</option>
            <option value="24-hours">Within 24 hours</option>
            <option value="48-hours">Within 48 hours</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timezone
        </label>
        <select
          value={commPrefs.timezone}
          onChange={(e) => setCommPrefs(prev => ({ ...prev, timezone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Available Hours
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
            <input
              type="time"
              value={commPrefs.availableHours.start}
              onChange={(e) => setCommPrefs(prev => ({
                ...prev,
                availableHours: { ...prev.availableHours, start: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Time</label>
            <input
              type="time"
              value={commPrefs.availableHours.end}
              onChange={(e) => setCommPrefs(prev => ({
                ...prev,
                availableHours: { ...prev.availableHours, end: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Days
        </label>
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day.value}
              onClick={() => handleDayToggle(day.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                commPrefs.preferredDays.includes(day.value)
                  ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Emergency Contact (Optional)
        </label>
        <input
          type="text"
          value={commPrefs.urgentContact}
          onChange={(e) => setCommPrefs(prev => ({ ...prev, urgentContact: e.target.value }))}
          placeholder="Phone number or urgent contact method"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isFormValid ? (
            <span className="text-green-600">✓ Communication setup complete</span>
          ) : (
            <span>Please complete required fields</span>
          )}
        </div>
        <button
          onClick={onComplete}
          disabled={!isFormValid}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Set Communication</span>
        </button>
      </div>
    </div>
  );
};