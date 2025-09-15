"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // errorReporting.captureError(error, errorInfo);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    // Limit retry attempts
    if (retryCount >= 3) {
      return;
    }

    this.setState({ isRetrying: true });
    
    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        retryCount: retryCount + 1
      });
    }, 1000);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleContactSupport = () => {
    window.location.href = '/help/contact';
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, retryCount, isRetrying } = this.state;
      const isRetryDisabled = retryCount >= 3 || isRetrying;

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-black mb-4">
              Something went wrong
            </h1>

            {/* User-friendly error message */}
            <p className="text-waterloo mb-6 leading-relaxed">
              We're sorry, but something unexpected happened. 
              This error has been logged and we're working to fix it.
            </p>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Development Error Details:
                </h3>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button */}
              <button
                onClick={this.handleRetry}
                disabled={isRetryDisabled}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isRetryDisabled
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
                    Try Again {retryCount > 0 && `(${3 - retryCount} left)`}
                  </>
                )}
              </button>

              {/* Home Button */}
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-gray-100 text-black hover:bg-gray-200 transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>

              {/* Contact Support Button */}
              <button
                onClick={this.handleContactSupport}
                className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium text-primary hover:text-primary-hover hover:bg-neutral-light transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-waterloo">
                Error Code: {Date.now().toString(36).toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Please include this code when contacting support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;