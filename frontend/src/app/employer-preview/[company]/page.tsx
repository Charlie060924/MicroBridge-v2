"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  ExternalLink,
  Star,
  Briefcase,
  Clock,
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface CompanyProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  website?: string;
  industry: string;
  size: string;
  founded: string;
  rating: number;
  reviewCount: number;
  logo?: string;
  activeJobs: Job[];
}

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  postedDate: string;
  isRemote: boolean;
  experienceLevel: string;
}

const EmployerPreviewPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const companySlug = params.company as string;
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock company data
  const mockCompanies: CompanyProfile[] = [
    {
      id: "1",
      name: "TechCorp",
      slug: "techcorp",
      description: "TechCorp is a leading technology company specializing in innovative software solutions. We focus on creating cutting-edge applications that solve real-world problems. Our team is passionate about technology and committed to delivering exceptional products that make a difference.",
      location: "San Francisco, CA",
      website: "https://techcorp.com",
      industry: "Technology",
      size: "50-200 employees",
      founded: "2018",
      rating: 4.2,
      reviewCount: 45,
      activeJobs: [
        {
          id: "1",
          title: "Frontend Developer",
          location: "San Francisco, CA",
          salary: "$25-35/hour",
          duration: "3-6 months",
          category: "Development",
          postedDate: "2 days ago",
          isRemote: true,
          experienceLevel: "Intermediate"
        },
        {
          id: "2",
          title: "Data Analyst",
          location: "Remote",
          salary: "$20-30/hour",
          duration: "2-4 months",
          category: "Data Science",
          postedDate: "1 week ago",
          isRemote: true,
          experienceLevel: "Entry"
        }
      ]
    },
    {
      id: "2",
      name: "Creative Studio",
      slug: "creative-studio",
      description: "Creative Studio is a dynamic design agency that creates stunning visual experiences. We work with clients across various industries to deliver innovative design solutions that captivate audiences and drive results.",
      location: "New York, NY",
      website: "https://creativestudio.com",
      industry: "Design",
      size: "10-50 employees",
      founded: "2020",
      rating: 4.7,
      reviewCount: 32,
      activeJobs: [
        {
          id: "3",
          title: "UI/UX Design Intern",
          location: "New York, NY",
          salary: "$30-40/hour",
          duration: "4-6 months",
          category: "Design",
          postedDate: "3 days ago",
          isRemote: false,
          experienceLevel: "Intermediate"
        }
      ]
    },
    {
      id: "3",
      name: "Growth Marketing Co.",
      slug: "growth-marketing-co",
      description: "Growth Marketing Co. is a results-driven marketing agency that helps businesses scale through strategic digital marketing campaigns. We specialize in data-driven approaches and creative content strategies.",
      location: "Austin, TX",
      website: "https://growthmarketing.com",
      industry: "Marketing",
      size: "20-100 employees",
      founded: "2019",
      rating: 4.0,
      reviewCount: 28,
      activeJobs: [
        {
          id: "4",
          title: "Content Marketing Assistant",
          location: "Austin, TX",
          salary: "$18-25/hour",
          duration: "3-5 months",
          category: "Marketing",
          postedDate: "5 days ago",
          isRemote: true,
          experienceLevel: "Entry"
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundCompany = mockCompanies.find(c => c.slug === companySlug);
      setCompany(foundCompany || null);
      setIsLoading(false);
    };

    fetchCompany();
  }, [companySlug]);

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Company Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The company profile you're looking for doesn't exist or has been removed.
          </p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Job
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Company Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="h-10 w-10 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {company.name}
                    </h1>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(company.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({company.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{company.size}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Founded {company.founded}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {company.industry}
                    </span>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About {company.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {company.description}
              </p>
            </div>

            {/* Active Job Postings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Active Job Postings ({company.activeJobs.length})
              </h2>
              <div className="space-y-4">
                {company.activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {job.category}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {job.experienceLevel}
                          </span>
                          {job.isRemote && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500">
                          {job.postedDate}
                        </span>
                        <Link
                          href={`/student_portal/workspace/job-details/${job.id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium text-gray-900">{company.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium text-gray-900">{company.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium text-gray-900">{company.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{company.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(company.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {company.rating}/5
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="font-medium text-gray-900">{company.activeJobs.length} positions</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => router.back()}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mb-3"
                >
                  <Briefcase className="h-5 w-5 mr-2 inline" />
                  View All Jobs
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Job Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPreviewPage;
