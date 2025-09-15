"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Search,
  Bookmark
} from 'lucide-react';
import VisualMilestoneCard from './VisualMilestoneCard';
import VerificationBadge from './VerificationBadge';
import SmartSearchBar from './SmartSearchBar';

interface VerificationDiscoveryHubProps {
  userType: 'student' | 'employer';
  className?: string;
}

const VerificationDiscoveryHub: React.FC<VerificationDiscoveryHubProps> = ({
  userType,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'verification' | 'discovery'>('progress');

  // Mock data for demonstration
  const studentMilestones = [
    {
      title: 'Complete Your Profile',
      description: 'Add skills, experience, and education details',
      progress: 85,
      reward: '50 XP + Profile Badge',
      type: 'profile' as const,
      isUnlocked: false,
      isCompleted: false,
      dueDate: '2025-09-15'
    },
    {
      title: 'Skill Verification',
      description: 'Complete skill assessments and get verified',
      progress: 100,
      reward: 'Skill Master Badge',
      type: 'achievement' as const,
      isUnlocked: true,
      isCompleted: true
    },
    {
      title: 'First Job Application',
      description: 'Apply to your first job on the platform',
      progress: 45,
      reward: 'Career Starter Badge + 100 XP',
      type: 'career' as const,
      isUnlocked: false,
      isCompleted: false,
      dueDate: '2025-09-20'
    }
  ];

  const employerMilestones = [
    {
      title: 'Company Verification',
      description: 'Complete company verification process',
      progress: 75,
      reward: 'Verified Employer Badge',
      type: 'profile' as const,
      isUnlocked: false,
      isCompleted: false,
      dueDate: '2025-09-12'
    },
    {
      title: 'Post First Project',
      description: 'Create and publish your first project listing',
      progress: 100,
      reward: 'Project Pioneer Badge + Premium Features',
      type: 'career' as const,
      isUnlocked: true,
      isCompleted: true
    },
    {
      title: 'Talent Network',
      description: 'Connect with 10+ verified students',
      progress: 60,
      reward: 'Network Builder Badge',
      type: 'social' as const,
      isUnlocked: false,
      isCompleted: false
    }
  ];

  const verificationStatus = {
    student: [
      { type: 'identity' as const, status: 'verified' as const, level: 'basic' as const, details: 'Government ID verified' },
      { type: 'education' as const, status: 'verified' as const, level: 'enhanced' as const, details: 'University transcript verified' },
      { type: 'skills' as const, status: 'pending' as const, level: 'basic' as const, details: 'Assessment in progress' },
      { type: 'background' as const, status: 'requires_action' as const, level: 'basic' as const, details: 'Additional information needed' }
    ],
    employer: [
      { type: 'company' as const, status: 'verified' as const, level: 'premium' as const, details: 'Business registration verified' },
      { type: 'payment' as const, status: 'verified' as const, level: 'basic' as const, details: 'Payment method verified' },
      { type: 'background' as const, status: 'pending' as const, level: 'enhanced' as const, details: 'Reference check in progress' }
    ]
  };

  const milestones = userType === 'student' ? studentMilestones : employerMilestones;
  const verifications = verificationStatus[userType];

  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const verifiedCount = verifications.filter(v => v.status === 'verified').length;

  const handleMilestoneClaim = (title: string) => {
    console.log(`Claiming reward for: ${title}`);
    // In real app, would make API call
  };

  const handleSearch = (query: string, filters?: any) => {
    console.log('Search:', query, filters);
    // In real app, would perform search
  };

  const handleVerificationAction = () => {
    console.log('Opening verification modal');
    // In real app, would open verification flow
  };

  const tabVariants = {
    inactive: { opacity: 0.6, y: 10 },
    active: { opacity: 1, y: 0 }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Verification & Discovery Hub</h2>
          <p className="text-waterloo mt-1">
            Track progress, manage verifications, and discover opportunities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{completedMilestones}</div>
            <div className="text-xs text-gray-500">Milestones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{verifiedCount}</div>
            <div className="text-xs text-gray-500">Verified</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {['progress', 'verification', 'discovery'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'progress' && <TrendingUp className="w-4 h-4" />}
            {tab === 'verification' && <Shield className="w-4 h-4" />}
            {tab === 'discovery' && <Search className="w-4 h-4" />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="inactive"
        animate="active"
        transition={{ duration: 0.3 }}
      >
        {/* Progress Tracking Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VisualMilestoneCard
                    {...milestone}
                    onClaim={() => handleMilestoneClaim(milestone.title)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Overall Progress Summary */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-black">Overall Progress</h3>
                  <p className="text-waterloo">
                    {completedMilestones} of {milestones.length} milestones completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((completedMilestones / milestones.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Systems Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {verifications.map((verification, index) => (
                <motion.div
                  key={verification.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-center"
                >
                  <VerificationBadge
                    {...verification}
                    size="lg"
                    onAction={verification.status !== 'verified' ? handleVerificationAction : undefined}
                  />
                </motion.div>
              ))}
            </div>

            {/* Verification Progress */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-black">Verification Progress</h3>
                <div className="text-sm text-primary font-medium">
                  {verifiedCount}/{verifications.length} Complete
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(verifiedCount / verifications.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                />
              </div>

              <div className="space-y-3">
                {verifications.map((verification) => (
                  <div key={verification.type} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        verification.status === 'verified' ? 'bg-success' :
                        verification.status === 'pending' ? 'bg-warning' : 'bg-error'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {verification.type} Verification
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      verification.status === 'verified' ? 'bg-success/10 text-success' :
                      verification.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                    }`}>
                      {verification.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search & Discovery Tab */}
        {activeTab === 'discovery' && (
          <div className="space-y-6">
            {/* Enhanced Search Bar */}
            <div>
              <h3 className="font-semibold text-lg text-black mb-4">Smart Search & Discovery</h3>
              <SmartSearchBar onSearch={handleSearch} />
            </div>

            {/* Discovery Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Auto-Complete</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Smart suggestions for skills, companies, and locations as you type
                </p>
                <div className="flex items-center text-xs text-blue-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Active</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Smart Filtering</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  AI-powered filtering with suggested refinements for better matches
                </p>
                <div className="flex items-center text-xs text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Active</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Saved Searches</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Save and revisit your favorite search queries and filters
                </p>
                <div className="flex items-center text-xs text-purple-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationDiscoveryHub;