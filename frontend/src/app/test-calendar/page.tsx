"use client";

import React from 'react';
import StartDateCalendar from '@/components/dashboard/student_portal/workspace/StartDateCalendar';

const TestCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Redesigned Calendar Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Preferred Start Date Selection
          </h2>
          
          <StartDateCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            minDate={new Date()}
            maxDate={(() => {
              const maxDate = new Date();
              maxDate.setMonth(maxDate.getMonth() + 6);
              return maxDate;
            })()}
            unavailableDates={[
              new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
              new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            ]}
            placeholder="Select your preferred start date"
          />
          
          {selectedDate && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-900 dark:text-green-100">
                <strong>Selected Date:</strong> {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCalendarPage;
