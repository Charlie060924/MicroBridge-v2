import React from 'react';
import { Project, ProjectCategory, categoryLabels } from './types';

interface CategoryFilterProps {
  projects: Project[];
  selectedCategory: ProjectCategory | 'all';
  onCategoryChange: (category: ProjectCategory | 'all') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  projects,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All ({projects.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = projects.filter(p => p.category === key).length;
          return count > 0 ? (
            <button
              key={key}
              onClick={() => onCategoryChange(key as ProjectCategory)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label} ({count})
            </button>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;