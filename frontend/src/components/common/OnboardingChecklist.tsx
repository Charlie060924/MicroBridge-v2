"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  User, 
  FileText, 
  Star, 
  Target, 
  Settings,
  ChevronRight,
  X,
  Award
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  href: string;
  points: number;
}

interface OnboardingChecklistProps {
  userType: 'student' | 'employer';
  onClose?: () => void;
  isVisible: boolean;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  userType,
  onClose,
  isVisible
}) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    const studentSteps: OnboardingStep[] = [
      {
        id: 'profile',
        title: 'Complete Your Profile',
        description: 'Add your skills, education, and experience',
        icon: User,
        completed: false,
        href: '/student_portal/workspace/profile',
        points: 100
      },
      {
        id: 'resume',
        title: 'Upload Your Resume',
        description: 'Showcase your background and achievements',
        icon: FileText,
        completed: false,
        href: '/student_portal/workspace/profile#resume',
        points: 75
      },
      {
        id: 'skills',
        title: 'Add Your Skills',
        description: 'List your technical and soft skills',
        icon: Star,
        completed: false,
        href: '/student_portal/workspace/profile#skills',
        points: 50
      },
      {
        id: 'goals',
        title: 'Set Career Goals',
        description: 'Define what you want to achieve',
        icon: Target,
        completed: false,
        href: '/student_portal/workspace/profile#goals',
        points: 50
      },
      {
        id: 'preferences',
        title: 'Update Job Preferences',
        description: 'Set your availability and compensation expectations',
        icon: Settings,
        completed: false,
        href: '/student_portal/workspace/settings',
        points: 25
      }
    ];

    const employerSteps: OnboardingStep[] = [
      {
        id: 'company',
        title: 'Complete Company Profile',
        description: 'Add company info, culture, and values',
        icon: User,
        completed: false,
        href: '/employer_portal/workspace/company-info',
        points: 100
      },
      {
        id: 'first-job',
        title: 'Post Your First Project',
        description: 'Create a project to attract students',
        icon: FileText,
        completed: false,
        href: '/employer_portal/workspace/post-job',
        points: 150
      },
      {
        id: 'requirements',
        title: 'Define Job Requirements',
        description: 'Set clear expectations and requirements',
        icon: Star,
        completed: false,
        href: '/employer_portal/workspace/post-job#requirements',
        points: 75
      },
      {
        id: 'budget',
        title: 'Set Project Budget',
        description: 'Define compensation and timeline',
        icon: Target,
        completed: false,
        href: '/employer_portal/workspace/post-job#budget',
        points: 50
      },
      {
        id: 'settings',
        title: 'Configure Notifications',
        description: 'Stay updated on applications and messages',
        icon: Settings,
        completed: false,
        href: '/employer_portal/workspace/settings',
        points: 25
      }
    ];

    const currentSteps = userType === 'student' ? studentSteps : employerSteps;
    setSteps(currentSteps);

    const total = currentSteps.reduce((sum, step) => sum + step.points, 0);
    const earned = currentSteps
      .filter(step => step.completed)
      .reduce((sum, step) => sum + step.points, 0);
    
    setTotalPoints(total);
    setEarnedPoints(earned);
  }, [userType]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const markCompleted = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-black">
                    Get Started Guide
                  </h2>
                  <p className="text-sm text-waterloo">
                    Complete your {userType} profile
                  </p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-black">
                  {completedSteps} of {steps.length} completed
                </span>
                <span className="text-sm font-medium text-primary">
                  {earnedPoints}/{totalPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <button
                    onClick={() => markCompleted(step.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        step.completed ? 'text-gray-500 line-through' : 'text-black'
                      }`}>
                        {step.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-secondary">
                          +{step.points}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${
                      step.completed ? 'text-gray-400' : 'text-waterloo'
                    }`}>
                      {step.description}
                    </p>
                    
                    {!step.completed && (
                      <a
                        href={step.href}
                        className="inline-flex items-center mt-2 text-sm text-primary hover:text-primary-hover transition-colors"
                      >
                        Complete this step
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-waterloo mb-3">
                Complete all steps to unlock premium features
              </p>
              <button
                onClick={onClose}
                className="btn-primary w-full"
              >
                Continue Setup
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingChecklist;