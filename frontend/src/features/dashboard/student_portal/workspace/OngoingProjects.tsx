"use client";

import React from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, ExternalLink } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  company: string;
  status: "In Progress" | "Review" | "Completed" | "Overdue";
  progress: number;
  dueDate: string;
  startDate: string;
  description: string;
  payment: string;
  category: string;
}

interface OngoingProjectsProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const OngoingProjects: React.FC<OngoingProjectsProps> = ({ projects, onProjectClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 ";
      case "Review":
        return "bg-yellow-100 text-yellow-800 ";
      case "Completed":
        return "bg-green-100 text-green-800 ";
      case "Overdue":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <PlayCircle className="h-4 w-4" />;
      case "Review":
        return <AlertCircle className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200  p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PlayCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Current Projects
        </h3>
        <p className="text-gray-600 mb-4">
          You don't have any active projects at the moment.
        </p>
        <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Browse Available Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200  p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900
            Current Projects
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Track your active micro-internship projects
          </p>
        </div>
        <span className="text-sm text-gray-500
          {projects.length} active
        </span>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50  transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600
                  {project.company}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600
                <Calendar className="h-4 w-4 mr-2" />
                <span>Started: {formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center text-gray-600
                <Clock className="h-4 w-4 mr-2" />
                <span className={project.status === "Overdue" ? "text-red-600 : ""}>
                  {getDaysRemaining(project.dueDate)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-3 pt-3 border-t border-gray-200
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600
                  Payment: <span className="font-medium text-gray-900
                </span>
                <span className="text-xs text-gray-500 bg-gray-100  px-2 py-1 rounded">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OngoingProjects; 