"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  User, 
  Search, 
  Bookmark, 
  Send, 
  Star,
  Trophy,
  Clock,
  Target,
  ArrowRight,
  X,
  Lightbulb,
  Zap,
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickStartStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  link: string;
  timeEstimate: string;
  xpReward: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface QuickStartGuideProps {
  userType: 'student' | 'employer';
  onClose?: () => void;
  showMinimized?: boolean;
}

const QuickStartGuide = ({ userType, onClose, showMinimized = false }: QuickStartGuideProps) => {
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(showMinimized);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Load completed steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`quickstart-${userType}`);
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  }, [userType]);

  // Save completed steps to localStorage
  const saveProgress = (newCompleted: Set<string>) => {
    localStorage.setItem(`quickstart-${userType}`, JSON.stringify([...newCompleted]));
  };

  const studentSteps: QuickStartStep[] = [
    {
      id: "complete-profile",
      title: "Complete Your Profile",
      description: "Add your education, skills, and portfolio to stand out to employers",
      icon: <User className="w-5 h-5" />,
      action: "Complete Profile",
      link: "/student_portal/workspace/profile",
      timeEstimate: "5 min",
      xpReward: 100,
      completed: false,
      priority: 'high'
    },
    {
      id: "browse-jobs",
      title: "Browse Available Jobs",
      description: "Explore micro-internships that match your skills and interests",
      icon: <Search className="w-5 h-5" />,
      action: "Browse Jobs",
      link: "/student_portal/workspace/jobs",
      timeEstimate: "3 min",
      xpReward: 25,
      completed: false,
      priority: 'high'
    },
    {
      id: "bookmark-jobs",
      title: "Save Interesting Jobs",
      description: "Bookmark 3 jobs you'd like to apply for to build your shortlist",
      icon: <Bookmark className="w-5 h-5" />,
      action: "Save Jobs",
      link: "/student_portal/workspace/jobs",
      timeEstimate: "2 min",
      xpReward: 50,
      completed: false,
      priority: 'medium'
    },
    {
      id: "apply-first-job",
      title: "Submit Your First Application",
      description: "Apply to a job that matches your skills - this is the most important step!",
      icon: <Send className="w-5 h-5" />,
      action: "Apply Now",
      link: "/student_portal/workspace/jobs",
      timeEstimate: "10 min",
      xpReward: 200,
      completed: false,
      priority: 'high'
    },
    {
      id: "set-availability",
      title: "Set Your Availability",
      description: "Update your calendar so employers know when you're free to work",
      icon: <Clock className="w-5 h-5" />,
      action: "Set Schedule",
      link: "/student_portal/workspace/calendar",
      timeEstimate: "3 min",
      xpReward: 75,
      completed: false,
      priority: 'medium'
    },
    {
      id: "join-community",
      title: "Join Student Community",
      description: "Connect with other students and get tips for success",
      icon: <Star className="w-5 h-5" />,
      action: "Join Community",
      link: "/student_portal/workspace/community",
      timeEstimate: "2 min",
      xpReward: 25,
      completed: false,
      priority: 'low'
    }
  ];

  const employerSteps: QuickStartStep[] = [
    {
      id: "complete-profile",
      title: "Complete Company Profile",
      description: "Add company details and verify your account to build trust",
      icon: <User className="w-5 h-5" />,
      action: "Complete Profile",
      link: "/employer_portal/workspace/profile",
      timeEstimate: "5 min",
      xpReward: 100,
      completed: false,
      priority: 'high'
    },
    {
      id: "post-first-job",
      title: "Post Your First Job",
      description: "Create a detailed job posting to attract qualified students",
      icon: <Target className="w-5 h-5" />,
      action: "Post Job",
      link: "/employer_portal/workspace/post-job",
      timeEstimate: "10 min",
      xpReward: 200,
      completed: false,
      priority: 'high'
    },
    {
      id: "browse-students",
      title: "Browse Student Profiles",
      description: "Explore talented students and invite them to apply",
      icon: <Search className="w-5 h-5" />,
      action: "Browse Students",
      link: "/employer_portal/workspace/candidates",
      timeEstimate: "5 min",
      xpReward: 50,
      completed: false,
      priority: 'medium'
    },
    {
      id: "setup-screening",
      title: "Set Up Screening Questions",
      description: "Add custom questions to filter the best candidates",
      icon: <CheckCircle className="w-5 h-5" />,
      action: "Add Questions",
      link: "/employer_portal/workspace/settings",
      timeEstimate: "3 min",
      xpReward: 75,
      completed: false,
      priority: 'medium'
    }
  ];

  const steps = userType === 'student' ? studentSteps : employerSteps;
  const completedCount = steps.filter(step => completedSteps.has(step.id)).length;
  const progressPercentage = (completedCount / steps.length) * 100;
  const totalXP = steps.reduce((sum, step) => sum + (completedSteps.has(step.id) ? step.xpReward : 0), 0);

  const handleStepClick = (step: QuickStartStep) => {
    router.push(step.link);
  };

  const handleMarkComplete = (stepId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newCompleted = new Set(completedSteps);
    if (completedSteps.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    saveProgress(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium">{completedCount}/{steps.length}</span>
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-4 right-4 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 max-h-[calc(100vh-2rem)] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Quick Start Guide</h3>
              <p className="text-blue-100 text-sm">Get up and running fast</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{completedCount} of {steps.length} completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">XP Earned: {totalXP}</span>
          </div>
          {progressPercentage === 100 && (
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              <Star className="w-3 h-3" />
              <span>Complete!</span>
            </div>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : getPriorityColor(step.priority)
                } hover:shadow-md`}
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={(e) => handleMarkComplete(step.id, e)}
                    className={`mt-1 transition-colors duration-200 ${
                      isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                        {step.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(step.priority)}`}>
                          {step.priority}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{step.timeEstimate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{step.xpReward} XP</span>
                        </div>
                      </div>
                      
                      {!isCompleted && (
                        <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
                          <span>{step.action}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <div className={isCompleted ? 'text-green-600' : 'text-gray-600'}>
                      {step.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Pro Tips</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            {userType === 'student' ? (
              <>
                <li>• Complete your profile first - it's your digital first impression</li>
                <li>• Apply to 3-5 jobs per week for best results</li>
                <li>• Respond to employer messages within 24 hours</li>
              </>
            ) : (
              <>
                <li>• Clear job descriptions get 3x more quality applications</li>
                <li>• Students respond faster to jobs with quick hiring timelines</li>
                <li>• Verify your company profile to build trust with students</li>
              </>
            )}
          </ul>
        </div>

        {/* Completion Reward */}
        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-center"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <h4 className="font-bold">Congratulations!</h4>
            <p className="text-sm opacity-90">You've completed the quick start guide and earned {totalXP} XP!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuickStartGuide;