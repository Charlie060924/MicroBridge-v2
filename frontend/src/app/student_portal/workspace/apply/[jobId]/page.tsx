"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, FileText, Edit3 } from "lucide-react";
import { Job } from "@/components/dashboard/student_portal/workspace/JobCategoryCard";

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  portfolio: string;
  coverLetter: string;
  availability: string;
  startDate: string;
}

// Mock user resume data - replace with actual user context/API
const mockUserResume = {
  fileName: "john_doe_resume.pdf",
  uploadedDate: "2024-01-15",
  isAvailable: true
};

// Memoized mock jobs data to prevent recreation on each render
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$25-35/hour",
    duration: "3-6 months",
    category: "Web Development",
    description: "Build responsive web applications using React and TypeScript.",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "Git", "REST APIs"],
    rating: 4.5,
    isBookmarked: false,
    postedDate: "2 days ago",
    deadline: "2024-02-15",
    isRemote: true,
    experienceLevel: "Entry"
  },
  {
    id: "2",
    title: "Data Analysis Assistant",
    company: "DataFlow Analytics",
    location: "Remote",
    salary: "$20-30/hour",
    duration: "2-4 months",
    category: "Data Science",
    description: "Analyze customer data and create insightful reports.",
    skills: ["Python", "Pandas", "SQL", "Excel", "Tableau", "Statistics"],
    rating: 4.2,
    isBookmarked: true,
    postedDate: "1 week ago",
    deadline: "2024-02-20",
    isRemote: true,
    experienceLevel: "Entry"
  },
  {
    id: "3",
    title: "UI/UX Design Intern",
    company: "Creative Studio",
    location: "New York, NY",
    salary: "$30-40/hour",
    duration: "4-6 months",
    category: "Design",
    description: "Design user interfaces and improve user experience.",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    rating: 4.7,
    isBookmarked: false,
    postedDate: "3 days ago",
    deadline: "2024-02-18",
    isRemote: false,
    experienceLevel: "Intermediate"
  },
  {
    id: "4",
    title: "Content Marketing Assistant",
    company: "Growth Marketing Co.",
    location: "Austin, TX",
    salary: "$18-25/hour",
    duration: "3-5 months",
    category: "Marketing",
    description: "Create engaging content for social media and blogs.",
    skills: ["Content Writing", "Social Media", "SEO", "Copywriting", "Analytics", "Creative Design"],
    rating: 4.0,
    isBookmarked: false,
    postedDate: "5 days ago",
    deadline: "2024-02-25",
    isRemote: true,
    experienceLevel: "Entry"
  }
];

const ApplicationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    coverLetter: "",
    availability: "",
    startDate: ""
  });

  const jobId = params.jobId as string;

  // Memoize the job lookup to prevent unnecessary recalculations
  const job = useMemo(() => {
    return mockJobs.find(j => j.id === jobId) || null;
  }, [jobId]);

  // Optimized job fetching with useCallback to prevent recreation
  const fetchJob = useCallback(async () => {
    // Simulate API delay only in development
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // Optimized input change handler using useCallback
  const handleInputChange = useCallback((field: keyof ApplicationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with shorter delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and redirect
      router.push(`/student_portal/workspace/applications?submitted=${jobId}`);
    } catch {
      // Better error handling - could use toast instead of alert
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [jobId, router]);

  // Optimized loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Optimized not found state
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Optimized Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Job
            </button>
            <div className="text-right">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Application for {job.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.company}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://..."
                  autoComplete="url"
                />
              </div>
            </div>
          </section>

          {/* Resume Section - Using Provided Resume */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Resume/CV
            </h2>
            
            {mockUserResume.isAvailable ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Using your uploaded resume
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {mockUserResume.fileName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Uploaded on {new Date(mockUserResume.uploadedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/student_portal/profile/documents')}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Update
                  </button>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">
                  We'll use the resume you previously uploaded to your profile for this application.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      No resume found
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Please upload your resume in your profile first.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/student_portal/profile/documents')}
                  className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </section>

          {/* Cover Letter */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Cover Letter *
            </h2>
            <div className="space-y-2">
              <textarea
                required
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                rows={8}
                placeholder={`Dear ${job.company} Hiring Team,\n\nI am excited to apply for the ${job.title} position. Here&apos;s why I believe I would be a great fit for this role...\n\n- Relevant experience with: ${job.skills.slice(0, 3).join(', ')}\n- My passion for ${job.category.toLowerCase()}\n- How I can contribute to your team\n\nI look forward to discussing this opportunity further.\n\nBest regards,\n[Your Name]`}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                style={{ minHeight: '200px' }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.coverLetter.length} characters • Recommended: 300-500 words
              </p>
            </div>
          </section>

          {/* Availability */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Availability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability *
                </label>
                <select
                  required
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate (Available now)</option>
                  <option value="1-2-weeks">1-2 weeks notice</option>
                  <option value="1-month">1 month notice</option>
                  <option value="flexible">Flexible start date</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !mockUserResume.isAvailable}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplicationPage;