"use client";

import React from "react";
import { Plus, Briefcase, Users, FileText, Calendar, Settings } from "lucide-react";

interface QuickActionsProps {
  onPostJob: () => void;
  onManageJobs: () => void;
  onViewApplications: () => void;
  onViewCandidates: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onPostJob,
  onManageJobs,
  onViewApplications,
  onViewCandidates,
}) => {
  const actions = [
    {
      title: "Post New Job",
      description: "Create and publish a new job posting",
      icon: <Plus className="h-6 w-6" />,
      onClick: onPostJob,
      color: "bg-green-600 hover:bg-green-700",
      textColor: "text-white",
      priority: true,
    },
    {
      title: "Manage Jobs",
      description: "View and edit your job postings",
      icon: <Briefcase className="h-6 w-6" />,
      onClick: onManageJobs,
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
      priority: false,
    },
    {
      title: "View Applications",
      description: "Review incoming applications",
      icon: <FileText className="h-6 w-6" />,
      onClick: onViewApplications,
      color: "bg-purple-600 hover:bg-purple-700",
      textColor: "text-white",
      priority: false,
    },
    {
      title: "Browse Candidates",
      description: "Find potential candidates",
      icon: <Users className="h-6 w-6" />,
      onClick: onViewCandidates,
      color: "bg-orange-600 hover:bg-orange-700",
      textColor: "text-white",
      priority: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200  p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900
            Quick Actions
          </h2>
          <p className="text-gray-600
            Get started with your hiring process
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`group relative p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              action.priority 
                ? 'ring-2 ring-green-500 ring-opacity-50' 
                : 'hover:border-gray-300
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${action.color} ${action.textColor}`}>
                {action.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 ">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
            
            {action.priority && (
              <div className="absolute -top-2 -right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ">
                  Popular
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Additional Quick Links */}
      <div className="mt-6 pt-6 border-t border-gray-200
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900  transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Interviews
          </button>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900  transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
