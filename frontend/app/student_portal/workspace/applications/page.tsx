"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedDate: string;
  jobId: string;
}

const ApplicationsPage: React.FC = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockApplications: Application[] = [
      {
        id: "1",
        jobTitle: "Frontend Developer",
        company: "TechCorp",
        status: "pending",
        appliedDate: "2024-01-15",
        jobId: "1"
      },
      {
        id: "2",
        jobTitle: "UI/UX Designer",
        company: "DesignStudio",
        status: "reviewed",
        appliedDate: "2024-01-10",
        jobId: "2"
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the status of your job applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Clock className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start applying to jobs to see your applications here
            </p>
            <button
              onClick={() => router.push("/student_portal/workspace/jobs")}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {application.jobTitle}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {application.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Applied on {application.appliedDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                    <button
                      onClick={() => router.push(`/student_portal/workspace/job-details/${application.jobId}`)}
                      className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage; 