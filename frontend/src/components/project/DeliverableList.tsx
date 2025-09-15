"use client";

import React, { useState } from "react";
import { Search, Filter, Grid, List, File, Folder } from "lucide-react";
import DeliverableCard from "./DeliverableCard";
import DeliverableFilters from "./DeliverableFilters";

interface Deliverable {
  id: string;
  name: string;
  description: string;
  size: number;
  type: 'document' | 'code' | 'design' | 'presentation' | 'other';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'needs_revision';
  version: number;
  uploadDate: Date;
  lastModified: Date;
  tags: string[];
  milestone?: string;
  clientFeedback?: string;
  reviewNotes?: string;
  isPublic: boolean;
}

interface DeliverableListProps {
  deliverables: Deliverable[];
  onStatusChange?: (deliverableId: string, status: Deliverable['status']) => void;
  onView?: (deliverable: Deliverable) => void;
  onEdit?: (deliverable: Deliverable) => void;
  onDownload?: (deliverable: Deliverable) => void;
}

const DeliverableList: React.FC<DeliverableListProps> = ({
  deliverables,
  onStatusChange,
  onView,
  onEdit,
  onDownload
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Deliverable['status'] | 'all'>('all');
  const [filterType, setFilterType] = useState<Deliverable['type'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  const filteredDeliverables = deliverables
    .filter(deliverable => {
      const matchesSearch = deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deliverable.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deliverable.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || deliverable.status === filterStatus;
      const matchesType = filterType === 'all' || deliverable.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return b.lastModified.getTime() - a.lastModified.getTime();
      }
    });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search deliverables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Filters and Controls */}
      <DeliverableFilters
        filterStatus={filterStatus}
        filterType={filterType}
        sortBy={sortBy}
        viewMode={viewMode}
        onFilterStatusChange={setFilterStatus}
        onFilterTypeChange={setFilterType}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
      />

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredDeliverables.length} of {deliverables.length} deliverables
      </div>

      {/* Deliverables Grid/List */}
      {filteredDeliverables.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredDeliverables.map((deliverable) => (
            <DeliverableCard
              key={deliverable.id}
              deliverable={deliverable}
              viewMode={viewMode}
              onStatusChange={onStatusChange}
              onView={onView}
              onEdit={onEdit}
              onDownload={onDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No deliverables found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first deliverable to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliverableList;