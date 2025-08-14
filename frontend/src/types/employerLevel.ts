import { LevelReward, FeatureUnlock } from './level';

// Employer-specific level progression (adapted from student progression)
export const EMPLOYER_LEVEL_PROGRESSION: LevelReward[] = [
  { level: 1, totalXPNeeded: 0, xpForThisLevel: 0, title: "New Employer", careerCoins: 0, unlocks: ["daily_dashes", "streaks"] },
  { level: 2, totalXPNeeded: 100, xpForThisLevel: 100, title: "Getting Started", careerCoins: 100, unlocks: ["rewards_store"] },
  { level: 3, totalXPNeeded: 225, xpForThisLevel: 125, title: "Company Builder", careerCoins: 125, unlocks: [] },
  { level: 4, totalXPNeeded: 375, xpForThisLevel: 150, title: "Job Poster", careerCoins: 150, unlocks: ["first_job_badge"] },
  { level: 5, totalXPNeeded: 550, xpForThisLevel: 175, title: "Active Recruiter", careerCoins: 200, unlocks: ["candidate_search"], specialRewards: ["streak_freeze"] },
  { level: 6, totalXPNeeded: 775, xpForThisLevel: 225, title: "Hiring Manager", careerCoins: 225, unlocks: [] },
  { level: 7, totalXPNeeded: 1050, xpForThisLevel: 275, title: "Consistent Recruiter", careerCoins: 250, unlocks: ["recruiter_badge"] },
  { level: 8, totalXPNeeded: 1400, xpForThisLevel: 350, title: "Dedicated Employer", careerCoins: 275, unlocks: ["veteran_tier"] },
  { level: 9, totalXPNeeded: 1800, xpForThisLevel: 400, title: "Network Builder", careerCoins: 300, unlocks: [], specialRewards: ["candidate_boost_token"] },
  { level: 10, totalXPNeeded: 2300, xpForThisLevel: 500, title: "Platform Veteran", careerCoins: 500, unlocks: ["streak_bonds"], specialRewards: ["exclusive_company_flair"] },
  { level: 12, totalXPNeeded: 3500, xpForThisLevel: 1200, title: "Hiring Strategist", careerCoins: 400, unlocks: ["reward_optimizer"] },
  { level: 15, totalXPNeeded: 5500, xpForThisLevel: 2000, title: "Recruitment Specialist", careerCoins: 600, unlocks: [], specialRewards: ["ai_candidate_review_token"] },
  { level: 18, totalXPNeeded: 8000, xpForThisLevel: 2500, title: "Talent Leader", careerCoins: 750, unlocks: [], specialRewards: ["exclusive_recruitment_banner"] },
  { level: 20, totalXPNeeded: 11000, xpForThisLevel: 3000, title: "Hiring Pro", careerCoins: 1000, unlocks: ["badge_prestige"], specialRewards: ["company_spotlight_token"] },
  { level: 25, totalXPNeeded: 17500, xpForThisLevel: 6500, title: "Platform Ambassador", careerCoins: 1500, unlocks: ["meta_achievements"], specialRewards: ["recruitment_spotlight_token"] }
];

// Employer-specific feature unlocks
export const EMPLOYER_FEATURE_UNLOCKS: Record<string, FeatureUnlock> = {
  daily_dashes: {
    id: "daily_dashes",
    name: "Daily Dashes & Streaks",
    description: "Access to daily hiring missions and streak tracking",
    levelRequired: 1,
    icon: "🎯",
    category: "core"
  },
  rewards_store: {
    id: "rewards_store",
    name: "Career Coins & Rewards Store",
    description: "Enables economic loop and in-game store for employers",
    levelRequired: 2,
    icon: "🛒",
    category: "core"
  },
  candidate_search: {
    id: "candidate_search",
    name: "Advanced Candidate Search",
    description: "Unlocks advanced filtering and search capabilities",
    levelRequired: 5,
    icon: "🔍",
    category: "social"
  },
  veteran_tier: {
    id: "veteran_tier",
    name: "Tiered Weekly Epics (Veteran Tier)",
    description: "Adds advanced hiring challenge missions",
    levelRequired: 8,
    icon: "🏆",
    category: "premium"
  },
  streak_bonds: {
    id: "streak_bonds",
    name: "Streak Bonds (Insurance)",
    description: "Allows employers to protect their hiring streak",
    levelRequired: 10,
    icon: "🛡️",
    category: "premium"
  },
  reward_optimizer: {
    id: "reward_optimizer",
    name: "Reward Optimizer (AI)",
    description: "Provides strategic hiring and economic advice",
    levelRequired: 12,
    icon: "🤖",
    category: "premium"
  },
  badge_prestige: {
    id: "badge_prestige",
    name: "Badge Prestige System",
    description: "Enables infinite replayability for advanced employers",
    levelRequired: 20,
    icon: "⭐",
    category: "cosmetic"
  }
};

// Employer-specific achievements
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
  },
  hiring_streak: {
    id: "hiring_streak",
    title: "Hiring Streak",
    description: "Maintained a 7-day hiring streak",
    icon: "🔥",
    xpReward: 50,
    category: 'employer'
  },
  multiple_hires: {
    id: "multiple_hires",
    title: "Multiple Hires",
    description: "Hired 5+ students",
    icon: "👥",
    xpReward: 150,
    category: 'employer'
  },
  company_growth: {
    id: "company_growth",
    title: "Company Growth",
    description: "Posted 10+ jobs",
    icon: "📈",
    xpReward: 200,
    category: 'employer'
  }
};

// Employer-specific XP values
export const EMPLOYER_XP_VALUES = {
  COMPLETE_COMPANY_PROFILE: 75,
  POST_JOB: 40,
  HIRE_STUDENT: 100,
  DAILY_LOGIN: 10,
  COMPLETE_HIRING_MISSION: 25,
  REVIEW_APPLICATION: 15,
  INTERVIEW_CANDIDATE: 30,
  PROVIDE_FEEDBACK: 20,
  MAINTAIN_STREAK: 5,
  REFER_OTHER_EMPLOYER: 50,
  COMPLETE_ONBOARDING: 100,
  FIRST_JOB_POST: 40,
  FIRST_HIRE: 100,
  HIRING_STREAK_7_DAYS: 50,
  HIRING_STREAK_30_DAYS: 200,
  MULTIPLE_HIRES_5: 150,
  MULTIPLE_HIRES_10: 300,
  COMPANY_GROWTH_10_JOBS: 200,
  COMPANY_GROWTH_25_JOBS: 500,
  PLATFORM_AMBASSADOR: 1000
};
