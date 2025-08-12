"use client";

import React from "react";
import { Users, Eye, CheckCircle, Star, TrendingUp } from "lucide-react";

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

interface HiringFunnelProps {
  applications: Application[];
}

const HiringFunnel: React.FC<HiringFunnelProps> = ({ applications }) => {
  // Calculate funnel data
  const funnelData = React.useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const reviewed = applications.filter(app => app.status === 'reviewed').length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
    const hired = applications.filter(app => app.status === 'hired').length;

    return [
      {
        stage: 'Applied',
        count: total,
        percentage: total > 0 ? 100 : 0,
        color: 'bg-blue-500',
        icon: <Users className="h-4 w-4" />,
        description: 'Total applications received'
      },
      {
        stage: 'Pending Review',
        count: pending,
        percentage: total > 0 ? Math.round((pending / total) * 100) : 0,
        color: 'bg-yellow-500',
        icon: <Eye className="h-4 w-4" />,
        description: 'Awaiting review'
      },
      {
        stage: 'Reviewed',
        count: reviewed,
        percentage: total > 0 ? Math.round((reviewed / total) * 100) : 0,
        color: 'bg-purple-500',
        icon: <CheckCircle className="h-4 w-4" />,
        description: 'Under consideration'
      },
      {
        stage: 'Shortlisted',
        count: shortlisted,
        percentage: total > 0 ? Math.round((shortlisted / total) * 100) : 0,
        color: 'bg-orange-500',
        icon: <Star className="h-4 w-4" />,
        description: 'Top candidates'
      },
      {
        stage: 'Hired',
        count: hired,
        percentage: total > 0 ? Math.round((hired / total) * 100) : 0,
        color: 'bg-green-500',
        icon: <TrendingUp className="h-4 w-4" />,
        description: 'Successfully hired'
      }
    ];
  }, [applications]);

  const getConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round((current / previous) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hiring Funnel
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your hiring process stages
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start receiving applications to see your hiring funnel
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stage.color} text-white`}>
                      {stage.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {stage.stage}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stage.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.percentage}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Conversion rate */}
                {index > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {getConversionRate(stage.count, funnelData[index - 1].count)}% conversion from {funnelData[index - 1].stage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {applications.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {applications.filter(app => app.status === 'shortlisted').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Shortlisted
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {applications.filter(app => app.status === 'hired').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hired
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiringFunnel;
