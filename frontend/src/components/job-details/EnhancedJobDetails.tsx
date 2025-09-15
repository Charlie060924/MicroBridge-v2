'use client';
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Users, Target, CheckCircle, AlertCircle, Building, Shield, Star, TrendingUp } from 'lucide-react';
import { JobResponse } from '@/services/jobService';
import { HelpTooltip } from '@/components/ui/Tooltip';

interface EnhancedJobDetailsProps {
  job: JobResponse;
  matchScore?: number;
  skillGapAnalysis?: any;
  className?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'upcoming' | 'current' | 'completed';
  deliverables: string[];
}

interface EmployerVerification {
  isVerified: boolean;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  badges: string[];
  rating: number;
  reviewCount: number;
}

export const EnhancedJobDetails: React.FC<EnhancedJobDetailsProps> = ({
  job,
  matchScore,
  skillGapAnalysis,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'requirements' | 'company'>('overview');

  // Mock data for enhanced features - in real app, this would come from backend
  const mockMilestones: Milestone[] = [
    {
      id: '1',
      title: 'Project Setup & Requirements Analysis',
      description: 'Initial project setup, requirements gathering, and technical planning phase.',
      duration: '1-2 weeks',
      status: 'upcoming',
      deliverables: ['Project plan', 'Technical requirements', 'Initial wireframes']
    },
    {
      id: '2',
      title: 'Development Phase 1',
      description: 'Core functionality development and initial prototyping.',
      duration: '3-4 weeks',
      status: 'upcoming',
      deliverables: ['MVP prototype', 'Core features', 'Initial testing']
    },
    {
      id: '3',
      title: 'Testing & Refinement',
      description: 'Comprehensive testing, bug fixes, and feature refinement.',
      duration: '1-2 weeks',
      status: 'upcoming',
      deliverables: ['Test results', 'Bug fixes', 'Performance optimization']
    },
    {
      id: '4',
      title: 'Final Delivery & Handover',
      description: 'Final delivery, documentation, and knowledge transfer.',
      duration: '1 week',
      status: 'upcoming',
      deliverables: ['Final product', 'Documentation', 'Training materials']
    }
  ];

  const mockEmployerVerification: EmployerVerification = {
    isVerified: true,
    verificationLevel: 'enhanced',
    badges: ['Verified Employer', 'Top Rated', 'Fast Payments'],
    rating: 4.8,
    reviewCount: 127
  };

  const formatSalary = (salary: any) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency} ${salary.min_amount?.toLocaleString()} - ${salary.max_amount?.toLocaleString()}${salary.negotiable ? ' (Negotiable)' : ''}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getVerificationBadge = (level: string) => {
    const badges = {
      basic: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      enhanced: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      premium: { color: 'bg-purple-100 text-purple-800', icon: Star }
    };
    const badge = badges[level as keyof typeof badges] || badges.basic;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)} Verified
      </span>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header with Match Score */}
      {matchScore && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {Math.round(matchScore * 100)}%
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Match Score</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {matchScore >= 0.8 ? 'Excellent match' : matchScore >= 0.6 ? 'Good match' : 'Potential match'}
                </p>
              </div>
            </div>
            <HelpTooltip content="This score is calculated using AI analysis of your skills, experience, and career goals compared to job requirements." />
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'timeline', label: 'Project Timeline', icon: Calendar },
            { id: 'requirements', label: 'Requirements', icon: CheckCircle },
            { id: 'company', label: 'Company Info', icon: Building }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Job Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {job.location} {job.is_remote && '(Remote Available)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Compensation</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {job.duration ? `${job.duration} weeks` : 'Ongoing'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Experience Level</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {job.experience_level}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Description</h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Skills Breakdown */}
            {skillGapAnalysis && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.filter(skill => !skillGapAnalysis.missing_skills?.includes(skill.name))
                        .map(skill => (
                          <span key={skill.name} className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs rounded">
                            {skill.name}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  {skillGapAnalysis.missing_skills?.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Skills to Develop</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGapAnalysis.missing_skills.map((skill: string) => (
                          <span key={skill} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Timeline & Milestones</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Estimated {job.duration || 6}-week project
              </span>
            </div>

            <div className="space-y-4">
              {mockMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(milestone.status)}
                    {index < mockMilestones.length - 1 && (
                      <div className="w-px h-16 bg-gray-300 dark:bg-gray-600 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {milestone.title}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {milestone.duration}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {milestone.description}
                    </p>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Key Deliverables:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {milestone.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Dates */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Important Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Application Deadline:</span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Open'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Start Date:</span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Flexible'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Expected Completion:</span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Requirements</h3>
            
            {/* Technical Skills */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Required Skills</h4>
              <div className="grid gap-3">
                {job.skills?.map(skill => (
                  <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                      {skill.is_required && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 text-xs rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Level {skill.level}/5</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.level ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Additional Requirements</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Work Arrangement */}
            {job.work_arrangement && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Work Arrangement</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {job.work_arrangement.schedule_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Hours per week:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {job.work_arrangement.hours_per_week}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Timezone:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {job.work_arrangement.timezone}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Meetings:</span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {job.work_arrangement.meeting_frequency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.company}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {getVerificationBadge(mockEmployerVerification.verificationLevel)}
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mockEmployerVerification.rating}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      ({mockEmployerVerification.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Verification Badges</h4>
              <div className="flex flex-wrap gap-2">
                {mockEmployerVerification.badges.map(badge => (
                  <span key={badge} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Benefits & Perks</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Stats */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Company Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{job.views}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Job Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{job.applications}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Applications</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">98%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Response Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2.5d</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg Response</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedJobDetails;