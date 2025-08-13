"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";
import {
  availabilityOptions,
  durationOptions,
} from "@/components/dashboard/Students/Student_Info_Constant";

interface AvailabilitySectionProps {
  userData: {
    availability: string;
    projectDuration: string;
  };
  onUpdate: (data: Partial<{
    availability: string;
    projectDuration: string;
  }>) => void;
  isOnboarding?: boolean;
  currentStep?: number;
  errors?: Record<string, string>;
}

export default function AvailabilitySection({ 
  userData, 
  onUpdate, 
  isOnboarding = false, 
  currentStep = 1,
  errors = {}
}: AvailabilitySectionProps) {
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [formData, setFormData] = useState({
    availability: userData.availability,
    projectDuration: userData.projectDuration,
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      availability: userData.availability,
      projectDuration: userData.projectDuration,
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      availability: userData.availability,
      projectDuration: userData.projectDuration,
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

  const isCurrentStep = isOnboarding && currentStep === 5;

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
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Availability
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                When you can work and project preferences
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
                  Weekly Availability *
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.availability ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select availability</option>
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.availability && <p className="text-sm text-red-600 mt-1">{errors.availability}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Project Duration *
                </label>
                <select
                  value={formData.projectDuration}
                  onChange={(e) => handleInputChange('projectDuration', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                    errors.projectDuration ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.projectDuration && <p className="text-sm text-red-600 mt-1">{errors.projectDuration}</p>}
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
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Availability</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {availabilityOptions.find(option => option.value === userData.availability)?.label || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Project Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {durationOptions.find(option => option.value === userData.projectDuration)?.label || "Not specified"}
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
