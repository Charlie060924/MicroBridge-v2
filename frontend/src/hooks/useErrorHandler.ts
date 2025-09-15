"use client";

import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ErrorState {
  error: Error | null;
  isError: boolean;
  retryCount: number;
  lastErrorTime: number;
}

interface UseErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  showToast?: boolean;
  toastPosition?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  onError?: (error: Error) => void;
  enableRecovery?: boolean;
}

interface ErrorHandlerResult {
  error: Error | null;
  isError: boolean;
  retryCount: number;
  handleError: (error: Error) => void;
  clearError: () => void;
  retry: (retryFn?: () => Promise<void> | void) => Promise<void>;
  canRetry: boolean;
}

const useErrorHandler = (options: UseErrorHandlerOptions = {}): ErrorHandlerResult => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    showToast = true,
    toastPosition = 'top-right',
    onError,
    enableRecovery = true
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    retryCount: 0,
    lastErrorTime: 0
  });

  const getErrorMessage = (error: Error): string => {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Connection problem. Please check your internet and try again.';
    }
    
    // Permission errors
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return 'You don\'t have permission to perform this action.';
    }
    
    // Not found errors
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return 'The requested resource was not found.';
    }
    
    // Server errors
    if (error.message.includes('500') || error.message.includes('Internal Server')) {
      return 'Server error. Our team has been notified and is working on it.';
    }
    
    // Rate limiting
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    // Timeout errors
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    
    // Generic fallback
    return error.message || 'Something went wrong. Please try again.';
  };

  const handleError = useCallback((error: Error) => {
    const now = Date.now();
    
    setErrorState(prev => ({
      error,
      isError: true,
      retryCount: now - prev.lastErrorTime < 5000 ? prev.retryCount + 1 : 0,
      lastErrorTime: now
    }));

    // Call custom error handler
    onError?.(error);

    // Show toast notification
    if (showToast) {
      const message = getErrorMessage(error);
      toast.error(message, {
        position: toastPosition,
        duration: 4000,
        id: `error-${now}` // Prevent duplicate toasts
      });
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', error);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && enableRecovery) {
      // Example: Send to error monitoring service
      // errorReporting.captureError(error, { retryCount: errorState.retryCount });
    }
  }, [onError, showToast, toastPosition, enableRecovery]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      retryCount: 0,
      lastErrorTime: 0
    });
  }, []);

  const retry = useCallback(async (retryFn?: () => Promise<void> | void) => {
    if (errorState.retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please refresh the page.', {
        position: toastPosition
      });
      return;
    }

    try {
      clearError();
      
      // Add delay before retry
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      // Execute retry function if provided
      if (retryFn) {
        await retryFn();
      }

      if (showToast) {
        toast.success('Action completed successfully!', {
          position: toastPosition
        });
      }
    } catch (retryError) {
      handleError(retryError as Error);
    }
  }, [errorState.retryCount, maxRetries, retryDelay, showToast, toastPosition, clearError, handleError]);

  const canRetry = errorState.retryCount < maxRetries;

  return {
    error: errorState.error,
    isError: errorState.isError,
    retryCount: errorState.retryCount,
    handleError,
    clearError,
    retry,
    canRetry
  };
};

// Higher-order component for wrapping components with error handling
export const withErrorHandler = <P extends object>(
  Component: React.ComponentType<P>,
  errorHandlerOptions?: UseErrorHandlerOptions
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const errorHandler = useErrorHandler(errorHandlerOptions);
    
    return React.createElement(Component, {
      ...props,
      errorHandler
    } as P);
  };

  WrappedComponent.displayName = `withErrorHandler(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default useErrorHandler;