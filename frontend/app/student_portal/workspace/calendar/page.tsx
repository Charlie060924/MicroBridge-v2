"use client";

import React, { useState, useEffect } from "react";
import { mockJobEvents, JobEvent } from "./calendarService";

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Job Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
              <p className="text-gray-900 dark:text-white">{event.company}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment</label>
              <p className="text-gray-900 dark:text-white">{event.payment}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</label>
              <p className="text-gray-900 dark:text-white">
                {new Date(event.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</label>
              <p className="text-gray-900 dark:text-white">
                {new Date(event.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            {event.status === "Ongoing" && (
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple calendar component
const SimpleCalendar: React.FC<{ events: JobEvent[]; onEventClick: (event: any) => void }> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const checkDate = new Date(dateStr);
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-blue-500";
      case "Upcoming":
        return "bg-green-500";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: React.ReactElement[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200 dark:border-gray-700 min-h-[100px]"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayEvents = getEventsForDate(date);
    
    days.push(
      <div key={day} className="p-2 border border-gray-200 dark:border-gray-700 min-h-[100px] relative">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{day}</div>
        <div className="space-y-1">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick({
                title: event.title,
                description: event.extendedProps.description,
                company: event.extendedProps.company,
                payment: event.extendedProps.payment,
                startDate: event.start,
                deadline: event.extendedProps.deadline,
                status: event.extendedProps.status
              })}
              className={`text-xs p-1 rounded cursor-pointer text-white truncate ${getStatusColor(event.extendedProps.status)}`}
              title={`${event.title} - ${event.extendedProps.company}`}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 bg-gray-50 dark:bg-gray-800 text-center text-sm font-medium text-gray-900 dark:text-white">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days}
      </div>
    </div>
  );
};

export default function CalendarPage() {
  const [events, setEvents] = useState<JobEvent[]>(mockJobEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch job events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // For now, use mock data
        setEvents(mockJobEvents);
      } catch (error) {
        console.error('Error fetching job events:', error);
        // Fallback to mock data
        setEvents(mockJobEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your job assignments and deadlines
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading calendar...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your job assignments and deadlines
          </p>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <SimpleCalendar events={events} onEventClick={handleEventClick} />
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Event Status</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Ongoing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}