"use client";

import React from "react";
import { Grid, List } from "lucide-react";

type DeliverableStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'needs_revision';
type DeliverableType = 'document' | 'code' | 'design' | 'presentation' | 'other';
type SortBy = 'name' | 'date' | 'status';

interface DeliverableFiltersProps {
  filterStatus: DeliverableStatus | 'all';
  filterType: DeliverableType | 'all';
  sortBy: SortBy;
  viewMode: 'grid' | 'list';
  onFilterStatusChange: (status: DeliverableStatus | 'all') => void;
  onFilterTypeChange: (type: DeliverableType | 'all') => void;
  onSortChange: (sort: SortBy) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DeliverableFilters: React.FC<DeliverableFiltersProps> = ({
  filterStatus,
  filterType,
  sortBy,
  viewMode,
  onFilterStatusChange,
  onFilterTypeChange,
  onSortChange,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value as DeliverableStatus | 'all')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="needs_revision">Needs Revision</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as DeliverableType | 'all')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="document">Document</option>
          <option value="code">Code</option>
          <option value="design">Design</option>
          <option value="presentation">Presentation</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="flex items-center space-x-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>
        
        <button
          onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default DeliverableFilters;