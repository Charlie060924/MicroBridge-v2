import React, { useState } from "react";
import { Code, Target, TrendingUp, Edit2, Save, X, Plus, Trash2 } from "lucide-react";

interface Skill {
  skill: string;
  proficiency: number;
}

interface UserData {
  skills: Skill[];
  careerGoals: string[];
  industry: string;
}

interface SkillsAndGoalsProps {
  userData: UserData;
  onSave?: (data: UserData) => void;
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

function SkillsAndGoals({ userData, onSave }: SkillsAndGoalsProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const [newSkill, setNewSkill] = useState({ skill: "", proficiency: 3 });
  const [newGoal, setNewGoal] = useState("");

  const handleEditSkills = () => {
    setIsEditingSkills(true);
    setFormData(userData);
  };

  const handleEditGoals = () => {
    setIsEditingGoals(true);
    setFormData(userData);
  };

  const handleCancelSkills = () => {
    setIsEditingSkills(false);
    setFormData(userData);
    setNewSkill({ skill: "", proficiency: 3 });
  };

  const handleCancelGoals = () => {
    setIsEditingGoals(false);
    setFormData(userData);
    setNewGoal("");
  };

  const handleSaveSkills = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditingSkills(false);
    setNewSkill({ skill: "", proficiency: 3 });
  };

  const handleSaveGoals = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditingGoals(false);
    setNewGoal("");
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
      
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill, skill: newSkill.skill.trim() }]
      }));
      setNewSkill({ skill: "", proficiency: 3 });
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
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
      
      setFormData(prev => ({
        ...prev,
        careerGoals: [...prev.careerGoals, newGoal.trim()]
      }));
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
    setFormData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals.filter((_, i) => i !== index)
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals.map((goal, i) => 
        i === index ? value : goal
      )
    }));
  };

  const updateIndustry = (value: string) => {
    setFormData(prev => ({
      ...prev,
      industry: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
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
                placeholder="Skill name"
                value={newSkill.skill}
                onChange={(e) => setNewSkill(prev => ({ ...prev, skill: e.target.value }))}
                onKeyPress={handleSkillKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
              <select
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
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

      {/* Career Goals Section */}
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
            {isEditingGoals ? (
              <>
                <button
                  onClick={handleSaveGoals}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelGoals}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditGoals}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Add New Goal Form */}
        {isEditingGoals && (
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
              {(isEditingGoals ? formData.careerGoals : userData.careerGoals).map((goal, index) => (
                <div key={index} className="relative group">
                  {isEditingGoals ? (
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
            {isEditingGoals ? (
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => updateIndustry(e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {userData.industry}
              </div>
            )}
          </div>
        </div>

        {(isEditingGoals ? formData.careerGoals : userData.careerGoals).length === 0 && (
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
    </div>
  );
}

// Demo Component
export default function Demo() {
  const [userData, setUserData] = useState({
    skills: [
      { skill: "React", proficiency: 4 },
      { skill: "TypeScript", proficiency: 3 },
      { skill: "Node.js", proficiency: 3 },
      { skill: "Python", proficiency: 2 },
    ],
    careerGoals: ["Senior Frontend Developer", "Full Stack Engineer", "Tech Lead"],
    industry: "Technology"
  });

  const handleSave = (data: UserData) => {
    setUserData(data);
    console.log("Data saved:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Skills & Career Goals Demo
        </h1>
        <SkillsAndGoals userData={userData} onSave={handleSave} />
      </div>
    </div>
  );
}