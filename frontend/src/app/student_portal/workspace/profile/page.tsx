"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { User, Mail, Phone, MapPin, Edit2, Award, Code, BookOpen, Info, CheckCircle } from "lucide-react";
import SkillsAndGoals from "./SkillsAndGoals";
import PortfolioSection from "./PortfolioSection";
import ResumeSection from "./ResumeSection";
import EducationSection from "./EducationSection";
import CareerGoalsSection from "./CareerGoalsSection";
import CareerGoalsProfileSection from "./CareerGoalsProfileSection";
import AvailabilitySection from "./AvailabilitySection";
import CompensationSection from "./CompensationSection";
import { useUser } from "@/hooks/useUser";
import { useLevel } from "@/hooks/useLevel";
import {
  educationLevels,
  academicMajors,
  careerGoals,
  industries,
  technicalSkills,
  proficiencyLevels,
  availabilityOptions,
  durationOptions,
  paymentTypes,
  projectSalaryRanges,
  currencies,
} from "@/components/dashboard/Students/Student_Info_Constant";

// Extended user data structure for profile with onboarding fields
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
  
  // Education
  educationLevel: string;
  major: string;
  university: string;
  degree: string;
  graduationDate: string;
  
  // Career
  careerGoal: string;
  industry: string;
  
  // Skills
  skills: Array<{ skill: string; proficiency: number }>;
  careerGoals: string[];
  
  // Availability
  availability: string;
  projectDuration: string;
  
  // Compensation
  paymentType: string;
  salaryRange?: string;
  customAmount?: string;
  flexibleNegotiation: boolean;
  currency: string;
  
  // Portfolio & Resume
  portfolioUrl: string;
  resume: {
    name: string;
    url: string;
    size: number;
    type: string;
  } | null;
}

// Mock extended user data - in real app this would come from API
const getExtendedUserData = (): ExtendedUserData => ({
  firstName: "",
  lastName: "",
  preferredName: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
  location: "",
  educationLevel: "",
  major: "",
  university: "",
  degree: "",
  graduationDate: "",
  careerGoal: "",
  industry: "",
  skills: [],
  careerGoals: [],
  availability: "",
  projectDuration: "",
  paymentType: "",
  salaryRange: undefined,
  customAmount: undefined,
  flexibleNegotiation: false,
  currency: "HKD",
  portfolioUrl: "",
  resume: null,
});

// Onboarding steps configuration
const onboardingSteps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: ["firstName", "lastName", "preferredName", "email", "phone", "location", "bio"],
    icon: User
  },
  {
    id: 2,
    title: "Education",
    description: "Your academic background",
    fields: ["educationLevel", "major", "university", "degree"],
    icon: BookOpen
  },
  {
    id: 3,
    title: "Career Goals",
    description: "What you want to achieve",
    fields: ["careerGoal", "industry"],
    icon: Award
  },
  {
    id: 4,
    title: "Skills",
    description: "Your technical expertise",
    fields: ["skills"],
    icon: Code
  },
  {
    id: 5,
    title: "Availability",
    description: "When you can work",
    fields: ["availability", "projectDuration"],
    icon: MapPin
  },
  {
    id: 6,
    title: "Compensation",
    description: "Your payment preferences",
    fields: ["paymentType", "salaryRange", "customAmount"],
    icon: Award
  },
  {
    id: 7,
    title: "Resume",
    description: "Upload your resume",
    fields: ["resume"],
    icon: Edit2
  }
];

function ProfileHeader({ isOnboarding }: { isOnboarding: boolean }) {
  return (
    <div className="mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isOnboarding ? "Complete Your Profile" : "Profile"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isOnboarding 
            ? "Let's get you set up with your student profile" 
            : "Manage your personal information and career preferences"
          }
        </p>
      </div>
    </div>
  );
}

// Onboarding Progress Component
function OnboardingProgress({ currentStep, completionPercentage }: { currentStep: number; completionPercentage: number }) {
  return (
    <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Complete Your Profile
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Please complete your profile to start using the student portal. This information helps employers understand your skills and match you with relevant opportunities.
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {completionPercentage}% complete ({Math.round((completionPercentage / 100) * 7)} of 7 required sections)
          </p>
          
          {/* Step Indicators */}
          <div className="flex gap-2 mt-4">
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  step.id < currentStep
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Personal Info Card with Onboarding Fields
function PersonalInfoCard({ 
  userData, 
  onUpdate, 
  isOnboarding, 
  currentStep, 
  errors 
}: { 
  userData: ExtendedUserData; 
  onUpdate: (data: Partial<ExtendedUserData>) => void;
  isOnboarding: boolean;
  currentStep: number;
  errors: Record<string, string>;
}) {
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    preferredName: userData.preferredName,
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    location: userData.location,
    university: userData.university,
    degree: userData.degree,
    major: userData.major,
    educationLevel: userData.educationLevel,
    careerGoal: userData.careerGoal,
    industry: userData.industry,
    availability: userData.availability,
    projectDuration: userData.projectDuration,
    paymentType: userData.paymentType,
    salaryRange: userData.salaryRange,
    customAmount: userData.customAmount,
    flexibleNegotiation: userData.flexibleNegotiation,
    currency: userData.currency
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      preferredName: userData.preferredName,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      location: userData.location,
      university: userData.university,
      degree: userData.degree,
      major: userData.major,
      educationLevel: userData.educationLevel,
      careerGoal: userData.careerGoal,
      industry: userData.industry,
      availability: userData.availability,
      projectDuration: userData.projectDuration,
      paymentType: userData.paymentType,
      salaryRange: userData.salaryRange,
      customAmount: userData.customAmount,
      flexibleNegotiation: userData.flexibleNegotiation,
      currency: userData.currency
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      preferredName: userData.preferredName,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      location: userData.location,
      university: userData.university,
      degree: userData.degree,
      major: userData.major,
      educationLevel: userData.educationLevel,
      careerGoal: userData.careerGoal,
      industry: userData.industry,
      availability: userData.availability,
      projectDuration: userData.projectDuration,
      paymentType: userData.paymentType,
      salaryRange: userData.salaryRange,
      customAmount: userData.customAmount,
      flexibleNegotiation: userData.flexibleNegotiation,
      currency: userData.currency
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding) {
      onUpdate({ [field]: value });
    }
  };

  const isCurrentStep = isOnboarding && currentStep === 1;
  const isCompleted = !isOnboarding || currentStep > 1;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border transition-all duration-300 ${
      isCurrentStep 
        ? "border-blue-300 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20" 
        : "border-gray-200 dark:border-gray-800"
    }`}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your basic profile information and contact details
              </p>
            </div>
          </div>
          {!isOnboarding && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {/* User Avatar and Name Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? formData.firstName + ' ' + formData.lastName : userData.firstName + ' ' + userData.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEditing ? formData.bio : userData.bio}
            </p>
          </div>
        </div>

        {(isEditing || isOnboarding) ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Name *
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange('preferredName', e.target.value)}
                  placeholder="What should we call you?"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.preferredName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.preferredName && <p className="text-sm text-red-600 mt-1">{errors.preferredName}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  This will be part of your username: {formData.preferredName.toLowerCase()} {formData.lastName.toLowerCase()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            {!isOnboarding && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">University</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.university}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Degree</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.degree}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Major</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.major}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, error } = useUser();
  const { gainXP, unlockAchievement } = useLevel();
  const searchParams = useSearchParams();
  const isFromRoleSelection = searchParams.get('fromRoleSelection') === 'true';
  
  const [userData, setUserData] = useState<ExtendedUserData>(getExtendedUserData());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug logging
  console.log("ProfilePage render - isFromRoleSelection:", isFromRoleSelection);
  console.log("ProfilePage render - currentStep:", currentStep);
  console.log("ProfilePage render - userData:", userData);

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStep - 1) / 7 * 100);

  // Validate current step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    console.log(`Validating step ${step} with userData:`, userData);
    
    switch (step) {
      case 1:
        if (!userData.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!userData.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!userData.preferredName?.trim()) newErrors.preferredName = "Preferred name is required";
        if (!userData.email?.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
          newErrors.email = "Invalid email format";
        }
        break;
      case 2:
        console.log("Validating education level:", userData.educationLevel);
        console.log("Validating major:", userData.major);
        if (!userData.educationLevel) newErrors.educationLevel = "Education level is required";
        if (!userData.major) newErrors.major = "Major is required";
        break;
      case 3:
        if (!userData.careerGoal) newErrors.careerGoal = "Career goal is required";
        if (!userData.industry) newErrors.industry = "Industry is required";
        break;
      case 4:
        if (userData.skills.length === 0) newErrors.skills = "At least one skill is required";
        break;
      case 5:
        if (!userData.availability) newErrors.availability = "Availability is required";
        if (!userData.projectDuration) newErrors.projectDuration = "Project duration is required";
        break;
      case 6:
        if (!userData.paymentType) newErrors.paymentType = "Payment type is required";
        if (userData.paymentType === "project_based" && !userData.salaryRange) {
          newErrors.salaryRange = "Salary range is required";
        }
        if (userData.salaryRange === "custom" && !userData.customAmount) {
          newErrors.customAmount = "Custom amount is required";
        }
        break;
    }
    return newErrors;
  };

  // Navigation handlers
  const nextStep = () => {
    console.log("nextStep called, current step:", currentStep);
    console.log("Current userData:", userData);
    const stepErrors = validateStep(currentStep);
    console.log("Validation errors:", stepErrors);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      console.log("Validation failed, not proceeding to next step");
      return;
    }

    console.log("Validation passed, proceeding to next step");

    // Award XP for completing each step
    if (currentStep === 1) {
      gainXP(10);
    } else if (currentStep === 2) {
      gainXP(15);
    } else if (currentStep === 3) {
      gainXP(15);
    } else if (currentStep === 4) {
      gainXP(20);
      if (userData.skills.length >= 3) {
        gainXP(10);
        unlockAchievement({
          id: "skill_master",
          title: "Skill Master",
          description: "Added 3+ skills to your profile",
          icon: "⚡"
        });
      }
    } else if (currentStep === 5) {
      gainXP(15);
    } else if (currentStep === 6) {
      gainXP(15);
    } else if (currentStep === 7) {
      gainXP(50);
      unlockAchievement({
        id: "profile_complete",
        title: "Profile Pioneer",
        description: "Completed your student profile",
        icon: "🎓"
      });
    }

    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, 7);
      console.log("Moving from step", prev, "to step", newStep);
      return newStep;
    });
    setErrors({});
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Handlers for data updates
  const handlePersonalInfoUpdate = (updates: Partial<ExtendedUserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
    console.log("Personal info updated:", updates);
  };

  const handlePortfolioUpdate = (newUrl: string) => {
    setUserData(prev => ({ ...prev, portfolioUrl: newUrl }));
    console.log("Portfolio URL updated:", newUrl);
  };

  const handleResumeUpload = async (file: File): Promise<void> => {
    const newResume = {
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type
    };
    
    setUserData(prev => ({ ...prev, resume: newResume }));
    console.log("Resume uploaded:", file.name);
  };

  const handleResumeRemove = () => {
    setUserData(prev => ({ ...prev, resume: null }));
    console.log("Resume removed");
  };

  const handleSkillsAndGoalsUpdate = (skillsAndGoalsData: { skills: Array<{ skill: string; proficiency: number }>; careerGoals: string[]; industry: string }) => {
    setUserData(prev => ({ 
      ...prev, 
      skills: skillsAndGoalsData.skills,
      careerGoals: skillsAndGoalsData.careerGoals,
      industry: skillsAndGoalsData.industry
    }));
    console.log("Skills and goals updated:", skillsAndGoalsData);
  };

  const handleCareerGoalsUpdate = (careerGoalsData: { careerGoals: string[]; industry: string }) => {
    setUserData(prev => ({ 
      ...prev, 
      careerGoals: careerGoalsData.careerGoals,
      industry: careerGoalsData.industry
    }));
    console.log("Career goals updated:", careerGoalsData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Profile</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader isOnboarding={isFromRoleSelection} />
        
        {isFromRoleSelection && (
          <OnboardingProgress currentStep={currentStep} completionPercentage={completionPercentage} />
        )}
        
        {isFromRoleSelection ? (
          // Onboarding Flow - Show sections based on current step
          <div className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <PersonalInfoCard 
                userData={userData} 
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <EducationSection
                userData={userData}
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 3: Career Goals */}
            {currentStep === 3 && (
              <CareerGoalsSection
                userData={userData}
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <SkillsAndGoals 
                userData={userData} 
                onSave={handleSkillsAndGoalsUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 5: Availability */}
            {currentStep === 5 && (
              <AvailabilitySection
                userData={userData}
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 6: Compensation */}
            {currentStep === 6 && (
              <CompensationSection
                userData={userData}
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}

            {/* Step 7: Resume */}
            {currentStep === 7 && (
              <ResumeSection 
                resume={userData.resume}
                onUpload={handleResumeUpload}
                onRemove={handleResumeRemove}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
            )}
          </div>
        ) : (
          // Regular Profile View - Show all sections
          <div className="space-y-8">
            {/* Top Row - Personal Info & Career Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PersonalInfoCard 
                userData={userData} 
                onUpdate={handlePersonalInfoUpdate}
                isOnboarding={isFromRoleSelection}
                currentStep={currentStep}
                errors={errors}
              />
              <CareerGoalsProfileSection 
                userData={userData} 
                onUpdate={handleCareerGoalsUpdate}
              />
            </div>
            
            {/* Bottom Row - Skills, Portfolio & Resume */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <SkillsAndGoals 
                userData={userData} 
                onSave={handleSkillsAndGoalsUpdate}
              />
              <PortfolioSection 
                portfolioUrl={userData.portfolioUrl} 
                onUpdate={handlePortfolioUpdate}
              />
              <ResumeSection 
                resume={userData.resume}
                onUpload={handleResumeUpload}
                onRemove={handleResumeRemove}
              />
            </div>
          </div>
        )}

        {/* Onboarding Navigation */}
        {isFromRoleSelection && (
          <div className="mt-8 flex justify-between relative z-40 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {currentStep > 1 ? (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Back button clicked");
                  prevStep();
                }} 
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep < 7 ? (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Next button clicked");
                  nextStep();
                }} 
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                type="button"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Complete Profile button clicked");
                  // Complete onboarding
                  gainXP(50);
                  unlockAchievement({
                    id: "profile_complete",
                    title: "Profile Pioneer",
                    description: "Completed your student profile",
                    icon: "🎓"
                  });
                  // Redirect to workspace
                  window.location.href = "/student_portal/workspace";
                }} 
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                type="button"
              >
                Complete Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
