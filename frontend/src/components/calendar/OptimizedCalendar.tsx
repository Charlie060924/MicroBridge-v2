"use client";

import React, { useState, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, Save } from 'lucide-react';
import PreferredStartDate from './PreferredStartDate';
import AvailabilityGrid from './AvailabilityGrid';

interface AvailabilityRange {
  day: string;
  ranges: [number, number][]; // [startHour, endHour][]
}

interface OptimizedCalendarProps {
  preferredStartDate?: Date;
  availability: AvailabilityRange[];
  onPreferredStartDateChange: (date: Date) => void;
  onAvailabilityChange: (availability: AvailabilityRange[]) => void;
  onSave?: () => void;
  className?: string;
}

export default function OptimizedCalendar({
  preferredStartDate,
  availability,
  onPreferredStartDateChange,
  onAvailabilityChange,
  onSave,
  className = '',
}: OptimizedCalendarProps) {
  const [activeTab, setActiveTab] = useState<'date' | 'availability'>('date');

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Schedule & Availability</h3>
        </div>
        {onSave && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('date')}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'date'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          <CalendarIcon className="h-4 w-4" />
          Preferred Start Date
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
            ${activeTab === 'availability'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          <Clock className="h-4 w-4" />
          Weekly Availability
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'date' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When would you like to start?
              </label>
              <PreferredStartDate
                selectedDate={preferredStartDate}
                onDateSelect={onPreferredStartDateChange}
                className="w-full"
              />
            </div>
            
            {preferredStartDate && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected start date:</strong> {preferredStartDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set your weekly availability
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Click and drag to select your available time slots. You can also use the quick actions below.
              </p>
              <AvailabilityGrid
                availability={availability}
                onAvailabilityChange={onAvailabilityChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {preferredStartDate && (
              <span className="mr-4">
                Start: {preferredStartDate.toLocaleDateString()}
              </span>
            )}
            {availability.length > 0 && (
              <span>
                Available: {availability.length} day{availability.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="text-gray-500">
            {activeTab === 'date' ? 'Date Selection' : 'Availability Grid'}
          </div>
        </div>
      </div>
    </div>
  );
}

