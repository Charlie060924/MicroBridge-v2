"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Star, MapPin, Clock, MessageCircle, Eye, ChevronRight } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  matchScore: number;
  avatar?: string;
}

interface RecommendedCandidatesProps {
  candidates: Candidate[];
  onViewCandidate: (candidateId: string) => void;
}

const RecommendedCandidates: React.FC<RecommendedCandidatesProps> = ({
  candidates,
  onViewCandidate,
}) => {
  const [shortlistedCandidates, setShortlistedCandidates] = useState<Set<string>>(new Set());

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-blue-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const handleShortlistToggle = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShortlistedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const handleCardClick = (candidateId: string) => {
    onViewCandidate(candidateId);
  };

  const handleMessageClick = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    // Handle message functionality
    console.log('Message candidate:', candidateId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recommended Candidates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Top matches for your job requirements
            </p>
          </div>
          <Link
            href="/employer_portal/workspace/candidates"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            role="link"
            tabIndex={0}
          >
            View All
          </Link>
        </div>
      </div>

      <div className="relative">
        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No candidates yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Post jobs to start receiving candidate recommendations
            </p>
          </div>
        ) : (
          <div className="p-6 pb-24"> {/* Added bottom padding for sticky button */}
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group min-h-[140px] flex flex-col"
                  onClick={() => handleCardClick(candidate.id)}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {candidate.avatar ? (
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {candidate.name}
                        </h3>
                        
                        {/* Match Score with Progress Ring */}
                        <div className="flex-shrink-0 relative">
                          <div className="w-12 h-12 relative">
                            {/* Progress Ring Background */}
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - candidate.matchScore / 100)}`}
                                className={`${getMatchScoreColor(candidate.matchScore)} transition-all duration-500`}
                                strokeLinecap="round"
                              />
                            </svg>
                            {/* Percentage Text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                                {candidate.matchScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {candidate.title}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {candidate.experience} experience
                      </div>

                      {/* Top 3 Skills - Prioritized */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                              index === 0 
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                : index === 1
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            +{candidate.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Fixed at bottom, evenly spaced */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href={`/employer_portal/workspace/candidates/${candidate.id}`}
                      className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => e.stopPropagation()} // Prevent card click
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Profile
                    </Link>
                    
                    <button
                      onClick={(e) => handleMessageClick(candidate.id, e)}
                      className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </button>
                    
                    <button
                      onClick={(e) => handleShortlistToggle(candidate.id, e)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                        shortlistedCandidates.has(candidate.id)
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title={shortlistedCandidates.has(candidate.id) ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Star 
                        className={`h-4 w-4 transition-all duration-200 ${
                          shortlistedCandidates.has(candidate.id) ? 'fill-current' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Bottom Button */}
        {candidates.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <Link
              href="/employer_portal/workspace/candidates"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
              role="link"
              tabIndex={0}
            >
              <User className="h-4 w-4 mr-2" />
              Browse All Candidates
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedCandidates;
