"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Search, 
  Bookmark, 
  User, 
  Calendar,
  CheckCircle,
  Star,
  Trophy,
  Target,
  MessageCircle,
  FileText,
  DollarSign
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetElement?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  interactive?: boolean;
}

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'student' | 'employer';
  onComplete?: () => void;
}

const InteractiveTutorial = ({ isOpen, onClose, userType, onComplete }: InteractiveTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const studentSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to MicroBridge!",
      description: "Let's take a quick tour to help you get started and find your first opportunity.",
      icon: <Trophy className="w-6 h-6" />,
      position: "center"
    },
    {
      id: "dashboard",
      title: "Your Dashboard",
      description: "This is your personal dashboard where you can see recommended jobs, track applications, and monitor your progress.",
      icon: <User className="w-6 h-6" />,
      targetElement: ".dashboard-overview",
      position: "bottom"
    },
    {
      id: "search",
      title: "Find Opportunities",
      description: "Use the search bar to find micro-internships that match your skills and interests. Try searching for something you're interested in!",
      icon: <Search className="w-6 h-6" />,
      targetElement: ".search-bar",
      position: "bottom",
      action: "Try searching for 'web development'",
      interactive: true
    },
    {
      id: "job-cards",
      title: "Job Opportunities",
      description: "Each card shows key details about a project. Click the bookmark icon to save interesting opportunities for later.",
      icon: <Bookmark className="w-6 h-6" />,
      targetElement: ".job-card",
      position: "right",
      action: "Try bookmarking a job",
      interactive: true
    },
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "A complete profile helps employers find you and increases your chances of getting hired. Add your skills, experience, and portfolio.",
      icon: <User className="w-6 h-6" />,
      targetElement: ".profile-completion",
      position: "left"
    },
    {
      id: "levels",
      title: "Level Up Your Career",
      description: "Earn XP and Career Coins by completing projects. Level up to unlock new opportunities and features!",
      icon: <Star className="w-6 h-6" />,
      targetElement: ".level-widget",
      position: "bottom"
    },
    {
      id: "applications",
      title: "Track Your Applications",
      description: "Keep track of all your applications and their status. You'll get notifications when employers respond.",
      icon: <FileText className="w-6 h-6" />,
      targetElement: ".applications-section",
      position: "top"
    },
    {
      id: "calendar",
      title: "Manage Your Schedule",
      description: "Use the calendar to set your availability and track project deadlines. This helps employers know when you're free to work.",
      icon: <Calendar className="w-6 h-6" />,
      targetElement: ".calendar-widget",
      position: "top"
    },
    {
      id: "messaging",
      title: "Communicate with Employers",
      description: "When you get hired, you can chat directly with employers through our messaging system to discuss project details.",
      icon: <MessageCircle className="w-6 h-6" />,
      targetElement: ".messaging-center",
      position: "left"
    },
    {
      id: "earnings",
      title: "Track Your Earnings",
      description: "Monitor your earnings and payment status. Payments are processed automatically when projects are completed.",
      icon: <DollarSign className="w-6 h-6" />,
      targetElement: ".earnings-section",
      position: "right"
    }
  ];

  const employerSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to MicroBridge!",
      description: "Let's show you how to find and hire talented students for your projects.",
      icon: <Trophy className="w-6 h-6" />,
      position: "center"
    },
    {
      id: "dashboard",
      title: "Your Employer Dashboard",
      description: "Track your posted jobs, manage applications, and monitor ongoing projects from your dashboard.",
      icon: <User className="w-6 h-6" />,
      targetElement: ".dashboard-overview",
      position: "bottom"
    },
    {
      id: "post-job",
      title: "Post Your First Job",
      description: "Click here to post a new project. Be specific about requirements and timeline to attract the right candidates.",
      icon: <Target className="w-6 h-6" />,
      targetElement: ".post-job-button",
      position: "bottom",
      action: "Click to post a job",
      interactive: true
    },
    {
      id: "candidates",
      title: "Review Candidates",
      description: "Browse student profiles, review their skills and portfolios, and invite the best matches to apply.",
      icon: <Search className="w-6 h-6" />,
      targetElement: ".candidates-section",
      position: "right"
    },
    {
      id: "applications",
      title: "Manage Applications",
      description: "Review applications, schedule interviews, and make hiring decisions. Students will be notified of your responses.",
      icon: <FileText className="w-6 h-6" />,
      targetElement: ".applications-management",
      position: "left"
    },
    {
      id: "projects",
      title: "Project Management",
      description: "Track progress on active projects, communicate with students, and approve milestones for payment.",
      icon: <CheckCircle className="w-6 h-6" />,
      targetElement: ".projects-section",
      position: "top"
    }
  ];

  const steps = userType === 'student' ? studentSteps : employerSteps;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && isOpen) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          handleNext();
        } else {
          setIsPlaying(false);
          handleComplete();
        }
      }, 5000); // 5 seconds per step

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Tutorial Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Platform Tutorial</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm opacity-90">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {currentStepData.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {currentStepData.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {currentStepData.description}
                </p>

                {currentStepData.action && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center text-blue-800">
                      <Play className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{currentStepData.action}</span>
                    </div>
                  </div>
                )}

                {currentStepData.interactive && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <p className="text-yellow-800 text-sm">
                      💡 This step is interactive - try it out on your dashboard!
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    isPlaying 
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{isPlaying ? 'Auto-playing' : 'Auto-play'}</span>
                </button>
                
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip Tutorial
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete
                      <CheckCircle className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Step Indicators */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentStep
                  ? 'bg-white scale-125'
                  : completedSteps.has(index)
                  ? 'bg-green-400'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Spotlight Effect for Target Elements */}
      {currentStepData.targetElement && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent 150px, rgba(0,0,0,0.8) 300px)`
          }}
        />
      )}
    </div>
  );
};

export default InteractiveTutorial;