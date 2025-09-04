"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NavigationMemory } from '@/utils/navigationMemory';
import { previewDemoDataService, PreviewDemoDataService } from '@/services/demoData';
import { previewAnalytics } from '@/services/previewAnalytics';

interface PreviewModeContextType {
  isPreviewMode: boolean;
  previewType: 'student' | 'employer' | null;
  enterPreviewMode: (type: 'student' | 'employer') => void;
  exitPreviewMode: () => void;
  isFeatureLocked: (feature: string) => boolean;
  currentLandingPage: 'student' | 'employer' | 'general' | null;
  demoDataService: PreviewDemoDataService;
  getDemoData: () => any;
  getABTestVariation: (element: string) => string;
  setABTestVariation: (variation: number) => void;
}

const PreviewModeContext = createContext<PreviewModeContextType | undefined>(undefined);

export const usePreviewMode = () => {
  const context = useContext(PreviewModeContext);
  if (context === undefined) {
    throw new Error('usePreviewMode must be used within a PreviewModeProvider');
  }
  return context;
};

interface PreviewModeProviderProps {
  children: ReactNode;
}

export const PreviewModeProvider: React.FC<PreviewModeProviderProps> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewType, setPreviewType] = useState<'student' | 'employer' | null>(null);
  const [currentLandingPage, setCurrentLandingPage] = useState<'student' | 'employer' | 'general' | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  // Detect current landing page based on pathname
  useEffect(() => {
    if (pathname === '/student') {
      setCurrentLandingPage('student');
      NavigationMemory.saveLandingOrigin('student');
    } else if (pathname === '/employer') {
      setCurrentLandingPage('employer');
      NavigationMemory.saveLandingOrigin('employer');
    } else if (pathname === '/') {
      setCurrentLandingPage('general');
      // For general landing page, we don't set a specific origin
      // Users will choose their path through the UI
    }
  }, [pathname]);

  // Check for preview mode on mount and when search params change
  useEffect(() => {
    const preview = searchParams.get('preview');
    const type = searchParams.get('type') as 'student' | 'employer';
    
    // If user is authenticated, exit preview mode
    if (isAuthenticated) {
      setIsPreviewMode(false);
      setPreviewType(null);
      sessionStorage.removeItem('previewMode');
      sessionStorage.removeItem('previewType');
      return;
    }
    
    if (preview === 'true' && (type === 'student' || type === 'employer')) {
      setIsPreviewMode(true);
      setPreviewType(type);
      // Store in session storage for persistence across page refreshes
      sessionStorage.setItem('previewMode', 'true');
      sessionStorage.setItem('previewType', type);
      // Save landing origin for this preview session
      NavigationMemory.saveLandingOrigin(type);
      // Start analytics tracking
      previewAnalytics.startPreviewSession(type);
    } else {
      // Check session storage for existing preview mode
      const storedPreview = sessionStorage.getItem('previewMode');
      const storedType = sessionStorage.getItem('previewType') as 'student' | 'employer';
      
      if (storedPreview === 'true' && (storedType === 'student' || storedType === 'employer')) {
        setIsPreviewMode(true);
        setPreviewType(storedType);
        // Resume analytics tracking if session exists
        previewAnalytics.startPreviewSession(storedType);
      }
    }
  }, [searchParams, isAuthenticated]);

  const enterPreviewMode = (type: 'student' | 'employer') => {
    // If user is authenticated, redirect to the appropriate portal
    if (isAuthenticated) {
      const basePath = type === 'student' ? '/student_portal/workspace' : '/employer_portal/workspace';
      router.push(basePath);
      return;
    }

    // Save landing origin for proper post-login routing
    NavigationMemory.saveLandingOrigin(type);

    setIsPreviewMode(true);
    setPreviewType(type);
    sessionStorage.setItem('previewMode', 'true');
    sessionStorage.setItem('previewType', type);
    
    // Navigate to the appropriate portal with preview parameters
    const basePath = type === 'student' ? '/student_portal/workspace' : '/employer_portal/workspace';
    router.push(`${basePath}?preview=true&type=${type}`);
  };

  const exitPreviewMode = () => {
    // End analytics tracking before exiting
    previewAnalytics.endPreviewSession();
    
    setIsPreviewMode(false);
    setPreviewType(null);
    sessionStorage.removeItem('previewMode');
    sessionStorage.removeItem('previewType');
    
    // Navigate back to appropriate landing page based on current context
    if (currentLandingPage === 'student') {
      router.push('/student');
    } else if (currentLandingPage === 'employer') {
      router.push('/employer');
    } else {
      router.push('/');
    }
  };

  const isFeatureLocked = (feature: string): boolean => {
    if (!isPreviewMode || isAuthenticated) return false;
    
    const lockedFeatures = {
      student: [
        'apply_job',
        'bookmark_job',
        'send_message',
        'update_profile',
        'view_applications',
        'earn_points',
        'access_premium_features',
        'current_projects',
        'billing',
        'level_system',
        'profile',
        'personalized_recommendations',
        'recommended_jobs',
        'ongoing_projects'
      ],
      employer: [
        'post_job',
        'send_message',
        'view_applications',
        'update_company_profile',
        'access_analytics',
        'access_premium_features',
        'current_projects',
        'billing',
        'level_system',
        'profile',
        'personalized_recommendations',
        'candidate_recommendations',
        'job_management',
        'analytics'
      ]
    };

    return lockedFeatures[previewType!]?.includes(feature) || false;
  };

  // Demo data functions
  const getDemoData = () => {
    if (!isPreviewMode || !previewType) return null;
    return previewDemoDataService.getDemoData(previewType);
  };

  const getABTestVariation = (element: string): string => {
    // Get variation from analytics service (which handles assignment)
    const variationIndex = previewAnalytics.getABTestVariation(element);
    return previewDemoDataService.getABTestVariation(element as any);
  };

  const setABTestVariation = (variation: number) => {
    previewDemoDataService.setABTestVariation(variation);
  };

  const value: PreviewModeContextType = {
    isPreviewMode,
    previewType,
    enterPreviewMode,
    exitPreviewMode,
    isFeatureLocked,
    currentLandingPage,
    demoDataService: previewDemoDataService,
    getDemoData,
    getABTestVariation,
    setABTestVariation
  };

  return (
    <PreviewModeContext.Provider value={value}>
      {children}
    </PreviewModeContext.Provider>
  );
};
