import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { ProjectCategory, categoryLabels } from '../types';

interface ProjectBasicInfoFormProps {
  formData: {
    title: string;
    description: string;
    category: ProjectCategory;
    dateCompleted: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const ProjectBasicInfoForm: React.FC<ProjectBasicInfoFormProps> = ({
  formData,
  onChange,
  errors
}) => {
  return (
    <div className="space-y-6">
      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
            errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Enter your project title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-colors ${
            errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Describe your project, its goals, and key features..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Category and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Completion Date
          </label>
          <input
            type="date"
            value={formData.dateCompleted}
            onChange={(e) => onChange('dateCompleted', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicInfoForm;