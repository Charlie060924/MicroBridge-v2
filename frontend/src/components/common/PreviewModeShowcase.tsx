"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  X,
  Sparkles,
  DollarSign,
  Clock
} from 'lucide-react';
import { usePreviewMode } from '@/context/PreviewModeContext';

interface PreviewModeShowcaseProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'modal';
}

export const PreviewModeShowcase: React.FC<PreviewModeShowcaseProps> = ({ 
  className = '', 
  variant = 'inline' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const router = useRouter();
  const { previewType, getDemoData, getABTestVariation } = usePreviewMode();

  const demoData = getDemoData();
  const ctaData = demoData?.cta;
  const socialProof = demoData?.socialProof;

  // A/B test variations
  const heroMessage = getABTestVariation('heroMessage');
  const ctaButton = getABTestVariation('ctaButton');
  const socialProofMessage = getABTestVariation('socialProof');

  const handleSignUp = useCallback(() => {
    // Track conversion
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'preview_signup_clicked', {
        preview_type: previewType,
        cta_variant: ctaButton,
        location: variant
      });
    }

    // Navigate to signup based on preview type
    if (previewType === 'student') {
      router.push('/auth/signup?role=student&from=preview');
    } else if (previewType === 'employer') {
      router.push('/auth/employer-signup?from=preview');
    } else {
      router.push('/auth/signup?from=preview');
    }
  }, [previewType, ctaButton, variant, router]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!isVisible || !ctaData) return null;

  const features = ctaData.features || [];

  // Floating CTA variant
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}>
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm transform transition-all duration-300 hover:scale-105">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 mr-2" />
            <h3 className="text-base sm:text-lg font-bold">Try it Free!</h3>
          </div>
          
          <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">
            {heroMessage}
          </p>
          
          <button
            onClick={handleSignUp}
            className="w-full bg-white text-primary font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
          >
            <span className="sm:hidden">Join Now</span>
            <span className="hidden sm:inline">{ctaButton}</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
          </button>
          
          <p className="text-white/70 text-xs mt-2 text-center">
            {socialProofMessage}
          </p>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl mx-4 overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-3" />
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            </div>
            
            <p className="text-white/90 text-lg mb-6">
              {heroMessage}
            </p>
            
            <button
              onClick={handleSignUp}
              className="bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center mx-auto text-lg"
            >
              {ctaButton}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  What You'll Get:
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Join the Community:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {socialProof?.totalStudentsHired.toLocaleString()}+ students hired
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {socialProof?.totalJobsPosted.toLocaleString()}+ jobs posted
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {socialProof?.averageRating}/5 average rating
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      ${(socialProof?.totalEarningsDistributed || 0).toLocaleString()} earned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (default) - Mobile optimized
  return (
    <div className={`bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white p-4 sm:p-6 lg:p-8 my-6 sm:my-8 ${className}`}>
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center flex-1">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{ctaData.primary}</h2>
            <p className="text-white/90 text-sm sm:text-base mt-1">{ctaData.secondary}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white ml-2 flex-shrink-0"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Features showcase with animation - Mobile optimized */}
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">What you'll get:</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start sm:items-center transform transition-all duration-300 ${
                  index === currentFeatureIndex ? 'scale-105 text-yellow-200' : ''
                }`}
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-sm sm:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Join thousands of others:</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start sm:items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{socialProof?.totalStudentsHired.toLocaleString()}+ students already hired</span>
            </div>
            <div className="flex items-start sm:items-center">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{socialProof?.totalJobsPosted.toLocaleString()}+ jobs posted monthly</span>
            </div>
            <div className="flex items-start sm:items-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{socialProof?.averageRating}/5 average satisfaction</span>
            </div>
            <div className="flex items-start sm:items-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">Average project: 2-6 weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button - Mobile optimized */}
      <div className="text-center">
        <button
          onClick={handleSignUp}
          className="bg-white text-primary font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto text-base sm:text-lg w-full sm:w-auto"
        >
          <span className="sm:hidden">Join Free</span>
          <span className="hidden sm:inline">{ctaButton}</span>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
        </button>
        <p className="text-white/80 text-xs sm:text-sm mt-2 sm:mt-3">
          {socialProofMessage} • No credit card required
        </p>
      </div>
    </div>
  );
};

// Hook for managing showcase state
export const usePreviewModeShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFloating, setShowFloating] = useState(true);
  const { isPreviewMode } = usePreviewMode();

  const triggerModal = useCallback(() => {
    if (isPreviewMode) {
      setShowModal(true);
    }
  }, [isPreviewMode]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeFloating = useCallback(() => {
    setShowFloating(false);
  }, []);

  return {
    showModal,
    showFloating,
    triggerModal,
    closeModal,
    closeFloating,
    isPreviewMode
  };
};

export default PreviewModeShowcase;