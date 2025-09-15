import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/Button';
import ProjectBasicInfoForm from './forms/ProjectBasicInfoForm';
import ProjectTechnologiesForm from './forms/ProjectTechnologiesForm';
import ProjectLinksForm from './forms/ProjectLinksForm';
import { Project } from './types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => Promise<void>;
  initialData?: Partial<Project>;
  isLoading?: boolean;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: 'web-development',
    technologies: [],
    images: [],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    dateCompleted: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || 'web-development',
        technologies: initialData?.technologies || [],
        images: initialData?.images || [],
        githubUrl: initialData?.githubUrl || '',
        liveUrl: initialData?.liveUrl || '',
        featured: initialData?.featured || false,
        dateCompleted: initialData?.dateCompleted || new Date().toISOString().split('T')[0]
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid live demo URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'web-development',
        technologies: [],
        images: [],
        githubUrl: '',
        liveUrl: '',
        featured: false,
        dateCompleted: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit project:', error);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Add Project'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Add New Project'}
      footer={footer}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProjectBasicInfoForm
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
        />
        
        <ProjectTechnologiesForm
          technologies={formData.technologies}
          onChange={(technologies) => handleInputChange('technologies', technologies)}
        />
        
        <ProjectLinksForm
          githubUrl={formData.githubUrl}
          liveUrl={formData.liveUrl}
          featured={formData.featured}
          onGithubChange={(url) => handleInputChange('githubUrl', url)}
          onLiveUrlChange={(url) => handleInputChange('liveUrl', url)}
          onFeaturedChange={(featured) => handleInputChange('featured', featured)}
          errors={errors}
        />
      </form>
    </Modal>
  );
};

export default ProjectFormModal;