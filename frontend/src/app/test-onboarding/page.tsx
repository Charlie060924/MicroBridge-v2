"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate role selection and redirect to student onboarding
    router.push("/student_portal/workspace/profile?fromRoleSelection=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to student onboarding...</p>
      </div>
    </div>
  );
}
