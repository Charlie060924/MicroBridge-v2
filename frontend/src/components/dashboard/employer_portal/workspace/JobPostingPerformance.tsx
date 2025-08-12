"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon, BarChart3, ArrowRight } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface JobPerformanceData {
  jobTitle: string;
  applications: number;
  views: number;
  conversionRate: number;
}

interface JobPostingPerformanceProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

const JobPostingPerformance: React.FC<JobPostingPerformanceProps> = ({
  title = "Job Posting Performance",
  subtitle = "Track posting effectiveness with applications and conversion rates",
  icon: Icon,
  className = ""
}) => {
  const [performanceData, setPerformanceData] = useState<JobPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // Mock data - replace with actual API call when ready
        const mockData: JobPerformanceData[] = [
          {
            jobTitle: "Frontend Developer",
            applications: 12,
            views: 45,
            conversionRate: 26.7
          },
          {
            jobTitle: "UI/UX Designer",
            applications: 8,
            views: 32,
            conversionRate: 25.0
          },
          {
            jobTitle: "Data Analyst",
            applications: 15,
            views: 52,
            conversionRate: 28.8
          },
          {
            jobTitle: "Backend Developer",
            applications: 11,
            views: 38,
            conversionRate: 28.9
          },
          {
            jobTitle: "Product Manager",
            applications: 6,
            views: 28,
            conversionRate: 21.4
          },
          {
            jobTitle: "DevOps Engineer",
            applications: 9,
            views: 35,
            conversionRate: 25.7
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setPerformanceData(mockData);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setPerformanceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const formatJobTitle = (title: string) => {
    return title.length > 15 ? title.substring(0, 15) + '...' : title;
  };

  const handleViewMore = () => {
    router.push('/employer_portal/workspace/reports');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{data.jobTitle}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Views:</span> {data.views}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Applications:</span> {data.applications}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Conversion Rate:</span> {data.conversionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3"></div>
            <div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleViewMore}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="View detailed reports"
        >
          View More
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="jobTitle" 
              tickFormatter={formatJobTitle}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
              label={{ value: 'Applications', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#374151', opacity: 0.3 }}
              label={{ value: 'Conversion Rate (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span style={{ color: '#6B7280', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
            <Bar 
              yAxisId="left"
              dataKey="applications" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              name="Applications"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="conversionRate" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name="Conversion Rate"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default JobPostingPerformance;
