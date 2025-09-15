import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { ProjectCategory } from './types';

interface Suggestion {
  category: ProjectCategory;
  title: string;
  description: string;
}

interface SmartSuggestionsProps {
  userCareerFields: string[];
  existingProjects: { category: ProjectCategory }[];
  onShowUploadModal: () => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  userCareerFields,
  existingProjects,
  onShowUploadModal
}) => {
  const getSmartSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    if (userCareerFields.includes('web-development') && !existingProjects.some(p => p.category === 'web-development')) {
      suggestions.push({
        category: 'web-development',
        title: 'Web Development Project',
        description: 'Showcase your front-end or full-stack development skills'
      });
    }
    
    if (userCareerFields.includes('design') && !existingProjects.some(p => p.category === 'design')) {
      suggestions.push({
        category: 'design',
        title: 'Design Portfolio',
        description: 'Display your UI/UX or graphic design work'
      });
    }

    if (userCareerFields.includes('data-science') && !existingProjects.some(p => p.category === 'data-science')) {
      suggestions.push({
        category: 'data-science',
        title: 'Data Science Project',
        description: 'Demonstrate your data analysis and machine learning skills'
      });
    }

    if (userCareerFields.includes('mobile-development') && !existingProjects.some(p => p.category === 'mobile-development')) {
      suggestions.push({
        category: 'mobile-development',
        title: 'Mobile App Project',
        description: 'Show your iOS/Android development capabilities'
      });
    }

    return suggestions;
  };

  const suggestions = getSmartSuggestions();

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700"
    >
      <div className="flex items-center mb-3">
        <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
        <h4 className="font-medium text-amber-900 dark:text-amber-100">
          Suggested Projects
        </h4>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {suggestion.title}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                {suggestion.description}
              </p>
            </div>
            <button
              onClick={onShowUploadModal}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-amber-700 bg-amber-100 dark:bg-amber-800/30 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors duration-200"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;