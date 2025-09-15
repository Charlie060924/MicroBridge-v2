import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Star, 
  Trash2, 
  ExternalLink,
  Calendar,
  Github
} from 'lucide-react';
import { Project, categoryLabels } from './types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onDelete, 
  onToggleFeatured 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    {/* Project Image */}
    {project.images.length > 0 ? (
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img 
          src={project.images[0]} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <Code className="w-8 h-8 text-blue-400" />
      </div>
    )}

    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-semibold text-gray-900 dark:text-white truncate">
          {project.title}
        </h5>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onToggleFeatured(project.id)}
            className={`p-1 rounded transition-colors duration-200 ${
              project.featured 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {project.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className={`px-2 py-1 rounded-full font-medium ${
          project.category === 'web-development' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
          project.category === 'design' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {categoryLabels[project.category]}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(project.dateCompleted).toLocaleDateString()}
        </span>
      </div>
      
      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <ExternalLink className="w-3 h-3" />
            Live
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Github className="w-3 h-3" />
            Code
          </a>
        )}
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;