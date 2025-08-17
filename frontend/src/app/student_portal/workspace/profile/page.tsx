"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Award, 
  Code, 
  BookOpen, 
  Info, 
  CheckCircle,
  Eye,
  Save,
  X,
  Star,
  Clock,
  GraduationCap,
  Briefcase,
  Languages,
  DollarSign,
  ExternalLink,
  Plus,
  Trash2,
  ChevronLeft,
  MessageCircle,
  Calendar,
  Target,
  Trophy,
  Zap,
  School,
  CalendarDays
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useLevel } from "@/hooks/useLevel";
import Link from "next/link";
import EditProfileModal from "./EditProfileModal";
import EducationSection from "./sections/EducationSection";
import CareerGoalsSection from "./sections/CareerGoalsSection";

// Extended user data structure for student profile
interface StudentProfileData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  profilePicture: string;
  
  // School Info (Hong Kong focused)
  school: string;
  major: string;
  yearOfStudy: string;
  
  // Education Details
  education: {
    university: string;
    major: string;
    yearOfStudy: string;
    graduationDate: string;
    gpa: string;
    relevantCoursework: string[];
  };
  
  // Gamification
  level: number;
  xp: number;
  careerCoins: number;
  
  // Availability & Micro-Internships
  availability: {
    preferredStartDate: string;
    availableDates: string[];
    unavailableDates: string[];
    flexibleTiming: boolean;
  };
  
  // Skills & Interests (for job matching)
  skills: Array<{
    skill: string;
    category: string; // e.g., "software", "design", "marketing"
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
    xpValue: number;
  }>;
  
  // Projects & Experience (student-focused)
  projects: Array<{
    title: string;
    description: string;
    type: 'academic' | 'competition' | 'volunteer' | 'personal' | 'research';
    duration: string;
    xpEarned: number;
    skills: string[];
  }>;
  
  // Career Goals (for job recommendations)
  careerGoals: {
    statement: string;
    interests: string[];
    targetIndustries: string[];
    availability: string[];
  };
  
  // Links
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  
  // Profile Completion - now computed dynamically
}

// Mock student data with platform-specific features
const getStudentProfileData = (): StudentProfileData => ({
  firstName: "Sarah",
  lastName: "Wilson",
  email: "sarah.wilson@email.com",
  phone: "+852 5555 1234",
  bio: "Passionate computer science student at HKU, interested in software development and AI. Looking for micro-internships to gain real-world experience.",
  profilePicture: "/images/user/user-01.png",
  
  // School Info (Hong Kong focused)
  school: "The University of Hong Kong",
  major: "Computer Science", 
  yearOfStudy: "Year 3",
  
  // Education Details
  education: {
    university: "The University of Hong Kong",
    major: "computer_science",
    yearOfStudy: "year_3",
    graduationDate: "2025-06",
    gpa: "3.75",
    relevantCoursework: [
      "Data Structures and Algorithms",
      "Machine Learning Fundamentals", 
      "Web Development",
      "Database Systems",
      "Software Engineering"
    ]
  },
  
  // Gamification
  level: 8,
  xp: 2450,
  careerCoins: 1250,
  
  // Availability & Micro-Internships
  availability: {
    preferredStartDate: "2024-01-15",
    availableDates: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-22", "2024-01-23"],
    unavailableDates: ["2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"],
    flexibleTiming: true
  },
  
  // Skills & Interests (for job matching)
  skills: [
    { skill: "Python", category: "software", proficiency: "Advanced", xpValue: 150 },
    { skill: "React", category: "software", proficiency: "Intermediate", xpValue: 100 },
    { skill: "UI/UX Design", category: "design", proficiency: "Beginner", xpValue: 50 },
    { skill: "Data Analysis", category: "analytics", proficiency: "Intermediate", xpValue: 75 },
    { skill: "Project Management", category: "business", proficiency: "Beginner", xpValue: 25 }
  ],
  
  // Projects & Experience (student-focused)
  projects: [
    {
      title: "AI Chatbot for Student Services",
      description: "Developed a Python-based chatbot to help students navigate university services",
      type: "academic",
      duration: "3 months",
      xpEarned: 200,
      skills: ["Python", "NLP", "Machine Learning"]
    },
    {
      title: "Hackathon Winner - Sustainability App",
      description: "Won first place in HKU's annual hackathon with a sustainability tracking app",
      type: "competition",
      duration: "48 hours",
      xpEarned: 150,
      skills: ["React", "Mobile Development", "UI/UX Design"]
    },
    {
      title: "Volunteer Web Developer",
      description: "Built website for local NGO helping underprivileged students",
      type: "volunteer",
      duration: "2 months",
      xpEarned: 100,
      skills: ["HTML/CSS", "JavaScript", "WordPress"]
    }
  ],
  
  // Career Goals (for job recommendations)
  careerGoals: {
    statement: "I want to work on meaningful software projects that solve real-world problems, particularly in the areas of education technology and sustainability.",
    interests: ["software_development", "data_science", "web_development", "machine_learning"],
    targetIndustries: ["fintech", "edtech", "healthtech"],
    availability: ["part_time_flexible", "remote_only", "hybrid"]
  },
  
  // Links
  linkedinUrl: "https://linkedin.com/in/sarahwilson",
  portfolioUrl: "https://sarahwilson.dev",
  githubUrl: "https://github.com/sarahwilson",
  
  // Profile Completion - computed dynamically
});

const StudentProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { levelData, gainXP, unlockAchievement } = useLevel();
  
  const [profileData, setProfileData] = useState<StudentProfileData>(getStudentProfileData());
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Handle preview mode toggle
  const handlePreviewToggle = (newMode: boolean) => {
    setIsPreviewMode(newMode);
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isFromRoleSelection, setIsFromRoleSelection] = useState(false);

  // Update handlers for new sections
  const handleEducationUpdate = (educationData: any) => {
    setProfileData(prev => ({
      ...prev,
      education: educationData,
      // Also update the legacy fields for compatibility
      school: educationData.university,
      major: educationData.major,
      yearOfStudy: educationData.yearOfStudy
    }));
  };

  const handleCareerGoalsUpdate = (careerGoalsData: any) => {
    setProfileData(prev => ({
      ...prev,
      careerGoals: {
        statement: careerGoalsData.careerStatement,
        interests: careerGoalsData.interests,
        targetIndustries: careerGoalsData.targetIndustries,
        availability: careerGoalsData.availability
      }
    }));
  };

  // Check if coming from role selection
  useEffect(() => {
    const fromRoleSelection = searchParams.get('fromRoleSelection') === 'true';
    setIsFromRoleSelection(fromRoleSelection);
    
    if (fromRoleSelection) {
      // Initialize with empty profile data for onboarding
      setProfileData({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        phone: "",
        bio: "",
        profilePicture: "",
        school: "",
        major: "",
        yearOfStudy: "",
        education: {
          university: "",
          major: "",
          yearOfStudy: "",
          graduationDate: "",
          gpa: "",
          relevantCoursework: []
        },
        level: 1,
        xp: 0,
        careerCoins: 0,
        availability: {
          preferredStartDate: "",
          availableDates: [],
          unavailableDates: [],
          flexibleTiming: false
        },
        skills: [],
        projects: [],
        careerGoals: {
          statement: "",
          interests: [],
          targetIndustries: [],
          availability: []
        },
        linkedinUrl: "",
        portfolioUrl: "",
        githubUrl: ""
      });
    }
  }, [searchParams, user]);

  // Calculate profile completion - computed value instead of state
  const calculateCompletionPercentage = () => {
    const requiredFields = [
      profileData.firstName, profileData.lastName, profileData.email,
      profileData.bio, profileData.school, profileData.major,
      profileData.yearOfStudy, profileData.skills.length > 0,
      profileData.projects.length > 0, profileData.careerGoals.statement
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setShowEditModal(true);
  };

  const handleSave = (updatedData: any) => {
    setProfileData(prev => ({ ...prev, ...updatedData }));
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 2000);
    
    // Award XP for completing sections
    if (updatedData.skills && updatedData.skills.length > 0) {
      gainXP(50);
    }
    if (updatedData.projects && updatedData.projects.length > 0) {
      gainXP(75);
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 dark:text-purple-400';
    if (level >= 7) return 'text-blue-600 dark:text-blue-400';
    if (level >= 4) return 'text-green-600 dark:text-green-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getLevelBg = (level: number) => {
    if (level >= 10) return 'bg-purple-100 dark:bg-purple-900/20';
    if (level >= 7) return 'bg-blue-100 dark:bg-blue-900/20';
    if (level >= 4) return 'bg-green-100 dark:bg-green-900/20';
    return 'bg-yellow-100 dark:bg-yellow-900/20';
  };

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'software': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'design': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'analytics': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'business': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'competition': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'volunteer': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'personal': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'research': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Student Profile Edit Mode
  const StudentEditMode = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gamification */}
        <div className="mb-8">
          {isFromRoleSelection && (
            <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Complete Your Student Profile
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Set up your profile to discover micro-internships and start earning XP and Career Coins!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isFromRoleSelection ? "Complete Your Profile" : "My Student Profile"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isFromRoleSelection 
                  ? "Let's get you set up for micro-internships" 
                  : "Manage your profile and track your progress"
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Profile Completion */}
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completionPercentage}% Complete
                </span>
              </div>
              
              {/* Preview Button */}
              <button
                onClick={() => handlePreviewToggle(true)}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              

            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Header Section with Gamification */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
                <button
                  onClick={() => handleEdit('basic')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="flex items-start space-x-6">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Name and School Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    {/* Level Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBg(profileData.level)} ${getLevelColor(profileData.level)}`}>
                      Level {profileData.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-1" />
                      {profileData.school || 'School not specified'}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {profileData.major || 'Major not specified'}
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {profileData.yearOfStudy || 'Year not specified'}
                    </div>
                  </div>
                  
                  {/* XP and Career Coins */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">{profileData.xp} XP</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">{profileData.careerCoins} CC</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <p className="text-gray-900 dark:text-white">
                  {profileData.bio || 'No bio added yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Availability & Preferred Start Date
                </h2>
                <button
                  onClick={() => handleEdit('availability')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Start Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.availability.preferredStartDate ? 
                      new Date(profileData.availability.preferredStartDate).toLocaleDateString() : 
                      'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Flexible Timing
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.availability.flexibleTiming ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {/* Calendar Preview */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Dates
                </label>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {profileData.availability.availableDates.length > 0 ? 
                    `${profileData.availability.availableDates.length} dates selected` : 
                    'No dates selected'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Interests Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Skills & Interests
                </h2>
                <button
                  onClick={() => handleEdit('skills')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.proficiency}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                      {skill.xpValue} XP
                    </div>
                  </div>
                ))}
                
                {profileData.skills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No skills added yet. Add your skills to get matched with relevant micro-internships!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <EducationSection
            data={profileData.education}
            onUpdate={handleEducationUpdate}
            isPreviewMode={isPreviewMode}
          />

          {/* Projects & Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Projects & Experience
                </h2>
                <button
                  onClick={() => handleEdit('projects')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                {profileData.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectTypeColor(project.type)}`}>
                            {project.type}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {project.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                        {project.xpEarned} XP
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                
                {profileData.projects.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No projects added yet. Add your academic projects, competitions, and volunteer work!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Career Goals Section */}
          <CareerGoalsSection
            data={{
              interests: profileData.careerGoals.interests,
              targetIndustries: profileData.careerGoals.targetIndustries,
              careerStatement: profileData.careerGoals.statement,
              availability: profileData.careerGoals.availability
            }}
            onUpdate={handleCareerGoalsUpdate}
            isPreviewMode={isPreviewMode}
          />

          {/* Contact & Links Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Contact & Links
                </h2>
                <button
                  onClick={() => handleEdit('contact')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.linkedinUrl || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.portfolioUrl || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Save Confirmation Modal
  const SaveModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${showSaveModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Updated
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your profile has been successfully saved.
        </p>
      </div>
    </div>
  );

  // Preview Mode Component
  const StudentPreviewMode = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Preview Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Employer View
                </h1>
              </div>
              <button
                onClick={() => handlePreviewToggle(false)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Back to Edit Mode
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              This is how employers will see your profile when you apply for micro-internships.
            </p>
          </div>
        </div>

        {/* Profile Content in Preview Mode */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Name and School Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBg(profileData.level)} ${getLevelColor(profileData.level)}`}>
                      Level {profileData.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-1" />
                      {profileData.school || 'School not specified'}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {profileData.major || 'Major not specified'}
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {profileData.yearOfStudy || 'Year not specified'}
                    </div>
                  </div>
                  
                  {/* XP and Career Coins */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">{profileData.xp} XP</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">{profileData.careerCoins} CC</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              {profileData.bio && (
                <div className="mt-6">
                  <p className="text-gray-900 dark:text-white">{profileData.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Education Section in Preview */}
          <EducationSection
            data={profileData.education}
            onUpdate={handleEducationUpdate}
            isPreviewMode={true}
          />

          {/* Career Goals Section in Preview */}
          <CareerGoalsSection
            data={{
              interests: profileData.careerGoals.interests,
              targetIndustries: profileData.careerGoals.targetIndustries,
              careerStatement: profileData.careerGoals.statement,
              availability: profileData.careerGoals.availability
            }}
            onUpdate={handleCareerGoalsUpdate}
            isPreviewMode={true}
          />

          {/* Skills Section */}
          {profileData.skills.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Skills & Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{skill.skill}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          skill.proficiency === 'Advanced' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          skill.proficiency === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}>
                          {skill.proficiency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{skill.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {profileData.projects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Projects & Experience
                </h2>
                <div className="space-y-4">
                  {profileData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.type === 'academic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                          project.type === 'competition' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                          project.type === 'volunteer' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                        }`}>
                          {project.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{project.duration}</span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                          {project.xpEarned} XP
                        </span>
                      </div>
                      {project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact & Links Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact & Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.email}
                  </p>
                </div>
                {profileData.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {profileData.phone}
                    </p>
                  </div>
                )}
                {profileData.linkedinUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <a 
                      href={profileData.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {profileData.linkedinUrl}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {profileData.portfolioUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portfolio
                    </label>
                    <a 
                      href={profileData.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {profileData.portfolioUrl}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  
  return (
    <>
      {isPreviewMode ? <StudentPreviewMode /> : <StudentEditMode />}
      <SaveModal />
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        section={editingSection || ''}
        currentData={profileData}
      />
    </>
  );
};

export default StudentProfilePage;
