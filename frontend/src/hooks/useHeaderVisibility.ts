"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useHeaderVisibility = () => {
  const pathname = usePathname();
  const [shouldShowHeader, setShouldShowHeader] = useState(true);

  useEffect(() => {
    // Paths where header should be hidden
    const noHeaderPaths = [
      "/auth",                    // Authentication pages
      "/onboarding",              // Onboarding flow
      "/students_info",           // Student information pages
      "/student_portal",          // Student portal (handled by root layout)
      "/jobs",                    // Job pages (preview, edit, analytics)
      "/employer_portal"          // Employer portal (has its own header)
    ];

    // Special cases where header should be shown even if path matches
    const forceShowHeaderPaths = [
      "/jobs"                     // Main jobs listing page
    ];

    // Check if current path should force show header
    const forceShow = forceShowHeaderPaths.some(path =>
      pathname === path
    );

    // Check if current path should hide header
    const hideHeader = noHeaderPaths.some(path =>
      pathname?.startsWith(path)
    );

    // Show header if forced, or if not in hide list
    setShouldShowHeader(forceShow || !hideHeader);
  }, [pathname]);

  return shouldShowHeader;
};

// Helper function to check if a specific path should show header
export const shouldShowHeaderForPath = (path: string): boolean => {
  const noHeaderPaths = [
    "/auth",
    "/onboarding", 
    "/students_info",
    "/student_portal",
    "/jobs",
    "/employer_portal"
  ];

  const forceShowHeaderPaths = [
    "/jobs"
  ];

  // Check if forced to show
  if (forceShowHeaderPaths.some(forcePath => path === forcePath)) {
    return true;
  }

  // Check if should hide
  if (noHeaderPaths.some(hidePath => path.startsWith(hidePath))) {
    return false;
  }

  return true;
};
