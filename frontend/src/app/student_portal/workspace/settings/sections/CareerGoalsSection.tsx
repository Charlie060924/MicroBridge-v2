import React, { useState } from 'react';
import { Target, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import Button from '@/components/ui/Button';
import { useSettings } from '../hooks/useSettings';
import { CAREER_INTERESTS, TARGET_INDUSTRIES, AVAILABILITY_PREFERENCES } from '../utils/studentConstants';
import CompensationCalculator, { CompensationExpectation } from '@/components/common/CompensationCalculator';
import CareerPathVisualization from '@/components/common/CareerPathVisualization';

interface CareerGoalsSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

interface CareerGoalsData {
  interests: string[];
  targetIndustries: string[];
  careerStatement: string;
  availability: string[];
  compensationExpectation?: CompensationExpectation;
}

const CareerGoalsSection: React.FC<CareerGoalsSectionProps> = ({ 
  onSaveAll, 
  isSaving = false, 
  hasChanges = false 
}) => {
  const { settings, updateSettings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<CareerGoalsData>({
    interests: settings.account.interests || [],
    targetIndustries: settings.account.targetIndustries || [],
    careerStatement: settings.account.careerStatement || '',
    availability: settings.account.availability || [],
    compensationExpectation: settings.account.compensationExpectation || {
      hourlyMin: 80,
      hourlyMax: 150,
      projectMin: 3000,
      projectMax: 8000,
      preferredType: 'both'
    }
  });

  const handleSave = () => {
    updateSettings('account', {
      ...settings.account,
      ...tempData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({
      interests: settings.account.interests || [],
      targetIndustries: settings.account.targetIndustries || [],
      careerStatement: settings.account.careerStatement || '',
      availability: settings.account.availability || [],
      compensationExpectation: settings.account.compensationExpectation || {
        hourlyMin: 80,
        hourlyMax: 150,
        projectMin: 3000,
        projectMax: 8000,
        preferredType: 'both'
      }
    });
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

  const handleCompensationChange = (compensationExpectation: CompensationExpectation) => {
    setTempData(prev => ({
      ...prev,
      compensationExpectation
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

  return (
    <SettingCard
      icon={Target}
      title="Career Goals & Availability"
      description="Help us match you with the perfect micro-internship opportunities"
    >
      <div className="space-y-6">
        {/* Career Statement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Career Objective
          </label>
          <textarea
            value={tempData.careerStatement}
            onChange={(e) => setTempData(prev => ({ ...prev, careerStatement: e.target.value }))}
            disabled={!isEditing}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed resize-none"
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
                disabled={!isEditing || (tempData.interests.length >= 5 && !tempData.interests.includes(interest.value))}
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
                disabled={!isEditing || (tempData.targetIndustries.length >= 4 && !tempData.targetIndustries.includes(industry.value))}
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
                disabled={!isEditing}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Let employers know when you're available to work
          </p>
        </div>

        {/* Compensation Expectations */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <CompensationCalculator
            selectedInterests={tempData.interests}
            selectedIndustries={tempData.targetIndustries}
            onExpectationChange={handleCompensationChange}
            disabled={!isEditing}
            value={tempData.compensationExpectation}
          />
        </div>

        {/* Career Path Visualization */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <CareerPathVisualization
            selectedInterests={tempData.interests}
            selectedIndustries={tempData.targetIndustries}
            disabled={!isEditing}
          />
        </div>

        {/* Summary Display (when not editing) */}
        {!isEditing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Your Profile Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-blue-800 dark:text-blue-200">Interests:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">
                  {tempData.interests.length > 0 
                    ? CAREER_INTERESTS.filter(i => tempData.interests.includes(i.value)).map(i => i.label).join(', ')
                    : 'Not specified'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800 dark:text-blue-200">Industries:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">
                  {tempData.targetIndustries.length > 0 
                    ? TARGET_INDUSTRIES.filter(i => tempData.targetIndustries.includes(i.value)).map(i => i.label).join(', ')
                    : 'Not specified'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800 dark:text-blue-200">Availability:</span>
                <span className="text-blue-700 dark:text-blue-300 ml-2">
                  {tempData.availability.length > 0 
                    ? AVAILABILITY_PREFERENCES.filter(a => tempData.availability.includes(a.value)).map(a => a.label).join(', ')
                    : 'Not specified'
                  }
                </span>
              </div>
              {tempData.compensationExpectation && (
                <div>
                  <span className="font-medium text-blue-800 dark:text-blue-200">Compensation:</span>
                  <span className="text-blue-700 dark:text-blue-300 ml-2">
                    {tempData.compensationExpectation.preferredType === 'hourly' && 
                      `HKD $${tempData.compensationExpectation.hourlyMin}-${tempData.compensationExpectation.hourlyMax}/hour`
                    }
                    {tempData.compensationExpectation.preferredType === 'project' && 
                      `HKD $${tempData.compensationExpectation.projectMin.toLocaleString()}-${tempData.compensationExpectation.projectMax.toLocaleString()}/project`
                    }
                    {tempData.compensationExpectation.preferredType === 'both' && 
                      `HKD $${tempData.compensationExpectation.hourlyMin}-${tempData.compensationExpectation.hourlyMax}/hour or $${tempData.compensationExpectation.projectMin.toLocaleString()}-${tempData.compensationExpectation.projectMax.toLocaleString()}/project`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    icon={Save}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    icon={X}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  icon={Edit3}
                >
                  Edit Goals
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default CareerGoalsSection;
