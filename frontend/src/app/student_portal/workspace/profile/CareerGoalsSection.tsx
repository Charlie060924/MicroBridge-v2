"use client";

import React, { useState, useEffect } from "react";
import { Award, Briefcase } from "lucide-react";
import {
  careerGoals,
  industries,
} from "@/components/dashboard/Students/Student_Info_Constant";

interface CareerGoalsSectionProps {
  userData: {
    careerGoal: string;
    industry: string;
  };
  onUpdate: (data: Partial<{
    careerGoal: string;
    industry: string;
  }>) => void;
  isOnboarding?: boolean;
  currentStep?: number;
  errors?: Record<string, string>;
}

export default function CareerGoalsSection({ 
  userData, 
  onUpdate, 
  isOnboarding = false, 
  currentStep = 1,
  errors = {}
}: CareerGoalsSectionProps) {
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [formData, setFormData] = useState({
    careerGoal: userData.careerGoal,
    industry: userData.industry,
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      careerGoal: userData.careerGoal,
      industry: userData.industry,
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      careerGoal: userData.careerGoal,
      industry: userData.industry,
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

  const isCurrentStep = isOnboarding && currentStep === 3;

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
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Career Goals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                What you want to achieve in your career
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
                  Primary Career Goal *
                </label>
                <select
                  value={formData.careerGoal}
                  onChange={(e) => handleInputChange('careerGoal', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.careerGoal ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select career goal</option>
                  {careerGoals.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
                {errors.careerGoal && <p className="text-sm text-red-600 mt-1">{errors.careerGoal}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.industry ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </select>
                {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
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
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Career Goal</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {careerGoals.find(goal => goal.value === userData.careerGoal)?.label || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Target Industry</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {industries.find(industry => industry.value === userData.industry)?.label || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
