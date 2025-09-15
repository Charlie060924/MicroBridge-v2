"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Target, 
  Award,
  Zap,
  Gift,
  Crown,
  Sparkles,
  CheckCircle,
  Lock,
  Unlock,
  TrendingUp,
  Flame,
  Medal
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  ccReward: number; // Career Coins
  unlocked: boolean;
  category: 'profile' | 'application' | 'skill' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface CompletionMilestone {
  id: string;
  title: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
  reward: {
    xp: number;
    cc: number;
    achievement?: string;
  };
  unlocked: boolean;
}

interface ProfileCompletionTrackerProps {
  currentProgress: number;
  completedSections: string[];
  userLevel: number;
  totalXP: number;
  careerCoins: number;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const ProfileCompletionTracker = ({ 
  currentProgress, 
  completedSections, 
  userLevel, 
  totalXP, 
  careerCoins,
  onAchievementUnlock 
}: ProfileCompletionTrackerProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [streakDays, setStreakDays] = useState(1);
  const [animateProgress, setAnimateProgress] = useState(false);

  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete basic information',
      icon: <Star className="w-6 h-6" />,
      xpReward: 50,
      ccReward: 25,
      unlocked: completedSections.includes('basic-info'),
      category: 'profile',
      rarity: 'common'
    },
    {
      id: 'scholar',
      title: 'Scholar',
      description: 'Add education details',
      icon: <Award className="w-6 h-6" />,
      xpReward: 75,
      ccReward: 35,
      unlocked: completedSections.includes('education'),
      category: 'profile',
      rarity: 'common'
    },
    {
      id: 'skilled-worker',
      title: 'Skilled Worker',
      description: 'Add 5+ skills to your profile',
      icon: <Zap className="w-6 h-6" />,
      xpReward: 100,
      ccReward: 50,
      unlocked: completedSections.includes('skills'),
      category: 'skill',
      rarity: 'rare'
    },
    {
      id: 'profile-master',
      title: 'Profile Master',
      description: 'Complete 100% of your profile',
      icon: <Crown className="w-6 h-6" />,
      xpReward: 250,
      ccReward: 100,
      unlocked: currentProgress >= 100,
      category: 'milestone',
      rarity: 'epic'
    },
    {
      id: 'early-adopter',
      title: 'Early Adopter',
      description: 'Join MicroBridge in the first wave',
      icon: <Sparkles className="w-6 h-6" />,
      xpReward: 500,
      ccReward: 200,
      unlocked: true, // Special achievement for early users
      category: 'milestone',
      rarity: 'legendary'
    }
  ];

  const milestones: CompletionMilestone[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Complete your first section',
      threshold: 20,
      icon: <Target className="w-5 h-5" />,
      reward: { xp: 25, cc: 10 },
      unlocked: currentProgress >= 20
    },
    {
      id: 'halfway-there',
      title: 'Halfway There',
      description: 'You\'re making great progress!',
      threshold: 50,
      icon: <TrendingUp className="w-5 h-5" />,
      reward: { xp: 50, cc: 25 },
      unlocked: currentProgress >= 50
    },
    {
      id: 'almost-done',
      title: 'Almost Done',
      description: 'Just a little bit more!',
      threshold: 80,
      icon: <Flame className="w-5 h-5" />,
      reward: { xp: 75, cc: 40 },
      unlocked: currentProgress >= 80
    },
    {
      id: 'profile-complete',
      title: 'Profile Complete',
      description: 'You\'re ready to find opportunities!',
      threshold: 100,
      icon: <Trophy className="w-5 h-5" />,
      reward: { xp: 100, cc: 50, achievement: 'profile-master' },
      unlocked: currentProgress >= 100
    }
  ];

  // Trigger celebration when milestones are reached
  useEffect(() => {
    const justUnlocked = achievements.filter(a => a.unlocked && !newlyUnlocked.includes(a));
    if (justUnlocked.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...justUnlocked]);
      setShowCelebration(true);
      setAnimateProgress(true);
      
      // Call callback for each new achievement
      justUnlocked.forEach(achievement => {
        onAchievementUnlock?.(achievement);
      });

      // Hide celebration after animation
      setTimeout(() => {
        setShowCelebration(false);
        setAnimateProgress(false);
      }, 3000);
    }
  }, [achievements, newlyUnlocked, onAchievementUnlock]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  const nextMilestone = milestones.find(m => !m.unlocked);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPossibleXP = achievements.reduce((sum, a) => sum + a.xpReward, 0);
  const earnedXP = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h3>
              {newlyUnlocked.length > 0 && (
                <div className="space-y-2">
                  {newlyUnlocked.slice(-1).map(achievement => (
                    <div key={achievement.id} className="text-center">
                      <p className="font-medium text-gray-800">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center justify-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-medium">+{achievement.xpReward} XP</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm font-medium">+{achievement.ccReward} CC</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Progress Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Profile Completion</h3>
            <p className="text-sm text-gray-600">Complete your profile to unlock opportunities</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{currentProgress}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar with Animation */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {animateProgress && (
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          </div>

          {/* Milestone Markers */}
          <div className="absolute top-0 w-full h-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="absolute top-0 h-3 w-1"
                style={{ left: `${milestone.threshold}%` }}
              >
                <div className={`w-3 h-3 rounded-full border-2 ${
                  milestone.unlocked 
                    ? 'bg-yellow-400 border-yellow-500' 
                    : 'bg-gray-300 border-gray-400'
                } transform -translate-x-1/2 -translate-y-px`}>
                  {milestone.unlocked && (
                    <CheckCircle className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {nextMilestone.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">{nextMilestone.title}</h4>
                <p className="text-sm text-blue-700">{nextMilestone.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-900">
                  {nextMilestone.threshold - currentProgress}% to go
                </div>
                <div className="text-xs text-blue-600">
                  +{nextMilestone.reward.xp} XP, +{nextMilestone.reward.cc} CC
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
          <div className="text-sm text-gray-600">
            {unlockedAchievements.length}/{achievements.length} unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: achievement.unlocked ? 1 : 0.6 }}
              className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                achievement.unlocked 
                  ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-br from-white to-gray-50` 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white` 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Zap className="w-3 h-3" />
                        <span className="text-xs font-medium">+{achievement.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Trophy className="w-3 h-3" />
                        <span className="text-xs font-medium">+{achievement.ccReward} CC</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Your Progress Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{userLevel}</div>
            <div className="text-sm opacity-90">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{earnedXP}</div>
            <div className="text-sm opacity-90">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{careerCoins}</div>
            <div className="text-sm opacity-90">Career Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{streakDays}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionTracker;