"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '@/types/level';

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  xpGained?: number;
  ccGained?: number;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
  xpGained = 0,
  ccGained = 0
}) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 opacity-10" />
            
            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full opacity-60"
              />
            ))}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8 text-center">
              {/* Trophy Animation */}
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                className="mb-6 relative"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative">
                  {/* Glow Effect */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-yellow-400 opacity-30"
                  />
                  
                  <span className="text-3xl relative z-10">
                    {achievement.icon || '🏆'}
                  </span>
                </div>

                {/* Sparkle Effects */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className={`absolute w-4 h-4 text-yellow-400 ${
                      i === 0 ? '-top-2 -right-2' :
                      i === 1 ? '-top-2 -left-2' :
                      i === 2 ? '-bottom-2 -right-2' : '-bottom-2 -left-2'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Achievement Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Achievement Unlocked!
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-semibold text-gray-800 mb-4"
              >
                {achievement.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-6"
              >
                {achievement.description}
              </motion.p>

              {/* Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center space-x-6 mb-6"
              >
                {xpGained > 0 && (
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-semibold text-blue-600">
                      +{xpGained} XP
                    </span>
                  </div>
                )}
                
                {ccGained > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold text-yellow-600">
                      +{ccGained} CC
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Awesome!
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;