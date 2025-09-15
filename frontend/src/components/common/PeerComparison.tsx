"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Target,
  Award,
  Clock,
  MapPin,
  BookOpen,
  Briefcase,
  DollarSign,
  ChevronRight,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

interface PeerMetrics {
  applications: number;
  interviews: number;
  jobViews: number;
  profileViews: number;
  responseRate: number;
  avgTimeToResponse: number; // in hours
  successRate: number; // interview to offer ratio
}

interface PeerData {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  location: string;
  university?: string;
  graduationYear?: number;
  industry: string;
  experienceLevel: string;
  metrics: PeerMetrics;
  rank: number;
  isAnonymous: boolean;
  similarityScore: number; // 0-100, how similar to current user
  trendDirection: 'up' | 'down' | 'stable';
}

interface ComparisonInsight {
  type: 'strength' | 'opportunity' | 'benchmark';
  metric: keyof PeerMetrics;
  message: string;
  suggestion?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PeerComparisonProps {
  userId?: string;
  showInsights?: boolean;
  showAnonymous?: boolean;
  maxPeers?: number;
  comparisonType?: 'similar_background' | 'same_industry' | 'same_location' | 'same_school';
  className?: string;
}

const PeerComparison: React.FC<PeerComparisonProps> = ({
  userId = 'current-user',
  showInsights = true,
  showAnonymous = true,
  maxPeers = 5,
  comparisonType = 'similar_background',
  className = ''
}) => {
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [userMetrics, setUserMetrics] = useState<PeerMetrics | null>(null);
  const [insights, setInsights] = useState<ComparisonInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<keyof PeerMetrics>('applications');
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  // Mock current user metrics
  const currentUserMetrics: PeerMetrics = {
    applications: 12,
    interviews: 3,
    jobViews: 156,
    profileViews: 28,
    responseRate: 25, // percentage
    avgTimeToResponse: 48, // hours
    successRate: 33 // percentage
  };

  useEffect(() => {
    // Mock peer data
    const mockPeers: PeerData[] = [
      {
        id: 'peer-1',
        name: showAnonymous ? 'Anonymous User #1' : 'Sarah Chen',
        title: 'Software Engineer',
        location: 'San Francisco, CA',
        university: 'UC Berkeley',
        graduationYear: 2022,
        industry: 'Technology',
        experienceLevel: '1-2 years',
        metrics: {
          applications: 18,
          interviews: 6,
          jobViews: 234,
          profileViews: 45,
          responseRate: 33,
          avgTimeToResponse: 36,
          successRate: 50
        },
        rank: 1,
        isAnonymous: showAnonymous,
        similarityScore: 92,
        trendDirection: 'up'
      },
      {
        id: 'peer-2',
        name: showAnonymous ? 'Anonymous User #2' : 'Marcus Johnson',
        title: 'Product Manager',
        location: 'New York, NY',
        university: 'Stanford',
        graduationYear: 2021,
        industry: 'Technology',
        experienceLevel: '2-3 years',
        metrics: {
          applications: 15,
          interviews: 4,
          jobViews: 189,
          profileViews: 32,
          responseRate: 27,
          avgTimeToResponse: 42,
          successRate: 40
        },
        rank: 2,
        isAnonymous: showAnonymous,
        similarityScore: 87,
        trendDirection: 'stable'
      },
      {
        id: 'peer-3',
        name: showAnonymous ? 'Anonymous User #3' : 'Elena Rodriguez',
        title: 'UX Designer',
        location: 'Austin, TX',
        university: 'UT Austin',
        graduationYear: 2023,
        industry: 'Design',
        experienceLevel: '0-1 years',
        metrics: {
          applications: 10,
          interviews: 2,
          jobViews: 98,
          profileViews: 19,
          responseRate: 20,
          avgTimeToResponse: 72,
          successRate: 25
        },
        rank: 3,
        isAnonymous: showAnonymous,
        similarityScore: 78,
        trendDirection: 'down'
      },
      {
        id: 'peer-4',
        name: showAnonymous ? 'Anonymous User #4' : 'David Kim',
        title: 'Data Scientist',
        location: 'Seattle, WA',
        university: 'University of Washington',
        graduationYear: 2022,
        industry: 'Technology',
        experienceLevel: '1-2 years',
        metrics: {
          applications: 22,
          interviews: 8,
          jobViews: 312,
          profileViews: 67,
          responseRate: 36,
          avgTimeToResponse: 28,
          successRate: 62
        },
        rank: 4,
        isAnonymous: showAnonymous,
        similarityScore: 85,
        trendDirection: 'up'
      },
      {
        id: 'peer-5',
        name: showAnonymous ? 'Anonymous User #5' : 'Jessica Taylor',
        title: 'Marketing Specialist',
        location: 'Boston, MA',
        university: 'MIT',
        graduationYear: 2021,
        industry: 'Marketing',
        experienceLevel: '2-3 years',
        metrics: {
          applications: 8,
          interviews: 1,
          jobViews: 67,
          profileViews: 12,
          responseRate: 12,
          avgTimeToResponse: 96,
          successRate: 20
        },
        rank: 5,
        isAnonymous: showAnonymous,
        similarityScore: 72,
        trendDirection: 'stable'
      }
    ];

    setUserMetrics(currentUserMetrics);
    setPeers(mockPeers.slice(0, maxPeers));
    generateInsights(currentUserMetrics, mockPeers.slice(0, maxPeers));
    setLoading(false);
  }, [maxPeers, showAnonymous]);

  const generateInsights = (userMetrics: PeerMetrics, peerData: PeerData[]) => {
    const insights: ComparisonInsight[] = [];
    
    // Calculate peer averages
    const avgMetrics: PeerMetrics = {
      applications: Math.round(peerData.reduce((sum, p) => sum + p.metrics.applications, 0) / peerData.length),
      interviews: Math.round(peerData.reduce((sum, p) => sum + p.metrics.interviews, 0) / peerData.length),
      jobViews: Math.round(peerData.reduce((sum, p) => sum + p.metrics.jobViews, 0) / peerData.length),
      profileViews: Math.round(peerData.reduce((sum, p) => sum + p.metrics.profileViews, 0) / peerData.length),
      responseRate: Math.round(peerData.reduce((sum, p) => sum + p.metrics.responseRate, 0) / peerData.length),
      avgTimeToResponse: Math.round(peerData.reduce((sum, p) => sum + p.metrics.avgTimeToResponse, 0) / peerData.length),
      successRate: Math.round(peerData.reduce((sum, p) => sum + p.metrics.successRate, 0) / peerData.length)
    };

    // Generate insights based on comparison
    if (userMetrics.responseRate > avgMetrics.responseRate * 1.2) {
      insights.push({
        type: 'strength',
        metric: 'responseRate',
        message: `Your response rate (${userMetrics.responseRate}%) is ${Math.round(((userMetrics.responseRate - avgMetrics.responseRate) / avgMetrics.responseRate) * 100)}% higher than your peers`,
        priority: 'high'
      });
    }

    if (userMetrics.applications < avgMetrics.applications * 0.8) {
      insights.push({
        type: 'opportunity',
        metric: 'applications',
        message: `You're applying to ${avgMetrics.applications - userMetrics.applications} fewer jobs than your peers on average`,
        suggestion: 'Consider increasing your application rate to improve job search outcomes',
        priority: 'high'
      });
    }

    if (userMetrics.successRate < avgMetrics.successRate * 0.8) {
      insights.push({
        type: 'opportunity',
        metric: 'successRate',
        message: `Your interview success rate (${userMetrics.successRate}%) is below peer average (${avgMetrics.successRate}%)`,
        suggestion: 'Focus on interview preparation and practice to improve conversion rates',
        priority: 'medium'
      });
    }

    if (userMetrics.avgTimeToResponse < avgMetrics.avgTimeToResponse * 0.8) {
      insights.push({
        type: 'strength',
        metric: 'avgTimeToResponse',
        message: `You respond to opportunities ${Math.round(avgMetrics.avgTimeToResponse - userMetrics.avgTimeToResponse)} hours faster than peers`,
        priority: 'medium'
      });
    }

    insights.push({
      type: 'benchmark',
      metric: 'jobViews',
      message: `Industry benchmark: ${avgMetrics.jobViews} job views per month`,
      priority: 'low'
    });

    setInsights(insights);
  };

  const getMetricDisplayName = (metric: keyof PeerMetrics): string => {
    switch (metric) {
      case 'applications': return 'Applications';
      case 'interviews': return 'Interviews';
      case 'jobViews': return 'Job Views';
      case 'profileViews': return 'Profile Views';
      case 'responseRate': return 'Response Rate';
      case 'avgTimeToResponse': return 'Response Time';
      case 'successRate': return 'Success Rate';
      default: return metric;
    }
  };

  const getMetricUnit = (metric: keyof PeerMetrics): string => {
    switch (metric) {
      case 'responseRate':
      case 'successRate':
        return '%';
      case 'avgTimeToResponse':
        return 'h';
      default:
        return '';
    }
  };

  const getMetricIcon = (metric: keyof PeerMetrics) => {
    switch (metric) {
      case 'applications': return <Target className="w-4 h-4" />;
      case 'interviews': return <Users className="w-4 h-4" />;
      case 'jobViews': return <Eye className="w-4 h-4" />;
      case 'profileViews': return <Users className="w-4 h-4" />;
      case 'responseRate': return <TrendingUp className="w-4 h-4" />;
      case 'avgTimeToResponse': return <Clock className="w-4 h-4" />;
      case 'successRate': return <Award className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getComparisonColor = (userValue: number, peerValue: number, metric: keyof PeerMetrics): string => {
    const isHigherBetter = metric !== 'avgTimeToResponse';
    const isUserBetter = isHigherBetter ? userValue > peerValue : userValue < peerValue;
    
    if (isUserBetter) return 'text-green-600';
    if (userValue === peerValue) return 'text-gray-600';
    return 'text-red-600';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const metricOptions: (keyof PeerMetrics)[] = [
    'applications', 'interviews', 'responseRate', 'successRate', 'jobViews', 'avgTimeToResponse'
  ];

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Peer Comparison
          </h2>
          <p className="text-gray-600">See how you compare with similar professionals</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Privacy Information"
          >
            <Info className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Privacy Info */}
      <AnimatePresence>
        {showPrivacyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Privacy & Data</p>
                <p>All peer data is anonymized and aggregated. Individual performance metrics are never shared without explicit consent. You can toggle anonymous viewing at any time.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Compare by metric:</label>
        <div className="flex flex-wrap gap-2">
          {metricOptions.map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getMetricIcon(metric)}
              <span>{getMetricDisplayName(metric)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Your Performance */}
      {userMetrics && (
        <div className="bg-blue-50 border-l-4 border-l-blue-600 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              YOU
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Your Performance</h3>
              <div className="flex items-center space-x-4 text-sm text-blue-700">
                <span>
                  {getMetricDisplayName(selectedMetric)}: {userMetrics[selectedMetric]}{getMetricUnit(selectedMetric)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peer Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {peers.map((peer, index) => (
          <motion.div
            key={peer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {peer.isAnonymous ? '?' : peer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{peer.name}</h4>
                  <p className="text-sm text-gray-600">{peer.title}</p>
                </div>
              </div>
              {getTrendIcon(peer.trendDirection)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {getMetricDisplayName(selectedMetric)}
                </span>
                <span className={`font-semibold ${
                  userMetrics ? getComparisonColor(userMetrics[selectedMetric], peer.metrics[selectedMetric], selectedMetric) : 'text-gray-900'
                }`}>
                  {peer.metrics[selectedMetric]}{getMetricUnit(selectedMetric)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Similarity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${peer.similarityScore}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600">{peer.similarityScore}%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{peer.location}</span>
                </div>
                {peer.university && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{peer.university} '{peer.graduationYear?.toString().slice(-2)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{peer.experienceLevel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      {showInsights && insights.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Insights
          </h3>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'strength' 
                    ? 'bg-green-50 border-l-green-500' 
                    : insight.type === 'opportunity'
                    ? 'bg-yellow-50 border-l-yellow-500'
                    : 'bg-blue-50 border-l-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${
                      insight.type === 'strength' 
                        ? 'text-green-800' 
                        : insight.type === 'opportunity'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {insight.message}
                    </p>
                    {insight.suggestion && (
                      <p className={`text-sm mt-1 ${
                        insight.type === 'strength' 
                          ? 'text-green-700' 
                          : insight.type === 'opportunity'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }`}>
                        💡 {insight.suggestion}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    insight.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : insight.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerComparison;