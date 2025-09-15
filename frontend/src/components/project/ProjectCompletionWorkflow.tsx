"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, Upload, DollarSign, Star, Download, FileText, Send } from "lucide-react";

interface CompletionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface ProjectCompletionWorkflowProps {
  projectId: string;
  projectTitle: string;
  finalPayment: number;
  onCompleteProject?: () => void;
}

const ProjectCompletionWorkflow: React.FC<ProjectCompletionWorkflowProps> = ({
  projectId,
  projectTitle,
  finalPayment,
  onCompleteProject
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [deliverableFiles, setDeliverableFiles] = useState<File[]>([]);
  const [testimonialRequest, setTestimonialRequest] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completionSteps: CompletionStep[] = [
    {
      id: 'final-deliverables',
      title: 'Submit Final Deliverables',
      description: 'Upload all final project files and documentation',
      completed: deliverableFiles.length > 0,
      required: true
    },
    {
      id: 'project-summary',
      title: 'Write Project Summary',
      description: 'Document your work and key achievements',
      completed: completionNotes.length > 100,
      required: true
    },
    {
      id: 'client-review',
      title: 'Request Client Review',
      description: 'Submit work for client approval',
      completed: false,
      required: true
    },
    {
      id: 'testimonial',
      title: 'Request Testimonial',
      description: 'Ask client for feedback and recommendation',
      completed: testimonialRequest.length > 50,
      required: false
    },
    {
      id: 'payment',
      title: 'Receive Final Payment',
      description: 'Complete payment processing',
      completed: false,
      required: true
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDeliverableFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setDeliverableFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update step completion
      const updatedSteps = [...completionSteps];
      updatedSteps[2].completed = true;
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderStepContent = () => {
    const step = completionSteps[currentStep];
    if (!step) return null;

    switch (step.id) {
      case 'final-deliverables':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Upload your final project deliverables
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="deliverable-upload"
              />
              <label
                htmlFor="deliverable-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>

            {deliverableFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Files:</h4>
                {deliverableFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'project-summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Summary & Achievements
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Describe what you accomplished, challenges overcome, and key deliverables..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="text-sm text-gray-500 mt-1">
                {completionNotes.length}/100 characters minimum
              </div>
            </div>
          </div>
        );

      case 'client-review':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Ready for Review
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Your deliverables and project summary will be sent to the client for review and approval.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900 dark:text-white">Review Package Includes:</h5>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{deliverableFiles.length} deliverable files</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Project summary and achievements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Work timeline and milestones</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubmitForReview}
              disabled={isSubmitting || !step.completed}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Submitting for Review...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit for Client Review</span>
                </>
              )}
            </button>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Testimonial Request Message
              </label>
              <textarea
                value={testimonialRequest}
                onChange={(e) => setTestimonialRequest(e.target.value)}
                placeholder="Hi [Client Name], I've really enjoyed working on this project. Would you be willing to provide a brief testimonial about our collaboration? This would help me in future applications..."
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <Star className="h-4 w-4 inline mr-1" />
                Testimonials help build your reputation and improve your chances of getting future projects.
              </p>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Final Payment Processing
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                Your final payment of <span className="font-bold">${finalPayment}</span> will be processed once the client approves your work.
              </p>
              <div className="text-xs text-green-600 dark:text-green-400">
                Estimated processing time: 1-3 business days
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = completionSteps[currentStep];
    return step?.completed || !step?.required;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Complete Project: {projectTitle}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Follow these steps to successfully complete your project
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {completionSteps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / completionSteps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / completionSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {completionSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              index === currentStep 
                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
                : step.completed 
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                {step.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Required</span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < completionSteps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={onCompleteProject}
            disabled={!completionSteps.every(s => s.completed || !s.required)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Complete Project
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCompletionWorkflow;