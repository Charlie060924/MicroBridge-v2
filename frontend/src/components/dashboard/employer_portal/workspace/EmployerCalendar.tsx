"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone,
  MessageCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'interview' | 'meeting' | 'deadline' | 'reminder';
  date: string;
  time: string;
  duration: number; // in minutes
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  location?: string;
  isVirtual: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const EmployerCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Mock data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: "1",
        title: "Interview with John Doe",
        type: 'interview',
        date: "2024-01-20",
        time: "10:00",
        duration: 60,
        candidateName: "John Doe",
        candidateEmail: "john.doe@email.com",
        jobTitle: "Frontend Developer",
        location: "Conference Room A",
        isVirtual: false,
        status: 'scheduled',
        notes: "Technical interview focusing on React and TypeScript"
      },
      {
        id: "2",
        title: "Virtual Interview with Jane Smith",
        type: 'interview',
        date: "2024-01-20",
        time: "14:00",
        duration: 45,
        candidateName: "Jane Smith",
        candidateEmail: "jane.smith@email.com",
        jobTitle: "UI/UX Designer",
        location: "Zoom Meeting",
        isVirtual: true,
        status: 'scheduled',
        notes: "Portfolio review and design discussion"
      },
      {
        id: "3",
        title: "Hiring Team Meeting",
        type: 'meeting',
        date: "2024-01-21",
        time: "09:00",
        duration: 30,
        location: "Board Room",
        isVirtual: false,
        status: 'scheduled',
        notes: "Review candidates for Frontend Developer position"
      },
      {
        id: "4",
        title: "Application Deadline - Data Analyst",
        type: 'deadline',
        date: "2024-01-22",
        time: "17:00",
        duration: 0,
        jobTitle: "Data Analyst",
        location: "Online",
        isVirtual: true,
        status: 'scheduled'
      },
      {
        id: "5",
        title: "Follow-up with Mike Johnson",
        type: 'reminder',
        date: "2024-01-23",
        time: "11:00",
        duration: 15,
        candidateName: "Mike Johnson",
        candidateEmail: "mike.johnson@email.com",
        jobTitle: "Frontend Developer",
        location: "Phone Call",
        isVirtual: true,
        status: 'scheduled',
        notes: "Call to discuss next steps in hiring process"
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 500);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <User className="h-3 w-3" />;
      case 'meeting':
        return <MessageCircle className="h-3 w-3" />;
      case 'deadline':
        return <Clock className="h-3 w-3" />;
      case 'reminder':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const days = getDaysInMonth(currentDate);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage interviews and hiring events
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Today
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {weekdays.map(day => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day && day.toDateString() === selectedDate.toDateString();
              const dayEvents = day ? getEventsForDate(day) : [];

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 ${
                    day ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''} ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <button
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`w-full text-left p-1 rounded text-xs font-medium truncate ${getEventTypeColor(event.type)} hover:opacity-80 transition-opacity`}
                          >
                            <div className="flex items-center">
                              {getEventTypeIcon(event.type)}
                              <span className="ml-1 truncate">{event.title}</span>
                            </div>
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
          </div>
          <div className="p-6">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No upcoming events
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Schedule interviews and meetings to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div
                      key={event.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {getEventTypeIcon(event.type)}
                              <span className="ml-1 capitalize">{event.type}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTime(event.time)} ({event.duration}min)
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              {event.isVirtual ? (
                                <Video className="h-4 w-4 mr-1" />
                              ) : (
                                <MapPin className="h-4 w-4 mr-1" />
                              )}
                              {event.location}
                            </div>
                          </div>

                          {event.candidateName && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <strong>Candidate:</strong> {event.candidateName} • {event.jobTitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Event Details
                </h2>
                <button
                  onClick={closeEventModal}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedEvent.jobTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Time:</span>
                    <p className="text-gray-900 dark:text-white">
                      {formatTime(selectedEvent.time)} ({selectedEvent.duration}min)
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <p className="text-gray-900 dark:text-white">
                      {selectedEvent.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Type:</span>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {selectedEvent.type}
                    </p>
                  </div>
                </div>

                {selectedEvent.candidateName && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Candidate:</span>
                    <p className="text-gray-900 dark:text-white">
                      {selectedEvent.candidateName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEvent.candidateEmail}
                    </p>
                  </div>
                )}

                {selectedEvent.notes && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {selectedEvent.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Reschedule
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerCalendar;
