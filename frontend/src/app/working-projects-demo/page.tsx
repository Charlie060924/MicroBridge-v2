"use client";

import React from 'react';
import WorkingProjectsSimple from '@/components/dashboard/employer_portal/workspace/WorkingProjectsSimple';

const WorkingProjectsDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Working Projects Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is a simplified version of the Working Projects component that should work without complex dependencies.
          </p>
        </div>

        <WorkingProjectsSimple />
      </div>
    </div>
  );
};

export default WorkingProjectsDemo;
