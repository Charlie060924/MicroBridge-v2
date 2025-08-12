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
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Check if profile is complete
  const checkProfileCompletion = (profile: EmployerProfile): boolean => {
    const requiredFields = [
      'companyName', 'companyType', 'industry', 'companySize', 'location',
      'firstName', 'lastName', 'email', 'phone', 'position'
    ];
    
    return requiredFields.every(field => {
      const value = profile[field as keyof EmployerProfile];
      return value && value.trim().length > 0;
    });
  };

  // Load profile data and check completion
  const loadProfileAndCheck = async () => {
    try {
      setIsLoading(true);
      
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

      const complete = checkProfileCompletion(mockProfile);
      setIsProfileComplete(complete);

      // If profile is incomplete and user is not on profile page, redirect
      if (!complete && pathname !== "/employer_portal/workspace/profile") {
        router.push("/employer_portal/workspace/profile");
      }
    } catch (error) {
      console.error('Error loading employer profile:', error);
      // If there's an error loading profile, assume it's incomplete
      setIsProfileComplete(false);
      if (pathname !== "/employer_portal/workspace/profile") {
        router.push("/employer_portal/workspace/profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run onboarding check for employer portal routes
    if (pathname?.startsWith('/employer_portal')) {
      loadProfileAndCheck();
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  return {
    isLoading,
    isProfileComplete,
    checkProfileCompletion,
    loadProfileAndCheck,
  };
};
