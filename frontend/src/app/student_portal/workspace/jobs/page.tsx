import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse All Micro-Internship Opportunities",
  description: "Explore hundreds of micro-internship opportunities from top companies",
};

// Dynamic import for better performance
const JobSearchAndFilters = dynamic(() => import("@/components/jobs/existing/SearchBar_and_Filter"));
const JobList = dynamic(() => import("@/components/jobs/existing/JobList"));

// Loading component for Suspense
const FiltersLoading = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

const JobListLoading = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Micro-Internship Opportunities</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find short-term projects that match your skills and help you gain real-world experience
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<FiltersLoading />}>
              <JobSearchAndFilters />
            </Suspense>
          </div>
          
          {/* Jobs List */}
          <div className="lg:col-span-3">
            <Suspense fallback={<JobListLoading />}>
              <JobList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}