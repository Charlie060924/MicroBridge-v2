"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'employer';
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackUrl = '/auth/signin' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the current path for redirect after login
        const currentPath = window.location.pathname;
        const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectUrl);
        return;
      }

      if (requiredRole && user?.user_type !== requiredRole) {
        // User doesn't have the required role, redirect to appropriate dashboard
        const dashboardPath = user?.user_type === 'employer' 
          ? '/employer_portal/workspace' 
          : '/student_portal/workspace';
        router.push(dashboardPath);
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router, fallbackUrl]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && user?.user_type !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;