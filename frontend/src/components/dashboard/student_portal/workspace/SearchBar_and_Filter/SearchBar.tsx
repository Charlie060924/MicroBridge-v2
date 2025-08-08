"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import FilterModal, { Filters } from "./FilterModal";

interface SearchBarProps {
  onSearch: (
    query: string,
    location: string,
    category: string,
    filters?: Filters
  ) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    occupation: "",
    educationLevel: "",
    difficulty: "",
    workType: "",
    salaryRange: [0, 0],
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, "", filters.occupation, filters);
  };

    const handleApplyFilters = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
    onSearch(searchQuery, "", updatedFilters.occupation, updatedFilters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for jobs, skills, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Button */}
          <div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <Filter className="h-5 w-5" />
              Filter
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Search Jobs
          </button>
        </div>
      </form>

      {/* Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default SearchBar;
