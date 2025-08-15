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
  MessageCircle
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useLevel } from "@/hooks/useLevel";
import Link from "next/link";
import EditProfileModal from "./EditProfileModal";

// Extended user data structure for profile
interface ExtendedUserData {
  // Basic Info
  firstName: string;
  lastName: string;
  preferredName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  profilePicture: string;
  
  // Education
  educationLevel: string;
  major: string;
  university: string;
  degree: string;
  graduationDate: string;
  
  // Career
  careerGoal: string;
  industry: string;
  headline: string;
  careerGoals: string[];
  
  // Skills
  skills: Array<{ skill: string; proficiency: number; level: string }>;
  
  // Experience
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bulletPoints: string[];
  }>;
  
  // Availability
  availability: string;
  projectDuration: string;
  
  // Compensation
  paymentType: string;
  salaryRange?: string;
  customAmount?: string;
  flexibleNegotiation: boolean;
  currency: string;
  expectedSalary: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Portfolio & Resume
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  resume: {
    name: string;
    url: string;
    size: number;
    type: string;
  } | null;
  
  // Languages
  languages: string[];
  
  // Match Score (for preview)
  matchScore: number;
}

// Mock extended user data
const getExtendedUserData = (): ExtendedUserData => ({
  firstName: "Sarah",
  lastName: "Wilson",
  preferredName: "Sarah",
  username: "sarahwilson",
  email: "sarah.wilson@email.com",
  phone: "+1 (415) 555-0123",
  bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. I specialize in React ecosystem and modern JavaScript frameworks. I love creating intuitive user experiences and mentoring junior developers.",
  location: "San Francisco, CA",
  profilePicture: "/images/user/user-01.png",
  educationLevel: "Bachelor's",
  major: "Computer Science",
  university: "Stanford University",
  degree: "Bachelor of Science in Computer Science",
  graduationDate: "2019",
  careerGoal: "Senior Developer",
  industry: "Technology",
  headline: "Senior Frontend Developer",
  skills: [
    { skill: "React", proficiency: 95, level: "Expert" },
    { skill: "TypeScript", proficiency: 90, level: "Advanced" },
    { skill: "Next.js", proficiency: 85, level: "Advanced" },
    { skill: "Tailwind CSS", proficiency: 88, level: "Advanced" },
    { skill: "JavaScript", proficiency: 95, level: "Expert" },
    { skill: "HTML/CSS", proficiency: 92, level: "Expert" }
  ],
  careerGoals: ["Lead a development team", "Contribute to open source", "Build scalable applications"],
  careerGoals: ["Lead a development team", "Contribute to open source", "Build scalable applications"],
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      duration: "2021 - Present",
      bulletPoints: [
        "Led development of responsive web applications using React and TypeScript",
        "Improved application performance by 40% through code optimization",
        "Mentored 3 junior developers and conducted code reviews"
      ]
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      duration: "2019 - 2021",
      bulletPoints: [
        "Built user interfaces for mobile and web applications",
        "Collaborated with UX designers to implement pixel-perfect designs",
        "Participated in agile development processes"
      ]
    }
  ],
  availability: "Available immediately",
  projectDuration: "3-6 months",
  paymentType: "Salary",
  salaryRange: "120000-150000",
  customAmount: "",
  flexibleNegotiation: true,
  currency: "USD",
  expectedSalary: {
    min: 120000,
    max: 150000,
    currency: "USD"
  },
  portfolioUrl: "https://sarahwilson.dev",
  linkedinUrl: "https://linkedin.com/in/sarahwilson",
  githubUrl: "https://github.com/sarahwilson",
  resume: {
    name: "Sarah_Wilson_Resume.pdf",
    url: "/resumes/Sarah_Wilson_Resume.pdf",
    size: 245760,
    type: "application/pdf"
  },
  languages: ["English", "Spanish"],
  matchScore: 95
});

const StudentProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { level } = useLevel();
  
  const [profileData, setProfileData] = useState<ExtendedUserData>(getExtendedUserData());
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate profile completeness
  useEffect(() => {
    const requiredFields = [
      profileData.firstName, profileData.lastName, profileData.email,
      profileData.bio, profileData.location, profileData.headline,
      profileData.degree, profileData.university, profileData.graduationDate,
      profileData.careerGoal, profileData.industry,
      profileData.availability, profileData.projectDuration, profileData.paymentType,
      profileData.skills.length > 0, profileData.experience.length > 0,
      profileData.careerGoals.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    const completeness = Math.round((completedFields / requiredFields.length) * 100);
    setProfileCompleteness(completeness);
  }, [profileData]);

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setShowEditModal(true);
  };

  const handleSave = (updatedData: any) => {
    setProfileData(prev => ({ ...prev, ...updatedData }));
    setHasUnsavedChanges(false);
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 2000);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setEditingSection(null);
    setHasUnsavedChanges(false);
  };

  const handleFieldChange = (field: keyof ExtendedUserData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Advanced': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Beginner': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  // Profile Preview Component (mirrors Employer Candidate View)
  const ProfilePreview = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Edit Mode
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Preview Mode - How employers see your profile
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {profileData.firstName} {profileData.lastName}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                        {profileData.headline}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {profileData.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {profileData.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      disabled
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                      title="Coming Soon"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>

                {/* Match Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Match Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreBg(profileData.matchScore)} ${getMatchScoreColor(profileData.matchScore)}`}>
                    {profileData.matchScore}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About Me
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Skills & Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exp.title}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.duration}
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {exp.bulletPoints.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Education
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profileData.degree}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {profileData.university}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Graduated {profileData.graduationDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Goals Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Career Goals
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profileData.careerGoal}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {profileData.industry}
                    </p>
                  </div>
                  {profileData.careerGoals && profileData.careerGoals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Career Objectives
                      </h4>
                      <ul className="space-y-2">
                        {profileData.careerGoals.map((goal, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Availability & Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Availability
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profileData.availability}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Project Duration
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profileData.projectDuration}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Payment Type
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profileData.paymentType}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Expected Salary
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatSalary(profileData.expectedSalary)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        {profileData.phone}
                      </div>
                    </div>
                  </div>

                  {/* Expected Salary */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Expected Salary
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatSalary(profileData.expectedSalary)}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Languages
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Languages className="h-4 w-4 mr-2" />
                      {profileData.languages.join(', ')}
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Experience
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {profileData.experience.length} position{profileData.experience.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Portfolio & Links
                </h3>
                <div className="space-y-3">
                  {profileData.portfolioUrl && (
                    <a 
                      href={profileData.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Portfolio
                    </a>
                  )}
                  {profileData.linkedinUrl && (
                    <a 
                      href={profileData.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {profileData.githubUrl && (
                    <a 
                      href={profileData.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Edit Mode Component
  const EditMode = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your professional profile and showcase your skills
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Profile Completeness */}
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {profileCompleteness}% Complete
                </span>
              </div>
              
              {/* Preview Button */}
              <button
                onClick={() => setIsPreviewMode(true)}
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
          {/* Basic Information Section */}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.firstName} {profileData.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Headline
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.headline}
                  </p>
                </div>
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
                    {profileData.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.availability}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <p className="text-gray-900 dark:text-white">
                  {profileData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Skills & Expertise
                </h2>
                <button
                  onClick={() => handleEdit('skills')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {skill.skill}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Work Experience
                </h2>
                <button
                  onClick={() => handleEdit('experience')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.duration}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {exp.bulletPoints.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Education
                </h2>
                <button
                  onClick={() => handleEdit('education')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profileData.degree}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {profileData.university}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Graduated {profileData.graduationDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Goals Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Career Goals
                </h2>
                <button
                  onClick={() => handleEdit('careerGoals')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Career Goal
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.careerGoal || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.industry || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Career Objectives
                  </label>
                  <div className="space-y-2">
                    {profileData.careerGoals && profileData.careerGoals.length > 0 ? (
                      profileData.careerGoals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-gray-900 dark:text-white">{goal}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No career objectives specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Availability & Preferences
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
                    Availability
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.availability || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Duration
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.projectDuration || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Type
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.paymentType || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Salary
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.expectedSalary ? formatSalary(profileData.expectedSalary) : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio & Links Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Portfolio & Links
                </h2>
                <button
                  onClick={() => handleEdit('portfolio')}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio URL
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.portfolioUrl || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.linkedinUrl || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.githubUrl || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profileData.resume?.name || 'Not uploaded'}
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

  return (
    <>
      {isPreviewMode ? <ProfilePreview /> : <EditMode />}
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
