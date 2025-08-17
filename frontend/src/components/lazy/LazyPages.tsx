"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  BillingSkeleton, 
  WorkingProjectsSkeleton, 
  SettingsSkeleton, 
  LevelSystemSkeleton,
  PageSkeleton 
} from '@/components/skeletons/PageSkeletons';

// Performance monitoring utility
const withPerformanceMonitoring = (Component: React.ComponentType<any>, pageName: string) => {
  return React.forwardRef<any, any>((props, ref) => {
    useEffect(() => {
      console.time(`PageLoad:${pageName}`);
      
      return () => {
        console.timeEnd(`PageLoad:${pageName}`);
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });
};

// Lazy load Billing page
const BillingPage = dynamic(
  () => import('@/app/billing/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <BillingSkeleton />,
    ssr: false // Billing might have client-side only features
  }
);

// Lazy load Working Projects page
const WorkingProjectsPage = dynamic(
  () => import('@/app/student_portal/workspace/working_projects/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <WorkingProjectsSkeleton />,
    ssr: true
  }
);

// Lazy load Settings page
const SettingsPage = dynamic(
  () => import('@/app/student_portal/workspace/settings/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <SettingsSkeleton />,
    ssr: true
  }
);

// Lazy load Level System page
const LevelSystemPage = dynamic(
  () => import('@/app/student_portal/workspace/levels/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <LevelSystemSkeleton />,
    ssr: true
  }
);

// Lazy load Profile page
const ProfilePage = dynamic(
  () => import('@/app/student_portal/workspace/profile/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <PageSkeleton />,
    ssr: true
  }
);

// Lazy load Applications page
const ApplicationsPage = dynamic(
  () => import('@/app/student_portal/workspace/applications/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <PageSkeleton />,
    ssr: true
  }
);

// Lazy load Jobs page
const JobsPage = dynamic(
  () => import('@/app/student_portal/workspace/jobs/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <PageSkeleton />,
    ssr: true
  }
);

// Lazy load Dashboard page
const DashboardPage = dynamic(
  () => import('@/app/student_portal/workspace/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <PageSkeleton />,
    ssr: true
  }
);

// Export with performance monitoring
export const LazyBillingPage = withPerformanceMonitoring(BillingPage, 'Billing');
export const LazyWorkingProjectsPage = withPerformanceMonitoring(WorkingProjectsPage, 'WorkingProjects');
export const LazySettingsPage = withPerformanceMonitoring(SettingsPage, 'Settings');
export const LazyLevelSystemPage = withPerformanceMonitoring(LevelSystemPage, 'LevelSystem');
export const LazyProfilePage = withPerformanceMonitoring(ProfilePage, 'Profile');
export const LazyApplicationsPage = withPerformanceMonitoring(ApplicationsPage, 'Applications');
export const LazyJobsPage = withPerformanceMonitoring(JobsPage, 'Jobs');
export const LazyDashboardPage = withPerformanceMonitoring(DashboardPage, 'Dashboard');

// Page mapping for easy access
export const LAZY_PAGES = {
  '/student_portal/workspace': LazyDashboardPage,
  '/student_portal/workspace/jobs': LazyJobsPage,
  '/student_portal/workspace/applications': LazyApplicationsPage,
  '/student_portal/workspace/working_projects': LazyWorkingProjectsPage,
  '/billing': LazyBillingPage,
  '/student_portal/workspace/levels': LazyLevelSystemPage,
  '/student_portal/workspace/profile': LazyProfilePage,
  '/student_portal/workspace/settings': LazySettingsPage,
} as const;
