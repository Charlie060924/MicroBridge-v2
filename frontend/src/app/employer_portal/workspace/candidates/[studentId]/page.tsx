"use client";

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  DollarSign, 
  ChevronLeft,
  MessageCircle,
  User,
  Calendar,
  Award
} from 'lucide-react';
import { mockCandidates, Candidate } from '@/data/mockCandidates';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CandidateProfilePage: React.FC = () => {
  const params = useParams();
  const studentId = params.studentId as string;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [starredCandidates, setStarredCandidates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load starred candidates from localStorage
  useEffect(() => {
    const savedStarred = localStorage.getItem('starredCandidates');
    if (savedStarred) {
      setStarredCandidates(new Set(JSON.parse(savedStarred)));
    }
  }, []);

  // Load candidate data
  useEffect(() => {
    const loadCandidate = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundCandidate = mockCandidates.find(c => c.id === studentId);
      setCandidate(foundCandidate || null);
      setIsLoading(false);
    };

    if (studentId) {
      loadCandidate();
    }
  }, [studentId]);

  const handleStarToggle = () => {
    if (!candidate) return;
    
    const newStarred = new Set(starredCandidates);
    if (newStarred.has(candidate.id)) {
      newStarred.delete(candidate.id);
    } else {
      newStarred.add(candidate.id);
    }
    setStarredCandidates(newStarred);
    localStorage.setItem('starredCandidates', JSON.stringify([...newStarred]));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Advanced': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Beginner': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Candidate not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The candidate you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/employer_portal/workspace/candidates"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/employer_portal/workspace/candidates"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Candidates
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    {candidate.profilePicture ? (
                      <img
                        src={candidate.profilePicture}
                        alt={candidate.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {candidate.name}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                        {candidate.headline}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {candidate.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleStarToggle}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                        starredCandidates.has(candidate.id)
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title={starredCandidates.has(candidate.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star 
                        className={`h-5 w-5 transition-all duration-200 ${
                          starredCandidates.has(candidate.id) ? 'fill-current' : ''
                        }`} 
                      />
                    </button>
                    <button
                      disabled
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                      title="Coming Soon"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>

                {/* Match Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Match Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
                    {candidate.matchScore}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About Me
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {candidate.bio}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Skills & Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exp.title}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.duration}
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {exp.bulletPoints.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Education
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {candidate.education.degree}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {candidate.education.institution}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Graduated {candidate.education.graduationYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        {candidate.contact.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        {candidate.contact.phone}
                      </div>
                    </div>
                  </div>

                  {/* Expected Salary */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Expected Salary
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatSalary(candidate.expectedSalary)}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Languages
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Languages className="h-4 w-4 mr-2" />
                      {candidate.languages.join(', ')}
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Experience
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {candidate.experience.length} position{candidate.experience.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Portfolio & Work Samples
                </h3>
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Portfolio coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;