import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, Star, Upload, Github } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project, ProjectCategory } from './types';

interface ProjectsGridProps {
  projects: Project[];
  selectedCategory: ProjectCategory | 'all';
  onDeleteProject: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onShowUploadModal: () => void;
  onShowGitHubModal: () => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  selectedCategory,
  onDeleteProject,
  onToggleFeatured,
  onShowUploadModal,
  onShowGitHubModal
}) => {
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const featuredProjects = projects.filter(p => p.featured);

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FolderPlus className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No projects yet
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Start building your portfolio by uploading your first project or importing from GitHub
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onShowUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Upload className="w-4 h-4" />
            Upload Project
          </button>
          <button
            onClick={onShowGitHubModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            Import from GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Projects */}
      {featuredProjects.length > 0 && selectedCategory === 'all' && (
        <div>
          <div className="flex items-center mb-4">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Featured Projects
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={onDeleteProject}
                onToggleFeatured={onToggleFeatured}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Projects */}
      <div>
        {featuredProjects.length > 0 && selectedCategory === 'all' && (
          <div className="flex items-center mb-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <FolderPlus className="w-4 h-4 text-gray-500 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              All Projects
            </h4>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects
              .filter(p => selectedCategory === 'all' ? !p.featured : true)
              .map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={onDeleteProject}
                onToggleFeatured={onToggleFeatured}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;