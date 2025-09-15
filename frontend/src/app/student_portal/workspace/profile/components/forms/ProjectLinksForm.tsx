import React from 'react';
import { Link, Star, Github, ExternalLink } from 'lucide-react';

interface ProjectLinksFormProps {
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  onGithubChange: (url: string) => void;
  onLiveUrlChange: (url: string) => void;
  onFeaturedChange: (featured: boolean) => void;
  errors: Record<string, string>;
}

const ProjectLinksForm: React.FC<ProjectLinksFormProps> = ({
  githubUrl,
  liveUrl,
  featured,
  onGithubChange,
  onLiveUrlChange,
  onFeaturedChange,
  errors
}) => {
  return (
    <div className="space-y-6">
      {/* URLs Section */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Project Links
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Github className="w-4 h-4 inline mr-1" />
              GitHub Repository
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => onGithubChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                errors.githubUrl ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.githubUrl}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Link to your source code repository
            </p>
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ExternalLink className="w-4 h-4 inline mr-1" />
              Live Demo
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => onLiveUrlChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                errors.liveUrl ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="https://your-project.com"
            />
            {errors.liveUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.liveUrl}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Link to the deployed/live version of your project
            </p>
          </div>
        </div>
      </div>

      {/* Featured Project Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => onFeaturedChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex-1">
            <label 
              htmlFor="featured" 
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              Feature this project
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Featured projects are displayed prominently in your portfolio and shown first to potential employers.
              Choose your best work to feature.
            </p>
          </div>
        </div>
      </div>

      {/* Help text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 Tips for Great Project Links
        </h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>Include a detailed README in your GitHub repository</li>
          <li>Ensure your live demo is accessible and functional</li>
          <li>Feature 2-3 of your strongest, most relevant projects</li>
          <li>Add screenshots or demo videos to showcase your work</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectLinksForm;