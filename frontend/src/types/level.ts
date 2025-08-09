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
