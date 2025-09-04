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
  Briefcase
} from "lucide-react";

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
        resumeUrl: "/resumes/john-doe-resume.pdf"
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
        resumeUrl: "/resumes/jane-smith-resume.pdf"
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
        location: "Chicago, IL",
        coverLetter: "I have extensive experience in data analysis...",
        resumeUrl: "/resumes/sarah-wilson-resume.pdf"
      },
      {
        id: "5",
        jobTitle: "UI/UX Designer",
        applicantName: "Alex Chen",
        applicantEmail: "alex.chen@email.com",
        appliedDate: "2024-01-08",
        status: 'rejected',
        matchScore: 65,
        skills: ["Sketch", "InVision", "Photoshop"],
        experience: "1 year",
        location: "Los Angeles, CA",
        coverLetter: "I am a creative designer with a passion for...",
        resumeUrl: "/resumes/alex-chen-resume.pdf"
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter and sort applications
  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesJob = jobFilter === "all" || app.jobTitle === jobFilter;
      
      return matchesSearch && matchesStatus && matchesJob;
    });

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "appliedDate":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "applicantName":
          return a.applicantName.localeCompare(b.applicantName);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter, jobFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'reviewed':
        return <Eye className="h-3 w-3" />;
      case 'shortlisted':
        return <Star className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
      case 'hired':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus as any } : app
    ));
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const getUniqueJobTitles = () => {
    const titles = applications.map(app => app.jobTitle);
    return Array.from(new Set(titles));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage job applications
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Jobs</option>
              {getUniqueJobTitles().map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="appliedDate">Applied Date</option>
              <option value="matchScore">Match Score</option>
              <option value="applicantName">Applicant Name</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Applications ({filteredApplications.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || statusFilter !== "all" || jobFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Applications will appear here when candidates apply to your jobs"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
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
                        </div>

                        {/* Application Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {application.applicantName}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">{application.status}</span>
                            </span>
                            <span className={`text-sm font-medium ${getMatchScoreColor(application.matchScore)}`}>
                              {application.matchScore}% match
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {application.jobTitle}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied {formatDate(application.appliedDate)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {application.experience} experience
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {application.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                +{application.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Application"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedApplication.applicantName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedApplication.applicantEmail}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedApplication.jobTitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Applied: {formatDate(selectedApplication.appliedDate)}</div>
                    <div>Location: {selectedApplication.location}</div>
                    <div>Experience: {selectedApplication.experience}</div>
                    <div>Match Score: <span className={getMatchScoreColor(selectedApplication.matchScore)}>{selectedApplication.matchScore}%</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                {selectedApplication.resumeUrl && (
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </a>
                )}
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
