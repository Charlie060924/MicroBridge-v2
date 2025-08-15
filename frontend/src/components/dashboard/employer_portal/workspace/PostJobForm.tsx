"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  FileText, 
  Save, 
  Eye,
  Plus,
  X
} from "lucide-react";
import JobActionModal, { ModalType } from "@/components/common/JobActionModal";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  requirements: string;
  skills: string[];
  experienceLevel: string;
  isRemote: boolean;
  deadline: string;
}

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  actionLabel?: string;
}

const PostJobForm: React.FC = () => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    actionLabel: ''
  });

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    salary: "",
    duration: "",
    category: "",
    description: "",
    requirements: "",
    skills: [],
    experienceLevel: "",
    isRemote: false,
    deadline: "",
  });

  const categories = [
    "Development",
    "Design",
    "Marketing",
    "Analytics",
    "Content",
    "Research",
    "Administration",
    "Other"
  ];

  const experienceLevels = [
    "Entry",
    "Intermediate",
    "Advanced",
    "Expert"
  ];

  const handleInputChange = useCallback((field: keyof JobFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAddSkill = useCallback(() => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  }, [currentSkill, formData.skills]);

  const handleRemoveSkill = useCallback((skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);

  // Show modal function
  const showModal = useCallback((type: ModalType, title: string, message: string, actionLabel?: string) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      actionLabel
    });
  }, []);

  // Close modal function
  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Handle modal action (navigate to manage jobs page)
  const handleModalAction = useCallback(() => {
    closeModal();
    router.push('/employer_portal/workspace/manage-jobs');
  }, [closeModal, router]);

  // Handle retry submission
  const handleRetry = useCallback(() => {
    closeModal();
    // Reset form or allow user to try again
  }, [closeModal]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success (you can toggle this to test error case)
      const shouldSucceed = Math.random() > 0.2; // 80% success rate for testing
      
      if (shouldSucceed) {
        showModal(
          'success',
          'Draft Saved Successfully!',
          'Your job draft has been saved successfully. You can continue editing or publish it later.',
          'Manage My Jobs'
        );
      } else {
        // Simulate error
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showModal(
        'error',
        'Draft Save Failed',
        `Failed to save draft: ${errorMessage}. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  }, [showModal]);

  const handlePublish = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success (you can toggle this to test error case)
      const shouldSucceed = Math.random() > 0.3; // 70% success rate for testing
      
      if (shouldSucceed) {
        showModal(
          'success',
          'Job Posted Successfully!',
          'Your job has been posted successfully and is now visible to candidates. You can manage your job postings from the employer portal.',
          'Manage My Jobs'
        );
      } else {
        // Simulate error
        throw new Error('Failed to publish job');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showModal(
        'error',
        'Job Posting Failed',
        `Failed to publish job: ${errorMessage}. Please check your information and try again.`
      );
    } finally {
      setIsSaving(false);
    }
  }, [showModal]);

  const isFormValid = useCallback(() => {
    return (
      formData.title &&
      formData.company &&
      formData.location &&
      formData.salary &&
      formData.duration &&
      formData.category &&
      formData.description &&
      formData.requirements &&
      formData.skills.length > 0 &&
      formData.experienceLevel &&
      formData.deadline
    );
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isPreview ? "Preview Job Posting" : "Post New Job"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isPreview ? "Review your job posting before publishing" : "Create a new job posting to attract candidates"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {isPreview ? (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                )}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={handlePublish}
                disabled={!isFormValid() || isSaving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSaving ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreview ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formData.title || "Job Title"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {formData.company || "Company Name"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {formData.location || "Location"}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2" />
                {formData.salary || "Salary"}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                {formData.duration || "Duration"}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Job Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {formData.description || "Job description will appear here..."}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Requirements
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {formData.requirements || "Job requirements will appear here..."}
              </p>
            </div>

            {formData.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <strong>Experience Level:</strong> {formData.experienceLevel || "Not specified"}
              </div>
              <div>
                <strong>Remote:</strong> {formData.isRemote ? "Yes" : "No"}
              </div>
              <div>
                <strong>Category:</strong> {formData.category || "Not specified"}
              </div>
              <div>
                <strong>Application Deadline:</strong> {formData.deadline || "Not specified"}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., New York, NY or Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Range *
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., $25-35/hr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 3 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level *
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remote position
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="List the requirements and qualifications needed..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Skills *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Add a skill (press Enter)"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Action Modal */}
      <JobActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actionLabel={modalState.actionLabel}
        onAction={handleModalAction}
        onRetry={handleRetry}
        isLoading={isSaving}
      />
    </div>
  );
};

export default PostJobForm;
