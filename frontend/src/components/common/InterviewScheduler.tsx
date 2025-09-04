"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Video, Phone, Users, X } from 'lucide-react';
import { useInterviews, CreateInterviewRequest } from '@/hooks/useInterviews';

interface InterviewSchedulerProps {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  candidateId,
  candidateName,
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onScheduled
}) => {
  const [formData, setFormData] = useState<CreateInterviewRequest>({
    candidateId,
    jobId,
    scheduledDate: '',
    duration: 60,
    type: 'video',
    notes: '',
    location: '',
    meetingLink: ''
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createInterview, getAvailableSlots } = useInterviews(candidateId);

  // Get available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        try {
          const slots = await getAvailableSlots(selectedDate, formData.duration);
          setAvailableSlots(slots);
        } catch (err) {
          console.error('Failed to fetch available slots:', err);
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, formData.duration, getAvailableSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scheduledDate) {
      setError('Please select a date and time');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createInterview(formData);
      onScheduled?.();
      onClose();
      // Reset form
      setFormData({
        candidateId,
        jobId,
        scheduledDate: '',
        duration: 60,
        type: 'video',
        notes: '',
        location: '',
        meetingLink: ''
      });
      setSelectedDate('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule interview';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, scheduledDate: '' }));
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setFormData(prev => ({ ...prev, scheduledDate: timeSlot }));
  };

  const formatTimeSlot = (timeSlot: string) => {
    return new Date(timeSlot).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInterviewTypeIcon = (type: string) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Interview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {candidateName} - {jobTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'phone', label: 'Phone Call', icon: Phone },
                { value: 'video', label: 'Video Call', icon: Video },
                { value: 'onsite', label: 'On-site', icon: MapPin },
                { value: 'technical', label: 'Technical', icon: Users }
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                    className={`p-3 border rounded-lg flex items-center space-x-2 transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-2 text-sm border rounded-lg transition-colors ${
                        formData.scheduledDate === slot
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {formatTimeSlot(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No available slots for this date
                </p>
              )}
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Location/Meeting Link */}
          {formData.type === 'onsite' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter interview location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : formData.type === 'video' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <input
                type="url"
                value={formData.meetingLink || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : null}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes or instructions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.scheduledDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduler;
