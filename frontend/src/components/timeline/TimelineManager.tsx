'use client';
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Pause, 
  Filter,
  Sort,
  Bell
} from 'lucide-react';
import { JobEvent, CalendarService } from '@/app/student_portal/workspace/calendar/calendarService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface TimelineManagerProps {
  className?: string;
}

type TimelineView = 'all' | 'upcoming' | 'ongoing' | 'overdue';
type SortBy = 'deadline' | 'priority' | 'payment' | 'status';

interface TimelineItem extends JobEvent {
  priority: 'high' | 'medium' | 'low';
  daysUntilDeadline: number;
  isOverdue: boolean;
  progress?: number;
}

export const TimelineManager: React.FC<TimelineManagerProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<TimelineView>('upcoming');
  const [sortBy, setSortBy] = useState<SortBy>('deadline');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const events = await CalendarService.fetchJobEvents(user?.id || '');
      const enrichedItems = events.map(event => enrichTimelineItem(event));
      setTimelineItems(enrichedItems);
    } catch (error) {
      console.error('Failed to fetch timeline data:', error);
      toast.error('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const enrichTimelineItem = (event: JobEvent): TimelineItem => {
    const deadline = new Date(event.extendedProps.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDeadline < 0;
    
    const priority: 'high' | 'medium' | 'low' = 
      daysUntilDeadline <= 2 ? 'high' :
      daysUntilDeadline <= 7 ? 'medium' : 'low';

    return {
      ...event,
      priority,
      daysUntilDeadline,
      isOverdue,
      progress: event.extendedProps.status === 'Ongoing' ? Math.floor(Math.random() * 80) + 10 : 
               event.extendedProps.status === 'Completed' ? 100 : 0
    };
  };

  const filteredItems = timelineItems.filter(item => {
    switch (currentView) {
      case 'upcoming':
        return item.extendedProps.status === 'Upcoming';
      case 'ongoing':
        return item.extendedProps.status === 'Ongoing';
      case 'overdue':
        return item.isOverdue;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.extendedProps.deadline).getTime() - new Date(b.extendedProps.deadline).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'payment':
        return parseInt(b.extendedProps.payment.replace('$', '')) - parseInt(a.extendedProps.payment.replace('$', ''));
      case 'status':
        return a.extendedProps.status.localeCompare(b.extendedProps.status);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue) return 'border-l-red-500';
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'medium':
        return 'border-l-yellow-400';
      case 'low':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatDeadlineText = (daysUntil: number, isOverdue: boolean) => {
    if (isOverdue) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    return `Due in ${daysUntil} days`;
  };

  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    try {
      await CalendarService.updateJobStatus(itemId, newStatus);
      await fetchTimelineData();
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading timeline...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Timeline
          </h2>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['all', 'upcoming', 'ongoing', 'overdue'] as TimelineView[]).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  currentView === view
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Sort className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="payment">Sort by Payment</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No projects found for the selected view
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 ${getPriorityColor(item.priority, item.isOverdue)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.extendedProps.status)}`}>
                        {item.extendedProps.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.extendedProps.company} • {item.extendedProps.payment}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.extendedProps.description}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 mb-2 ${
                      item.isOverdue ? 'text-red-600' : 
                      item.daysUntilDeadline <= 2 ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatDeadlineText(item.daysUntilDeadline, item.isOverdue)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(item.extendedProps.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {item.extendedProps.status === 'Ongoing' && item.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    {item.priority === 'high' && (
                      <span className="flex items-center space-x-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>High Priority</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.extendedProps.status === 'Upcoming' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'Ongoing')}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    )}
                    {item.extendedProps.status === 'Ongoing' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'Completed')}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineManager;