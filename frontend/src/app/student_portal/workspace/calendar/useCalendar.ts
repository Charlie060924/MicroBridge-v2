import { useState, useEffect, useCallback } from 'react';
import { CalendarService, JobEvent } from './calendarService';

export const useCalendar = (studentId: string) => {
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<JobEvent[]>([]);

  // Fetch all job events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobEvents = await CalendarService.fetchJobEvents(studentId);
      setEvents(jobEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Error fetching job events:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // Fetch upcoming deadlines for notifications
  const fetchUpcomingDeadlines = useCallback(async (days: number = 7) => {
    try {
      const deadlines = await CalendarService.getUpcomingDeadlines(studentId, days);
      setUpcomingDeadlines(deadlines);
    } catch (err) {
      console.error('Error fetching upcoming deadlines:', err);
    }
  }, [studentId]);

  // Update job status
  const updateJobStatus = useCallback(async (jobId: string, status: string) => {
    try {
      await CalendarService.updateJobStatus(jobId, status);
      // Refresh events after status update
      await fetchEvents();
      return true;
    } catch (err) {
      console.error('Error updating job status:', err);
      return false;
    }
  }, [fetchEvents]);

  // Get events by status
  const getEventsByStatus = useCallback((status: string) => {
    return events.filter(event => event.extendedProps.status === status);
  }, [events]);

  // Get overdue events
  const getOverdueEvents = useCallback(() => {
    const today = new Date();
    return events.filter(event => {
      const deadline = new Date(event.extendedProps.deadline);
      return deadline < today && event.extendedProps.status !== 'Completed';
    });
  }, [events]);

  // Get events due today
  const getEventsDueToday = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return events.filter(event => {
      const deadline = new Date(event.extendedProps.deadline);
      const deadlineStr = deadline.toISOString().split('T')[0];
      return deadlineStr === todayStr && event.extendedProps.status !== 'Completed';
    });
  }, [events]);

  // Initialize calendar data
  useEffect(() => {
    fetchEvents();
    fetchUpcomingDeadlines();
  }, [fetchEvents, fetchUpcomingDeadlines]);

  return {
    events,
    loading,
    error,
    upcomingDeadlines,
    fetchEvents,
    fetchUpcomingDeadlines,
    updateJobStatus,
    getEventsByStatus,
    getOverdueEvents,
    getEventsDueToday,
  };
}; 