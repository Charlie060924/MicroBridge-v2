"use client";

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/Button';

export type ModalType = 'success' | 'error';

export interface JobActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  retryLabel?: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

const JobActionModal: React.FC<JobActionModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction,
  retryLabel = 'Try Again',
  onRetry,
  isLoading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800';
      case 'error':
        return 'border-red-200 dark:border-red-800';
      default:
        return 'border-yellow-200 dark:border-yellow-800';
    }
  };

  const footer = (
    <div className="flex items-center justify-end space-x-3">
      {type === 'error' && onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isLoading}
          icon={RefreshCw}
          loading={isLoading}
        >
          {retryLabel}
        </Button>
      )}
      {actionLabel && onAction ? (
        <Button
          variant="primary"
          onClick={onAction}
          disabled={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          {actionLabel}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onClose}
          disabled={isLoading}
        >
          Close
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      footer={footer}
      closeOnOverlayClick={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        {type === 'success' && (
          <div className={`p-4 rounded-lg border ${getBackgroundColor()} ${getBorderColor()}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {actionLabel ? 
                `You can ${actionLabel.toLowerCase()} to view your ${actionLabel.includes('Applications') ? 'applications' : 'job postings'}.` :
                'Your action has been completed successfully.'
              }
            </p>
          </div>
        )}
        
        {type === 'error' && (
          <div className={`p-4 rounded-lg border ${getBackgroundColor()} ${getBorderColor()}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please check your information and try again. If the problem persists, contact support.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default JobActionModal;
