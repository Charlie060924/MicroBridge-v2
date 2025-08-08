"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext"; // Add this import
import React from "react";
import AppSidebar from "@/layout/AppSidebar";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import { useSidebar } from "@/context/SidebarContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}