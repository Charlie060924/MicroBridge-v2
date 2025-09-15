"use client";

import React, { useState } from "react";
import { 
  FileText, Download, Share, Star, Trophy, CheckCircle, 
  Calendar, MapPin, DollarSign, Clock, Plus, Edit3 
} from "lucide-react";

interface ProjectExperience {
  id: string;
  projectTitle: string;
  clientName: string;
  duration: string;
  compensation: number;
  skills: string[];
  achievements: string[];
  testimonial?: {
    rating: number;
    feedback: string;
    clientName: string;
    date: string;
  };
  deliverables: string[];
  challenges: string[];
  learnings: string[];
  portfolioImages: string[];
  completionDate: string;
}

interface ExperienceDocumentationSystemProps {
  projectId: string;
  onExperienceDocumented?: (experience: ProjectExperience) => void;
}

const ExperienceDocumentationSystem: React.FC<ExperienceDocumentationSystemProps> = ({
  projectId,
  onExperienceDocumented
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [experienceData, setExperienceData] = useState<Partial<ProjectExperience>>({
    skills: [],
    achievements: [],
    deliverables: [],
    challenges: [],
    learnings: [],
    portfolioImages: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 'overview', title: 'Project Overview', icon: FileText },
    { id: 'skills', title: 'Skills & Achievements', icon: Trophy },
    { id: 'impact', title: 'Impact & Learnings', icon: Star },
    { id: 'portfolio', title: 'Portfolio Assets', icon: Download },
    { id: 'review', title: 'Review & Export', icon: CheckCircle }
  ];

  const handleUpdateData = (field: string, value: any) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToArray = (field: string, value: string) => {
    if (value.trim()) {
      setExperienceData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
    }
  };

  const handleRemoveFromArray = (field: string, index: number) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const generatePortfolioEntry = async () => {
    setIsGenerating(true);
    try {
      // Simulate portfolio generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const portfolioData = {
        ...experienceData,
        id: Date.now().toString(),
        completionDate: new Date().toISOString()
      };
      
      onExperienceDocumented?.(portfolioData as ProjectExperience);
    } catch (error) {
      console.error('Portfolio generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={experienceData.projectTitle || ''}
                onChange={(e) => handleUpdateData('projectTitle', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter the project title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client/Company Name
              </label>
              <input
                type="text"
                value={experienceData.clientName || ''}
                onChange={(e) => handleUpdateData('clientName', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Client or company name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Duration
                </label>
                <input
                  type="text"
                  value={experienceData.duration || ''}
                  onChange={(e) => handleUpdateData('duration', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 3 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compensation (HKD)
                </label>
                <input
                  type="number"
                  value={experienceData.compensation || ''}
                  onChange={(e) => handleUpdateData('compensation', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="8000"
                />
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skills Utilized</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {(experienceData.skills || []).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => handleRemoveFromArray('skills', index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <AddItemInput
                placeholder="Add a skill (e.g., React, Project Management)"
                onAdd={(value) => handleAddToArray('skills', value)}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Achievements</h4>
              <div className="space-y-2 mb-3">
                {(experienceData.achievements || []).map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Trophy className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-green-700 dark:text-green-300 flex-1">{achievement}</span>
                    <button 
                      onClick={() => handleRemoveFromArray('achievements', index)}
                      className="text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <AddItemInput
                placeholder="Describe an achievement (e.g., Increased user engagement by 40%)"
                onAdd={(value) => handleAddToArray('achievements', value)}
              />
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Challenges Overcome</h4>
              <div className="space-y-2 mb-3">
                {(experienceData.challenges || []).map((challenge, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-sm text-orange-700 dark:text-orange-300 flex-1">{challenge}</span>
                    <button 
                      onClick={() => handleRemoveFromArray('challenges', index)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <AddItemInput
                placeholder="Describe a challenge you overcame"
                onAdd={(value) => handleAddToArray('challenges', value)}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Learnings</h4>
              <div className="space-y-2 mb-3">
                {(experienceData.learnings || []).map((learning, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm text-purple-700 dark:text-purple-300 flex-1">{learning}</span>
                    <button 
                      onClick={() => handleRemoveFromArray('learnings', index)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <AddItemInput
                placeholder="What did you learn from this project?"
                onAdd={(value) => handleAddToArray('learnings', value)}
              />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Deliverables Created</h4>
              <div className="space-y-2 mb-3">
                {(experienceData.deliverables || []).map((deliverable, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{deliverable}</span>
                    <button 
                      onClick={() => handleRemoveFromArray('deliverables', index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <AddItemInput
                placeholder="List a deliverable (e.g., React component library)"
                onAdd={(value) => handleAddToArray('deliverables', value)}
              />
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload screenshots, demos, or visual assets from your project
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Upload Portfolio Assets
                </button>
              </div>
            </div>

            {experienceData.testimonial && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Client Testimonial</h4>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < experienceData.testimonial!.rating 
                          ? 'text-yellow-500 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-green-700 dark:text-green-300 ml-2">
                    {experienceData.testimonial.rating}/5
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                  "{experienceData.testimonial.feedback}"
                </p>
                <p className="text-green-600 dark:text-green-400 text-xs">
                  - {experienceData.testimonial.clientName}
                </p>
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">Portfolio Entry Preview</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {experienceData.projectTitle || 'Project Title'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {experienceData.clientName || 'Client Name'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {experienceData.duration || 'Duration'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">
                    HKD {experienceData.compensation || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">
                    {(experienceData.skills || []).length} skills, {(experienceData.achievements || []).length} achievements
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300 text-sm">
                    {(experienceData.learnings || []).length} learnings, {(experienceData.deliverables || []).length} deliverables
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={generatePortfolioEntry}
                disabled={isGenerating}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating Portfolio Entry...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Add to Portfolio</span>
                  </>
                )}
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                <Share className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const AddItemInput: React.FC<{ placeholder: string; onAdd: (value: string) => void }> = ({ placeholder, onAdd }) => {
    const [value, setValue] = useState('');
    
    const handleAdd = () => {
      onAdd(value);
      setValue('');
    };

    return (
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          placeholder={placeholder}
        />
        <button
          onClick={handleAdd}
          disabled={!value.trim()}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Document Your Experience
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create a comprehensive portfolio entry from this project
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-2 ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next Step
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ExperienceDocumentationSystem;