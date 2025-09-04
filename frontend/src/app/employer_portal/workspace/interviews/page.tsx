"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, Phone, Users, Plus, Search, Filter } from 'lucide-react';
import { useInterviews, Interview } from '@/hooks/useInterviews';
import InterviewScheduler from '@/components/common/InterviewScheduler';
import toast from 'react-hot-toast';

const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: string;
    name: string;
    jobId: string;
    jobTitle: string;
  } | null>(null);

  // Mock candidates for demo
  const mockCandidates = [
    { id: '1', name: 'John Doe', jobId: 'job-1', jobTitle: 'Frontend Developer' },
    { id: '2', name: 'Jane Smith', jobId: 'job-2', jobTitle: 'Backend Developer' },
    { id: '3', name: 'Mike Johnson', jobId: 'job-3', jobTitle: 'UI/UX Designer' },
  ];

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        // console.log('📅 Loading interviews...');
        
        // For demo purposes, we'll use mock data
        // In production, you would fetch from the API
        const mockInterviews: Interview[] = [
          {
            id: '1',
            candidateId: '1',
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
            candidateId: '2',
            candidateName: 'Jane Smith',
            jobId: 'job-2',
            jobTitle: 'Backend Developer',
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
        // console.log('✅ Interviews loaded:', mockInterviews.length);
      } catch (err) {
        // console.error('❌ Error loading interviews:', err);
        setError('Failed to load interviews');
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleScheduleInterview = (candidate: typeof mockCandidates[0]) => {
    setSelectedCandidate(candidate);
    setIsSchedulerOpen(true);
  };

  const handleInterviewScheduled = () => {
    toast.success('Interview scheduled successfully!');
    // Refresh interviews list
    // In production, you would refetch the data
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: Interview['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'onsite':
        return <MapPin className="h-4 w-4" />;
      case 'technical':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interviews
              </h1>
              <p className="text-gray-600">
                Manage candidate interviews and scheduling
              </p>
            </div>
            <button
              onClick={() => setIsSchedulerOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates or job titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No interviews found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'Get started by scheduling your first interview'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsSchedulerOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Schedule Interview
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {interview.candidateName}
                        </h3>
                        <p className="text-gray-600">
                          {interview.jobTitle}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(interview.status)}`}
                      >
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {formatDate(interview.scheduledDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {interview.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(interview.type)}
                        <span className="text-gray-600 ml-2 capitalize">
                          {interview.type}
                        </span>
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {interview.notes}
                        </p>
                      </div>
                    )}

                    {interview.meetingLink && interview.status === 'scheduled' && (
                      <div className="mt-4">
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {interview.status === 'scheduled' && (
                      <>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          Reschedule
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Scheduler Modal */}
      {isSchedulerOpen && (
        <InterviewScheduler
          candidateId={selectedCandidate?.id || '1'}
          candidateName={selectedCandidate?.name || 'Select Candidate'}
          jobId={selectedCandidate?.jobId || 'job-1'}
          jobTitle={selectedCandidate?.jobTitle || 'Select Job'}
          isOpen={isSchedulerOpen}
          onClose={() => {
            setIsSchedulerOpen(false);
            setSelectedCandidate(null);
          }}
          onScheduled={handleInterviewScheduled}
        />
      )}
    </div>
  );
};

export default InterviewsPage;
