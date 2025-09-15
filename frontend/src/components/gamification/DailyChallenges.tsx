"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Target, 
  TrendingUp,
  User,
  FileText,
  Search,
  MessageCircle,
  BookOpen,
  Zap
} from 'lucide-react';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  xpReward: number;
  ccReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'profile' | 'search' | 'application' | 'networking' | 'learning';
  completed: boolean;
  progress?: number; // 0-100 for progress-based challenges
  target?: number; // Target value for progress challenges
  timeLimit?: number; // Minutes to complete (optional)
}

interface DailyChallengesProps {
  userType: 'student' | 'employer';
  className?: string;
  onChallengeComplete?: (challenge: DailyChallenge) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({
  userType,
  className = '',
  onChallengeComplete
}) => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Generate daily challenges based on user type
  useEffect(() => {
    const generateChallenges = (): DailyChallenge[] => {
      const studentChallenges: DailyChallenge[] = [
        {
          id: 'profile_update',
          title: 'Polish Your Profile',
          description: 'Update at least 2 sections of your profile',
          icon: User,
          xpReward: 25,
          ccReward: 10,
          difficulty: 'easy',
          category: 'profile',
          completed: false,
          progress: 0,
          target: 2
        },
        {
          id: 'job_search',
          title: 'Explore Opportunities',
          description: 'Browse and save 5 job listings',
          icon: Search,
          xpReward: 30,
          ccReward: 15,
          difficulty: 'easy',
          category: 'search',
          completed: false,
          progress: 0,
          target: 5
        },
        {
          id: 'apply_jobs',
          title: 'Take Action',
          description: 'Submit 2 quality job applications',
          icon: FileText,
          xpReward: 50,
          ccReward: 25,
          difficulty: 'medium',
          category: 'application',
          completed: false,
          progress: 0,
          target: 2
        },
        {
          id: 'skill_learning',
          title: 'Level Up Skills',
          description: 'Complete a learning module or tutorial',
          icon: BookOpen,
          xpReward: 40,
          ccReward: 20,
          difficulty: 'medium',
          category: 'learning',
          completed: false,
          timeLimit: 60
        },
        {
          id: 'networking',
          title: 'Connect & Grow',
          description: 'Reach out to 3 professionals in your field',
          icon: MessageCircle,
          xpReward: 60,
          ccReward: 30,
          difficulty: 'hard',
          category: 'networking',
          completed: false,
          progress: 0,
          target: 3
        }
      ];

      const employerChallenges: DailyChallenge[] = [
        {
          id: 'company_profile',
          title: 'Showcase Your Company',
          description: 'Update company culture section',
          icon: User,
          xpReward: 30,
          ccReward: 15,
          difficulty: 'easy',
          category: 'profile',
          completed: false
        },
        {
          id: 'candidate_search',
          title: 'Scout Talent',
          description: 'Review 10 student profiles',
          icon: Search,
          xpReward: 35,
          ccReward: 20,
          difficulty: 'easy',
          category: 'search',
          completed: false,
          progress: 0,
          target: 10
        },
        {
          id: 'post_job',
          title: 'Create Opportunity',
          description: 'Post a detailed job listing',
          icon: FileText,
          xpReward: 45,
          ccReward: 25,
          difficulty: 'medium',
          category: 'application',
          completed: false
        },
        {
          id: 'engage_candidates',
          title: 'Connect with Talent',
          description: 'Message 5 promising candidates',
          icon: MessageCircle,
          xpReward: 55,
          ccReward: 30,
          difficulty: 'medium',
          category: 'networking',
          completed: false,
          progress: 0,
          target: 5
        }
      ];

      // Randomly select 3-4 challenges for the day
      const allChallenges = userType === 'student' ? studentChallenges : employerChallenges;
      const shuffled = allChallenges.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(4, allChallenges.length));
    };

    setChallenges(generateChallenges());
  }, [userType]);

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChallengeClick = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        const updated = { ...challenge, completed: true };
        if (challenge.progress !== undefined) {
          updated.progress = 100;
        }
        onChallengeComplete?.(updated);
        return updated;
      }
      return challenge;
    }));
  };

  const getDifficultyColor = (difficulty: DailyChallenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getCategoryIcon = (category: DailyChallenge['category']) => {
    switch (category) {
      case 'profile': return '👤';
      case 'search': return '🔍';
      case 'application': return '📝';
      case 'networking': return '🤝';
      case 'learning': return '📚';
      default: return '🎯';
    }
  };

  const filteredChallenges = challenges.filter(challenge => 
    selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
  );

  const completedCount = challenges.filter(c => c.completed).length;
  const totalXP = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.xpReward, 0);
  const totalCC = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.ccReward, 0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Daily Challenges</h2>
              <p className="text-sm text-gray-500">
                {completedCount} of {challenges.length} completed
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Resets in {timeLeft}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-blue-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">+{totalXP} XP</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">+{totalCC} CC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex space-x-2">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="p-6">
        <div className="space-y-4">
          <AnimatePresence>
            {filteredChallenges.map((challenge, index) => {
              const IconComponent = challenge.icon;
              const progressPercent = challenge.progress || 0;
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    challenge.completed 
                      ? 'border-green-200 bg-green-50 opacity-75' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Challenge Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center relative ${
                      challenge.completed 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      {challenge.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute -top-1 -right-1 text-xs">
                        {getCategoryIcon(challenge.category)}
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Challenge Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${
                            challenge.completed 
                              ? 'text-green-700 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {/* Difficulty Badge */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          
                          {/* Time Limit */}
                          {challenge.timeLimit && !challenge.completed && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{challenge.timeLimit}m</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar (for progress-based challenges) */}
                      {challenge.target && challenge.progress !== undefined && !challenge.completed && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">
                              Progress: {Math.round(progressPercent)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round((progressPercent / 100) * challenge.target)} / {challenge.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}

                      {/* Rewards */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">+{challenge.xpReward} XP</span>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">+{challenge.ccReward} CC</span>
                          </div>
                        </div>

                        {challenge.completed && (
                          <span className="text-sm font-medium text-green-600">
                            Completed! ✨
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Completion Bonus */}
        {completedCount === challenges.length && challenges.length > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-center"
          >
            <div className="text-lg font-bold text-green-700 mb-2">
              🎉 All Challenges Complete!
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Amazing work! You've earned a completion bonus.
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1 text-blue-600">
                <Zap className="w-4 h-4" />
                <span className="font-medium">+50 Bonus XP</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">+25 Bonus CC</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenges;