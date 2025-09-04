"use client";

import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string;
  onClearFilters?: () => void;
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchQuery, 
  onClearFilters, 
  onRefresh 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="h-12 w-12 text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        No jobs found
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        {searchQuery ? (
          <>
            We couldn't find any jobs matching "<span className="font-medium">{searchQuery}</span>". 
            Try adjusting your search criteria or browse all available opportunities.
          </>
        ) : (
          "There are currently no micro-internship opportunities available. Check back later for new openings."
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50  transition-colors duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        )}
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-12 max-w-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Try these suggestions:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Broaden your search
            </h4>
            <p className="text-sm text-gray-600
              Try using fewer or more general keywords
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Check your filters
            </h4>
            <p className="text-sm text-gray-600
              Remove location or category restrictions
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Update your profile
            </h4>
            <p className="text-sm text-gray-600
              Add more skills to get better matches
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Browse categories
            </h4>
            <p className="text-sm text-gray-600
              Explore different job categories
            </p>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">
          Popular searches:
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {["Web Development", "Data Analysis", "Content Writing", "Design", "Marketing"].map((term) => (
            <button
              key={term}
              className="px-3 py-1 bg-gray-100 text-gray-700  text-sm rounded-full hover:bg-gray-200  transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState; 