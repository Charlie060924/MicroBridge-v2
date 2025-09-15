"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { block } from 'million/react';
import { 
  User, 
  Briefcase, 
  Trophy, 
  TrendingUp, 
  Clock,
  MapPin,
  Sparkles,
  Users,
  ChevronRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'job_posted' | 'user_hired' | 'achievement_unlocked' | 'streak_milestone' | 'skill_certified' | 'project_completed';
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    title?: string;
  };
  company?: {
    name: string;
    logo?: string;
  };
  job?: {
    id: string;
    title: string;
    category: string;
  };
  achievement?: {
    name: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
  showTimestamps?: boolean;
  className?: string;
}

const ActivityFeedComponent: React.FC<ActivityFeedProps> = ({
  maxItems = 20,
  showFilters = true,
  compact = false,
  showTimestamps = true,
  className = ''
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);

  // Simulate real-time activity feed
  useEffect(() => {
    const generateMockActivity = (): ActivityItem => {
      const types = ['job_posted', 'user_hired', 'achievement_unlocked', 'streak_milestone', 'skill_certified', 'project_completed'];
      const type = types[Math.floor(Math.random() * types.length)] as ActivityItem['type'];
      
      const users = [
        { name: 'Sarah Chen', location: 'San Francisco', title: 'Full Stack Developer' },
        { name: 'Marcus Johnson', location: 'New York', title: 'Product Manager' },
        { name: 'Elena Rodriguez', location: 'Austin', title: 'UX Designer' },
        { name: 'David Kim', location: 'Seattle', title: 'Data Scientist' },
        { name: 'Jessica Taylor', location: 'Boston', title: 'Software Engineer' }
      ];
      
      const companies = [
        { name: 'TechCorp Solutions' },
        { name: 'InnovateLabs' },
        { name: 'DataFlow Systems' },
        { name: 'CloudVentures' },
        { name: 'StartupHub Inc.' }
      ];
      
      const jobs = [
        { title: 'Senior React Developer', category: 'Engineering' },
        { title: 'Product Designer', category: 'Design' },
        { title: 'Marketing Specialist', category: 'Marketing' },
        { title: 'Data Analyst', category: 'Analytics' },
        { title: 'DevOps Engineer', category: 'Engineering' }
      ];
      
      const achievements = [
        { name: 'First Application', icon: '🚀', rarity: 'common' as const },
        { name: 'Profile Master', icon: '⭐', rarity: 'rare' as const },
        { name: 'Interview Ace', icon: '🏆', rarity: 'epic' as const },
        { name: 'Career Catalyst', icon: '💫', rarity: 'legendary' as const }
      ];

      const user = users[Math.floor(Math.random() * users.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const job = jobs[Math.floor(Math.random() * jobs.length)];
      const achievement = achievements[Math.floor(Math.random() * achievements.length)];

      return {
        id: `activity-${Date.now()}-${Math.random()}`,
        type,
        timestamp: new Date(),
        user: {
          id: `user-${Math.random()}`,
          ...user
        },
        company,
        job: {
          id: `job-${Math.random()}`,
          ...job
        },
        achievement,
        metadata: {
          streakDays: Math.floor(Math.random() * 100) + 1,
          projectValue: Math.floor(Math.random() * 50000) + 5000,
          skillName: ['React', 'Python', 'Design Thinking', 'SQL'][Math.floor(Math.random() * 4)]
        }
      };
    };

    // Initialize with some activities
    const initialActivities = Array.from({ length: 10 }, generateMockActivity);
    setActivities(initialActivities);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setActivities(prev => [newActivity, ...prev].slice(0, maxItems));
    }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [maxItems]);

  // Filter activities based on active filters
  useEffect(() => {
    if (activeFilters.includes('all')) {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => 
        activeFilters.includes(activity.type)
      ));
    }
  }, [activities, activeFilters]);

  const filterOptions = [
    { id: 'all', label: 'All Activity', icon: Users },
    { id: 'user_hired', label: 'New Hires', icon: Trophy },
    { id: 'job_posted', label: 'New Jobs', icon: Briefcase },
    { id: 'achievement_unlocked', label: 'Achievements', icon: Sparkles },
    { id: 'streak_milestone', label: 'Streaks', icon: TrendingUp }
  ];

  const toggleFilter = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(filterId)) {
          const filtered = newFilters.filter(f => f !== filterId);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newFilters, filterId];
        }
      });
    }
  };

  const getActivityMessage = (activity: ActivityItem): { message: string; color: string; icon: React.ReactNode } => {
    const { user, company, job, achievement, metadata } = activity;
    
    switch (activity.type) {
      case 'job_posted':
        return {
          message: `${company?.name} posted a new ${job?.title} position`,
          color: 'text-blue-600',
          icon: <Briefcase className="w-4 h-4" />
        };
      
      case 'user_hired':
        return {
          message: `${user?.name} was hired as ${job?.title} at ${company?.name}`,
          color: 'text-green-600',
          icon: <Trophy className="w-4 h-4" />
        };
      
      case 'achievement_unlocked':
        return {
          message: `${user?.name} unlocked "${achievement?.name}" ${achievement?.icon}`,
          color: achievement?.rarity === 'legendary' ? 'text-purple-600' : 
                 achievement?.rarity === 'epic' ? 'text-orange-600' : 
                 achievement?.rarity === 'rare' ? 'text-blue-600' : 'text-gray-600',
          icon: <Sparkles className="w-4 h-4" />
        };
      
      case 'streak_milestone':
        return {
          message: `${user?.name} reached a ${metadata?.streakDays}-day streak! 🔥`,
          color: 'text-orange-600',
          icon: <TrendingUp className="w-4 h-4" />
        };
      
      case 'skill_certified':
        return {
          message: `${user?.name} earned ${metadata?.skillName} certification`,
          color: 'text-indigo-600',
          icon: <Sparkles className="w-4 h-4" />
        };
      
      case 'project_completed':
        return {
          message: `${user?.name} completed a $${metadata?.projectValue?.toLocaleString()} project`,
          color: 'text-emerald-600',
          icon: <Trophy className="w-4 h-4" />
        };
      
      default:
        return {
          message: 'Unknown activity',
          color: 'text-gray-600',
          icon: <User className="w-4 h-4" />
        };
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Live Activity Feed
        </h3>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleFilter(id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilters.includes(id) || (id === 'all' && activeFilters.includes('all'))
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={compact ? "p-2" : "p-4"}>
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((activity) => {
            const { message, color, icon } = getActivityMessage(activity);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-3 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors ${
                  compact ? 'py-2' : 'py-3'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${color}`}>
                  {icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${compact ? 'text-xs' : 'text-sm'} text-gray-900 leading-relaxed`}>
                    {message}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    {showTimestamps && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    )}
                    
                    {activity.user?.location && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.user.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity to show</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Million.js optimized component for high-frequency updates
const ActivityFeed = block(ActivityFeedComponent);

export default ActivityFeed;