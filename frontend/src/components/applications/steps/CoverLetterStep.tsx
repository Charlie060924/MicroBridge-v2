'use client';
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/Tooltip';

interface CoverLetterStepProps {
  coverLetter: string;
  onCoverLetterChange: (coverLetter: string) => void;
  className?: string;
}

export const CoverLetterStep: React.FC<CoverLetterStepProps> = ({
  coverLetter,
  onCoverLetterChange,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Customize Your Cover Letter
        </h3>
        <HelpTooltip content="Edit the template to personalize it. Add specific examples from your experience that relate to the job requirements." />
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Tips for a great cover letter:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
              <li>• Mention specific skills that match the job requirements</li>
              <li>• Include quantifiable achievements when possible</li>
              <li>• Show enthusiasm for the company and project</li>
              <li>• Keep it concise but comprehensive</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cover Letter *
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => onCoverLetterChange(e.target.value)}
          rows={16}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Write your cover letter here..."
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {coverLetter.length} characters
        </p>
      </div>
    </div>
  );
};

export default CoverLetterStep;