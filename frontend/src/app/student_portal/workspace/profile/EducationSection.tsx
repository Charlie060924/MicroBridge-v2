"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Award } from "lucide-react";
import {
  educationLevels,
  academicMajors,
} from "@/components/dashboard/Students/Student_Info_Constant";

interface EducationSectionProps {
  userData: {
    educationLevel: string;
    major: string;
    university: string;
    degree: string;
  };
  onUpdate: (data: Partial<{
    educationLevel: string;
    major: string;
    university: string;
    degree: string;
  }>) => void;
  isOnboarding?: boolean;
  currentStep?: number;
  errors?: Record<string, string>;
}

export default function EducationSection({ 
  userData, 
  onUpdate, 
  isOnboarding = false, 
  currentStep = 1,
  errors = {}
}: EducationSectionProps) {
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [formData, setFormData] = useState({
    educationLevel: userData.educationLevel,
    major: userData.major,
    university: userData.university,
    degree: userData.degree,
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      educationLevel: userData.educationLevel,
      major: userData.major,
      university: userData.university,
      degree: userData.degree,
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      educationLevel: userData.educationLevel,
      major: userData.major,
      university: userData.university,
      degree: userData.degree,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding) {
      onUpdate({ [field]: value });
    }
  };

  const isCurrentStep = isOnboarding && currentStep === 2;

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
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Education Background
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your academic background and qualifications
              </p>
            </div>
          </div>
          {!isOnboarding && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Edit
            </button>
          )}
        </div>

        {(isEditing || isOnboarding) ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education Level *
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.educationLevel ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your level</option>
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && <p className="text-sm text-red-600 mt-1">{errors.educationLevel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Major/Field of Study *
                </label>
                <select
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.major ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your major</option>
                  {academicMajors.map((major) => (
                    <option key={major.value} value={major.value}>
                      {major.label}
                    </option>
                  ))}
                </select>
                {errors.major && <p className="text-sm text-red-600 mt-1">{errors.major}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  placeholder="Enter your university"
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
                  placeholder="e.g., Bachelor of Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
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
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Education Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {educationLevels.find(level => level.value === userData.educationLevel)?.label || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Major</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {academicMajors.find(major => major.value === userData.major)?.label || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">University</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.university || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Degree</p>
                  <p className="font-medium text-gray-900 dark:text-white">{userData.degree || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
