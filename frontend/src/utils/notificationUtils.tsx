import toast from "react-hot-toast";
import React from "react";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export interface NotificationConfig {
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  duration?: number;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface JobApplicationNotification {
  success: NotificationConfig;
  error: NotificationConfig;
  validationError: NotificationConfig;
}

export interface JobPostingNotification {
  success: NotificationConfig;
  error: NotificationConfig;
  validationError: NotificationConfig;
  draftSaved: NotificationConfig;
}

// Student job application notifications
export const studentApplicationNotifications: JobApplicationNotification = {
  success: {
    title: "Application Submitted Successfully!",
    message: "Your application has been submitted successfully! You can track your application status in your dashboard.",
    actionText: "View Applications",
    actionUrl: "/student_portal/workspace/applications",
    duration: 6000,
    type: 'success'
  },
  error: {
    title: "Application Failed",
    message: "Your application could not be submitted. Please check your internet connection and try again.",
    actionText: "Try Again",
    duration: 8000,
    type: 'error'
  },
  validationError: {
    title: "Missing Information",
    message: "Please ensure all required fields are filled out correctly before submitting your application.",
    actionText: "Review Form",
    duration: 6000,
    type: 'error'
  }
};

// Employer job posting notifications
export const employerPostingNotifications: JobPostingNotification = {
  success: {
    title: "Job Posted Successfully!",
    message: "Your job has been posted successfully! You can manage your job posts in the Employer Portal.",
    actionText: "Manage Jobs",
    actionUrl: "/employer_portal/workspace/manage-jobs",
    duration: 6000,
    type: 'success'
  },
  error: {
    title: "Job Posting Failed",
    message: "Your job could not be posted. Please ensure all required fields are filled and try again.",
    actionText: "Try Again",
    duration: 8000,
    type: 'error'
  },
  validationError: {
    title: "Missing Required Information",
    message: "Please ensure all required fields are filled out correctly before posting your job.",
    actionText: "Review Form",
    duration: 6000,
    type: 'error'
  },
  draftSaved: {
    title: "Draft Saved",
    message: "Your job draft has been saved successfully. You can continue editing or publish it later.",
    actionText: "Continue Editing",
    duration: 4000,
    type: 'info'
  }
};

// Profile completion notifications
export const profileNotifications = {
  success: {
    title: "Profile Updated Successfully!",
    message: "Your profile has been updated successfully! This will help improve your job matching.",
    duration: 5000,
    type: 'success' as const
  },
  error: {
    title: "Profile Update Failed",
    message: "Your profile could not be updated. Please try again or contact support if the issue persists.",
    duration: 6000,
    type: 'error' as const
  }
};

// Generic notification helper
export const showNotification = (config: NotificationConfig) => {
  const {
    title,
    message,
    actionText,
    actionUrl,
    duration = 5000,
    type
  } = config;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0'
          }
        };
      case 'error':
        return {
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca'
          }
        };
      case 'warning':
        return {
          style: {
            background: '#fffbeb',
            color: '#d97706',
            border: '1px solid #fed7aa'
          }
        };
      case 'info':
        return {
          style: {
            background: '#eff6ff',
            color: '#2563eb',
            border: '1px solid #bfdbfe'
          }
        };
      default:
        return {};
    }
  };

  const toastContent = (
    <div className="flex items-start space-x-3">
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-sm opacity-90 mb-2">{message}</p>
        {actionText && actionUrl && (
          <button
            onClick={() => {
              window.location.href = actionUrl;
            }}
            className="text-sm font-medium underline hover:no-underline transition-all"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );

  return toast(toastContent, {
    duration,
    ...getStyle(),
    position: 'top-center',
    ariaProps: {
      role: 'alert',
      'aria-live': 'assertive'
    }
  });
};

// Specific notification functions for better developer experience
export const showApplicationSuccess = () => {
  showNotification(studentApplicationNotifications.success);
};

export const showApplicationError = (isValidationError = false) => {
  const config = isValidationError 
    ? studentApplicationNotifications.validationError 
    : studentApplicationNotifications.error;
  showNotification(config);
};

export const showJobPostingSuccess = () => {
  showNotification(employerPostingNotifications.success);
};

export const showJobPostingError = (isValidationError = false) => {
  const config = isValidationError 
    ? employerPostingNotifications.validationError 
    : employerPostingNotifications.error;
  showNotification(config);
};

export const showDraftSaved = () => {
  showNotification(employerPostingNotifications.draftSaved);
};

export const showProfileUpdateSuccess = () => {
  showNotification(profileNotifications.success);
};

export const showProfileUpdateError = () => {
  showNotification(profileNotifications.error);
};

// Utility function to handle form validation errors
export const showValidationErrors = (errors: Record<string, string[]>) => {
  const errorMessages = Object.values(errors).flat();
  const message = errorMessages.length > 0 
    ? `Please fix the following issues: ${errorMessages.join(', ')}`
    : 'Please check your form and try again.';

  showNotification({
    title: 'Validation Errors',
    message,
    duration: 8000,
    type: 'error'
  });
};

// Utility function to handle network errors
export const showNetworkError = (operation: string) => {
  showNotification({
    title: `${operation} Failed`,
    message: 'Network error occurred. Please check your internet connection and try again.',
    duration: 6000,
    type: 'error'
  });
};

// Utility function to handle server errors
export const showServerError = (operation: string) => {
  showNotification({
    title: `${operation} Failed`,
    message: 'Server error occurred. Please try again later or contact support if the issue persists.',
    duration: 6000,
    type: 'error'
  });
};
