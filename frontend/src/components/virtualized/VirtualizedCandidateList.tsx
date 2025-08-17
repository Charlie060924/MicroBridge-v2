"use client";

import React, { useMemo, useCallback, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Star, MapPin, Clock, Eye, User } from 'lucide-react';
import { Candidate } from '@/data/mockCandidates';

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
  starredCandidates: Set<string>;
  onStarToggle: (candidateId: string) => void;
  onCandidateClick: (candidate: Candidate) => void;
  height?: number;
  itemHeight?: number;
}

const CandidateCard = React.memo(({ 
  candidate, 
  starredCandidates, 
  onStarToggle, 
  onCandidateClick,
  style 
}: {
  candidate: Candidate;
  starredCandidates: Set<string>;
  onStarToggle: (candidateId: string) => void;
  onCandidateClick: (candidate: Candidate) => void;
  style: React.CSSProperties;
}) => {
  const isStarred = starredCandidates.has(candidate.id);

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

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      style={style}
      onClick={() => onCandidateClick(candidate)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {candidate.headline}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle(candidate.id);
          }}
          className="text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <Star className={`h-5 w-5 ${isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {candidate.bio}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{candidate.experience} years</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
          {candidate.matchScore}% match
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              {skill.name}
            </span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
              +{candidate.skills.length - 3} more
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatSalary(candidate.salary)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {candidate.availability}
          </p>
        </div>
      </div>
    </div>
  );
});

CandidateCard.displayName = 'CandidateCard';

export const VirtualizedCandidateList: React.FC<VirtualizedCandidateListProps> = ({
  candidates,
  starredCandidates,
  onStarToggle,
  onCandidateClick,
  height = 600,
  itemHeight = 200
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update container width on resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const candidate = candidates[index];
    if (!candidate) return null;

    return (
      <CandidateCard
        candidate={candidate}
        starredCandidates={starredCandidates}
        onStarToggle={onStarToggle}
        onCandidateClick={onCandidateClick}
        style={style}
      />
    );
  }, [candidates, starredCandidates, onStarToggle, onCandidateClick]);

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No candidates found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <List
        height={height}
        itemCount={candidates.length}
        itemSize={itemHeight}
        width={containerWidth || '100%'}
        className="space-y-4"
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedCandidateList;
