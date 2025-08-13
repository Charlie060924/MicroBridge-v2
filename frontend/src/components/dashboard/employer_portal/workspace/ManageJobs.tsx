"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Users,
  Eye as EyeIcon,
  Calendar,
  MapPin,
  DollarSign,
  Clock
} from "lucide-react";
import { originTracking } from "@/utils/originTracking";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: string;
  status: 'active' | 'draft' | 'closed';
  applications: number;
  views: number;
}

const ManageJobs: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("postedDate");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Remote",
        salary: "$25-35/hr",
        duration: "3 months",
        category: "Development",
        description: "Build responsive web applications using modern technologies",
        skills: ["React", "TypeScript", "CSS"],
        rating: 4.5,
        isBookmarked: false,
        postedDate: "2024-01-15",
        deadline: "2024-02-15",
        isRemote: true,
        experienceLevel: "Intermediate",
        status: 'active',
        applications: 12,
        views: 45
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "DesignStudio",
        location: "New York, NY",
        salary: "$30-45/hr",
        duration: "2 months",
        category: "Design",
        description: "Create beautiful and intuitive user interfaces",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        rating: 4.8,
        isBookmarked: true,
        postedDate: "2024-01-10",
        deadline: "2024-02-10",
        isRemote: false,
        experienceLevel: "Entry",
        status: 'active',
        applications: 8,
        views: 32
      },
      {
        id: "3",
        title: "Data Analyst",
        company: "DataCorp",
        location: "San Francisco, CA",
        salary: "$35-50/hr",
        duration: "4 months",
        category: "Analytics",
        description: "Analyze data and create insights for business decisions",
        skills: ["Python", "SQL", "Tableau"],
        rating: 4.2,
        isBookmarked: false,
        postedDate: "2024-01-20",
        deadline: "2024-02-20",
        isRemote: true,
        experienceLevel: "Intermediate",
        status: 'draft',
        applications: 0,
        views: 0
      },
      {
        id: "4",
        title: "Marketing Specialist",
        company: "MarketingPro",
        location: "Los Angeles, CA",
        salary: "$20-30/hr",
        duration: "6 months",
        category: "Marketing",
        description: "Develop and execute marketing campaigns",
        skills: ["Social Media", "Content Creation", "Analytics"],
        rating: 4.0,
        isBookmarked: false,
        postedDate: "2024-01-05",
        deadline: "2024-02-05",
        isRemote: false,
        experienceLevel: "Entry",
        status: 'closed',
        applications: 15,
        views: 67
      }
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter and sort jobs
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "postedDate":
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case "applications":
          return b.applications - a.applications;
        case "views":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter, categoryFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  const handleEditJob = (jobId: string) => {
    // Set origin context for edit navigation
    originTracking.setOrigin('manage-jobs');
    router.push(`/jobs/edit/${jobId}`);
  };

  const handleViewJob = (jobId: string) => {
    // Set origin context for view navigation
    originTracking.setOrigin('manage-jobs');
    router.push(`/jobs/${jobId}`);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your job postings
              </p>
            </div>
            <button
              onClick={() => router.push('/employer_portal/workspace/post-job')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </button>
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
                placeholder="Search jobs..."
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
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Analytics">Analytics</option>
              <option value="Content">Content</option>
              <option value="Research">Research</option>
              <option value="Administration">Administration</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="postedDate">Posted Date</option>
              <option value="applications">Applications</option>
              <option value="views">Views</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Postings ({filteredJobs.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Create your first job posting to get started"}
                </p>
                {!searchQuery && statusFilter === "all" && categoryFilter === "all" && (
                  <button
                    onClick={() => router.push('/employer_portal/workspace/post-job')}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {job.company}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {job.salary}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-2" />
                            {job.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            Posted {formatDate(job.postedDate)}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applications} applications
                          </div>
                          <div className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {job.views} views
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewJob(job.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Job"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
