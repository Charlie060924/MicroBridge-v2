import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Check, Edit3, Send, LucideIcon } from 'lucide-react';
import Button from './ui/Button';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
}

interface StickyActionBarProps {
  isVisible: boolean;
  actions: Action[];
  onClose?: () => void;
  title?: string;
  className?: string;
}

const StickyActionBar: React.FC<StickyActionBarProps> = ({
  isVisible,
  actions,
  onClose,
  title,
  className = '',
}) => {
  const barVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      y: 100,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm ${className}`}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center space-x-4">
                {title && (
                  <motion.h3 
                    className="text-sm font-medium text-gray-900 dark:text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {title}
                  </motion.h3>
                )}
              </div>

              {/* Center - Actions */}
              <div className="flex items-center space-x-3">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      variant={action.variant || 'primary'}
                      onClick={action.onClick}
                      icon={action.icon}
                      loading={action.loading}
                      disabled={action.disabled}
                      size="md"
                    >
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Right side - Close button */}
              {onClose && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    icon={X}
                    aria-label="Close"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Predefined action bar configurations
export const EditProfileActionBar: React.FC<{
  isVisible: boolean;
  onSave: () => void;
  onCancel: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
}> = ({ isVisible, onSave, onCancel, onPreview, isSaving }) => (
  <StickyActionBar
    isVisible={isVisible}
    title="Editing Profile"
    actions={[
      ...(onPreview ? [{
        label: "Preview",
        onClick: onPreview,
        variant: "secondary" as const,
        icon: Edit3
      }] : []),
      {
        label: "Save Changes",
        onClick: onSave,
        variant: "primary" as const,
        icon: Save,
        loading: isSaving
      },
      {
        label: "Cancel",
        onClick: onCancel,
        variant: "ghost" as const,
        icon: X
      }
    ]}
  />
);

export const JobApplicationActionBar: React.FC<{
  isVisible: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}> = ({ isVisible, onSubmit, onSaveDraft, onCancel, isSubmitting }) => (
  <StickyActionBar
    isVisible={isVisible}
    title="Job Application"
    actions={[
      {
        label: "Save Draft",
        onClick: onSaveDraft,
        variant: "secondary" as const,
        icon: Save
      },
      {
        label: "Submit Application",
        onClick: onSubmit,
        variant: "primary" as const,
        icon: Send,
        loading: isSubmitting
      },
      {
        label: "Cancel",
        onClick: onCancel,
        variant: "ghost" as const,
        icon: X
      }
    ]}
  />
);

export const SettingsActionBar: React.FC<{
  isVisible: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}> = ({ isVisible, onSave, onReset, isSaving, hasChanges }) => (
  <StickyActionBar
    isVisible={isVisible}
    title={hasChanges ? "Unsaved Changes" : "Settings"}
    actions={[
      {
        label: "Reset",
        onClick: onReset,
        variant: "secondary" as const,
        icon: X
      },
      {
        label: "Save All",
        onClick: onSave,
        variant: "primary" as const,
        icon: Check,
        loading: isSaving,
        disabled: !hasChanges
      }
    ]}
  />
);

export default StickyActionBar;
