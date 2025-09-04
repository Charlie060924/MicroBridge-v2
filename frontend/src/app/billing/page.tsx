"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SharedBillingDashboard from '@/components/billing/SharedBillingDashboard';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

const BillingPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Restore navigation state if returning from another page
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      const state = NavigationMemory.getState();
      if (state && state.origin === '/billing') {
        NavigationMemory.restoreScrollPosition(state.scrollPosition);
      }
    });
  }, []);

  // Show loading state while auth is loading
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={handleBack}
            className="mb-4"
          >
            Back
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your payments and billing history
          </p>
        </div>

        {user.role === 'employer' || user.role === 'student' ? (
          <SharedBillingDashboard role={user.role} />
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
