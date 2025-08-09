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
 * Predefined achievements
 */
export const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: "profile_complete",
    title: "Profile Complete",
    description: "Completed your profile with all required details.",
    icon: "📝",
  },
  {
    id: "first_project",
    title: "First Project",
    description: "Successfully applied for your first project.",
    icon: "🚀",
  },
  {
    id: "project_master",
    title: "Project Master",
    description: "Completed 5 projects successfully.",
    icon: "🏆",
  },
  {
    id: "skill_upgraded",
    title: "Skill Upgraded",
    description: "Learned a new skill and added it to your profile.",
    icon: "📚",
  },
  {
    id: "positive_feedback",
    title: "Shining Star",
    description: "Received positive feedback from an employer.",
    icon: "⭐",
  },
  {
    id: "employer_first_post",
    title: "First Job Post",
    description: "Posted your first project as an employer.",
    icon: "📢",
  },
];
