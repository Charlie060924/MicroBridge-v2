"use client";

import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Edit2, Save, X, Plus } from "lucide-react";

interface CareerGoalsProfileSectionProps {
  userData: {
    careerGoals: string[];
    industry: string;
  };
  onUpdate: (data: Partial<{
    careerGoals: string[];
    industry: string;
  }>) => void;
}

export default function CareerGoalsProfileSection({ 
  userData, 
  onUpdate 
}: CareerGoalsProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    careerGoals: userData.careerGoals,
    industry: userData.industry,
  });
  const [newGoal, setNewGoal] = useState("");

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      careerGoals: userData.careerGoals,
      industry: userData.industry,
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      careerGoals: userData.careerGoals,
      industry: userData.industry,
    });
    setIsEditing(false);
    setNewGoal("");
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const goalExists = formData.careerGoals.some(goal => 
        goal.toLowerCase() === newGoal.trim().toLowerCase()
      );
      
      if (goalExists) {
        alert("This career goal already exists!");
        return;
      }
      
      const updatedFormData = {
        ...formData,
        careerGoals: [...formData.careerGoals, newGoal.trim()]
      };
      setFormData(updatedFormData);
      setNewGoal("");
    }
  };

  const handleGoalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGoal();
    }
  };

  const removeGoal = (index: number) => {
    const updatedFormData = {
      ...formData,
      careerGoals: formData.careerGoals.filter((_, i) => i !== index)
    };
    setFormData(updatedFormData);
  };

  const updateGoal = (index: number, value: string) => {
    const updatedFormData = {
      ...formData,
      careerGoals: formData.careerGoals.map((goal, i) => 
        i === index ? value : goal
      )
    };
    setFormData(updatedFormData);
  };

  const updateIndustry = (value: string) => {
    const updatedFormData = {
      ...formData,
      industry: value
    };
    setFormData(updatedFormData);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Career Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your professional aspirations and target roles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Add New Goal Form */}
      {isEditing && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add New Career Goal
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Press Enter to quickly add a career goal
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={handleGoalKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            <button
              onClick={addGoal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Career Goals */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Target Roles
          </h4>
          <div className="flex flex-wrap gap-3">
            {(isEditing ? formData.careerGoals : userData.careerGoals).map((goal, index) => (
              <div key={index} className="relative group">
                {isEditing ? (
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-4 py-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="bg-transparent text-blue-700 dark:text-blue-300 text-sm font-medium border-none focus:outline-none focus:ring-0 p-0 min-w-0"
                    />
                    <button
                      onClick={() => removeGoal(index)}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {goal}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferred Industry
          </h4>
          {isEditing ? (
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => updateIndustry(e.target.value)}
              placeholder="e.g., Technology, Healthcare, Finance"
              className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {userData.industry || "Not specified"}
            </div>
          )}
        </div>
      </div>

      {(isEditing ? formData.careerGoals : userData.careerGoals).length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No career goals set yet. Define your professional objectives to get personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
