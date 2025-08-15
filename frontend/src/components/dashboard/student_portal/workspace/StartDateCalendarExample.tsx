"use client";

import React, { useState } from 'react';
import StartDateCalendar from './StartDateCalendar';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const StartDateCalendarExample: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [calendarMode, setCalendarMode] = useState<'single' | 'range'>('single');

  // Mock unavailable dates (e.g., holidays, company blackout periods)
  const unavailableDates = [
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
  ];

  // Mock minimum start date (e.g., 2 weeks from now)
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 14);

  // Mock maximum start date (e.g., 6 months from now)
  const maxStartDate = new Date();
  maxStartDate.setMonth(maxStartDate.getMonth() + 6);

  const handleSingleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    console.log('Selected single date:', date);
  };

  const handleRangeDateSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log('Selected date range:', { startDate, endDate });
  };

  const getDateDisplayText = () => {
    if (calendarMode === 'single') {
      return selectedDate ? selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : 'No date selected';
    } else {
      if (selectedStartDate && selectedEndDate) {
        return `${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      } else if (selectedStartDate) {
        return `From ${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
      return 'No date range selected';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Preferred Start Date Selection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose when you'd like to start this position
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selection Mode
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setCalendarMode('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                calendarMode === 'single'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Single Date
            </button>
            <button
              onClick={() => setCalendarMode('range')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                calendarMode === 'range'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              Date Range
            </button>
          </div>
        </div>

        {/* Calendar Component */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {calendarMode === 'single' ? 'Select Start Date' : 'Select Date Range'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span>Some dates may be unavailable</span>
            </div>
          </div>

          <StartDateCalendar
            onDateSelect={handleSingleDateSelect}
            onDateRangeSelect={handleRangeDateSelect}
            selectedDate={selectedDate}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            mode={calendarMode}
            minDate={minStartDate}
            maxDate={maxStartDate}
            unavailableDates={unavailableDates}
            placeholder={calendarMode === 'single' ? 'Select your preferred start date' : 'Select your preferred start date range'}
          />
        </div>

        {/* Selected Date Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selected {calendarMode === 'single' ? 'Date' : 'Date Range'}
          </h2>
          
          {((calendarMode === 'single' && selectedDate) || 
            (calendarMode === 'range' && (selectedStartDate || selectedEndDate))) ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {getDateDisplayText()}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {calendarMode === 'single' 
                    ? 'Your preferred start date has been selected'
                    : 'Your preferred date range has been selected'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  No date selected
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please select your preferred start date above
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Important Information
          </h3>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Minimum Start Date:</strong> {minStartDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Maximum Start Date:</strong> {maxStartDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Unavailable Dates:</strong> Some dates may be unavailable due to holidays, 
                company blackout periods, or other scheduling conflicts.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Flexibility:</strong> Your selected date is your preference. The employer 
                may contact you to discuss alternative start dates if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          <button className="px-6 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Back
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Save Draft
            </button>
            <button 
              disabled={!selectedDate && !selectedStartDate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartDateCalendarExample;
