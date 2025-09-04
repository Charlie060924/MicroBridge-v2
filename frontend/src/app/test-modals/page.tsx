"use client";

import React, { useState, useCallback } from 'react';
import JobActionModal, { ModalType } from '@/components/common/JobActionModal';
import Button from '@/components/ui/button';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  actionLabel?: string;
}

const TestModalsPage: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    actionLabel: ''
  });

  const showModal = useCallback((type: ModalType, title: string, message: string, actionLabel?: string) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      actionLabel
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleModalAction = useCallback(() => {
    closeModal();
    alert('Modal action triggered!');
  }, [closeModal]);

  const handleRetry = useCallback(() => {
    closeModal();
    alert('Retry action triggered!');
  }, [closeModal]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Job Action Modal Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Application Tests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Student Application Tests
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => showModal(
                  'success',
                  'Application Submitted Successfully!',
                  'Your application has been submitted successfully. The employer will review your application and get back to you soon.',
                  'View My Applications'
                )}
              >
                Test Success Modal
              </Button>
              
              <Button
                variant="danger"
                onClick={() => showModal(
                  'error',
                  'Application Failed',
                  'Failed to submit application: Network error occurred. Please check your internet connection and try again.'
                )}
              >
                Test Error Modal
              </Button>
            </div>
          </div>

          {/* Employer Job Posting Tests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Employer Job Posting Tests
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => showModal(
                  'success',
                  'Job Posted Successfully!',
                  'Your job has been posted successfully and is now visible to candidates. You can manage your job postings from the employer portal.',
                  'Manage My Jobs'
                )}
              >
                Test Success Modal
              </Button>
              
              <Button
                variant="danger"
                onClick={() => showModal(
                  'error',
                  'Job Posting Failed',
                  'Failed to publish job: Server error occurred. Please check your information and try again.'
                )}
              >
                Test Error Modal
              </Button>
            </div>
          </div>

          {/* Draft Save Tests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Draft Save Tests
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={() => showModal(
                  'success',
                  'Draft Saved Successfully!',
                  'Your job draft has been saved successfully. You can continue editing or publish it later.',
                  'Manage My Jobs'
                )}
              >
                Test Success Modal
              </Button>
              
              <Button
                variant="danger"
                onClick={() => showModal(
                  'error',
                  'Draft Save Failed',
                  'Failed to save draft: Database connection error. Please try again.'
                )}
              >
                Test Error Modal
              </Button>
            </div>
          </div>

          {/* Generic Tests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Generic Tests
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => showModal(
                  'success',
                  'Operation Completed!',
                  'Your operation has been completed successfully.',
                  'Continue'
                )}
              >
                Test Generic Success
              </Button>
              
              <Button
                variant="outline"
                onClick={() => showModal(
                  'error',
                  'Operation Failed',
                  'An unexpected error occurred. Please try again later.'
                )}
              >
                Test Generic Error
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Test Instructions
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2">
            <li>• Click any button to test different modal scenarios</li>
            <li>• Success modals show green styling with action buttons</li>
            <li>• Error modals show red styling with retry buttons</li>
            <li>• Modals can be closed by clicking the X, backdrop, or pressing Escape</li>
            <li>• Action buttons will trigger an alert and close the modal</li>
            <li>• Retry buttons will trigger an alert and close the modal</li>
          </ul>
        </div>
      </div>

      {/* Job Action Modal */}
      <JobActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actionLabel={modalState.actionLabel}
        onAction={handleModalAction}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default TestModalsPage;
