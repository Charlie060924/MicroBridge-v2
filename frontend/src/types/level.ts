export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon?: string; // optional emoji/icon
  xpReward?: number; // XP awarded when unlocked
  category?: 'student' | 'employer' | 'general';
};

export type LevelData = {
  level: number;
  xp: number;
  xpToNext: number;
  achievements: Achievement[];
  totalXP: number; // Track total XP earned
  careerCoins: number; // Career Coins (CC) balance
  unlockedFeatures: string[]; // List of unlocked feature IDs
  streakDays: number; // Current streak count
  totalStreakDays: number; // Total streak days ever achieved
  prestigeLevel: number; // Prestige level for badge reset system
  metaAchievements: string[]; // Meta-achievement IDs
};

export type LevelReward = {
  level: number;
  totalXPNeeded: number;
  xpForThisLevel: number;
  title: string;
  careerCoins: number;
  unlocks: string[];
  specialRewards?: string[];
};

export type FeatureUnlock = {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  icon: string;
  category: 'core' | 'social' | 'premium' | 'cosmetic';
};

// Level progression table (Levels 1–25) exactly as specified
export const LEVEL_PROGRESSION: LevelReward[] = [
  { level: 1, totalXPNeeded: 0, xpForThisLevel: 0, title: "Newcomer", careerCoins: 0, unlocks: ["daily_dashes", "streaks"] },
  { level: 2, totalXPNeeded: 100, xpForThisLevel: 100, title: "Getting Started", careerCoins: 100, unlocks: ["rewards_store"] },
  { level: 3, totalXPNeeded: 225, xpForThisLevel: 125, title: "Profile Builder", careerCoins: 125, unlocks: [] },
  { level: 4, totalXPNeeded: 375, xpForThisLevel: 150, title: "Applicant", careerCoins: 150, unlocks: ["first_step_badge"] },
  { level: 5, totalXPNeeded: 550, xpForThisLevel: 175, title: "Collaborator", careerCoins: 200, unlocks: ["job_search_guilds"], specialRewards: ["streak_freeze"] },
  { level: 6, totalXPNeeded: 775, xpForThisLevel: 225, title: "Rising Talent", careerCoins: 225, unlocks: [] },
  { level: 7, totalXPNeeded: 1050, xpForThisLevel: 275, title: "Consistent Contender", careerCoins: 250, unlocks: ["streaker_badge"] },
  { level: 8, totalXPNeeded: 1400, xpForThisLevel: 350, title: "Dedicated Job Seeker", careerCoins: 275, unlocks: ["veteran_tier"] },
  { level: 9, totalXPNeeded: 1800, xpForThisLevel: 400, title: "Networker", careerCoins: 300, unlocks: [], specialRewards: ["application_boost_token"] },
  { level: 10, totalXPNeeded: 2300, xpForThisLevel: 500, title: "Platform Veteran", careerCoins: 500, unlocks: ["streak_bonds"], specialRewards: ["exclusive_profile_flair"] },
  { level: 12, totalXPNeeded: 3500, xpForThisLevel: 1200, title: "Strategist", careerCoins: 400, unlocks: ["reward_optimizer"] },
  { level: 15, totalXPNeeded: 5500, xpForThisLevel: 2000, title: "Career Specialist", careerCoins: 600, unlocks: [], specialRewards: ["ai_resume_review_token"] },
  { level: 18, totalXPNeeded: 8000, xpForThisLevel: 2500, title: "Guild Leader", careerCoins: 750, unlocks: [], specialRewards: ["exclusive_guild_banner"] },
  { level: 20, totalXPNeeded: 11000, xpForThisLevel: 3000, title: "Career Pro", careerCoins: 1000, unlocks: ["badge_prestige"], specialRewards: ["skill_certification_voucher"] },
  { level: 25, totalXPNeeded: 17500, xpForThisLevel: 6500, title: "Platform Ambassador", careerCoins: 1500, unlocks: ["meta_achievements"], specialRewards: ["resume_spotlight_token"] }
];

// Feature unlocks exactly as specified
export const FEATURE_UNLOCKS: Record<string, FeatureUnlock> = {
  daily_dashes: {
    id: "daily_dashes",
    name: "Daily Dashes & Streaks",
    description: "Access to daily missions and streak tracking",
    levelRequired: 1,
    icon: "🎯",
    category: "core"
  },
  rewards_store: {
    id: "rewards_store",
    name: "Career Coins & Rewards Store",
    description: "Enables economic loop and in-game store",
    levelRequired: 2,
    icon: "🛒",
    category: "core"
  },
  job_search_guilds: {
    id: "job_search_guilds",
    name: "Job Search Guilds",
    description: "Unlocks core social features",
    levelRequired: 5,
    icon: "👥",
    category: "social"
  },
  veteran_tier: {
    id: "veteran_tier",
    name: "Tiered Weekly Epics (Veteran Tier)",
    description: "Adds advanced challenge missions",
    levelRequired: 8,
    icon: "🏆",
    category: "premium"
  },
  streak_bonds: {
    id: "streak_bonds",
    name: "Streak Bonds (Insurance)",
    description: "Allows users to protect their streak",
    levelRequired: 10,
    icon: "🛡️",
    category: "premium"
  },
  reward_optimizer: {
    id: "reward_optimizer",
    name: "Reward Optimizer (AI)",
    description: "Provides strategic gameplay/economic advice",
    levelRequired: 12,
    icon: "🤖",
    category: "premium"
  },
  badge_prestige: {
    id: "badge_prestige",
    name: "Badge Prestige System",
    description: "Enables infinite replayability for advanced users",
    levelRequired: 20,
    icon: "⭐",
    category: "cosmetic"
  }
};

// Achievement definitions
export const STUDENT_ACHIEVEMENTS = {
  profile_complete: {
    id: "profile_complete",
    title: "Profile Pioneer",
    description: "Completed your student profile",
    icon: "🎓",
    xpReward: 50,
    category: 'student'
  },
  first_application: {
    id: "first_application", 
    title: "First Steps",
    description: "Applied for your first job",
    icon: "🚀",
    xpReward: 25,
    category: 'student'
  },
  skill_master: {
    id: "skill_master",
    title: "Skill Master",
    description: "Added 3+ skills to your profile",
    icon: "⚡",
    xpReward: 30,
    category: 'student'
  },
  level_5: {
    id: "level_5",
    title: "Rising Star",
    description: "Reached level 5",
    icon: "⭐",
    xpReward: 100,
    category: 'student'
  },
  first_step_badge: {
    id: "first_step_badge",
    title: "First Step",
    description: "Unlocked at level 4",
    icon: "👣",
    xpReward: 0,
    category: 'student'
  },
  streaker_badge: {
    id: "streaker_badge",
    title: "Streaker",
    description: "Achieved 7-day streak",
    icon: "🔥",
    xpReward: 0,
    category: 'student'
  }
};

export const EMPLOYER_ACHIEVEMENTS = {
  company_profile: {
    id: "company_profile",
    title: "Company Creator", 
    description: "Set up your company profile",
    icon: "🏢",
    xpReward: 75,
    category: 'employer'
  },
  first_job_post: {
    id: "first_job_post",
    title: "Job Poster",
    description: "Posted your first job",
    icon: "📝",
    xpReward: 40,
    category: 'employer'
  },
  first_hire: {
    id: "first_hire",
    title: "First Hire",
    description: "Hired your first student",
    icon: "🤝",
    xpReward: 100,
    category: 'employer'
  }
};

// Meta-achievements for prestige system
export const META_ACHIEVEMENTS = {
  streak_365: {
    id: "streak_365",
    title: "Year of Dedication",
    description: "Maintained a 365-day streak",
    icon: "📅",
    xpReward: 1000,
    category: 'general'
  },
  cc_spender: {
    id: "cc_spender",
    title: "Big Spender",
    description: "Spent 5,000 Career Coins",
    icon: "💰",
    xpReward: 500,
    category: 'general'
  },
  referrer: {
    id: "referrer",
    title: "Network Builder",
    description: "Referred 10 friends who reached level 10",
    icon: "🌐",
    xpReward: 750,
    category: 'general'
  }
};
