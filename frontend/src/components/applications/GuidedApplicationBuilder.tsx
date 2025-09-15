'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JobResponse } from '@/services/jobService';
import { applicationService, CreateApplicationRequest } from '@/services/applicationService';
import { useAuth } from '@/hooks/useAuth';
import ProgressIndicator from '@/components/common/ProgressIndicator';
import toast from 'react-hot-toast';

// Import step components
import TemplateSelectionStep, { COVER_LETTER_TEMPLATES } from './steps/TemplateSelectionStep';
import CoverLetterStep from './steps/CoverLetterStep';
import PortfolioSelectionStep from './steps/PortfolioSelectionStep';
import ReviewStep from './steps/ReviewStep';

// Import utilities
import { populateTemplate, getMockPortfolioItems, validateApplicationData } from './utils/templateUtils';

interface GuidedApplicationBuilderProps {
  job: JobResponse;
  onApplicationSubmitted?: (applicationId: string) => void;
  onCancel?: () => void;
  className?: string;
}

interface ApplicationData {
  cover_letter: string;
  selected_portfolio_items: string[];
  custom_resume?: string;
  additional_notes: string;
}

export const GuidedApplicationBuilder: React.FC<GuidedApplicationBuilderProps> = ({
  job,
  onApplicationSubmitted,
  onCancel,
  className = ''
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    cover_letter: '',
    selected_portfolio_items: [],
    additional_notes: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const portfolioItems = getMockPortfolioItems();

  const steps = [
    { id: 'template', label: 'Choose Template', completed: false },
    { id: 'cover-letter', label: 'Cover Letter', completed: false },
    { id: 'portfolio', label: 'Portfolio Selection', completed: false },
    { id: 'review', label: 'Review & Submit', completed: false }
  ];

  const [stepProgress, setStepProgress] = useState(
    steps.map(step => ({
      id: step.id,
      label: step.label,
      completed: false,
      current: false
    }))
  );

  useEffect(() => {
    setStepProgress(prev => prev.map((step, index) => ({
      ...step,
      current: index === currentStep,
      completed: index < currentStep
    })));
  }, [currentStep]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = COVER_LETTER_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const populatedTemplate = populateTemplate(template.template, job, portfolioItems, user?.name);
      setApplicationData(prev => ({
        ...prev,
        cover_letter: populatedTemplate
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitApplication = async () => {
    const validation = validateApplicationData(applicationData);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const request: CreateApplicationRequest = {
        job_id: job.id,
        cover_letter: applicationData.cover_letter,
        custom_resume: applicationData.custom_resume
      };

      const result = await applicationService.submitApplication(request);
      
      if (result.success && result.data) {
        toast.success('Application submitted successfully!');
        onApplicationSubmitted?.(result.data.id);
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TemplateSelectionStep
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            jobCategory={job.category}
            jobTitle={job.title}
          />
        );
      case 1:
        return (
          <CoverLetterStep
            coverLetter={applicationData.cover_letter}
            onCoverLetterChange={(coverLetter) => 
              setApplicationData(prev => ({ ...prev, cover_letter: coverLetter }))
            }
          />
        );
      case 2:
        return (
          <PortfolioSelectionStep
            portfolioItems={portfolioItems}
            selectedItems={applicationData.selected_portfolio_items}
            onSelectionChange={(selectedItems) => 
              setApplicationData(prev => ({ ...prev, selected_portfolio_items: selectedItems }))
            }
            additionalNotes={applicationData.additional_notes}
            onNotesChange={(notes) => 
              setApplicationData(prev => ({ ...prev, additional_notes: notes }))
            }
          />
        );
      case 3:
        return (
          <ReviewStep
            job={job}
            applicationData={applicationData}
            portfolioItems={portfolioItems}
            onSubmit={handleSubmitApplication}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Apply for {job.title}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
        
        <ProgressIndicator
          steps={stepProgress}
          className="max-w-md"
          showLabels={true}
          variant="horizontal"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleNextStep}
                disabled={currentStep === 0 && !selectedTemplate}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedApplicationBuilder;