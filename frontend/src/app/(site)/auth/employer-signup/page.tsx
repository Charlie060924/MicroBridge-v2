"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavigationMemory } from "@/utils/navigationMemory";

export default function EmployerSignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Set employer role and save landing origin
    localStorage.setItem('mock_user_role', 'employer');
    NavigationMemory.saveLandingOrigin('employer');
    
    // Redirect to main signup page
    router.push('/auth/signup');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to employer sign up...</p>
      </div>
    </div>
  );
}
