"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  Filter,
  Grid,
  List,
  Bell,
  ExternalLink,
  Plus,
  Eye,
  CalendarDays
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  deadline: Date;
  status: 'applied' | 'pending' | 'accepted' | 'rejected' | 'draft';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  location: string;
  salary?: string;
  isReminderSet: boolean;
}

interface CalendarView {
  type: 'month' | 'week';
  label: string;
  icon: React.ReactNode;
}

const ApplicationCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: '1',
        jobTitle: 'Frontend Developer',
        company: 'TechCorp Inc.',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'applied',
        priority: 'high',
        location: 'Hong Kong',
        salary: '$25-35/hr',
        isReminderSet: true
      },
      {
        id: '2',
        jobTitle: 'UI/UX Designer',
        company: 'Design Studio',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'pending',
        priority: 'medium',
        location: 'Hong Kong',
        salary: '$20-30/hr',
        isReminderSet: false
      },
      {
        id: '3',
        jobTitle: 'Backend Developer',
        company: 'StartupXYZ',
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: 'accepted',
        priority: 'high',
        location: 'Hong Kong',
        salary: '$30-40/hr',
        isReminderSet: true
      },
      {
        id: '4',
        jobTitle: 'Data Analyst',
        company: 'Analytics Co.',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: 'rejected',
        priority: 'low',
        location: 'Hong Kong',
        salary: '$18-25/hr',
        isReminderSet: false
      },
      {
        id: '5',
        jobTitle: 'Mobile Developer',
        company: 'AppWorks',
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'draft',
        priority: 'high',
        location: 'Hong Kong',
        salary: '$25-35/hr',
        isReminderSet: true
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setIsLoading(false);
    }, 500);
  }, []);

  const viewOptions: CalendarView[] = [
    { type: 'month', label: 'Month', icon: <CalendarDays className="h-4 w-4" /> },
    { type: 'week', label: 'Week', icon: <List className="h-4 w-4" /> }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'applied', label: 'Applied', color: 'blue' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'draft', label: 'Draft', color: 'gray' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority', color: 'gray' },
    { value: 'high', label: 'High', color: 'red' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'low', label: 'Low', color: 'green' }
  ];

  // Filter applications based on selected filters
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const priorityMatch = filterPriority === 'all' || app.priority === filterPriority;
      return statusMatch && priorityMatch;
    });
  }, [applications, filterStatus, filterPriority]);

  // Get applications for a specific date
  const getApplicationsForDate = (date: Date) => {
    return filteredApplications.filter(app => {
      const appDate = new Date(app.deadline);
      return appDate.toDateString() === date.toDateString();
    });
  };

  // Get deadline status
  const getDeadlineStatus = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'past';
    if (diffDays <= 7) return 'upcoming';
    return 'future';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'accepted': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  // Get deadline indicator color
  const getDeadlineIndicatorColor = (deadline: Date) => {
    const status = getDeadlineStatus(deadline);
    switch (status) {
      case 'past': return 'bg-red-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'future': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Calendar grid generation
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const dayApplications = getApplicationsForDate(date);

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        applications: dayApplications
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

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
                Application Calendar
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your application deadlines and progress
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Application
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={goToNext}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              {viewOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setViewType(option.type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewType === option.type
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>

              {showFilters && (
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200
                  ${!day.isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-800'}
                  ${day.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  ${day.isSelected ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-gray-50 dark:hover:bg-gray-700
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-medium
                    ${day.isToday ? 'text-blue-600 dark:text-blue-400' : ''}
                    ${day.isSelected ? 'text-blue-600 dark:text-blue-400' : ''}
                  `}>
                    {day.date.getDate()}
                  </span>
                  
                  {/* Deadline indicators */}
                  {day.applications.length > 0 && (
                    <div className="flex gap-1">
                      {day.applications.slice(0, 3).map((app, appIndex) => (
                        <div
                          key={appIndex}
                          className={`w-2 h-2 rounded-full ${getDeadlineIndicatorColor(app.deadline)}`}
                          title={`${app.jobTitle} at ${app.company}`}
                        />
                      ))}
                      {day.applications.length > 3 && (
                        <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center">
                          <span className="text-white text-xs">+</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Application previews */}
                <div className="space-y-1">
                  {day.applications.slice(0, 2).map((app) => (
                    <div
                      key={app.id}
                      className="text-xs p-1 rounded bg-gray-100 dark:bg-gray-700 truncate"
                      title={`${app.jobTitle} at ${app.company}`}
                    >
                      <div className="font-medium truncate">{app.jobTitle}</div>
                      <div className="text-gray-500 dark:text-gray-400 truncate">{app.company}</div>
                    </div>
                  ))}
                  {day.applications.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{day.applications.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {getApplicationsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No applications due on this date
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getApplicationsForDate(selectedDate).map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {app.jobTitle}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(app.priority)}`}>
                            {app.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {app.company} • {app.location}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className={`
                              ${getDeadlineStatus(app.deadline) === 'past' ? 'text-red-600 dark:text-red-400' : ''}
                              ${getDeadlineStatus(app.deadline) === 'upcoming' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                            `}>
                              {getDeadlineStatus(app.deadline) === 'past' ? 'Overdue' : 
                               getDeadlineStatus(app.deadline) === 'upcoming' ? 'Due soon' : 
                               'Upcoming'}
                            </span>
                          </div>
                          {app.salary && (
                            <span>{app.salary}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Bell className={`h-4 w-4 ${app.isReminderSet ? 'text-yellow-500' : ''}`} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCalendar;
