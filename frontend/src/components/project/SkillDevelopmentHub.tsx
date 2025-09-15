"use client";

import React, { useState } from "react";
import { BookOpen, Trophy, Users, Lightbulb, ArrowRight, Star, CheckCircle } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  progress: number;
  category: string;
}

interface LearningResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'practice';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  relevantSkills: string[];
  url: string;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  responseTime: string;
  avatar: string;
  isAvailable: boolean;
}

interface SkillDevelopmentHubProps {
  projectSkills: string[];
  userSkills: Skill[];
  onSkillProgress?: (skillId: string, progress: number) => void;
}

const SkillDevelopmentHub: React.FC<SkillDevelopmentHubProps> = ({
  projectSkills,
  userSkills,
  onSkillProgress
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'mentors' | 'community' | 'progress'>('resources');

  const learningResources: LearningResource[] = [
    {
      id: '1',
      title: 'Advanced React Patterns for Production Apps',
      type: 'course',
      duration: '3h 45m',
      difficulty: 'advanced',
      rating: 4.8,
      relevantSkills: ['React', 'JavaScript'],
      url: '#'
    },
    {
      id: '2',
      title: 'Client Communication Best Practices',
      type: 'article',
      duration: '15m',
      difficulty: 'beginner',
      rating: 4.5,
      relevantSkills: ['Communication', 'Project Management'],
      url: '#'
    },
    {
      id: '3',
      title: 'TypeScript Performance Optimization',
      type: 'video',
      duration: '1h 20m',
      difficulty: 'intermediate',
      rating: 4.7,
      relevantSkills: ['TypeScript', 'Performance'],
      url: '#'
    }
  ];

  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      expertise: ['React', 'Full-Stack Development', 'Career Growth'],
      rating: 4.9,
      responseTime: '< 2 hours',
      avatar: '/api/placeholder/40/40',
      isAvailable: true
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      expertise: ['Node.js', 'System Design', 'Technical Leadership'],
      rating: 4.8,
      responseTime: '< 4 hours',
      avatar: '/api/placeholder/40/40',
      isAvailable: false
    }
  ];

  const getTypeIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Star className="h-4 w-4" />;
      case 'article': return <Lightbulb className="h-4 w-4" />;
      case 'practice': return <Trophy className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: LearningResource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const ResourceCard: React.FC<{ resource: LearningResource }> = ({ resource }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon(resource.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{resource.rating}</span>
        </div>
      </div>
      
      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{resource.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{resource.duration}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {resource.relevantSkills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
        <span>Start Learning</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  const MentorCard: React.FC<{ mentor: Mentor }> = ({ mentor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{mentor.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{mentor.name}</h4>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{mentor.rating}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{mentor.responseTime}</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${mentor.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {mentor.expertise.map(skill => (
          <span key={skill} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>
      
      <button 
        disabled={!mentor.isAvailable}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mentor.isAvailable ? 'Request Guidance' : 'Currently Unavailable'}
      </button>
    </div>
  );

  const SkillProgressCard: React.FC<{ skill: Skill }> = ({ skill }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{skill.name}</h4>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Level {skill.level}/{skill.maxLevel}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${skill.progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{skill.progress}% complete</span>
        <span className="text-blue-600 dark:text-blue-400">{skill.category}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Skill Development Hub
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enhance your skills while working on this project
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'resources', label: 'Learning Resources', icon: BookOpen },
          { id: 'mentors', label: 'Mentors', icon: Users },
          { id: 'community', label: 'Community', icon: Trophy },
          { id: 'progress', label: 'Progress', icon: CheckCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Study Groups & Peer Support
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect with other students working on similar projects
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Join Study Group
            </button>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSkills.map(skill => (
              <SkillProgressCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDevelopmentHub;