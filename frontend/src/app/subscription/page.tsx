"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionManagement from '@/components/subscription/SubscriptionManagement';
import PricingContent from '@/components/subscription/PricingContent';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';

const SubscriptionPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    // Try to go back to employer dashboard, fallback to previous page
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/employer_portal/workspace');
    }
  };

  // Block access for students
  if (user.role === 'student') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Subscription management is only available for employers. Students don't need subscription plans.
            </p>
            <Button
              variant="primary"
              onClick={handleBack}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Only show subscription management for employers
  if (user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

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

        {/* Subscription Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subscription Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Choose the plan that fits your hiring needs and manage your billing
            </p>
          </div>

          <SubscriptionManagement />
        </div>

        {/* Pricing Content */}
        <div>
          <PricingContent />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
