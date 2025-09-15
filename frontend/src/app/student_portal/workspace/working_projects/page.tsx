
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, ExternalLink, DollarSign, Eye, FolderOpen, Settings, Users, MessageSquare } from "lucide-react";
import { useWorkingProjects } from "@/hooks/useStudentData";
import { usePerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { WorkingProjectsSkeleton } from "@/components/skeletons/PageSkeletons";
import ProjectKickoffModal from "@/components/onboarding/ProjectKickoffModal";
import ProjectMilestonePlanner from "@/components/onboarding/ProjectMilestonePlanner";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  earnings: number;
  progress: number;
  employer: string;
}

const WorkingProjectsPage: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, error } = useWorkingProjects();
  const projects: Project[] = Array.isArray(data) ? data : [];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showKickoff, setShowKickoff] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  
  // Performance monitoring
  usePerformanceMonitor('WorkingProjects');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Working Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your ongoing micro-internship projects and billing status
              </p>
            </div>
            <button
              onClick={() => router.push('/student_portal/workspace/jobs')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Browse Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <WorkingProjectsSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Failed to load your working projects. Please try again.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects?.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Earnings: ${project.earnings}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    Progress: {project.progress}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Employer: {project.employer}
                  </span>
                  <div className="flex space-x-2">
                    {project.status === 'pending' && (
                      <button 
                        onClick={() => {
                          setSelectedProject(project);
                          setShowKickoff(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Users className="h-3 w-3" />
                        <span>Start Kickoff</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        setShowMilestones(true);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Settings className="h-3 w-3" />
                      <span>Milestones</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/student_portal/workspace/project-details/${project.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {projects && projects.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Working Projects
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You don't have any active projects yet. Start applying for micro-internships!
                </p>
                <button
                  onClick={() => router.push('/student_portal/workspace/jobs')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showKickoff && selectedProject && (
        <ProjectKickoffModal
          project={selectedProject}
          onClose={() => {
            setShowKickoff(false);
            setSelectedProject(null);
          }}
          onComplete={() => {
            setShowKickoff(false);
            setSelectedProject(null);
          }}
        />
      )}

      {showMilestones && selectedProject && (
        <ProjectMilestonePlanner
          project={selectedProject}
          onClose={() => {
            setShowMilestones(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkingProjectsPage;
