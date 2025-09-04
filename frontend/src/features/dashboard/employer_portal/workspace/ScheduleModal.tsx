"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, FileText, X } from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  matchScore: number;
  avatar?: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'interview' | 'meeting' | 'deadline' | 'reminder';
  date: string;
  time: string;
  duration: number;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  location?: string;
  isVirtual: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ScheduleEvent) => void;
  selectedDate?: Date;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate
}) => {
  const [formData, setFormData] = useState({
    title: "",
    candidateId: "",
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    time: "10:00",
    duration: 60,
    location: "",
    notes: "",
    isVirtual: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock candidates data (in a real app, this would come from props or API)
  const [candidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Sarah Wilson",
      title: "Senior Frontend Developer",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      experience: "5 years",
      matchScore: 95,
      avatar: "/images/user/user-01.png"
    },
    {
      id: "2",
      name: "Alex Chen",
      title: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      experience: "3 years",
      matchScore: 88,
      avatar: "/images/user/user-02.png"
    },
    {
      id: "3",
      name: "David Brown",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "Python", "PostgreSQL"],
      experience: "4 years",
      matchScore: 82
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      title: "Product Manager",
      skills: ["Agile", "Scrum", "Product Strategy", "User Research"],
      experience: "6 years",
      matchScore: 91
    },
    {
      id: "5",
      name: "Michael Thompson",
      title: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      experience: "4 years",
      matchScore: 87
    }
  ]);

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCandidate = candidates.find(c => c.id === formData.candidateId);
      
      const newEvent: ScheduleEvent = {
        id: Date.now().toString(),
        title: formData.title,
        type: 'interview',
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        candidateId: formData.candidateId || undefined,
        candidateName: selectedCandidate?.name,
        candidateEmail: `${selectedCandidate?.name.toLowerCase().replace(' ', '.')}@email.com`,
        jobTitle: selectedCandidate?.title,
        location: formData.location || (formData.isVirtual ? "Virtual Meeting" : "Office"),
        isVirtual: formData.isVirtual,
        status: 'scheduled',
        notes: formData.notes
      };

      onSave(newEvent);
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      candidateId: "",
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
      time: "10:00",
      duration: 60,
      location: "",
      notes: "",
      isVirtual: false
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule New Event"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <Input
          label="Event Title"
          placeholder="Enter event title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          icon={Calendar}
          required
        />

        {/* Candidate Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700
            Candidate (Optional)
          </label>
          <select
            value={formData.candidateId}
            onChange={(e) => handleInputChange('candidateId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white  text-gray-900 
          >
            <option value="">Select a candidate (optional)</option>
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} - {candidate.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
            icon={Calendar}
            required
          />
          
          <Input
            label="Time"
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            error={errors.time}
            icon={Clock}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700
              Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white  text-gray-900 
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
            {errors.duration && (
              <p className="text-sm text-red-600
            )}
          </div>
        </div>

        {/* Location and Virtual Meeting */}
        <div className="space-y-4">
          <Input
            label="Location"
            placeholder="Enter location or meeting link"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            icon={MapPin}
          />
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isVirtual"
              checked={formData.isVirtual}
              onChange={(e) => handleInputChange('isVirtual', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isVirtual" className="text-sm text-gray-700
              Virtual meeting
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any additional notes or instructions..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white  text-gray-900  resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Schedule Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleModal;