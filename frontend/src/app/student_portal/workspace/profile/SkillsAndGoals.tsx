import React, { useState, useEffect } from "react";
import { Code, Edit2, Save, X, Plus, Trash2 } from "lucide-react";

interface Skill {
  skill: string;
  proficiency: number;
}

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

interface SkillsAndGoalsProps {
  userData: ExtendedUserData;
  onSave?: (data: { skills: Array<{ skill: string; proficiency: number }>; careerGoals: string[]; industry: string }) => void;
  isOnboarding?: boolean;
  currentStep?: number;
  errors?: Record<string, string>;
}

const getProficiencyColor = (proficiency: number) => {
  switch (proficiency) {
    case 1:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case 2:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case 3:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case 4:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case 5:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getProficiencyLabel = (proficiency: number) => {
  switch (proficiency) {
    case 1:
      return "Beginner";
    case 2:
      return "Elementary";
    case 3:
      return "Intermediate";
    case 4:
      return "Advanced";
    case 5:
      return "Expert";
    default:
      return "Unknown";
  }
};

const proficiencyOptions = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Elementary" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
];

function SkillsAndGoals({ userData, onSave, isOnboarding = false, currentStep = 1, errors = {} }: SkillsAndGoalsProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(isOnboarding);
  const [formData, setFormData] = useState<ExtendedUserData>(userData);
  const [newSkill, setNewSkill] = useState({ skill: "", proficiency: 3 });

  // Update form data when userData changes
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleEditSkills = () => {
    setIsEditingSkills(true);
    setFormData(userData);
  };

  const handleCancelSkills = () => {
    setIsEditingSkills(false);
    setFormData(userData);
    setNewSkill({ skill: "", proficiency: 3 });
  };

  const handleSaveSkills = () => {
    if (onSave) {
      onSave({
        skills: formData.skills,
        careerGoals: formData.careerGoals,
        industry: formData.industry,
      });
    }
    setIsEditingSkills(false);
    setNewSkill({ skill: "", proficiency: 3 });
  };

  const addSkill = () => {
    if (newSkill.skill.trim()) {
      const skillExists = formData.skills.some(skill => 
        skill.skill.toLowerCase() === newSkill.skill.trim().toLowerCase()
      );
      
      if (skillExists) {
        alert("This skill already exists!");
        return;
      }
      
      const updatedFormData = {
        ...formData,
        skills: [...formData.skills, { ...newSkill, skill: newSkill.skill.trim() }]
      };
      setFormData(updatedFormData);
      setNewSkill({ skill: "", proficiency: 3 });
      
      // In onboarding mode, automatically save to parent component
      if (isOnboarding && onSave) {
        onSave({
          skills: updatedFormData.skills,
          careerGoals: updatedFormData.careerGoals,
          industry: updatedFormData.industry,
        });
      }
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (index: number) => {
    const updatedFormData = {
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding && onSave) {
      onSave({
        skills: updatedFormData.skills,
        careerGoals: updatedFormData.careerGoals,
        industry: updatedFormData.industry,
      });
    }
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updatedFormData = {
      ...formData,
      skills: formData.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding && onSave) {
      onSave({
        skills: updatedFormData.skills,
        careerGoals: updatedFormData.careerGoals,
        industry: updatedFormData.industry,
      });
    }
  };

  const isCurrentStep = isOnboarding && currentStep === 4;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border transition-all duration-300 ${
      isCurrentStep 
        ? "border-blue-300 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20" 
        : "border-gray-200 dark:border-gray-800"
    } p-8`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Skills & Expertise
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your technical skills and proficiency levels
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditingSkills ? (
            <>
              <button
                onClick={handleSaveSkills}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancelSkills}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditSkills}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Add New Skill Form */}
      {isEditingSkills && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Add New Skill
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Press Enter to quickly add a skill
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., React, Python, UI/UX Design"
              value={newSkill.skill}
              onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
              onKeyPress={handleSkillKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
            >
              {proficiencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={addSkill}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isEditingSkills ? formData.skills : userData.skills).map((skill, index) => (
          <div
            key={index}
            className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            {isEditingSkills && (
              <button
                onClick={() => removeSkill(index)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            {/* Fixed height container to maintain consistent layout */}
            <div className="min-h-[120px] flex flex-col">
              {/* Skill name and level label row - fixed positioning */}
              <div className="flex items-start justify-between mb-2 pr-8">
                <div className="flex-1 min-w-0">
                  {isEditingSkills ? (
                    <input
                      type="text"
                      value={skill.skill}
                      onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                      className="w-full font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                      placeholder="Skill name"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {skill.skill}
                    </span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 flex-shrink-0 ${getProficiencyColor(skill.proficiency)}`}>
                  {getProficiencyLabel(skill.proficiency)}
                </span>
              </div>
              
              {/* Progress bar - fixed positioning */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                />
              </div>
              
              {/* Level indicator - fixed positioning */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Level {skill.proficiency}/5
              </div>
              
              {/* Proficiency selector - positioned at bottom to avoid layout shift */}
              {isEditingSkills && (
                <div className="mt-auto">
                  <select
                    value={skill.proficiency}
                    onChange={(e) => updateSkill(index, 'proficiency', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  >
                    {proficiencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(isEditingSkills ? formData.skills : userData.skills).length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No skills added yet. Add your technical skills to get better job matches.
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillsAndGoals;