import React, { useState, useCallback } from 'react';
import { FolderPlus, Github, Plus, Link } from 'lucide-react';
import PortfolioProgress from './PortfolioProgress';
import SmartSuggestions from './SmartSuggestions';
import CategoryFilter from './CategoryFilter';
import ProjectsGrid from './ProjectsGrid';
import { Project, ProjectCategory } from './types';

interface AdvancedPortfolioSectionProps {
  userCareerFields?: string[];
  onSwitchToTraditional: () => void;
  onShowUploadModal: () => void;
  onShowGitHubModal: () => void;
}

const AdvancedPortfolioSection: React.FC<AdvancedPortfolioSectionProps> = ({
  userCareerFields = [],
  onSwitchToTraditional,
  onShowUploadModal,
  onShowGitHubModal
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const featuredProjects = projects.filter(p => p.featured);

  const handleProjectUpload = useCallback(async (projectData: Omit<Project, 'id'>) => {
    setIsLoading(true);
    try {
      const newProject: Project = {
        ...projectData,
        id: `project_${Date.now()}`
      };
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('Failed to upload project:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGitHubImport = useCallback(async (repoUrl: string) => {
    setIsLoading(true);
    try {
      const mockProject: Project = {
        id: `github_${Date.now()}`,
        title: 'Imported from GitHub',
        description: 'Automatically imported project from GitHub repository',
        category: 'web-development',
        technologies: ['JavaScript', 'React'],
        images: [],
        githubUrl: repoUrl,
        featured: false,
        dateCompleted: new Date().toISOString().split('T')[0]
      };
      setProjects(prev => [...prev, mockProject]);
    } catch (error) {
      console.error('Failed to import from GitHub:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  const handleToggleFeatured = useCallback((projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    ));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Portfolio Creation System
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Showcase your best work to potential employers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToTraditional}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Link className="w-4 h-4" />
            Simple URL
          </button>
          <button
            onClick={onShowGitHubModal}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            Import from GitHub
          </button>
          <button
            onClick={onShowUploadModal}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Portfolio Progress */}
      <PortfolioProgress
        totalProjects={projects.length}
        featuredProjects={featuredProjects.length}
      />

      {/* Smart Suggestions */}
      <SmartSuggestions
        userCareerFields={userCareerFields}
        existingProjects={projects}
        onShowUploadModal={onShowUploadModal}
      />

      {/* Category Filter */}
      <CategoryFilter
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Projects Grid */}
      <ProjectsGrid
        projects={projects}
        selectedCategory={selectedCategory}
        onDeleteProject={handleDeleteProject}
        onToggleFeatured={handleToggleFeatured}
        onShowUploadModal={onShowUploadModal}
        onShowGitHubModal={onShowGitHubModal}
      />
    </div>
  );
};

export default AdvancedPortfolioSection;