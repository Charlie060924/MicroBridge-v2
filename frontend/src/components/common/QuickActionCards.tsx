"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  UserPlus, 
  Star, 
  Calendar,
  Briefcase,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickActionCardsProps {
  userType: 'student' | 'employer';
  className?: string;
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  userType,
  className = ''
}) => {
  const studentActions: QuickAction[] = [
    {
      id: 'browse-jobs',
      title: 'Browse Projects',
      description: 'Find your next opportunity',
      icon: Search,
      href: '/student_portal/workspace/jobs',
      color: 'text-primary',
      bgColor: 'bg-primary',
      priority: 'high'
    },
    {
      id: 'complete-profile',
      title: 'Complete Profile',
      description: 'Get better matches',
      icon: UserPlus,
      href: '/student_portal/workspace/profile',
      color: 'text-secondary',
      bgColor: 'bg-secondary',
      priority: 'high'
    },
    {
      id: 'view-applications',
      title: 'My Applications',
      description: 'Track your progress',
      icon: FileText,
      href: '/student_portal/workspace/applications',
      color: 'text-info',
      bgColor: 'bg-info',
      priority: 'medium'
    },
    {
      id: 'skill-assessment',
      title: 'Skill Assessment',
      description: 'Showcase your abilities',
      icon: Star,
      href: '/student_portal/workspace/skills',
      color: 'text-warning',
      bgColor: 'bg-warning',
      priority: 'medium'
    }
  ];

  const employerActions: QuickAction[] = [
    {
      id: 'post-job',
      title: 'Post New Project',
      description: 'Find talented students',
      icon: Briefcase,
      href: '/employer_portal/workspace/post-job',
      color: 'text-primary',
      bgColor: 'bg-primary',
      priority: 'high'
    },
    {
      id: 'view-candidates',
      title: 'Browse Candidates',
      description: 'Discover student talent',
      icon: Search,
      href: '/employer_portal/workspace/candidates',
      color: 'text-secondary',
      bgColor: 'bg-secondary',
      priority: 'high'
    },
    {
      id: 'manage-applications',
      title: 'Review Applications',
      description: 'Manage incoming applications',
      icon: FileText,
      href: '/employer_portal/workspace/applications',
      color: 'text-info',
      bgColor: 'bg-info',
      priority: 'medium'
    },
    {
      id: 'schedule-interviews',
      title: 'Schedule Interviews',
      description: 'Connect with candidates',
      icon: Calendar,
      href: '/employer_portal/workspace/interviews',
      color: 'text-success',
      bgColor: 'bg-success',
      priority: 'medium'
    }
  ];

  const actions = userType === 'student' ? studentActions : employerActions;
  const highPriorityActions = actions.filter(action => action.priority === 'high');
  const mediumPriorityActions = actions.filter(action => action.priority === 'medium');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`${className}`}>
      {/* High Priority Actions */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-black mb-4">
          Recommended Actions
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {highPriorityActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.a
                key={action.id}
                href={action.href}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-waterloo">
                      {action.description}
                    </p>
                  </div>
                  <div className={`w-6 h-6 ${action.color} flex-shrink-0`}>
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Medium Priority Actions */}
      <div>
        <h4 className="font-medium text-base text-black mb-3">
          Other Actions
        </h4>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {mediumPriorityActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.a
                key={action.id}
                href={action.href}
                variants={cardVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="block bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${action.bgColor} rounded-md flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-black">
                      {action.title}
                    </h5>
                    <p className="text-xs text-waterloo">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default QuickActionCards;