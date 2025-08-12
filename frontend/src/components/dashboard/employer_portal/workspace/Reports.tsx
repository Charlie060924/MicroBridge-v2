"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileText, Clock, Eye } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamic imports for components
const HiringFunnel = dynamic(() => import("./HiringFunnel"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const ChartCard = dynamic(() => import("./ChartCard"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const StatCard = dynamic(() => import("./StatCard"), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

interface Application {
  id: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  matchScore: number;
  skills: string[];
}

const Reports: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    conversionRate: 0,
    averageTimeToHire: 0,
    totalViews: 0
  });

  useEffect(() => {
    // Mock data for reports
    const mockApplications: Application[] = [
      {
        id: "1",
        jobTitle: "Frontend Developer",
        applicantName: "John Doe",
        applicantEmail: "john.doe@email.com",
        appliedDate: "2024-01-16",
        status: 'pending',
        matchScore: 85,
        skills: ["React", "TypeScript", "CSS", "Node.js"]
      },
      {
        id: "2",
        jobTitle: "UI/UX Designer",
        applicantName: "Jane Smith",
        applicantEmail: "jane.smith@email.com",
        appliedDate: "2024-01-12",
        status: 'reviewed',
        matchScore: 92,
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
      },
      {
        id: "3",
        jobTitle: "Frontend Developer",
        applicantName: "Mike Johnson",
        applicantEmail: "mike.johnson@email.com",
        appliedDate: "2024-01-14",
        status: 'shortlisted',
        matchScore: 78,
        skills: ["React", "JavaScript", "HTML", "CSS"]
      }
    ];

    const mockStats = {
      totalApplications: 45,
      conversionRate: 23.5,
      averageTimeToHire: 14,
      totalViews: 234
    };

    setApplications(mockApplications);
    setStats(mockStats);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
              <BarChart3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your hiring performance and conversion rates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            value={stats.totalApplications}
            label="Total Applications"
          />
          <StatCard
            icon={TrendingUp}
            value={`${stats.conversionRate}%`}
            label="Conversion Rate"
            change="+2.3% this month"
            changeType="positive"
          />
          <StatCard
            icon={Clock}
            value={`${stats.averageTimeToHire}d`}
            label="Avg. Time to Hire"
            change="-1.2 days"
            changeType="positive"
          />
          <StatCard
            icon={Eye}
            value={stats.totalViews}
            label="Total Job Views"
            change="+15% this week"
            changeType="positive"
          />
        </div>

        {/* Hiring Funnel and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hiring Funnel */}
          <div>
            <HiringFunnel applications={applications} />
          </div>

          {/* Application Trends Chart */}
          <div>
            <ChartCard
              title="Application Trends"
              subtitle="Monthly application volume and trends"
              icon={TrendingUp}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Application trends chart
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Shows monthly application volume and growth
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Source Analytics */}
          <ChartCard
            title="Application Sources"
            subtitle="Where your applications are coming from"
            icon={Users}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Source analytics chart
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Shows application sources and effectiveness
                </p>
              </div>
            </div>
          </ChartCard>

          {/* Performance Metrics */}
          <ChartCard
            title="Performance Metrics"
            subtitle="Key hiring performance indicators"
            icon={BarChart3}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Performance metrics chart
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Shows KPIs and performance trends
                </p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Reports;
