'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  relevanceScore: number;
  url?: string;
}

interface PortfolioSelectionStepProps {
  portfolioItems: PortfolioItem[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  additionalNotes: string;
  onNotesChange: (notes: string) => void;
  className?: string;
}

export const PortfolioSelectionStep: React.FC<PortfolioSelectionStepProps> = ({
  portfolioItems,
  selectedItems,
  onSelectionChange,
  additionalNotes,
  onNotesChange,
  className = ''
}) => {
  const handleItemToggle = (itemId: string) => {
    const isSelected = selectedItems.includes(itemId);
    const newSelection = isSelected
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Select Relevant Portfolio Items
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose projects that best demonstrate your fit for this role
        </p>
      </div>

      <div className="space-y-4">
        {portfolioItems
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .map(item => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <div
                key={item.id}
                onClick={() => handleItemToggle(item.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded border-2 mt-1 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <CheckCircle className="w-3 h-3" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          item.relevanceScore >= 0.9 ? 'bg-green-500' :
                          item.relevanceScore >= 0.8 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(item.relevanceScore * 100)}% match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {item.url && (
                      <div className="mt-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Project →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Any additional information you'd like to share..."
        />
      </div>
    </div>
  );
};

export default PortfolioSelectionStep;