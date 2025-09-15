"use client";

import React, { useState } from 'react';
import { X, Users, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { MeetingScheduleStep } from './kickoff/MeetingScheduleStep';
import { ExpectationsStep } from './kickoff/ExpectationsStep';
import { CommunicationStep } from './kickoff/CommunicationStep';

interface ProjectKickoffModalProps {
  project: any;
  onClose: () => void;
  onComplete: () => void;
}

interface KickoffStep {
  id: string;
  title: string;
  completed: boolean;
  icon: React.ReactNode;
}

const ProjectKickoffModal: React.FC<ProjectKickoffModalProps> = ({
  project,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [kickoffData, setKickoffData] = useState({
    meetingScheduled: false,
    expectationsSet: false,
    clarificationsAdded: false,
    communicationPrefSet: false
  });

  const steps: KickoffStep[] = [
    {
      id: 'meeting',
      title: 'Schedule Kickoff Meeting',
      completed: kickoffData.meetingScheduled,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'expectations',
      title: 'Set Project Expectations',
      completed: kickoffData.expectationsSet,
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'communication',
      title: 'Setup Communication',
      completed: kickoffData.communicationPrefSet,
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  const allStepsCompleted = steps.every(step => step.completed);

  const handleStepComplete = (stepId: string) => {
    setKickoffData(prev => ({
      ...prev,
      [`${stepId}${stepId === 'meeting' ? 'Scheduled' : stepId === 'expectations' ? 'Set' : 'Set'}`]: true
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    if (!step) return null;

    switch (step.id) {
      case 'meeting':
        return <MeetingScheduleStep project={project} onComplete={() => handleStepComplete('meeting')} />;
      case 'expectations':
        return <ExpectationsStep project={project} onComplete={() => handleStepComplete('expectations')} />;
      case 'communication':
        return <CommunicationStep project={project} onComplete={() => handleStepComplete('communication')} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Project Kickoff: {project.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Setup your project for success
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full ${
                    step.completed ? 'bg-green-500' :
                    index === currentStep ? 'bg-blue-500' :
                    'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center space-x-2 text-sm ${
                    step.completed ? 'text-green-600' :
                    index === currentStep ? 'text-blue-600' :
                    'text-gray-500'
                  }`}
                >
                  {step.icon}
                  <span>{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onComplete}
              disabled={!allStepsCompleted}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Kickoff</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectKickoffModal;