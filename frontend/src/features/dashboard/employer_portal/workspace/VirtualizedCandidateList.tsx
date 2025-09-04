"use client";

import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Avatar } from '@/components/common/OptimizedImage';
import { 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Eye,
  GraduationCap,
  Building,
  Briefcase
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  location: string;
  matchScore: number;
  avatar?: string;
  education: string;
  availability: string;
  hourlyRate?: string;
  salary?: {
    amount?: number;
    currency?: string;
  };
  lastActive: string;
}

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
  onViewCandidate: (id: string) => void;
  onMessageCandidate: (id: string) => void;
  onStarCandidate: (id: string) => void;
  height?: number;
  itemHeight?: number;
}

const ITEM_HEIGHT = 120; // Height of each candidate card

export default function VirtualizedCandidateList({
  candidates,
  onViewCandidate,
  onMessageCandidate,
  onStarCandidate,
  height = 600,
  itemHeight = ITEM_HEIGHT,
}: VirtualizedCandidateListProps) {
  
  // Helper function to format salary with null/undefined checks
  const formatSalary = (candidate: Candidate): string => {
    // Check for hourly rate first
    if (candidate.hourlyRate) {
      return `${candidate.hourlyRate}/hr`;
    }
    
    // Check for salary object
    if (candidate.salary?.amount && candidate.salary?.currency) {
      return `${candidate.salary.currency}${candidate.salary.amount.toLocaleString()}`;
    }
    
    // Fallback for missing salary data
    return "Salary not specified";
  };

  // Memoize the row renderer to prevent unnecessary re-renders
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const candidate = candidates[index];
    
    if (!candidate) return null;

    const getMatchScoreBg = (score: number) => {
      if (score >= 90) return 'bg-green-100 text-green-800';
      if (score >= 80) return 'bg-blue-100 text-blue-800';
      if (score >= 70) return 'bg-yellow-100 text-yellow-800';
      return 'bg-gray-100 text-gray-800';
    };

    const getMatchScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-800';
      if (score >= 80) return 'text-blue-800';
      if (score >= 70) return 'text-yellow-800';
      return 'text-gray-800';
    };

    return (
      <div style={style} className="px-4 py-2">
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white ">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar
                  src={candidate.avatar}
                  alt={candidate.name}
                  size="medium"
                />
              </div>

              {/* Candidate Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {candidate.title}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
                    <Star className="h-3 w-3 mr-1" />
                    {candidate.matchScore}%
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {candidate.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700  text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500  text-xs rounded-full">
                      +{candidate.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{candidate.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{candidate.education}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{candidate.experience}</span>
                  </div>
                </div>

                {/* Rate and Last Active */}
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-green-600 font-medium">
                    {formatSalary(candidate)}
                  </span>
                  <span className="text-gray-500
                    Active {candidate.lastActive}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onViewCandidate(candidate.id)}
                className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                title="View Profile"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onMessageCandidate(candidate.id)}
                className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                title="Send Message"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => onStarCandidate(candidate.id)}
                className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                title="Star Candidate"
              >
                <Star className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [candidates, onViewCandidate, onMessageCandidate, onStarCandidate]);

  // Memoize the list to prevent unnecessary re-renders
  const memoizedList = useMemo(() => (
    <List
      height={height}
      itemCount={candidates.length}
      itemSize={itemHeight}
      width="100%"
      overscanCount={5} // Render 5 items outside the viewport for smooth scrolling
    >
      {Row}
    </List>
  ), [candidates.length, height, itemHeight, Row]);

  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="virtualized-candidate-list">
      {memoizedList}
    </div>
  );
}

