"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { LevelProvider } from "./context/LevelContext";
import { MockAccountProvider } from "@/context/MockAccountContext";
import ScrollToTop from "@/components/common/ScrollToTop";
import AchievementPopup from "@/components/common/Level/AchievementPopup";
import UserRoleSwitcher from "@/components/common/UserRoleSwitcher";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import analyticsService from '@/services/analyticsService';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize analytics service
  useEffect(() => {
    analyticsService.initialize();
    analyticsService.trackDailyActivity();
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Track error in analytics
        analyticsService.trackErrorRecovery(
          error.name || 'UnknownError',
          false,
          'App'
        );
        console.error('App Error:', error, errorInfo);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <MockAccountProvider>
          <LevelProvider>
            {children}
            <ScrollToTop />
            <AchievementPopup achievement={null} />
            <UserRoleSwitcher />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </LevelProvider>
        </MockAccountProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
