"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Upload, ExternalLink } from 'lucide-react';

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
        if (!formData.headline?.trim()) newErrors.headline = 'Professional headline is required';
        if (!formData.bio?.trim()) newErrors.bio = 'Bio is required';
        break;
      
      case 'skills':
        if (!formData.skills || formData.skills.length === 0) {
          newErrors.skills = 'At least one skill is required';
        }
        break;
      
      case 'experience':
        if (!formData.experience || formData.experience.length === 0) {
          newErrors.experience = 'At least one experience entry is required';
        }
        break;
      
      case 'education':
        if (!formData.degree?.trim()) newErrors.degree = 'Degree is required';
        if (!formData.university?.trim()) newErrors.university = 'University is required';
        if (!formData.graduationDate?.trim()) newErrors.graduationDate = 'Graduation date is required';
        break;
      
      case 'portfolio':
        // Portfolio fields are optional
        break;
      
      case 'careerGoals':
        if (!formData.careerGoal?.trim()) newErrors.careerGoal = 'Career goal is required';
        if (!formData.industry?.trim()) newErrors.industry = 'Industry is required';
        break;
      
      case 'availability':
        if (!formData.availability?.trim()) newErrors.availability = 'Availability is required';
        if (!formData.projectDuration?.trim()) newErrors.projectDuration = 'Project duration is required';
        if (!formData.paymentType?.trim()) newErrors.paymentType = 'Payment type is required';
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
    const newSkill = { skill: '', proficiency: 50, level: 'Intermediate' };
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

  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      duration: '',
      bulletPoints: ['']
    };
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: any, i: number) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addBulletPoint = (expIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: any, i: number) => 
        i === expIndex 
          ? { ...exp, bulletPoints: [...exp.bulletPoints, ''] }
          : exp
      )
    }));
  };

  const addCareerGoal = () => {
    setFormData(prev => ({
      ...prev,
      careerGoals: [...(prev.careerGoals || []), '']
    }));
  };

  const removeCareerGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateCareerGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      careerGoals: prev.careerGoals.map((goal: any, i: number) => 
        i === index ? value : goal
      )
    }));
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: any, i: number) => 
        i === expIndex 
          ? { ...exp, bulletPoints: exp.bulletPoints.filter((_: any, bi: number) => bi !== bulletIndex) }
          : exp
      )
    }));
  };

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp: any, i: number) => 
        i === expIndex 
          ? { 
              ...exp, 
              bulletPoints: exp.bulletPoints.map((bp: any, bi: number) => 
                bi === bulletIndex ? value : bp
              )
            }
          : exp
      )
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
          Professional Headline *
        </label>
        <input
          type="text"
          value={formData.headline || ''}
          onChange={(e) => handleInputChange('headline', e.target.value)}
          placeholder="e.g., Senior Frontend Developer"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.headline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.headline && <p className="text-sm text-red-600 mt-1">{errors.headline}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., San Francisco, CA"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio *
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio}</p>}
      </div>
    </div>
  );

  const renderSkillsForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills & Expertise</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={skill.skill || ''}
                onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                placeholder="e.g., React"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Proficiency Level
              </label>
              <select
                value={skill.level || 'Intermediate'}
                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Proficiency % ({skill.proficiency || 50}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.proficiency || 50}
                onChange={(e) => updateSkill(index, 'proficiency', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      ))}
      
      {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
    </div>
  );

  const renderExperienceForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </button>
      </div>
      
      {formData.experience?.map((exp: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience {index + 1}</span>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={exp.title || ''}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Company
              </label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                placeholder="e.g., TechCorp Inc."
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={exp.duration || ''}
              onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              placeholder="e.g., 2021 - Present"
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Key Achievements
              </label>
              <button
                onClick={() => addBulletPoint(index)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Point
              </button>
            </div>
            {exp.bulletPoints?.map((point: string, bulletIndex: number) => (
              <div key={bulletIndex} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={point || ''}
                  onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                  placeholder="Describe a key achievement or responsibility..."
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => removeBulletPoint(index, bulletIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
    </div>
  );

  const renderEducationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Degree *
          </label>
          <input
            type="text"
            value={formData.degree || ''}
            onChange={(e) => handleInputChange('degree', e.target.value)}
            placeholder="e.g., Bachelor of Science in Computer Science"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.degree ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.degree && <p className="text-sm text-red-600 mt-1">{errors.degree}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University *
          </label>
          <input
            type="text"
            value={formData.university || ''}
            onChange={(e) => handleInputChange('university', e.target.value)}
            placeholder="e.g., Stanford University"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.university ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Graduation Date *
        </label>
        <input
          type="text"
          value={formData.graduationDate || ''}
          onChange={(e) => handleInputChange('graduationDate', e.target.value)}
          placeholder="e.g., 2019"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.graduationDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.graduationDate && <p className="text-sm text-red-600 mt-1">{errors.graduationDate}</p>}
      </div>
    </div>
  );

  const renderCareerGoalsForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Career Goal *
          </label>
          <input
            type="text"
            value={formData.careerGoal || ''}
            onChange={(e) => handleInputChange('careerGoal', e.target.value)}
            placeholder="e.g., Senior Developer"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.careerGoal ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.careerGoal && <p className="text-sm text-red-600 mt-1">{errors.careerGoal}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry *
          </label>
          <input
            type="text"
            value={formData.industry || ''}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            placeholder="e.g., Technology"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.industry ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Career Objectives
          </label>
          <button
            onClick={addCareerGoal}
            className="flex items-center px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Goal
          </button>
        </div>
        <div className="space-y-2">
          {formData.careerGoals?.map((goal: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={goal || ''}
                onChange={(e) => updateCareerGoal(index, e.target.value)}
                placeholder="Describe a career objective..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => removeCareerGoal(index)}
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

  const renderAvailabilityForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Availability *
          </label>
          <select
            value={formData.availability || ''}
            onChange={(e) => handleInputChange('availability', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.availability ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select availability</option>
            <option value="Available immediately">Available immediately</option>
            <option value="Available in 1 week">Available in 1 week</option>
            <option value="Available in 2 weeks">Available in 2 weeks</option>
            <option value="Available in 1 month">Available in 1 month</option>
            <option value="Available in 2 months">Available in 2 months</option>
            <option value="Available in 3 months">Available in 3 months</option>
          </select>
          {errors.availability && <p className="text-sm text-red-600 mt-1">{errors.availability}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Duration *
          </label>
          <select
            value={formData.projectDuration || ''}
            onChange={(e) => handleInputChange('projectDuration', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.projectDuration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select duration</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="1+ years">1+ years</option>
            <option value="Flexible">Flexible</option>
          </select>
          {errors.projectDuration && <p className="text-sm text-red-600 mt-1">{errors.projectDuration}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Type *
          </label>
          <select
            value={formData.paymentType || ''}
            onChange={(e) => handleInputChange('paymentType', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.paymentType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select payment type</option>
            <option value="Salary">Salary</option>
            <option value="Hourly">Hourly</option>
            <option value="Project-based">Project-based</option>
            <option value="Freelance">Freelance</option>
            <option value="Contract">Contract</option>
          </select>
          {errors.paymentType && <p className="text-sm text-red-600 mt-1">{errors.paymentType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <select
            value={formData.currency || 'USD'}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Salary
          </label>
          <input
            type="number"
            value={formData.expectedSalary?.min || ''}
            onChange={(e) => handleInputChange('expectedSalary', {
              ...formData.expectedSalary,
              min: parseInt(e.target.value) || 0
            })}
            placeholder="e.g., 80000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Salary
          </label>
          <input
            type="number"
            value={formData.expectedSalary?.max || ''}
            onChange={(e) => handleInputChange('expectedSalary', {
              ...formData.expectedSalary,
              max: parseInt(e.target.value) || 0
            })}
            placeholder="e.g., 120000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="flexibleNegotiation"
          checked={formData.flexibleNegotiation || false}
          onChange={(e) => handleInputChange('flexibleNegotiation', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="flexibleNegotiation" className="text-sm text-gray-700 dark:text-gray-300">
          I'm flexible with salary negotiation
        </label>
      </div>
    </div>
  );

  const renderPortfolioForm = () => (
    <div className="space-y-4">
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
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resume
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formData.resume?.name || 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PDF, DOC, DOCX up to 10MB
          </p>
        </div>
      </div>
    </div>
  );

  const getSectionTitle = () => {
    switch (section) {
      case 'basic': return 'Basic Information';
      case 'skills': return 'Skills & Expertise';
      case 'experience': return 'Work Experience';
      case 'education': return 'Education';
      case 'careerGoals': return 'Career Goals';
      case 'availability': return 'Availability & Preferences';
      case 'portfolio': return 'Portfolio & Links';
      default: return 'Edit Profile';
    }
  };

  const renderForm = () => {
    switch (section) {
      case 'basic': return renderBasicInfoForm();
      case 'skills': return renderSkillsForm();
      case 'experience': return renderExperienceForm();
      case 'education': return renderEducationForm();
      case 'careerGoals': return renderCareerGoalsForm();
      case 'availability': return renderAvailabilityForm();
      case 'portfolio': return renderPortfolioForm();
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