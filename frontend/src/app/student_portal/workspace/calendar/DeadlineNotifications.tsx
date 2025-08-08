import React from 'react';
import { JobEvent } from './calendarService';

interface DeadlineNotificationsProps {
  upcomingDeadlines: JobEvent[];
  onEventClick: (event: JobEvent) => void;
}

export const DeadlineNotifications: React.FC<DeadlineNotificationsProps> = ({
  upcomingDeadlines,
  onEventClick
}) => {
  if (upcomingDeadlines.length === 0) {
    return null;
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getUrgencyText = (days: number) => {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Upcoming Deadlines
      </h3>
      <div className="space-y-2">
        {upcomingDeadlines.slice(0, 5).map((event) => {
          const daysUntil = getDaysUntilDeadline(event.extendedProps.deadline);
          const urgencyColor = getUrgencyColor(daysUntil);
          const urgencyText = getUrgencyText(daysUntil);

          return (
            <div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:opacity-80 ${urgencyColor}`}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.extendedProps.company}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    daysUntil <= 1 ? 'bg-red-100 text-red-800' :
                    daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {urgencyText}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.extendedProps.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {upcomingDeadlines.length > 5 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          +{upcomingDeadlines.length - 5} more deadlines
        </p>
      )}
    </div>
  );
}; 