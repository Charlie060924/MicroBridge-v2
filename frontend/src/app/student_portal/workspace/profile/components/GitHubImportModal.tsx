import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/Button';
import { Github, ExternalLink, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Project } from './types';
import { GitHubService } from '../services/githubService';

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (project: Omit<Project, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

interface RepositoryData {
  name: string;
  description: string;
  language: string;
  topics: string[];
  html_url: string;
  clone_url: string;
  created_at: string;
  updated_at: string;
  homepage?: string;
}

const GitHubImportModal: React.FC<GitHubImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  isLoading = false
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoData, setRepoData] = useState<RepositoryData | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [validationStep, setValidationStep] = useState<'input' | 'preview' | 'importing'>('input');

  const fetchRepositoryData = async () => {
    if (!repoUrl.trim()) {
      setFetchError('Please enter a GitHub repository URL');
      return;
    }

    const repoInfo = GitHubService.parseRepositoryUrl(repoUrl);
    if (!repoInfo) {
      setFetchError('Invalid GitHub URL format. Please enter a valid repository URL.');
      return;
    }

    setIsFetching(true);
    setFetchError('');

    try {
      // For demo purposes, we'll use mock data
      // In production, you would use: const repoData = await GitHubService.fetchRepository(repoInfo.owner, repoInfo.repo);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const mockData: RepositoryData = GitHubService.createMockRepository(repoUrl);
      setRepoData(mockData);
      setValidationStep('preview');
    } catch (error) {
      setFetchError('Failed to fetch repository data. Please check the URL and try again.');
      console.error('GitHub API error:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleImport = async () => {
    if (!repoData) return;

    setValidationStep('importing');

    try {
      const projectData: Omit<Project, 'id'> = {
        title: repoData.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repoData.description || `Imported from GitHub repository: ${repoData.name}`,
        category: GitHubService.determineCategory(repoData),
        technologies: GitHubService.extractTechnologies(repoData),
        images: [],
        githubUrl: repoData.html_url,
        liveUrl: repoData.homepage || '',
        featured: false,
        dateCompleted: new Date(repoData.updated_at).toISOString().split('T')[0]
      };

      await onImport(projectData);
      handleClose();
    } catch (error) {
      setFetchError('Failed to import project. Please try again.');
      setValidationStep('preview');
    }
  };

  const handleClose = () => {
    setRepoUrl('');
    setRepoData(null);
    setFetchError('');
    setValidationStep('input');
    onClose();
  };

  const renderInputStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Github className="w-4 h-4 inline mr-1" />
          GitHub Repository URL
        </label>
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          placeholder="https://github.com/username/repository-name"
        />
        {fetchError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {fetchError}
          </p>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 What we'll import
        </h5>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>Project name and description</li>
          <li>Programming languages and technologies used</li>
          <li>Repository topics as project tags</li>
          <li>Live demo link (if available)</li>
        </ul>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Repository found!</span>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {repoData?.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {repoData?.description}
            </p>
          </div>
          <a
            href={repoData?.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Language:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{repoData?.language}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {repoData?.updated_at ? new Date(repoData.updated_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {repoData?.topics && repoData.topics.length > 0 && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Technologies:</span>
            <div className="flex flex-wrap gap-2">
              {repoData.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose}>
        Cancel
      </Button>
      {validationStep === 'input' && (
        <Button onClick={fetchRepositoryData} loading={isFetching} disabled={isFetching || !repoUrl.trim()}>
          {isFetching ? 'Fetching...' : 'Fetch Repository'}
        </Button>
      )}
      {validationStep === 'preview' && (
        <Button onClick={handleImport} loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Importing...' : 'Import Project'}
        </Button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import from GitHub"
      footer={footer}
      size="lg"
    >
      {validationStep === 'input' && renderInputStep()}
      {validationStep === 'preview' && renderPreviewStep()}
      
      {validationStep === 'importing' && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Importing your project...</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GitHubImportModal;