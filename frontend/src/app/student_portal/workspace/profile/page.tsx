"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Award, Code, BookOpen } from "lucide-react";
import SkillsAndGoals from "./SkillsAndGoals";
import PortfolioSection from "./PortfolioSection";
import ResumeSection from "./ResumeSection";
import { useUser } from "@/hooks/useUser";

// Extended user data structure for profile
interface ExtendedUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  university: string;
  degree: string;
  major: string;
  graduationDate: string;
  skills: Array<{ skill: string; proficiency: number }>;
  careerGoals: string[];
  industry: string;
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
  firstName: "Musharof",
  lastName: "Chowdhury",
  email: "musharof@pimjo.com",
  phone: "+09 363 398 46",
  bio: "Passionate software engineering student with a focus on full-stack development and emerging technologies.",
  location: "Hong Kong",
  university: "University of Hong Kong",
  degree: "Bachelor of Engineering",
  major: "Computer Science",
  graduationDate: "June 2026",
  skills: [
    { skill: "React", proficiency: 4 },
    { skill: "TypeScript", proficiency: 3 },
    { skill: "Python", proficiency: 4 },
    { skill: "Node.js", proficiency: 3 },
    { skill: "SQL", proficiency: 3 },
    { skill: "Git", proficiency: 4 }
  ],
  careerGoals: ["Software Engineer", "Full-Stack Developer"],
  industry: "FinTech",
  portfolioUrl: "https://musharof.dev",
  resume: {
    name: "Musharof_Chowdhury_Resume.pdf",
    url: "/resumes/Musharof_Chowdhury_Resume.pdf",
    size: 245760, // 240KB
    type: "application/pdf"
  }
});

function ProfileHeader() {
  return (
    <div className="mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and career preferences
        </p>
      </div>
    </div>
  );
}

function PersonalInfoCard({ userData, onUpdate }: { userData: ExtendedUserData; onUpdate: (data: Partial<ExtendedUserData>) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    location: userData.location,
    university: userData.university,
    degree: userData.degree,
    major: userData.major
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      location: userData.location,
      university: userData.university,
      degree: userData.degree,
      major: userData.major
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
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
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
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

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Degree
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Major
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
          </div>
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
  );
}

export default function ProfilePage() {
  const { user, loading, error } = useUser();
  const [userData, setUserData] = useState<ExtendedUserData>(getExtendedUserData());

  // Handlers for data updates
  const handlePersonalInfoUpdate = (updates: Partial<ExtendedUserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
    // In real app, this would call an API to update the user's information
    console.log("Personal info updated:", updates);
  };

  const handlePortfolioUpdate = (newUrl: string) => {
    setUserData(prev => ({ ...prev, portfolioUrl: newUrl }));
    // In real app, this would call an API to update the user's portfolio URL
    console.log("Portfolio URL updated:", newUrl);
  };

  const handleResumeUpload = async (file: File): Promise<void> => {
    // In real app, this would upload the file to a server and return the file info
    const newResume = {
      name: file.name,
      url: URL.createObjectURL(file), // In real app, this would be the server URL
      size: file.size,
      type: file.type
    };
    
    setUserData(prev => ({ ...prev, resume: newResume }));
    console.log("Resume uploaded:", file.name);
  };

  const handleResumeRemove = () => {
    setUserData(prev => ({ ...prev, resume: null }));
    // In real app, this would call an API to remove the resume
    console.log("Resume removed");
  };

  const handleSkillsAndGoalsUpdate = (skillsAndGoalsData: { skills: Array<{ skill: string; proficiency: number }>; careerGoals: string[]; industry: string }) => {
    setUserData(prev => ({ 
      ...prev, 
      skills: skillsAndGoalsData.skills,
      careerGoals: skillsAndGoalsData.careerGoals,
      industry: skillsAndGoalsData.industry
    }));
    // In real app, this would call an API to update the user's skills and goals
    console.log("Skills and goals updated:", skillsAndGoalsData);
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
        <ProfileHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal Info & Skills */}
          <div className="lg:col-span-1 space-y-8">
            <PersonalInfoCard userData={userData} onUpdate={handlePersonalInfoUpdate} />
            <SkillsAndGoals 
              userData={userData} 
              onSave={handleSkillsAndGoalsUpdate}
            />
          </div>
          
          {/* Right Column - Portfolio & Resume */}
          <div className="lg:col-span-1 space-y-8">
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
      </div>
    </div>
  );
}
