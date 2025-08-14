"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PreviewModeProvider } from "@/context/PreviewModeContext";
import EmployerAppSidebar from "@/layout/EmployerAppSidebar";
import EmployerAppHeader from "@/layout/EmployerAppHeader";
import Backdrop from "@/layout/Backdrop";
import PreviewBanner from "@/components/common/PreviewBanner";
import { useEmployerOnboarding } from "@/hooks/useEmployerOnboarding";

export default function EmployerRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreviewModeProvider>
        <SidebarProvider>
          <EmployerLayoutContent>{children}</EmployerLayoutContent>
        </SidebarProvider>
      </PreviewModeProvider>
    </ThemeProvider>
  );
}

function EmployerLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const { isLoading } = useEmployerOnboarding();

  // Calculate sidebar width based on state
  const getSidebarWidth = () => {
    if (isMobileOpen) return 0;
    if (isExpanded || isHovered) return 290;
    return 90;
  };

  const sidebarWidth = getSidebarWidth();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading state while checking onboarding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading employer portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 sidebar-layout">
      {/* Sidebar */}
      <EmployerAppSidebar />

      {/* Backdrop for mobile menu */}
      <Backdrop />

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col sidebar-layout-content"
        style={{
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          width: isMobile ? '100vw' : `calc(100vw - ${sidebarWidth}px)`,
          maxWidth: isMobile ? '100vw' : `calc(100vw - ${sidebarWidth}px)`
        }}
      >
        {/* Preview Banner */}
        <PreviewBanner />

        {/* Header */}
        <EmployerAppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
