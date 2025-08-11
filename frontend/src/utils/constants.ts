import { Achievement } from "@/types/level";

/**
 * XP values for common actions
 */
export const XP_VALUES = {
  COMPLETE_PROFILE: 50,
  APPLY_FOR_PROJECT: 30,
  COMPLETE_PROJECT: 150,
  LEARN_NEW_SKILL: 40,
  RECEIVE_POSITIVE_FEEDBACK: 60,
  POST_JOB: 80, // For employers
  ACCEPT_STUDENT: 50, // For employers
  
  // Enhanced level system XP values
  DAILY_LOGIN: 10,
  COMPLETE_ONBOARDING: 25,
  FIRST_APPLICATION: 50,
  PROFILE_COMPLETION: 100,
  SKILL_ADDITION: 15,
  ACHIEVEMENT_UNLOCK: 25,
  STREAK_MILESTONE: 20,
  GUILD_JOIN: 30,
  GUILD_CONTRIBUTION: 25,
  WEEKLY_CHALLENGE: 75,
  MONTHLY_GOAL: 150,
  REFERRAL: 100,
  FEEDBACK_PROVIDED: 20,
  RESUME_UPLOAD: 30,
  PORTFOLIO_UPDATE: 25,
  NETWORK_CONNECTION: 15,
  LEARNING_COMPLETION: 40,
  CERTIFICATION_EARNED: 200,
  MENTORSHIP_SESSION: 50,
  COMMUNITY_CONTRIBUTION: 35
};

/**
 * XP multiplier increase per level
 * Example: if base XP to level up is 100,
 * Level 2 = 100 * LEVEL_MULTIPLIER, Level 3 = previous * LEVEL_MULTIPLIER, etc.
 */
export const LEVEL_MULTIPLIER = 1.2;

/**
 * Base XP required to go from Level 1 → Level 2
 */
export const BASE_XP_REQUIREMENT = 100;

/**
 * Enhanced Level System Configuration
 */
export const ENHANCED_LEVEL_CONFIG = {
  // Streak system
  STREAK_XP_BONUS: 10,
  MAX_STREAK_BONUS: 50,
  STREAK_MILESTONES: [7, 30, 100, 365],
  
  // Career Coins earning rates
  CC_PER_LEVEL: {
    1: 0,
    2: 100,
    3: 125,
    4: 150,
    5: 200,
    6: 225,
    7: 250,
    8: 275,
    9: 300,
    10: 500,
    12: 400,
    15: 600,
    18: 750,
    20: 1000,
    25: 1500
  },
  
  // Feature unlock levels
  FEATURE_UNLOCKS: {
    DAILY_DASHES: 1,
    REWARDS_STORE: 2,
    JOB_SEARCH_GUILDS: 5,
    VETERAN_TIER: 8,
    STREAK_BONDS: 10,
    REWARD_OPTIMIZER: 12,
    BADGE_PRESTIGE: 20
  },
  
  // Prestige system
  PRESTIGE_MIN_LEVEL: 20,
  PRESTIGE_XP_PER_LEVEL: 7500,
  
  // Meta-achievements
  META_ACHIEVEMENTS: {
    STREAK_365_DAYS: 365,
    SPEND_5000_CC: 5000,
    REFER_10_FRIENDS: 10
  }
};

/**
 * Daily and weekly challenges
 */
export const CHALLENGES = {
  DAILY: [
    { id: 'login', name: 'Daily Login', xp: 10, description: 'Log in to the platform' },
    { id: 'apply', name: 'Apply to a Job', xp: 30, description: 'Submit an application' },
    { id: 'skill', name: 'Add a Skill', xp: 15, description: 'Add a new skill to your profile' },
    { id: 'network', name: 'Network', xp: 15, description: 'Connect with another user' },
    { id: 'learn', name: 'Learn Something', xp: 20, description: 'Complete a learning activity' }
  ],
  WEEKLY: [
    { id: 'applications', name: 'Active Job Seeker', xp: 100, description: 'Apply to 5 jobs this week' },
    { id: 'skills', name: 'Skill Builder', xp: 75, description: 'Add 3 new skills' },
    { id: 'network', name: 'Networker', xp: 80, description: 'Connect with 5 new people' },
    { id: 'feedback', name: 'Helpful Member', xp: 60, description: 'Provide feedback to 3 others' },
    { id: 'streak', name: 'Consistent', xp: 120, description: 'Maintain a 7-day streak' }
  ]
};

/**
 * Achievement categories and their XP rewards
 */
export const ACHIEVEMENT_CATEGORIES = {
  PROFILE: {
    name: 'Profile',
    icon: '👤',
    achievements: [
      { id: 'profile_complete', xp: 50, title: 'Profile Pioneer' },
      { id: 'skills_master', xp: 75, title: 'Skill Master' },
      { id: 'resume_upload', xp: 30, title: 'Resume Ready' }
    ]
  },
  APPLICATIONS: {
    name: 'Applications',
    icon: '📝',
    achievements: [
      { id: 'first_application', xp: 25, title: 'First Steps' },
      { id: 'application_streak', xp: 50, title: 'Consistent Applicant' },
      { id: 'successful_match', xp: 100, title: 'Perfect Match' }
    ]
  },
  NETWORKING: {
    name: 'Networking',
    icon: '🌐',
    achievements: [
      { id: 'first_connection', xp: 20, title: 'Network Starter' },
      { id: 'guild_member', xp: 40, title: 'Guild Member' },
      { id: 'community_leader', xp: 150, title: 'Community Leader' }
    ]
  },
  LEARNING: {
    name: 'Learning',
    icon: '🎓',
    achievements: [
      { id: 'first_course', xp: 30, title: 'Lifelong Learner' },
      { id: 'certification', xp: 100, title: 'Certified Professional' },
      { id: 'mentor', xp: 200, title: 'Mentor' }
    ]
  }
};
