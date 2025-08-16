import React, { useState } from 'react';
import { GraduationCap, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { HK_UNIVERSITIES, STUDENT_MAJORS, YEAR_OF_STUDY } from '../../settings/utils/studentConstants';

interface EducationData {
  university: string;
  major: string;
  yearOfStudy: string;
  graduationDate: string;
  gpa: string;
  relevantCoursework: string[];
}

interface EducationSectionProps {
  data: EducationData;
  onUpdate: (data: EducationData) => void;
  isPreviewMode?: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  data, 
  onUpdate, 
  isPreviewMode = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<EducationData>(data);
  const [newCourse, setNewCourse] = useState('');

  const handleSave = () => {
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(data);
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

  const getUniversityDisplayName = (value: string) => {
    return HK_UNIVERSITIES.find(uni => uni === value) || value;
  };

  const getMajorDisplayName = (value: string) => {
    return STUDENT_MAJORS.find(major => major.value === value)?.label || value;
  };

  const getYearDisplayName = (value: string) => {
    return YEAR_OF_STUDY.find(year => year.value === value)?.label || value;
  };

  if (isPreviewMode) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{getUniversityDisplayName(data.university)}</h4>
            <p className="text-gray-600 dark:text-gray-400">{getMajorDisplayName(data.major)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getYearDisplayName(data.yearOfStudy)} • Expected Graduation: {data.graduationDate || 'Not specified'}
            </p>
            {data.gpa && (
              <p className="text-sm text-gray-500 dark:text-gray-400">GPA: {data.gpa}/4.0</p>
            )}
          </div>

          {data.relevantCoursework.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Relevant Coursework</h5>
              <div className="flex flex-wrap gap-2">
                {data.relevantCoursework.map((course, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {course}
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
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h3>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* University Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              University <span className="text-red-500">*</span>
            </label>
            <select
              value={tempData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select your university</option>
              {HK_UNIVERSITIES.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </div>

          {/* Major Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Major/Field of Study <span className="text-red-500">*</span>
            </label>
            <select
              value={tempData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expected Graduation
              </label>
              <input
                type="month"
                value={tempData.graduationDate}
                onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="2025-06"
              />
            </div>
          </div>

          {/* GPA (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GPA (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              value={tempData.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="3.75"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              On a 4.0 scale (optional but recommended)
            </p>
          </div>

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
                    <button
                      onClick={() => removeCourse(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Course Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="e.g., Data Structures and Algorithms"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addCourse()}
              />
              <button
                onClick={addCourse}
                disabled={!newCourse.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{getUniversityDisplayName(data.university) || 'University not specified'}</h4>
            <p className="text-gray-600 dark:text-gray-400">{getMajorDisplayName(data.major) || 'Major not specified'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getYearDisplayName(data.yearOfStudy) || 'Year not specified'} • Expected Graduation: {data.graduationDate || 'Not specified'}
            </p>
            {data.gpa && (
              <p className="text-sm text-gray-500 dark:text-gray-400">GPA: {data.gpa}/4.0</p>
            )}
          </div>

          {data.relevantCoursework.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Relevant Coursework</h5>
              <div className="flex flex-wrap gap-2">
                {data.relevantCoursework.map((course, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {course}
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

export default EducationSection;
