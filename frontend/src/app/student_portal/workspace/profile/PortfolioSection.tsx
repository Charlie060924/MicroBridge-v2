"use client";

import React, { useState } from "react";
import TraditionalPortfolioSection from './components/TraditionalPortfolioSection';
import AdvancedPortfolioSection from './components/AdvancedPortfolioSection';
import ProjectFormModal from './components/ProjectFormModal';
import GitHubImportModal from './components/GitHubImportModal';
import { Project } from './components/types';

interface PortfolioSectionProps {
  portfolioUrl: string;
  onUpdate: (url: string) => void;
  userCareerFields?: string[];
}

export default function PortfolioSection({ 
  portfolioUrl, 
  onUpdate, 
  userCareerFields = [] 
}: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<'traditional' | 'advanced'>('traditional');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProjectUpload = async (projectData: Omit<Project, 'id'>) => {
    setIsLoading(true);
    try {
      // Here you would typically call an API to save the project
      console.log('Uploading project:', projectData);
      
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // The actual project creation will be handled by the AdvancedPortfolioSection
      // when we integrate the state management
    } catch (error) {
      console.error('Failed to upload project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubImport = async (projectData: Omit<Project, 'id'>) => {
    setIsLoading(true);
    try {
      console.log('Importing GitHub project:', projectData);
      
      // Simulate API call for GitHub import
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // The actual project creation will be handled by the AdvancedPortfolioSection
      // when we integrate the state management
    } catch (error) {
      console.error('Failed to import GitHub project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {viewMode === 'traditional' ? (
        <TraditionalPortfolioSection
          portfolioUrl={portfolioUrl}
          onUpdate={onUpdate}
          onSwitchToAdvanced={() => setViewMode('advanced')}
        />
      ) : (
        <AdvancedPortfolioSection
          userCareerFields={userCareerFields}
          onSwitchToTraditional={() => setViewMode('traditional')}
          onShowUploadModal={() => setShowUploadModal(true)}
          onShowGitHubModal={() => setShowGitHubModal(true)}
        />
      )}

      <ProjectFormModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleProjectUpload}
        isLoading={isLoading}
      />

      <GitHubImportModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        onImport={handleGitHubImport}
        isLoading={isLoading}
      />
    </>
  );
}