"use client";

import React, { useEffect, useState, Suspense } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PreviewModeProvider } from "@/context/PreviewModeContext";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import PreviewBanner from "@/components/common/PreviewBanner";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreviewModeProvider>
        <SidebarProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
      </PreviewModeProvider>
    </ThemeProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    
    // Set loading to false after a short delay to ensure hydration
    const timer = setTimeout(() => setIsLoading(false), 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 sidebar-layout">
      {/* Sidebar */}
      <AppSidebar />

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
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          <Suspense fallback={<LoadingSkeleton />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
