"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Star, 
  Target, 
  MapPin, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface ProfileSection {
  id: string;
  name: string;
  icon: React.ElementType;
  completed: boolean;
  weight: number; // Importance weight for overall completion
}

interface ProfileProgressTrackerProps {
  userType: 'student' | 'employer';
  className?: string;
  showDetails?: boolean;
}

const ProfileProgressTracker: React.FC<ProfileProgressTrackerProps> = ({
  userType,
  className = '',
  showDetails = true
}) => {
  // Mock data - in real implementation, this would come from user profile
  const studentSections: ProfileSection[] = [
    { id: 'basic', name: 'Basic Info', icon: User, completed: true, weight: 20 },
    { id: 'education', name: 'Education', icon: FileText, completed: true, weight: 15 },
    { id: 'skills', name: 'Skills', icon: Star, completed: false, weight: 25 },
    { id: 'experience', name: 'Experience', icon: TrendingUp, completed: false, weight: 20 },
    { id: 'goals', name: 'Career Goals', icon: Target, completed: false, weight: 10 },
    { id: 'availability', name: 'Availability', icon: MapPin, completed: false, weight: 5 },
    { id: 'compensation', name: 'Compensation', icon: DollarSign, completed: false, weight: 5 }
  ];

  const employerSections: ProfileSection[] = [
    { id: 'company', name: 'Company Info', icon: User, completed: true, weight: 30 },
    { id: 'culture', name: 'Company Culture', icon: Target, completed: false, weight: 15 },
    { id: 'verification', name: 'Verification', icon: CheckCircle, completed: false, weight: 20 },
    { id: 'preferences', name: 'Hiring Preferences', icon: Star, completed: false, weight: 15 },
    { id: 'location', name: 'Location & Remote', icon: MapPin, completed: false, weight: 10 },
    { id: 'budget', name: 'Budget Range', icon: DollarSign, completed: false, weight: 10 }
  ];

  const sections = userType === 'student' ? studentSections : employerSections;

  const { completionPercentage, completedCount, totalCount, missingCritical } = useMemo(() => {
    const completed = sections.filter(section => section.completed);
    const completedWeight = completed.reduce((sum, section) => sum + section.weight, 0);
    const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
    
    // Check for critical missing sections (weight >= 20)
    const critical = sections.filter(section => !section.completed && section.weight >= 20);

    return {
      completionPercentage: (completedWeight / totalWeight) * 100,
      completedCount: completed.length,
      totalCount: sections.length,
      missingCritical: critical
    };
  }, [sections]);

  const getStatusColor = () => {
    if (completionPercentage >= 80) return 'text-success';
    if (completionPercentage >= 50) return 'text-warning';
    return 'text-error';
  };

  const getStatusMessage = () => {
    if (completionPercentage >= 80) return 'Profile looks great!';
    if (completionPercentage >= 50) return 'Good progress, keep going!';
    return 'Complete your profile to get better matches';
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-black">Profile Strength</h3>
          <p className="text-sm text-waterloo">
            {completedCount} of {totalCount} sections completed
          </p>
        </div>
        <div className={`text-right ${getStatusColor()}`}>
          <div className="text-2xl font-bold">
            {Math.round(completionPercentage)}%
          </div>
          <div className="text-xs font-medium">
            {getStatusMessage()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-black">
            Profile Completion
          </span>
          {missingCritical.length > 0 && (
            <span className="flex items-center text-xs text-error">
              <AlertCircle className="w-3 h-3 mr-1" />
              {missingCritical.length} critical missing
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              completionPercentage >= 80 
                ? 'bg-success' 
                : completionPercentage >= 50 
                  ? 'bg-warning'
                  : 'bg-error'
            }`}
          />
        </div>
      </div>

      {/* Section Details */}
      {showDetails && (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    section.completed 
                      ? 'bg-success text-white' 
                      : section.weight >= 20
                        ? 'bg-error text-white'
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {section.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${
                      section.completed ? 'text-black' : 'text-gray-600'
                    }`}>
                      {section.name}
                    </div>
                    {section.weight >= 20 && !section.completed && (
                      <div className="text-xs text-error">Critical section</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {section.weight}% weight
                  </span>
                  {section.completed ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Action Button */}
      {completionPercentage < 100 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a
            href={`/${userType}_portal/workspace/profile`}
            className="btn-primary w-full text-center"
          >
            Complete Profile (+{Math.round((100 - completionPercentage) * 2)} points)
          </a>
        </div>
      )}

      {completionPercentage === 100 && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center text-success mb-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-semibold">Profile Complete!</span>
          </div>
          <p className="text-sm text-waterloo">
            You're now visible to {userType === 'student' ? 'employers' : 'students'} and will receive better matches.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileProgressTracker;