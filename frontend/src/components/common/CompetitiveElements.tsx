"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { block } from 'million/react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Zap, 
  Medal, 
  Crown,
  Users,
  Calendar,
  Award,
  Star,
  Flame,
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface CompetitiveChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'applications' | 'views' | 'skills' | 'streak' | 'social';
  target: number;
  current: number;
  reward: {
    xp: number;
    careerCoins: number;
    badge?: string;
  };
  timeLimit: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  participants: number;
  leaderboard?: LeaderboardEntry[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  category: string;
}

interface CompetitiveElementsProps {
  userId?: string;
  showChallenges?: boolean;
  showLeaderboard?: boolean;
  showAchievements?: boolean;
  compact?: boolean;
  className?: string;
}

const CompetitiveElementsComponent: React.FC<CompetitiveElementsProps> = ({
  userId = 'current-user',
  showChallenges = true,
  showLeaderboard = true,
  showAchievements = true,
  compact = false,
  className = ''
}) => {
  const [challenges, setChallenges] = useState<CompetitiveChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'achievements'>('challenges');
  const [userRank, setUserRank] = useState<number>(42);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockChallenges: CompetitiveChallenge[] = [
      {
        id: 'daily-apps',
        title: 'Application Sprint',
        description: 'Submit 3 job applications today',
        type: 'daily',
        category: 'applications',
        target: 3,
        current: 1,
        reward: { xp: 50, careerCoins: 25 },
        timeLimit: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        difficulty: 'easy',
        participants: 1247
      },
      {
        id: 'weekly-streak',
        title: 'Consistency Champion',
        description: 'Maintain a 7-day activity streak',
        type: 'weekly',
        category: 'streak',
        target: 7,
        current: 4,
        reward: { xp: 200, careerCoins: 100, badge: 'streak_master' },
        timeLimit: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        difficulty: 'medium',
        participants: 856
      },
      {
        id: 'monthly-explorer',
        title: 'Career Explorer',
        description: 'View 50 job postings this month',
        type: 'monthly',
        category: 'views',
        target: 50,
        current: 23,
        reward: { xp: 300, careerCoins: 150, badge: 'explorer' },
        timeLimit: new Date('2024-01-31'),
        difficulty: 'medium',
        participants: 2341
      },
      {
        id: 'special-networking',
        title: 'Networking Master',
        description: 'Connect with 10 professionals in your field',
        type: 'special',
        category: 'social',
        target: 10,
        current: 6,
        reward: { xp: 500, careerCoins: 250, badge: 'networker' },
        timeLimit: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        difficulty: 'hard',
        participants: 234
      }
    ];

    const mockLeaderboard: LeaderboardEntry[] = [
      { id: '1', name: 'Sarah Chen', score: 2850, rank: 1, trend: 'same' },
      { id: '2', name: 'Marcus Johnson', score: 2720, rank: 2, trend: 'up' },
      { id: '3', name: 'Elena Rodriguez', score: 2680, rank: 3, trend: 'down' },
      { id: '4', name: 'David Kim', score: 2456, rank: 4, trend: 'up' },
      { id: '5', name: 'Jessica Taylor', score: 2234, rank: 5, trend: 'same' },
      { id: 'current', name: 'You', score: 1876, rank: 42, trend: 'up', isCurrentUser: true }
    ];

    const mockAchievements: UserAchievement[] = [
      {
        id: 'first-app',
        title: 'First Steps',
        description: 'Submitted your first job application',
        icon: '🚀',
        rarity: 'common',
        unlockedAt: new Date('2024-01-10'),
        category: 'milestones'
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintained a 7-day activity streak',
        icon: '🔥',
        rarity: 'rare',
        unlockedAt: new Date('2024-01-15'),
        category: 'consistency'
      },
      {
        id: 'profile-master',
        title: 'Profile Perfectionist',
        description: 'Completed 100% of your profile',
        icon: '⭐',
        rarity: 'epic',
        unlockedAt: new Date('2024-01-08'),
        category: 'profile'
      },
      {
        id: 'interview-ace',
        title: 'Interview Champion',
        description: 'Aced 5 interviews in a row',
        icon: '🏆',
        rarity: 'legendary',
        unlockedAt: new Date('2024-01-20'),
        category: 'interviews'
      }
    ];

    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
    setAchievements(mockAchievements);
    setLoading(false);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      case 'legendary': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-orange-300 bg-orange-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatTimeRemaining = (timeLimit: Date): string => {
    const now = new Date();
    const diff = timeLimit.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const calculateProgress = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const renderChallengeCard = (challenge: CompetitiveChallenge) => {
    const progress = calculateProgress(challenge.current, challenge.target);
    const isCompleted = challenge.current >= challenge.target;
    const timeRemaining = formatTimeRemaining(challenge.timeLimit);
    const isExpired = timeRemaining === 'Expired';

    return (
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg border-2 transition-all duration-200 ${
          isCompleted 
            ? 'border-green-200 bg-green-50' 
            : isExpired 
            ? 'border-gray-200 bg-gray-50 opacity-75'
            : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
        } ${compact ? 'p-4' : 'p-6'}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} text-gray-900`}>
                {challenge.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
              {challenge.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {challenge.type === 'daily' && <Clock className="w-4 h-4 text-blue-500" />}
            {challenge.type === 'weekly' && <Calendar className="w-4 h-4 text-green-500" />}
            {challenge.type === 'monthly' && <TrendingUp className="w-4 h-4 text-purple-500" />}
            {challenge.type === 'special' && <Star className="w-4 h-4 text-orange-500" />}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
              Progress: {challenge.current}/{challenge.target}
            </span>
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium ${
              isExpired ? 'text-red-500' : isCompleted ? 'text-green-600' : 'text-blue-600'
            }`}>
              {isExpired ? 'Expired' : isCompleted ? 'Completed!' : `${Math.round(progress)}%`}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Rewards & Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-blue-600">
              <Zap className="w-4 h-4" />
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                +{challenge.reward.xp} XP
              </span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-600">
              <Medal className="w-4 h-4" />
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                +{challenge.reward.careerCoins} CC
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {!isExpired && (
                <>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {timeRemaining}
                </>
              )}
            </div>
            <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              <Users className="w-3 h-3 inline mr-1" />
              {challenge.participants.toLocaleString()} participants
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLeaderboard = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Weekly Leaderboard
        </h3>
        <p className="text-blue-100 text-sm">Top performers this week</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 flex items-center space-x-4 ${
              entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {entry.rank <= 3 ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  entry.rank === 1 ? 'bg-yellow-500' : entry.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                  {entry.rank}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${entry.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                  {entry.name}
                </span>
                {entry.isCurrentUser && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    You
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {entry.score.toLocaleString()} pts
              </div>
              <div className="flex items-center justify-end space-x-1">
                {entry.trend === 'up' && <ChevronUp className="w-3 h-3 text-green-500" />}
                {entry.trend === 'down' && <ChevronDown className="w-3 h-3 text-red-500" />}
                {entry.trend !== 'same' && (
                  <span className={`text-xs ${
                    entry.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {entry.trend === 'up' ? '+' : '-'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} transition-transform hover:scale-105`}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  achievement.rarity === 'legendary' ? 'bg-orange-100 text-orange-700' :
                  achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                  achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {achievement.rarity}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              <div className="text-xs text-gray-500">
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with Rank */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Competitive Hub</h2>
          <p className="text-gray-600">Challenge yourself and compete with the community</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Your Rank</div>
          <div className="text-2xl font-bold text-blue-600">#{userRank}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { id: 'challenges', label: 'Challenges', icon: Target, show: showChallenges },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, show: showLeaderboard },
          { id: 'achievements', label: 'Achievements', icon: Award, show: showAchievements }
        ].filter(tab => tab.show).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'challenges' && showChallenges && (
          <div className="space-y-4">
            {challenges.map(renderChallengeCard)}
          </div>
        )}
        
        {activeTab === 'leaderboard' && showLeaderboard && renderLeaderboard()}
        
        {activeTab === 'achievements' && showAchievements && renderAchievements()}
      </div>
    </div>
  );
};

// Million.js optimized component for leaderboards and real-time challenges
const CompetitiveElements = block(CompetitiveElementsComponent);

export default CompetitiveElements;