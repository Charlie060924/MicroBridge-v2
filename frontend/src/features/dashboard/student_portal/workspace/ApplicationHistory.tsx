"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  FileText,
  Filter,
  Search,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import { applicationService, ApplicationResponse } from "@/services/applicationService";
import toast from "react-hot-toast";

interface ApplicationHistoryProps {
  className?: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ className = "" }) => {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadApplications();
  }, [currentPage, statusFilter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getUserApplications(currentPage, 10, statusFilter);
      if (response.success && response.data) {
        setApplications(response.data.applications);
        setTotalPages(response.data.total_pages);
      } else {
        toast.error(response.error || "Failed to load applications");
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "reviewed":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "withdrawn":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 ";
      case "reviewed":
        return "bg-blue-100 text-blue-800 ";
      case "accepted":
        return "bg-green-100 text-green-800 ";
      case "rejected":
        return "bg-red-100 text-red-800 ";
      case "withdrawn":
        return "bg-gray-100 text-gray-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      const response = await applicationService.withdrawApplication(applicationId);
      if (response.success) {
        toast.success("Application withdrawn successfully");
        loadApplications(); // Reload the list
      } else {
        toast.error(response.error || "Failed to withdraw application");
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application");
    }
  };

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      app.job?.title.toLowerCase().includes(searchLower) ||
      app.job?.company.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200  ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200  ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900
              Application History
            </h3>
            <p className="text-sm text-gray-600
              Track your job applications and their status
            </p>
          </div>
          <Briefcase className="h-6 w-6 text-gray-400" />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white  text-gray-900  focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600
              {applications.length === 0 
                ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                : "No applications match your current filters."
              }
            </p>
            {applications.length === 0 && (
              <button
                onClick={() => router.push("/jobs")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900
                        {application.job?.title || "Job Title"}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {application.job?.company || "Company"}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {application.job?.location || "Location"}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {application.job?.salary || "Salary"}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied: {formatDate(application.applied_at)}
                      </div>
                      {application.match_score > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 font-medium">
                            {application.match_score.toFixed(1)}% Match
                          </span>
                        </div>
                      )}
                    </div>

                    {application.employer_feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700
                          <strong>Feedback:</strong> {application.employer_feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/jobs/${application.job_id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 "
                    >
                      <Eye className="h-4 w-4" />
                      View Job
                    </button>
                    
                    {application.status === "pending" && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 "
                      >
                        <XCircle className="h-4 w-4" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200
            <div className="text-sm text-gray-600
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 "
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 "
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistory;
