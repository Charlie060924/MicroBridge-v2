"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Download,
  Share2
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface JobAnalytics {
  id: string;
  title: string;
  company: string;
  status: 'active' | 'draft' | 'closed';
  views: number;
  applications: number;
  conversionRate: number;
  timeToFill: number;
  averageApplicationQuality: number;
  viewsOverTime: Array<{ date: string; views: number; applications: number }>;
  applicationSources: Array<{ source: string; count: number; percentage: number; color: string }>;
  candidateDemographics: Array<{ category: string; count: number; percentage: number }>;
}

const JobAnalyticsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jobId = params.id as string;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Mock API call - replace with actual API
        const mockAnalytics: JobAnalytics = {
          id: jobId,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          status: 'active',
          views: 1247,
          applications: 24,
          conversionRate: 1.92,
          timeToFill: 14,
          averageApplicationQuality: 78,
          viewsOverTime: [
            { date: '2024-01-01', views: 45, applications: 2 },
            { date: '2024-01-02', views: 67, applications: 3 },
            { date: '2024-01-03', views: 89, applications: 5 },
            { date: '2024-01-04', views: 123, applications: 8 },
            { date: '2024-01-05', views: 156, applications: 12 },
            { date: '2024-01-06', views: 134, applications: 9 },
            { date: '2024-01-07', views: 98, applications: 6 }
          ],
          applicationSources: [
            { source: 'Platform Search', count: 12, percentage: 50, color: '#3B82F6' },
            { source: 'Referrals', count: 6, percentage: 25, color: '#10B981' },
            { source: 'Direct Links', count: 4, percentage: 17, color: '#F59E0B' },
            { source: 'Social Media', count: 2, percentage: 8, color: '#EF4444' }
          ],
          candidateDemographics: [
            { category: 'Entry Level', count: 3, percentage: 12.5 },
            { category: 'Mid Level', count: 8, percentage: 33.3 },
            { category: 'Senior Level', count: 13, percentage: 54.2 }
          ]
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError('Failed to load job analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [jobId]);

  const handleExport = () => {
    // console.log('Export analytics data');
    // Implement export functionality
  };

  const handleShare = () => {
    // console.log('Share analytics');
    // Implement share functionality
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Not Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Analytics data for this job posting is not available.
          </p>
          <Link
            href="/employer_portal/workspace/manage-jobs"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Back to Manage Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/employer_portal/workspace/manage-jobs"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Job Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {analytics.title} at {analytics.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.views.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Applications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.applications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.conversionRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Days to Fill
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.timeToFill}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Views and Applications Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Views & Applications Over Time
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [value, name === 'views' ? 'Views' : 'Applications']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Application Sources
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.applicationSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analytics.applicationSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} (${props.payload.percentage}%)`, 
                    props.payload.source
                  ]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Candidate Demographics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Candidate Experience Level Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.candidateDemographics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip formatter={(value, name, props) => [
                  `${value} (${props.payload.percentage}%)`, 
                  'Candidates'
                ]} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyticsPage;
