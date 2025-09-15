'use client';
import React, { useState } from 'react';
import { Eye, AlertCircle, Send } from 'lucide-react';
import { JobResponse } from '@/services/jobService';
import { PortfolioItem } from './PortfolioSelectionStep';

interface ApplicationData {
  cover_letter: string;
  selected_portfolio_items: string[];
  additional_notes: string;
}

interface ReviewStepProps {
  job: JobResponse;
  applicationData: ApplicationData;
  portfolioItems: PortfolioItem[];
  onSubmit: () => void;
  isSubmitting: boolean;
  className?: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  job,
  applicationData,
  portfolioItems,
  onSubmit,
  isSubmitting,
  className = ''
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const selectedPortfolioItems = portfolioItems.filter(item => 
    applicationData.selected_portfolio_items.includes(item.id)
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Review Your Application
      </h3>

      {/* Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Job Details</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Position:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{job.title}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Company:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{job.company}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Location:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{job.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Application Summary</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Cover Letter:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {applicationData.cover_letter.length} characters
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Portfolio Items:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {applicationData.selected_portfolio_items.length} selected
              </span>
            </div>
            {applicationData.additional_notes && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Additional Notes:</span>
                <span className="ml-2 text-gray-900 dark:text-white">Included</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? 'Hide' : 'Preview'} Application</span>
        </button>
      </div>

      {/* Preview Content */}
      {showPreview && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Application Preview</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Letter:</h5>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {applicationData.cover_letter}
              </div>
            </div>
            
            {selectedPortfolioItems.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Portfolio Items:</h5>
                <div className="space-y-2">
                  {selectedPortfolioItems.map(item => (
                    <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-gray-600 dark:text-gray-400">{item.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.technologies.map(tech => (
                          <span key={tech} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs text-gray-600 dark:text-gray-300 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {applicationData.additional_notes && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes:</h5>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {applicationData.additional_notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Actions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Ready to submit?</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Once submitted, you won't be able to edit your application. Make sure everything looks good!
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !applicationData.cover_letter.trim()}
          className="flex items-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;