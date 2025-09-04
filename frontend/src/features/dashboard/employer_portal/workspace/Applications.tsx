"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  X,
  Clock,
  Star,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Bookmark,
  Download,
  Mail
} from "lucide-react";
import { showNotification } from "@/utils/notificationUtils";
import { api } from "@/services/api";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import JobActionModal, { ModalType } from "@/components/common/JobActionModal";

interface Application {
  id: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  matchScore: number;
  skills: string[];
  experience: string;
  location: string;
  avatar?: string;
  coverLetter?: string;
  resumeUrl?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("appliedDate");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [showJobActionModal, setShowJobActionModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('success');
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  
  // Loading states
  const [isShortlisting, setIsShortlisting] = useState<string | null>(null);
  const [isMessaging, setIsMessaging] = useState<string | null>(null);
  const [isViewingResume, setIsViewingResume] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: "1",
        jobTitle: "Frontend Developer",
        applicantName: "John Doe",
        applicantEmail: "john.doe@email.com",
        appliedDate: "2024-01-16",
        status: 'pending',
        matchScore: 85,
        skills: ["React", "TypeScript", "CSS", "Node.js"],
        experience: "3 years",
        location: "New York, NY",
        coverLetter: "I am excited to apply for the Frontend Developer position...",
        resumeUrl: "/resumes/john-doe-resume.pdf",
        salary: { min: 50000, max: 70000, currency: "USD" }
      },
      {
        id: "2",
        jobTitle: "UI/UX Designer",
        applicantName: "Jane Smith",
        applicantEmail: "jane.smith@email.com",
        appliedDate: "2024-01-12",
        status: 'reviewed',
        matchScore: 92,
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        experience: "2 years",
        location: "San Francisco, CA",
        coverLetter: "With my background in design and user experience...",
        resumeUrl: "/resumes/jane-smith-resume.pdf",
        salary: { min: 60000, max: 80000, currency: "USD" }
      },
      {
        id: "3",
        jobTitle: "Frontend Developer",
        applicantName: "Mike Johnson",
        applicantEmail: "mike.johnson@email.com",
        appliedDate: "2024-01-14",
        status: 'shortlisted',
        matchScore: 78,
        skills: ["React", "JavaScript", "HTML", "CSS"],
        experience: "1 year",
        location: "Remote",
        coverLetter: "I am a passionate developer with experience in...",
        resumeUrl: "/resumes/mike-johnson-resume.pdf"
      },
      {
        id: "4",
        jobTitle: "Data Analyst",
        applicantName: "Sarah Wilson",
        applicantEmail: "sarah.wilson@email.com",
        appliedDate: "2024-01-10",
        status: 'hired',
        matchScore: 95,
        skills: ["Python", "SQL", "Tableau", "Excel"],
        experience: "4 years",
        location: "Boston, MA",
        coverLetter: "I have extensive experience in data analysis...",
        resumeUrl: "/resumes/sarah-wilson-resume.pdf",
        salary: { min: 70000, max: 90000, currency: "USD" }
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search applications
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Job filter
    if (jobFilter !== "all") {
      filtered = filtered.filter(app => app.jobTitle === jobFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "appliedDate":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "name":
          return a.applicantName.localeCompare(b.applicantName);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter, jobFilter, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 ";
      case "reviewed":
        return "bg-blue-100 text-blue-800 ";
      case "shortlisted":
        return "bg-green-100 text-green-800 ";
      case "rejected":
        return "bg-red-100 text-red-800 ";
      case "hired":
        return "bg-purple-100 text-purple-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600
    if (score >= 80) return 'text-blue-600
    if (score >= 70) return 'text-yellow-600
    return 'text-red-600
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary || !salary.currency || salary.min === undefined || salary.max === undefined) {
      return "Salary not specified";
    }
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  // Handle application actions
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setShowMessageModal(false);
    setShowResumeModal(false);
    setShowShortlistModal(false);
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as Application['status'] }
            : app
        )
      );

      showNotification({
        type: 'success',
        title: 'Status Updated',
        message: `Application status updated to ${newStatus}`,
        action: {
          label: 'View',
          url: '#'
        }
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update application status. Please try again.',
        action: {
          label: 'Retry',
          url: '#'
        }
      });
    }
  };

  const handleSendMessage = async (application: Application) => {
    setIsMessaging(application.id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModalType('success');
      setModalTitle('Message Sent');
      setModalMessage(`Message sent successfully to ${application.applicantName}`);
      setShowJobActionModal(true);
      
      showNotification({
        type: 'success',
        title: 'Message Sent',
        message: `Message sent to ${application.applicantName}`,
        action: {
          label: 'View Messages',
          url: '#'
        }
      });
    } catch (error) {
      setModalType('error');
      setModalTitle('Message Failed');
      setModalMessage('Failed to send message. Please try again.');
      setShowJobActionModal(true);
      
      showNotification({
        type: 'error',
        title: 'Message Failed',
        message: 'Failed to send message. Please try again.',
        action: {
          label: 'Retry',
          url: '#'
        }
      });
    } finally {
      setIsMessaging(null);
    }
  };

  const handleViewResume = async (application: Application) => {
    setIsViewingResume(application.id);
    try {
      // Simulate API call to log resume view
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (application.resumeUrl) {
        window.open(application.resumeUrl, '_blank');
      }
      
      showNotification({
        type: 'success',
        title: 'Resume Opened',
        message: `Resume for ${application.applicantName} opened in new tab`,
        action: {
          label: 'View',
          url: application.resumeUrl || '#'
        }
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Resume Error',
        message: 'Failed to open resume. Please try again.',
        action: {
          label: 'Retry',
          url: '#'
        }
      });
    } finally {
      setIsViewingResume(null);
    }
  };

  const handleShortlist = async (application: Application) => {
    setIsShortlisting(application.id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = application.status === 'shortlisted' ? 'reviewed' : 'shortlisted';
      
      setApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, status: newStatus }
            : app
        )
      );

      setModalType('success');
      setModalTitle(newStatus === 'shortlisted' ? 'Shortlisted' : 'Removed from Shortlist');
      setModalMessage(`${application.applicantName} has been ${newStatus === 'shortlisted' ? 'added to' : 'removed from'} the shortlist`);
      setShowJobActionModal(true);
      
      showNotification({
        type: 'success',
        title: newStatus === 'shortlisted' ? 'Shortlisted' : 'Removed from Shortlist',
        message: `${application.applicantName} ${newStatus === 'shortlisted' ? 'added to' : 'removed from'} shortlist`,
        action: {
          label: 'View Shortlist',
          url: '#'
        }
      });
    } catch (error) {
      setModalType('error');
      setModalTitle('Shortlist Failed');
      setModalMessage('Failed to update shortlist status. Please try again.');
      setShowJobActionModal(true);
      
      showNotification({
        type: 'error',
        title: 'Shortlist Failed',
        message: 'Failed to update shortlist status. Please try again.',
        action: {
          label: 'Retry',
          url: '#'
        }
      });
    } finally {
      setIsShortlisting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900
              Applications
            </h1>
            <p className="text-gray-600
              Review and manage job applications
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200  p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>

            {/* Job Filter */}
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  
            >
              <option value="all">All Jobs</option>
              {Array.from(new Set(applications.map(app => app.jobTitle))).map(jobTitle => (
                <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  
            >
              <option value="appliedDate">Applied Date</option>
              <option value="matchScore">Match Score</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl border border-gray-200 ">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600
                {searchQuery || statusFilter !== "all" || jobFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "Applications will appear here when candidates apply to your jobs"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        {application.avatar ? (
                          <img
                            src={application.avatar}
                            alt={application.applicantName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900
                            {application.applicantName}
                          </h3>
                          <p className="text-gray-600
                            {application.applicantEmail}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 Title</p>
                          <p className="font-medium text-gray-900
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 Date</p>
                          <p className="font-medium text-gray-900
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 Score</p>
                          <p className={`font-medium ${getMatchScoreColor(application.matchScore)}`}>
                            {application.matchScore}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{application.experience}</span>
                        </div>
                        {application.salary && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatSalary(application.salary)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {application.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800  rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700  rounded text-xs">
                            +{application.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewApplication(application)}
                        className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                        title="View Application"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleSendMessage(application)}
                        disabled={isMessaging === application.id}
                        className={`p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors ${
                          isMessaging === application.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Send Message"
                      >
                        {isMessaging === application.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleShortlist(application)}
                        disabled={isShortlisting === application.id}
                        className={`p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors ${
                          isShortlisting === application.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={application.status === 'shortlisted' ? 'Remove from Shortlist' : 'Add to Shortlist'}
                      >
                        {isShortlisting === application.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        ) : (
                          <Bookmark className={`h-4 w-4 ${application.status === 'shortlisted' ? 'fill-blue-500 text-blue-500' : ''}`} />
                        )}
                      </button>
                      
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent  
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900
                  Application Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                {selectedApplication.avatar ? (
                  <img
                    src={selectedApplication.avatar}
                    alt={selectedApplication.applicantName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900
                    {selectedApplication.applicantName}
                  </h3>
                  <p className="text-gray-600
                    {selectedApplication.applicantEmail}
                  </p>
                  <p className="text-gray-600
                    {selectedApplication.jobTitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                  <div className="space-y-2 text-sm text-gray-600
                    <div>Applied: {formatDate(selectedApplication.appliedDate)}</div>
                    <div>Location: {selectedApplication.location}</div>
                    <div>Experience: {selectedApplication.experience}</div>
                    <div>Match Score: <span className={getMatchScoreColor(selectedApplication.matchScore)}>{selectedApplication.matchScore}%</span></div>
                    {selectedApplication.salary && (
                      <div>Salary: {formatSalary(selectedApplication.salary)}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800  rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 ">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                {selectedApplication.resumeUrl && (
                  <button
                    onClick={() => handleViewResume(selectedApplication)}
                    disabled={isViewingResume === selectedApplication.id}
                    className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                      isViewingResume === selectedApplication.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isViewingResume === selectedApplication.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    View Resume
                  </button>
                )}
                
                <button
                  onClick={() => handleSendMessage(selectedApplication)}
                  disabled={isMessaging === selectedApplication.id}
                  className={`flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors   ${
                    isMessaging === selectedApplication.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isMessaging === selectedApplication.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  ) : (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  Send Message
                </button>
                
                <button
                  onClick={() => handleShortlist(selectedApplication)}
                  disabled={isShortlisting === selectedApplication.id}
                  className={`flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors   ${
                    isShortlisting === selectedApplication.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isShortlisting === selectedApplication.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  ) : (
                    <Bookmark className={`h-4 w-4 mr-2 ${selectedApplication.status === 'shortlisted' ? 'fill-blue-500 text-blue-500' : ''}`} />
                  )}
                  {selectedApplication.status === 'shortlisted' ? 'Remove from Shortlist' : 'Add to Shortlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Action Modal */}
      {showJobActionModal && (
        <JobActionModal
          isOpen={showJobActionModal}
          onClose={() => setShowJobActionModal(false)}
          type={modalType}
          title={modalTitle}
          message={modalMessage}
          onAction={() => setShowJobActionModal(false)}
          actionText="Close"
        />
      )}
    </div>
  );
};

export default Applications;
