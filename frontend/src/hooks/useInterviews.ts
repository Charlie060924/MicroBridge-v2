import { useState, useEffect, useCallback } from 'react';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  scheduledDate: string;
  duration: number; // in minutes
  type: 'phone' | 'video' | 'onsite' | 'technical';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  location?: string;
  meetingLink?: string;
  interviewerId: string;
  interviewerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewRequest {
  candidateId: string;
  jobId: string;
  scheduledDate: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  notes?: string;
  location?: string;
  meetingLink?: string;
}

export interface UpdateInterviewRequest {
  id: string;
  scheduledDate?: string;
  duration?: number;
  type?: 'phone' | 'video' | 'onsite' | 'technical';
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  location?: string;
  meetingLink?: string;
}

export interface InterviewStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export const useInterviews = (candidateId?: string) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InterviewStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    upcoming: 0
  });

  // Calculate stats from interviews
  const calculateStats = useCallback((interviewList: Interview[]): InterviewStats => {
    const total = interviewList.length;
    const scheduled = interviewList.filter(i => i.status === 'scheduled').length;
    const completed = interviewList.filter(i => i.status === 'completed').length;
    const cancelled = interviewList.filter(i => i.status === 'cancelled').length;
    const upcoming = interviewList.filter(i => 
      i.status === 'scheduled' && new Date(i.scheduledDate) > new Date()
    ).length;

    return {
      total,
      scheduled,
      completed,
      cancelled,
      upcoming
    };
  }, []);

  // Fetch interviews for a candidate
  const fetchInterviews = useCallback(async (candidateId: string) => {
    console.log('📅 Fetching interviews for candidate:', candidateId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await interviewService.getInterviews(candidateId);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockInterviews: Interview[] = [
        {
          id: '1',
          candidateId,
          candidateName: 'John Doe',
          jobId: 'job-1',
          jobTitle: 'Frontend Developer',
          scheduledDate: '2024-01-25T14:00:00Z',
          duration: 60,
          type: 'video',
          status: 'scheduled',
          notes: 'Technical interview focusing on React and TypeScript',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          interviewerId: 'employer-1',
          interviewerName: 'Jane Smith',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          candidateId,
          candidateName: 'John Doe',
          jobId: 'job-1',
          jobTitle: 'Frontend Developer',
          scheduledDate: '2024-01-15T10:00:00Z',
          duration: 30,
          type: 'phone',
          status: 'completed',
          notes: 'Initial screening call - candidate passed',
          interviewerId: 'employer-1',
          interviewerName: 'Jane Smith',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ];

      setInterviews(mockInterviews);
      setStats(calculateStats(mockInterviews));
      console.log('📅 Interviews loaded:', mockInterviews.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch interviews';
      console.error('📅 Error fetching interviews:', err);
      setError(errorMessage);
      setInterviews([]);
      setStats(calculateStats([]));
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // Create a new interview
  const createInterview = useCallback(async (interviewData: CreateInterviewRequest) => {
    console.log('📅 Creating interview:', interviewData);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await interviewService.createInterview(interviewData);
      
      // Mock creation
      await new Promise(resolve => setTimeout(resolve, 300));
      const newInterview: Interview = {
        id: Date.now().toString(),
        ...interviewData,
        candidateName: 'John Doe', // TODO: Get from candidate data
        jobTitle: 'Frontend Developer', // TODO: Get from job data
        status: 'scheduled',
        interviewerId: 'employer-1', // TODO: Get from auth context
        interviewerName: 'Jane Smith', // TODO: Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedInterviews = [...interviews, newInterview];
      setInterviews(updatedInterviews);
      setStats(calculateStats(updatedInterviews));
      console.log('📅 Interview created:', newInterview.id);
      return newInterview;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create interview';
      console.error('📅 Error creating interview:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviews, calculateStats]);

  // Update an interview
  const updateInterview = useCallback(async (interviewId: string, updates: UpdateInterviewRequest) => {
    console.log('📅 Updating interview:', interviewId, updates);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await interviewService.updateInterview(interviewId, updates);
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedInterviews = interviews.map(interview => 
        interview.id === interviewId 
          ? { ...interview, ...updates, updatedAt: new Date().toISOString() }
          : interview
      );

      setInterviews(updatedInterviews);
      setStats(calculateStats(updatedInterviews));
      console.log('📅 Interview updated:', interviewId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update interview';
      console.error('📅 Error updating interview:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [interviews, calculateStats]);

  // Cancel an interview
  const cancelInterview = useCallback(async (interviewId: string, reason?: string) => {
    console.log('📅 Cancelling interview:', interviewId, reason);
    return updateInterview(interviewId, { 
      status: 'cancelled',
      notes: reason ? `${reason}\n\n${interviews.find(i => i.id === interviewId)?.notes || ''}` : undefined
    });
  }, [updateInterview, interviews]);

  // Reschedule an interview
  const rescheduleInterview = useCallback(async (interviewId: string, newDate: string, reason?: string) => {
    console.log('📅 Rescheduling interview:', interviewId, newDate, reason);
    return updateInterview(interviewId, { 
      scheduledDate: newDate,
      status: 'rescheduled',
      notes: reason ? `${reason}\n\n${interviews.find(i => i.id === interviewId)?.notes || ''}` : undefined
    });
  }, [updateInterview, interviews]);

  // Complete an interview
  const completeInterview = useCallback(async (interviewId: string, feedback?: string) => {
    console.log('📅 Completing interview:', interviewId, feedback);
    return updateInterview(interviewId, { 
      status: 'completed',
      notes: feedback ? `${feedback}\n\n${interviews.find(i => i.id === interviewId)?.notes || ''}` : undefined
    });
  }, [updateInterview, interviews]);

  // Get available time slots
  const getAvailableSlots = useCallback(async (date: string, duration: number = 60) => {
    console.log('📅 Getting available slots for:', date, duration);
    
    try {
      // TODO: Replace with actual API call
      // const response = await interviewService.getAvailableSlots(date, duration);
      
      // Mock available slots
      await new Promise(resolve => setTimeout(resolve, 200));
      const slots = [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
      ].map(time => `${date}T${time}:00Z`);
      
      console.log('📅 Available slots:', slots.length);
      return slots;
    } catch (err) {
      console.error('📅 Error getting available slots:', err);
      return [];
    }
  }, []);

  // Load interviews when candidateId changes
  useEffect(() => {
    if (candidateId) {
      fetchInterviews(candidateId);
    } else {
      setInterviews([]);
      setStats(calculateStats([]));
    }
  }, [candidateId, fetchInterviews, calculateStats]);

  return {
    // State
    interviews,
    loading,
    error,
    stats,
    
    // Actions
    fetchInterviews,
    createInterview,
    updateInterview,
    cancelInterview,
    rescheduleInterview,
    completeInterview,
    getAvailableSlots,
    
    // Utilities
    hasInterviews: interviews.length > 0,
    upcomingInterviews: interviews.filter(i => 
      i.status === 'scheduled' && new Date(i.scheduledDate) > new Date()
    ),
    pastInterviews: interviews.filter(i => 
      i.status === 'completed' || new Date(i.scheduledDate) < new Date()
    )
  };
};
