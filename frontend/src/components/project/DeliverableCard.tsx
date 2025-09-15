"use client";

import React from "react";
import { 
  File, Eye, Download, Edit3, Tag, MessageSquare,
  CheckCircle, Clock, AlertCircle
} from "lucide-react";

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

interface DeliverableCardProps {
  deliverable: Deliverable;
  viewMode: 'grid' | 'list';
  onStatusChange?: (deliverableId: string, status: Deliverable['status']) => void;
  onView?: (deliverable: Deliverable) => void;
  onEdit?: (deliverable: Deliverable) => void;
  onDownload?: (deliverable: Deliverable) => void;
}

const DeliverableCard: React.FC<DeliverableCardProps> = ({
  deliverable,
  viewMode,
  onStatusChange,
  onView,
  onEdit,
  onDownload
}) => {
  const getStatusColor = (status: Deliverable['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      needs_revision: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Deliverable['status']) => {
    const icons = {
      draft: <Edit3 className="h-4 w-4" />,
      submitted: <Clock className="h-4 w-4" />,
      under_review: <AlertCircle className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      needs_revision: <MessageSquare className="h-4 w-4" />
    };
    return icons[status];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isValidStatus = (status: string): status is Deliverable['status'] => {
    return ['draft', 'submitted', 'under_review', 'approved', 'needs_revision'].includes(status);
  };

  const handleStatusChange = (newStatus: string) => {
    if (isValidStatus(newStatus)) {
      onStatusChange?.(deliverable.id, newStatus);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${
      viewMode === 'list' ? 'flex items-center justify-between' : ''
    }`}>
      <div className={viewMode === 'list' ? 'flex items-center space-x-4 flex-1' : ''}>
        <div className={`flex items-center space-x-3 ${viewMode === 'grid' ? 'mb-3' : ''}`}>
          <div className="text-gray-500 dark:text-gray-400">
            <File className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {deliverable.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              v{deliverable.version} • {formatFileSize(deliverable.size)}
            </p>
          </div>
          {viewMode === 'list' && (
            <div className="flex items-center space-x-2">
              {getStatusIcon(deliverable.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                {deliverable.status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
        
        {viewMode === 'grid' && (
          <>
            {deliverable.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
                {deliverable.description.length > 100 
                  ? deliverable.description.substring(0, 100) + '...' 
                  : deliverable.description}
              </p>
            )}
            
            {deliverable.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {deliverable.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </span>
                ))}
                {deliverable.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                    +{deliverable.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(deliverable.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
                  {deliverable.status.replace('_', ' ')}
                </span>
              </div>
              
              {deliverable.milestone && (
                <span className="text-xs text-gray-500">
                  {deliverable.milestone}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Actions */}
      <div className={`flex items-center space-x-2 ${viewMode === 'grid' ? '' : 'ml-4'}`}>
        <button 
          onClick={() => onView?.(deliverable)}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDownload?.(deliverable)}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onEdit?.(deliverable)}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          title="Edit"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        
        {/* Quick Status Update */}
        <select
          value={deliverable.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="needs_revision">Needs Revision</option>
        </select>
      </div>
      
      {viewMode === 'grid' && (
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>Modified: {deliverable.lastModified.toLocaleDateString()}</span>
          {deliverable.clientFeedback && (
            <MessageSquare 
              className="h-3 w-3 text-blue-500" 
              aria-label="Has client feedback"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DeliverableCard;