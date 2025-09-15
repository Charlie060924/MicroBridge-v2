"use client";

import React from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft, Wifi, WifiOff } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  type?: 'network' | 'permission' | 'not-found' | 'server' | 'generic';
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  retryText?: string;
  className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  type = 'generic',
  title,
  message,
  showRetry = true,
  showHome = true,
  showBack = false,
  retryText = 'Try Again',
  className = ''
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onlineState !== false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    
    // Add delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    resetError?.();
    setIsRetrying(false);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: isOnline ? Wifi : WifiOff,
          iconColor: isOnline ? 'text-blue-500' : 'text-red-500',
          iconBg: isOnline ? 'bg-blue-100' : 'bg-red-100',
          defaultTitle: isOnline ? 'Connection Issue' : 'No Internet Connection',
          defaultMessage: isOnline 
            ? 'Unable to connect to our servers. Please check your connection and try again.'
            : 'Please check your internet connection and try again.'
        };
      
      case 'permission':
        return {
          icon: AlertCircle,
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-100',
          defaultTitle: 'Access Denied',
          defaultMessage: 'You don\'t have permission to access this resource. Please contact support if you believe this is an error.'
        };
      
      case 'not-found':
        return {
          icon: AlertCircle,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-100',
          defaultTitle: 'Page Not Found',
          defaultMessage: 'The page you\'re looking for doesn\'t exist or has been moved.'
        };
      
      case 'server':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          defaultTitle: 'Server Error',
          defaultMessage: 'Our servers are experiencing issues. We\'re working to fix this as quickly as possible.'
        };
      
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          defaultTitle: 'Something went wrong',
          defaultMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {/* Error Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${config.iconBg}`}>
        <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
      </div>

      {/* Error Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
        {title || config.defaultTitle}
      </h2>

      {/* Error Message */}
      <p className="text-waterloo mb-8 max-w-md leading-relaxed">
        {message || config.defaultMessage}
      </p>

      {/* Development Error Details */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left w-full max-w-md">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Development Error Details:
          </h3>
          <p className="text-xs text-gray-600 font-mono break-all">
            {error.message}
          </p>
          {error.stack && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Stack Trace
              </summary>
              <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        {/* Retry Button */}
        {showRetry && resetError && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isRetrying
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryText}
              </>
            )}
          </button>
        )}

        {/* Back Button */}
        {showBack && (
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-gray-100 text-black hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        )}

        {/* Home Button */}
        {showHome && (
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-primary hover:text-primary-hover hover:bg-neutral-light transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </button>
        )}
      </div>

      {/* Network Status */}
      {!isOnline && (
        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <WifiOff className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-sm text-red-700">
            You appear to be offline
          </span>
        </div>
      )}
    </div>
  );
};

export default ErrorFallback;