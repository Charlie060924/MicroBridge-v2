import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Button from './ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: LucideIcon;
  };
  illustration?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className = '',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Illustration or Icon */}
      <motion.div variants={itemVariants} className="mb-6">
        {illustration ? (
          <div className="w-32 h-32 text-gray-300 dark:text-gray-600">
            {illustration}
          </div>
        ) : Icon ? (
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants} className="max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div variants={itemVariants} className="flex items-center space-x-3 mt-8">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'secondary'}
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Predefined empty states for common scenarios
export const NoJobsEmptyState: React.FC<{ onBrowseJobs?: () => void }> = ({ onBrowseJobs }) => (
  <EmptyState
    title="No jobs found"
    description="We couldn't find any jobs matching your criteria. Try adjusting your filters or browse all available opportunities."
    action={onBrowseJobs ? {
      label: "Browse All Jobs",
      onClick: onBrowseJobs,
      variant: "primary"
    } : undefined}
    illustration={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
      </svg>
    }
  />
);

export const NoApplicationsEmptyState: React.FC<{ onBrowseJobs?: () => void }> = ({ onBrowseJobs }) => (
  <EmptyState
    title="No applications yet"
    description="You haven't applied to any jobs yet. Start exploring opportunities and apply to positions that match your skills and interests."
    action={onBrowseJobs ? {
      label: "Find Jobs",
      onClick: onBrowseJobs,
      variant: "primary"
    } : undefined}
    illustration={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
  />
);

export const NoNotificationsEmptyState: React.FC = () => (
  <EmptyState
    title="All caught up!"
    description="You don't have any notifications right now. We'll let you know when there are updates about your applications or new opportunities."
    illustration={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    }
  />
);

export const NoResultsEmptyState: React.FC<{ onClearFilters?: () => void }> = ({ onClearFilters }) => (
  <EmptyState
    title="No results found"
    description="We couldn't find anything matching your search. Try adjusting your filters or search terms."
    action={onClearFilters ? {
      label: "Clear Filters",
      onClick: onClearFilters,
      variant: "secondary"
    } : undefined}
    illustration={
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
  />
);

export default EmptyState;
