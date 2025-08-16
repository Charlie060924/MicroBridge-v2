import React, { useState } from 'react';
import { GraduationCap, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';
import { useSettings } from '../hooks/useSettings';
import { HK_UNIVERSITIES, STUDENT_MAJORS, YEAR_OF_STUDY } from '../utils/studentConstants';

interface EducationInfoSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

interface EducationData {
  university: string;
  major: string;
  yearOfStudy: string;
  graduationDate: string;
  gpa: string;
  relevantCoursework: string[];
}

const EducationInfoSection: React.FC<EducationInfoSectionProps> = ({ 
  onSaveAll, 
  isSaving = false, 
  hasChanges = false 
}) => {
  const { settings, updateSettings } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<EducationData>({
    university: settings.account.university || '',
    major: settings.account.major || '',
    yearOfStudy: settings.account.yearOfStudy || '',
    graduationDate: settings.account.graduationDate || '',
    gpa: settings.account.gpa || '',
    relevantCoursework: settings.account.relevantCoursework || []
  });
  const [newCourse, setNewCourse] = useState('');

  const handleSave = () => {
    updateSettings('account', {
      ...settings.account,
      ...tempData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({
      university: settings.account.university || '',
      major: settings.account.major || '',
      yearOfStudy: settings.account.yearOfStudy || '',
      graduationDate: settings.account.graduationDate || '',
      gpa: settings.account.gpa || '',
      relevantCoursework: settings.account.relevantCoursework || []
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof EducationData, value: string | string[]) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const addCourse = () => {
    if (newCourse.trim()) {
      handleInputChange('relevantCoursework', [...tempData.relevantCoursework, newCourse.trim()]);
      setNewCourse('');
    }
  };

  const removeCourse = (index: number) => {
    const updated = tempData.relevantCoursework.filter((_, i) => i !== index);
    handleInputChange('relevantCoursework', updated);
  };

  const groupedMajors = STUDENT_MAJORS.reduce((acc, major) => {
    const category = major.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(major);
    return acc;
  }, {} as Record<string, typeof STUDENT_MAJORS[number][]>);

  return (
    <SettingCard
      icon={GraduationCap}
      title="Education Information"
      description="Your academic background helps match you with relevant micro-internships"
    >
      <div className="space-y-6">
        {/* University Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            University <span className="text-red-500">*</span>
          </label>
          <select
            value={tempData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            required
          >
            <option value="">Select your university</option>
            {HK_UNIVERSITIES.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Select your Hong Kong university
          </p>
        </div>

        {/* Major Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Major/Field of Study <span className="text-red-500">*</span>
          </label>
          <select
            value={tempData.major}
            onChange={(e) => handleInputChange('major', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            required
          >
            <option value="">Select your major</option>
            {Object.entries(groupedMajors).map(([category, majors]) => (
              <optgroup key={category} label={category}>
                {majors.map((major) => (
                  <option key={major.value} value={major.value}>
                    {major.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your area of specialization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Year of Study */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Study <span className="text-red-500">*</span>
            </label>
            <select
              value={tempData.yearOfStudy}
              onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
              required
            >
              <option value="">Select year</option>
              {YEAR_OF_STUDY.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Graduation */}
          <Input
            label="Expected Graduation"
            type="month"
            value={tempData.graduationDate}
            onChange={(e) => handleInputChange('graduationDate', e.target.value)}
            disabled={!isEditing}
            placeholder="2025-06"
            helpText="Month and year"
          />
        </div>

        {/* GPA (Optional) */}
        <Input
          label="GPA (Optional)"
          type="number"
          step="0.01"
          min="0"
          max="4.0"
          value={tempData.gpa}
          onChange={(e) => handleInputChange('gpa', e.target.value)}
          disabled={!isEditing}
          placeholder="3.75"
          helpText="On a 4.0 scale (optional but recommended)"
        />

        {/* Relevant Coursework */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Relevant Coursework <span className="text-gray-400">(Optional)</span>
          </label>
          
          {/* Course List */}
          {tempData.relevantCoursework.length > 0 && (
            <div className="mb-3 space-y-2">
              {tempData.relevantCoursework.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {course}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => removeCourse(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Course Input */}
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="e.g., Data Structures and Algorithms"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addCourse()}
              />
              <Button
                onClick={addCourse}
                icon={Plus}
                size="sm"
                disabled={!newCourse.trim()}
              >
                Add
              </Button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            List courses relevant to your target micro-internships
          </p>
        </div>

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
                  Edit Education
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  );
};

export default EducationInfoSection;
