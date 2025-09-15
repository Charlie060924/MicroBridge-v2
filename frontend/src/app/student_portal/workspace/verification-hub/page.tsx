"use client";

import React from "react";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the VerificationDiscoveryHub component
const VerificationDiscoveryHub = React.lazy(() => import("@/components/common/VerificationDiscoveryHub").catch(() => ({ default: () => <div>Error loading Verification Hub</div> })));

export default function StudentVerificationHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verification & Discovery Hub
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Track your progress, manage verifications, and discover new opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <VerificationDiscoveryHub userType="student" />
        </Suspense>
      </div>
    </div>
  );
}