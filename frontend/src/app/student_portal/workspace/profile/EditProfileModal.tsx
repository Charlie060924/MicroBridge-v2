"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Upload, ExternalLink, Calendar, Target, Zap, Trophy, School, BookOpen, GraduationCap } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  section: string;
  currentData: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  section,
  currentData
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(currentData);
      setErrors({});
    }
  }, [isOpen, currentData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    switch (section) {
      case 'basic':
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email?.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.school?.trim()) newErrors.school = 'School is required';
        if (!formData.major?.trim()) newErrors.major = 'Major is required';
        if (!formData.yearOfStudy?.trim()) newErrors.yearOfStudy = 'Year of study is required';
        if (!formData.bio?.trim()) newErrors.bio = 'Bio is required';
        break;
      
      case 'availability':
        if (!formData.availability?.preferredStartDate) newErrors.preferredStartDate = 'Preferred start date is required';
        break;
      
      case 'skills':
        if (!formData.skills || formData.skills.length === 0) {
          newErrors.skills = 'At least one skill is required';
        }
        break;
      
      case 'projects':
        if (!formData.projects || formData.projects.length === 0) {
          newErrors.projects = 'At least one project is required';
        }
        break;
      
      case 'careerGoals':
        if (!formData.careerGoals?.statement?.trim()) newErrors.statement = 'Career statement is required';
        break;
      
      case 'contact':
        // Contact fields are optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const addSkill = () => {
    const newSkill = { 
      skill: '', 
      category: 'software', 
      proficiency: 'Beginner' as const, 
      xpValue: 25 
    };
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill: any, i: number) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      type: 'academic' as const,
      duration: '',
      xpEarned: 50,
      skills: []
    };
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProjectSkill = (projectIndex: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === projectIndex 
          ? { ...project, skills: [...project.skills, ''] }
          : project
      )
    }));
  };

  const removeProjectSkill = (projectIndex: number, skillIndex: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === projectIndex 
          ? { ...project, skills: project.skills.filter((_: any, si: number) => si !== skillIndex) }
          : project
      )
    }));
  };

  const updateProjectSkill = (projectIndex: number, skillIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project: any, i: number) => 
        i === projectIndex 
          ? { 
              ...project, 
              skills: project.skills.map((skill: any, si: number) => 
                si === skillIndex ? value : skill
              )
            }
          : project
      )
    }));
  };

  const addCareerInterest = () => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        interests: [...(prev.careerGoals?.interests || []), '']
      }
    }));
  };

  const removeCareerInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        interests: prev.careerGoals.interests.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const updateCareerInterest = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        interests: prev.careerGoals.interests.map((interest: any, i: number) => 
          i === index ? value : interest
        )
      }
    }));
  };

  const addTargetIndustry = () => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        targetIndustries: [...(prev.careerGoals?.targetIndustries || []), '']
      }
    }));
  };

  const removeTargetIndustry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        targetIndustries: prev.careerGoals.targetIndustries.filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const updateTargetIndustry = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: {
        ...prev.careerGoals,
        targetIndustries: prev.careerGoals.targetIndustries.map((industry: any, i: number) => 
          i === index ? value : industry
        )
      }
    }));
  };

  const renderBasicInfoForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
            value={formData.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+852 5555 1234"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            School *
          </label>
          <select
            value={formData.school || ''}
            onChange={(e) => handleInputChange('school', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.school ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select school</option>
            <option value="The University of Hong Kong">The University of Hong Kong</option>
            <option value="The Chinese University of Hong Kong">The Chinese University of Hong Kong</option>
            <option value="The Hong Kong University of Science and Technology">The Hong Kong University of Science and Technology</option>
            <option value="City University of Hong Kong">City University of Hong Kong</option>
            <option value="The Hong Kong Polytechnic University">The Hong Kong Polytechnic University</option>
            <option value="Hong Kong Baptist University">Hong Kong Baptist University</option>
            <option value="Lingnan University">Lingnan University</option>
            <option value="The Education University of Hong Kong">The Education University of Hong Kong</option>
            <option value="Other">Other</option>
          </select>
          {errors.school && <p className="text-sm text-red-600 mt-1">{errors.school}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Major *
          </label>
          <select
            value={formData.major || ''}
            onChange={(e) => handleInputChange('major', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.major ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select major</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Media and Communication">Media and Communication</option>
            <option value="Psychology">Psychology</option>
            <option value="Economics">Economics</option>
            <option value="Other">Other</option>
          </select>
          {errors.major && <p className="text-sm text-red-600 mt-1">{errors.major}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Year of Study *
          </label>
          <select
            value={formData.yearOfStudy || ''}
            onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.yearOfStudy ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select year</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Graduate">Graduate</option>
          </select>
          {errors.yearOfStudy && <p className="text-sm text-red-600 mt-1">{errors.yearOfStudy}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio *
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          placeholder="Tell us about yourself, your interests, and what you're looking for in micro-internships..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio}</p>}
      </div>
    </div>
  );

  const renderAvailabilityForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Start Date *
        </label>
        <input
          type="date"
          value={formData.availability?.preferredStartDate || ''}
          onChange={(e) => handleInputChange('availability', {
            ...formData.availability,
            preferredStartDate: e.target.value
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.preferredStartDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.preferredStartDate && <p className="text-sm text-red-600 mt-1">{errors.preferredStartDate}</p>}
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="flexibleTiming"
          checked={formData.availability?.flexibleTiming || false}
          onChange={(e) => handleInputChange('availability', {
            ...formData.availability,
            flexibleTiming: e.target.checked
          })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="flexibleTiming" className="text-sm text-gray-700 dark:text-gray-300">
          I'm flexible with timing and can work around my schedule
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Available Dates (Optional)
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Select specific dates when you're available for micro-internships
        </p>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calendar selection coming soon
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            You'll be able to select available dates for micro-internships
          </p>
        </div>
      </div>
    </div>
  );

  const renderSkillsForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills & Interests</h3>
        <button
          onClick={addSkill}
          className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </button>
      </div>
      
      {formData.skills?.map((skill: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skill {index + 1}</span>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={skill.skill || ''}
                onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                placeholder="e.g., Python"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={skill.category || 'software'}
                onChange={(e) => updateSkill(index, 'category', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="software">Software</option>
                <option value="design">Design</option>
                <option value="analytics">Analytics</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Proficiency
              </label>
              <select
                value={skill.proficiency || 'Beginner'}
                onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                XP Value
              </label>
              <input
                type="number"
                value={skill.xpValue || 25}
                onChange={(e) => updateSkill(index, 'xpValue', parseInt(e.target.value) || 25)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      ))}
      
      {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
    </div>
  );

  const renderProjectsForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Projects & Experience</h3>
        <button
          onClick={addProject}
          className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </button>
      </div>
      
      {formData.projects?.map((project: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project {index + 1}</span>
            <button
              onClick={() => removeProject(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                placeholder="e.g., AI Chatbot for Student Services"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Project Type
              </label>
              <select
                value={project.type || 'academic'}
                onChange={(e) => updateProject(index, 'type', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="academic">Academic</option>
                <option value="competition">Competition</option>
                <option value="volunteer">Volunteer</option>
                <option value="personal">Personal</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={project.description || ''}
              onChange={(e) => updateProject(index, 'description', e.target.value)}
              rows={3}
              placeholder="Describe your project and what you accomplished..."
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={project.duration || ''}
                onChange={(e) => updateProject(index, 'duration', e.target.value)}
                placeholder="e.g., 3 months"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                XP Earned
              </label>
              <input
                type="number"
                value={project.xpEarned || 50}
                onChange={(e) => updateProject(index, 'xpEarned', parseInt(e.target.value) || 50)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Skills Used
              </label>
              <button
                onClick={() => addProjectSkill(index)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Skill
              </button>
            </div>
            {project.skills?.map((skill: string, skillIndex: number) => (
              <div key={skillIndex} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={skill || ''}
                  onChange={(e) => updateProjectSkill(index, skillIndex, e.target.value)}
                  placeholder="e.g., Python"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => removeProjectSkill(index, skillIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {errors.projects && <p className="text-sm text-red-600">{errors.projects}</p>}
    </div>
  );

  const renderCareerGoalsForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Career Statement *
        </label>
        <textarea
          value={formData.careerGoals?.statement || ''}
          onChange={(e) => handleInputChange('careerGoals', {
            ...formData.careerGoals,
            statement: e.target.value
          })}
          rows={4}
          placeholder="Describe your career goals and what you hope to achieve through micro-internships..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.statement ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.statement && <p className="text-sm text-red-600 mt-1">{errors.statement}</p>}
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Interests
          </label>
          <button
            onClick={addCareerInterest}
            className="flex items-center px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Interest
          </button>
        </div>
        <div className="space-y-2">
          {formData.careerGoals?.interests?.map((interest: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={interest || ''}
                onChange={(e) => updateCareerInterest(index, e.target.value)}
                placeholder="e.g., Software Development"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeCareerInterest(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Industries
          </label>
          <button
            onClick={addTargetIndustry}
            className="flex items-center px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Industry
          </button>
        </div>
        <div className="space-y-2">
          {formData.careerGoals?.targetIndustries?.map((industry: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={industry || ''}
                onChange={(e) => updateTargetIndustry(index, e.target.value)}
                placeholder="e.g., Technology"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeTargetIndustry(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          LinkedIn URL
        </label>
        <input
          type="url"
          value={formData.linkedinUrl || ''}
          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Portfolio URL
        </label>
        <input
          type="url"
          value={formData.portfolioUrl || ''}
          onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
          placeholder="https://your-portfolio.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GitHub URL
        </label>
        <input
          type="url"
          value={formData.githubUrl || ''}
          onChange={(e) => handleInputChange('githubUrl', e.target.value)}
          placeholder="https://github.com/yourusername"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );

  const getSectionTitle = () => {
    switch (section) {
      case 'basic': return 'Basic Information';
      case 'availability': return 'Availability & Start Date';
      case 'skills': return 'Skills & Interests';
      case 'projects': return 'Projects & Experience';
      case 'careerGoals': return 'Career Goals';
      case 'contact': return 'Contact & Links';
      default: return 'Edit Profile';
    }
  };

  const renderForm = () => {
    switch (section) {
      case 'basic': return renderBasicInfoForm();
      case 'availability': return renderAvailabilityForm();
      case 'skills': return renderSkillsForm();
      case 'projects': return renderProjectsForm();
      case 'careerGoals': return renderCareerGoalsForm();
      case 'contact': return renderContactForm();
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getSectionTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderForm()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;