"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface EmployerProfile {
  companyName: string;
  companyType: string;
  industry: string;
  companySize: string;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
}

export const useEmployerOnboarding = () => {
  console.log('🏢 useEmployerOnboarding hook initialized');
  
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if profile is complete
  const checkProfileCompletion = (profile: EmployerProfile): boolean => {
    console.log('🏢 Checking profile completion:', profile);
    
    const requiredFields = [
      'companyName', 'companyType', 'industry', 'companySize', 'location',
      'firstName', 'lastName', 'email', 'phone', 'position'
    ];
    
    const isComplete = requiredFields.every(field => {
      const value = profile[field as keyof EmployerProfile];
      const isValid = value && value.trim().length > 0;
      if (!isValid) {
        console.log('🏢 Missing required field:', field, 'value:', value);
      }
      return isValid;
    });
    
    console.log('🏢 Profile completion result:', isComplete);
    return isComplete;
  };

  // Load profile data and check completion
  const loadProfileAndCheck = async () => {
    console.log('🏢 Loading profile and checking completion');
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call to get employer profile
      const mockProfile: EmployerProfile = {
        companyName: "TechCorp Inc.",
        companyType: "startup",
        industry: "technology",
        companySize: "10-50",
        location: "San Francisco, CA",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@techcorp.com",
        phone: "+1 (555) 123-4567",
        position: "Senior HR Manager",
      };

      console.log('🏢 Mock profile loaded:', mockProfile);

      const complete = checkProfileCompletion(mockProfile);
      setIsProfileComplete(complete);

      // Only redirect if profile is incomplete and user is not already on profile page
      if (!complete && pathname !== "/employer_portal/workspace/profile") {
        console.log('🏢 Profile incomplete, redirecting to profile page');
        router.push("/employer_portal/workspace/profile");
      } else if (complete) {
        console.log('🏢 Profile complete, no redirect needed');
      } else {
        console.log('🏢 Already on profile page, no redirect needed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading profile';
      console.error('🏢 Error loading employer profile:', error);
      setError(errorMessage);
      
      // Don't redirect on error - just mark as incomplete
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🏢 useEmployerOnboarding effect triggered, pathname:', pathname);
    
    // Only run onboarding check for employer portal routes
    if (pathname?.startsWith('/employer_portal')) {
      console.log('🏢 Running onboarding check for employer portal');
      loadProfileAndCheck();
    } else {
      console.log('🏢 Not on employer portal, skipping onboarding check');
      setIsLoading(false);
    }
  }, [pathname]);

  const returnValue = {
    isLoading,
    isProfileComplete,
    error,
    checkProfileCompletion,
    loadProfileAndCheck,
  };

  console.log('🏢 useEmployerOnboarding returning:', {
    isLoading: returnValue.isLoading,
    isProfileComplete: returnValue.isProfileComplete,
    error: returnValue.error
  });

  return returnValue;
};
