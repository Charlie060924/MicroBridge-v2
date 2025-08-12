"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  Eye, 
  Download, 
  Calendar,
  Target,
  DollarSign,
  GraduationCap,
  Briefcase,
  Filter,
  ChevronDown,
  Lightbulb,
  TrendingDown
} from "lucide-react";
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
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import dynamic from 'next/dynamic';

// Dynamic imports for components
const StatCard = dynamic(() => import("./StatCard"), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

const ChartCard = dynamic(() => import("./ChartCard"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

// Data interfaces
interface JobPerformanceData {
  date: string;
  jobTitle: string;
  views: number;
  applications: number;
  hires: number;
  conversionRate: number;
}

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  color: string;
}

interface SourceData {
  source: string;
  applications: number;
  percentage: number;
  color: string;
}

interface TimeToFillData {
  month: string;
  averageDays: number;
  trend: 'up' | 'down' | 'stable';
}

interface DemographicsData {
  category: string;
  education: { [key: string]: number };
  experience: { [key: string]: number };
}

interface ROIData {
  jobTitle: string;
  costPerHire: number;
  numberOfHires: number;
  totalCost: number;
}

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedJob, setSelectedJob] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data states
  const [jobPerformanceData, setJobPerformanceData] = useState<JobPerformanceData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [timeToFillData, setTimeToFillData] = useState<TimeToFillData[]>([]);
  const [demographicsData, setDemographicsData] = useState<DemographicsData[]>([]);
  const [roiData, setRoiData] = useState<ROIData[]>([]);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    timeToFillChange: -10,
    acceptanceRate: 75,
    topPerformingJob: "Marketing Associate",
    totalApplications: 234,
    conversionRate: 23.5,
    averageTimeToHire: 14,
    totalViews: 1247
  });

  // Insights
  const [insights, setInsights] = useState([
    {
      type: 'warning',
      message: "Your 'Senior Engineer' post has low conversion (12%), try revising requirements",
      icon: Target
    },
    {
      type: 'success',
      message: "Boost ads on LinkedIn - highest quality candidates from this channel",
      icon: TrendingUp
    },
    {
      type: 'info',
      message: "Time to fill improved 15% this month - keep current posting strategy",
      icon: Clock
    }
  ]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Mock Job Performance Data
        const mockJobPerformance: JobPerformanceData[] = [
          { date: '2024-01-01', jobTitle: 'Frontend Developer', views: 45, applications: 12, hires: 1, conversionRate: 26.7 },
          { date: '2024-01-02', jobTitle: 'Frontend Developer', views: 52, applications: 15, hires: 0, conversionRate: 28.8 },
          { date: '2024-01-03', jobTitle: 'UI/UX Designer', views: 38, applications: 8, hires: 0, conversionRate: 21.1 },
          { date: '2024-01-04', jobTitle: 'Data Analyst', views: 41, applications: 11, hires: 1, conversionRate: 26.8 },
          { date: '2024-01-05', jobTitle: 'Marketing Associate', views: 67, applications: 23, hires: 2, conversionRate: 34.3 },
          { date: '2024-01-06', jobTitle: 'Senior Engineer', views: 28, applications: 3, hires: 0, conversionRate: 10.7 },
          { date: '2024-01-07', jobTitle: 'Product Manager', views: 35, applications: 9, hires: 1, conversionRate: 25.7 }
        ];

        // Mock Funnel Data
        const mockFunnel: FunnelData[] = [
          { stage: 'Views', count: 1247, percentage: 100, color: '#3B82F6' },
          { stage: 'Applications', count: 234, percentage: 18.8, color: '#10B981' },
          { stage: 'Shortlisted', count: 47, percentage: 3.8, color: '#F59E0B' },
          { stage: 'Interviews', count: 23, percentage: 1.8, color: '#EF4444' },
          { stage: 'Hires', count: 8, percentage: 0.6, color: '#8B5CF6' }
        ];

        // Mock Source Data
        const mockSource: SourceData[] = [
          { source: 'Platform Search', applications: 89, percentage: 38, color: '#3B82F6' },
          { source: 'Referrals', applications: 67, percentage: 29, color: '#10B981' },
          { source: 'Direct Links', applications: 45, percentage: 19, color: '#F59E0B' },
          { source: 'Promoted Ads', applications: 33, percentage: 14, color: '#EF4444' }
        ];

        // Mock Time to Fill Data
        const mockTimeToFill: TimeToFillData[] = [
          { month: 'Jul', averageDays: 18, trend: 'up' },
          { month: 'Aug', averageDays: 16, trend: 'down' },
          { month: 'Sep', averageDays: 15, trend: 'down' },
          { month: 'Oct', averageDays: 14, trend: 'down' },
          { month: 'Nov', averageDays: 13, trend: 'down' },
          { month: 'Dec', averageDays: 12, trend: 'down' }
        ];

        // Mock Demographics Data
        const mockDemographics: DemographicsData[] = [
          {
            category: 'Education',
            education: { 'Bachelor': 45, 'Master': 35, 'PhD': 12, 'Other': 8 },
            experience: {}
          },
          {
            category: 'Experience',
            education: {},
            experience: { '0-2 years': 25, '3-5 years': 40, '6-10 years': 25, '10+ years': 10 }
          }
        ];

        // Mock ROI Data
        const mockROI: ROIData[] = [
          { jobTitle: 'Frontend Developer', costPerHire: 2500, numberOfHires: 2, totalCost: 5000 },
          { jobTitle: 'UI/UX Designer', costPerHire: 1800, numberOfHires: 1, totalCost: 1800 },
          { jobTitle: 'Marketing Associate', costPerHire: 1200, numberOfHires: 3, totalCost: 3600 },
          { jobTitle: 'Data Analyst', costPerHire: 3000, numberOfHires: 1, totalCost: 3000 }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setJobPerformanceData(mockJobPerformance);
        setFunnelData(mockFunnel);
        setSourceData(mockSource);
        setTimeToFillData(mockTimeToFill);
        setDemographicsData(mockDemographics);
        setRoiData(mockROI);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
              <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const FunnelTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{data.stage}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {data.count}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conversion: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return Target;
      case 'success': return TrendingUp;
      case 'info': return Clock;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleExport = (type: string, data: any) => {
    console.log(`Exporting ${type} data:`, data);
    // Implement actual export functionality here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard-Level Summary Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Time to Fill ↓ {summaryStats.timeToFillChange}% this quarter
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Acceptance Rate: {summaryStats.acceptanceRate}%
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Most Applications from '{summaryStats.topPerformingJob}' posting
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-3 space-y-8">
            {/* High Frequency Section */}
            <div className="space-y-8">
              {/* Job Posting Performance - Primary Chart */}
              <ChartCard
                title="Job Posting Performance"
                subtitle="Interactive timeline of views, applications, and hires"
                icon={BarChart3}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <select 
                      value={selectedJob} 
                      onChange={(e) => setSelectedJob(e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Jobs</option>
                      <option value="frontend">Frontend Developer</option>
                      <option value="uiux">UI/UX Designer</option>
                      <option value="marketing">Marketing Associate</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleExport('CSV', jobPerformanceData)}
                      className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </button>
                    <button 
                      onClick={() => handleExport('PDF', jobPerformanceData)}
                      className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={jobPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.3 }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.3 }}
                        label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280' } }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#374151', opacity: 0.3 }}
                        label={{ value: 'Conversion Rate (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6B7280' } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Views" />
                      <Bar yAxisId="left" dataKey="applications" fill="#10B981" radius={[4, 4, 0, 0]} name="Applications" />
                      <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#EF4444" strokeWidth={2} name="Conversion Rate" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Application Conversion Funnel */}
              <ChartCard
                title="Application Conversion Funnel"
                subtitle="Track conversion rates through the hiring process"
                icon={Target}
              >
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={() => handleExport('CSV', funnelData)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis dataKey="stage" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip content={<FunnelTooltip />} />
                      <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Medium Frequency Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Effectiveness Chart */}
              <ChartCard
                title="Source Effectiveness"
                subtitle="Where your applications are coming from"
                icon={Users}
              >
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={() => handleExport('CSV', sourceData)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="applications"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Time-to-Fill Trend */}
              <ChartCard
                title="Time-to-Fill Trend"
                subtitle="Average days to fill positions over time"
                icon={Clock}
              >
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={() => handleExport('CSV', timeToFillData)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeToFillData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="averageDays" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Lower Frequency Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Candidate Demographics */}
              <ChartCard
                title="Candidate Demographics"
                subtitle="Education level and work experience distribution"
                icon={GraduationCap}
              >
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={() => handleExport('CSV', demographicsData)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographicsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="education.Bachelor" stackId="education" fill="#3B82F6" name="Bachelor" />
                      <Bar dataKey="education.Master" stackId="education" fill="#10B981" name="Master" />
                      <Bar dataKey="education.PhD" stackId="education" fill="#F59E0B" name="PhD" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Budget & Promotion ROI */}
              <ChartCard
                title="Budget & Promotion ROI"
                subtitle="Cost per hire vs. number of hires per posting"
                icon={DollarSign}
              >
                <div className="flex items-center justify-end mb-4">
                  <button 
                    onClick={() => handleExport('CSV', roiData)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={roiData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="jobTitle" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="numberOfHires" fill="#3B82F6" name="Number of Hires" />
                      <Line yAxisId="right" type="monotone" dataKey="costPerHire" stroke="#EF4444" name="Cost per Hire" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Right Column - Insights Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Insights & Tips
                </h3>
              </div>
              
              <div className="space-y-4">
                {insights.map((insight, index) => {
                  const IconComponent = getInsightIcon(insight.type);
                  return (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <IconComponent className={`h-5 w-5 mt-0.5 ${getInsightColor(insight.type)}`} />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Export All Reports
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Schedule Weekly Report
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Share with Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;