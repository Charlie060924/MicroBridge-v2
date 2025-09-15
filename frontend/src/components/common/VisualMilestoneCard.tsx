"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  CheckCircle, 
  Gift,
  Zap,
  Crown,
  Calendar
} from 'lucide-react';

interface VisualMilestoneCardProps {
  title: string;
  description: string;
  progress: number; // 0-100
  reward: string;
  type: 'profile' | 'achievement' | 'career' | 'social';
  isUnlocked: boolean;
  isCompleted: boolean;
  dueDate?: string;
  onClaim?: () => void;
  className?: string;
}

const VisualMilestoneCard: React.FC<VisualMilestoneCardProps> = ({
  title,
  description,
  progress,
  reward,
  type,
  isUnlocked,
  isCompleted,
  dueDate,
  onClaim,
  className = ''
}) => {
  const getMilestoneIcon = () => {
    switch (type) {
      case 'profile':
        return Star;
      case 'achievement':
        return Trophy;
      case 'career':
        return Target;
      case 'social':
        return Crown;
      default:
        return Award;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'profile':
        return 'from-blue-500 to-blue-600';
      case 'achievement':
        return 'from-yellow-500 to-yellow-600';
      case 'career':
        return 'from-green-500 to-green-600';
      case 'social':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const IconComponent = getMilestoneIcon();
  const canClaim = isCompleted && !isUnlocked;
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`relative bg-white rounded-xl shadow-lg border-2 p-6 transition-all duration-300 ${
        isCompleted 
          ? 'border-success bg-gradient-to-br from-success/5 to-success/10' 
          : canClaim 
            ? 'border-warning bg-gradient-to-br from-warning/5 to-secondary/5 hover:shadow-xl' 
            : isOverdue
              ? 'border-error bg-gradient-to-br from-error/5 to-error/10'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${className}`}
    >
      {/* Celebration Confetti Effect */}
      {isCompleted && (
        <>
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
            className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center text-white shadow-lg z-10"
          >
            <Trophy className="w-5 h-5" />
          </motion.div>
          
          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                x: [0, (i % 2 ? 20 : -20) * Math.cos(i * 60 * Math.PI / 180)],
                y: [0, -20 * Math.sin(i * 60 * Math.PI / 180)]
              }}
              transition={{ 
                delay: 0.5 + i * 0.1, 
                duration: 1.5,
                ease: "easeOut"
              }}
              className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                transform: `rotate(${i * 60}deg)`
              }}
            />
          ))}
        </>
      )}

      {/* Glow effect for claimable rewards */}
      {canClaim && (
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(234, 179, 8, 0.3)',
              '0 0 30px rgba(234, 179, 8, 0.5)', 
              '0 0 20px rgba(234, 179, 8, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl"
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <motion.div 
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor()} flex items-center justify-center text-white shadow-md`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <IconComponent className="w-6 h-6" />
            </motion.div>
            <div className="flex-1">
              <h3 className={`font-semibold text-lg leading-tight ${
                isCompleted ? 'text-success' : isOverdue ? 'text-error' : 'text-black'
              }`}>
                {title}
              </h3>
              <p className="text-sm text-waterloo mt-1">
                {description}
              </p>
              {dueDate && (
                <div className={`flex items-center space-x-1 mt-2 text-xs ${
                  isOverdue ? 'text-error' : 'text-gray-500'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>Due: {formatDate(dueDate)}</span>
                  {isOverdue && <span className="font-semibold">(Overdue)</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar with Animation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black">
              Progress
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full relative ${
                isCompleted 
                  ? 'bg-gradient-to-r from-success via-success to-green-400' 
                  : 'bg-gradient-to-r from-primary via-secondary to-primary'
              }`}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Reward Section */}
        <motion.div 
          className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 ${
            canClaim 
              ? 'bg-gradient-to-r from-warning/10 to-secondary/10 border-warning' 
              : isCompleted
                ? 'bg-gradient-to-r from-success/10 to-success/20 border-success'
                : 'bg-gray-50 border-gray-200'
          }`}
          whileHover={canClaim ? { scale: 1.02 } : {}}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className={`w-5 h-5 ${canClaim ? 'text-warning' : 'text-secondary'}`} />
              <span className="text-sm font-medium text-black">
                Reward: {reward}
              </span>
            </div>
            
            {canClaim && onClaim && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClaim}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-warning to-secondary text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span>Claim Reward</span>
              </motion.button>
            )}
            
            {isCompleted && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-success to-green-400 text-white text-sm font-semibold rounded-lg shadow-md"
              >
                <Trophy className="w-4 h-4" />
                <span>Earned!</span>
              </motion.div>
            )}
            
            {!isCompleted && progress < 100 && (
              <div className="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg">
                {Math.round(progress)}% Complete
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievement Badge Preview */}
        {progress >= 75 && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Almost there! Complete to unlock your achievement badge
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VisualMilestoneCard;