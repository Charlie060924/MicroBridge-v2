"use client";

import React from "react";
import { FileText, Briefcase, Clock, BarChart3 } from "lucide-react";

interface HiringOverviewProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    averageTimeToFill: number;
    totalViews: number;
  };
}

const HiringOverview: React.FC<HiringOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200  p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900
            Hiring Overview
          </h3>
          <p className="text-gray-600
            Key metrics for your hiring process
          </p>
        </div>
        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors   
          <BarChart3 className="h-4 w-4 mr-2" />
          View Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Primary Metric - Total Applications */}
        <div className="lg:col-span-2 bg-green-50 rounded-lg p-4 border border-green-200 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600
                Total Applications
              </p>
              <p className="text-3xl font-bold text-green-700
                {stats.totalApplications}
              </p>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ">
                  +{stats.pendingApplications} today
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-8 w-8 text-green-600 />
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600
                Active Jobs
              </p>
              <p className="text-2xl font-bold text-blue-700
                {stats.activeJobs}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600 />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600
                Avg. Time to Fill
              </p>
              <p className="text-2xl font-bold text-purple-700
                {stats.averageTimeToFill}d
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringOverview;
