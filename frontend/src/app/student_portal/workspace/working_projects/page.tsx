"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, ExternalLink, DollarSign, Eye } from "lucide-react";
import dynamic from 'next/dynamic';

// Import the WorkingProjects component
const WorkingProjects = dynamic(() => import("@/components/dashboard/student_portal/workspace/WorkingProjects"), {
  loading: () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      ))}
    </div>
  )
});

const WorkingProjectsPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Working Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your ongoing micro-internship projects and billing status
              </p>
            </div>
            <button
              onClick={() => router.push('/student_portal/workspace/jobs')}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Browse Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkingProjects />
      </div>
    </div>
  );
};

export default WorkingProjectsPage;
