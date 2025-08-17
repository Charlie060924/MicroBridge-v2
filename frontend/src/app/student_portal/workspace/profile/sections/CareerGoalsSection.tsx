import React, { useState } from 'react';
import { Target, Edit2, Save, X } from 'lucide-react';
import { CAREER_INTERESTS, TARGET_INDUSTRIES, AVAILABILITY_PREFERENCES } from '../../settings/utils/studentConstants';

interface CareerGoalsData {
  interests: string[];
  targetIndustries: string[];
  careerStatement: string;
  availability: string[];
}

interface CareerGoalsSectionProps {
  data: CareerGoalsData;
  onUpdate: (data: CareerGoalsData) => void;
  isPreviewMode?: boolean;
}

const CareerGoalsSection: React.FC<CareerGoalsSectionProps> = ({ 
  data, 
  onUpdate, 
  isPreviewMode = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<CareerGoalsData>(data);

  const handleSave = () => {
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleInterestToggle = (interest: string) => {
    setTempData(prev => ({
      ...prev,
      interests: toggleArrayItem(prev.interests, interest)
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setTempData(prev => ({
      ...prev,
      targetIndustries: toggleArrayItem(prev.targetIndustries, industry)
    }));
  };

  const handleAvailabilityToggle = (availability: string) => {
    setTempData(prev => ({
      ...prev,
      availability: toggleArrayItem(prev.availability, availability)
    }));
  };

  const TagButton: React.FC<{ 
    label: string; 
    isSelected: boolean; 
    onClick: () => void; 
    disabled?: boolean;
  }> = ({ label, isSelected, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {label}
    </button>
  );

  const getDisplayLabels = (values: string[], options: ReadonlyArray<{readonly value: string, readonly label: string}>) => {
    return values.map(value => options.find(opt => opt.value === value)?.label || value);
  };

  if (isPreviewMode) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Career Goals</h3>
        </div>

        <div className="space-y-6">
          {/* Career Statement */}
          {data.careerStatement && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Career Objective</h5>
              <p className="text-gray-600 dark:text-gray-400">{data.careerStatement}</p>
            </div>
          )}

          {/* Career Interests */}
          {data.interests.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Career Interests</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.interests, CAREER_INTERESTS).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-200 dark:border-purple-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Industries */}
          {data.targetIndustries.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Target Industries</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.targetIndustries, TARGET_INDUSTRIES).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full border border-green-200 dark:border-green-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {data.availability.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Availability</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.availability, AVAILABILITY_PREFERENCES).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Career Goals & Availability</h3>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Career Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Career Objective
            </label>
            <textarea
              value={tempData.careerStatement}
              onChange={(e) => setTempData(prev => ({ ...prev, careerStatement: e.target.value }))}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white resize-none"
              placeholder="Describe your career goals and what you hope to achieve through micro-internships..."
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Brief statement about your career aspirations
              </p>
              <span className="text-xs text-gray-400">
                {tempData.careerStatement?.length || 0}/200
              </span>
            </div>
          </div>

          {/* Career Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Career Interests <span className="text-gray-400">(Select up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CAREER_INTERESTS.map((interest) => (
                <TagButton
                  key={interest.value}
                  label={interest.label}
                  isSelected={tempData.interests.includes(interest.value)}
                  onClick={() => handleInterestToggle(interest.value)}
                  disabled={tempData.interests.length >= 5 && !tempData.interests.includes(interest.value)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selected: {tempData.interests.length}/5
            </p>
          </div>

          {/* Target Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Target Industries <span className="text-gray-400">(Select up to 4)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_INDUSTRIES.map((industry) => (
                <TagButton
                  key={industry.value}
                  label={industry.label}
                  isSelected={tempData.targetIndustries.includes(industry.value)}
                  onClick={() => handleIndustryToggle(industry.value)}
                  disabled={tempData.targetIndustries.length >= 4 && !tempData.targetIndustries.includes(industry.value)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selected: {tempData.targetIndustries.length}/4
            </p>
          </div>

          {/* Availability Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Availability Preferences <span className="text-gray-400">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_PREFERENCES.map((pref) => (
                <TagButton
                  key={pref.value}
                  label={pref.label}
                  isSelected={tempData.availability.includes(pref.value)}
                  onClick={() => handleAvailabilityToggle(pref.value)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Let employers know when you're available to work
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Career Statement */}
          {data.careerStatement ? (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Career Objective</h5>
              <p className="text-gray-600 dark:text-gray-400">{data.careerStatement}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p>Add your career goals to help employers understand your aspirations</p>
            </div>
          )}

          {/* Career Interests */}
          {data.interests.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Career Interests</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.interests, CAREER_INTERESTS).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-200 dark:border-purple-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Industries */}
          {data.targetIndustries.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Target Industries</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.targetIndustries, TARGET_INDUSTRIES).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-full border border-green-200 dark:border-green-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {data.availability.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Availability</h5>
              <div className="flex flex-wrap gap-2">
                {getDisplayLabels(data.availability, AVAILABILITY_PREFERENCES).map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerGoalsSection;
