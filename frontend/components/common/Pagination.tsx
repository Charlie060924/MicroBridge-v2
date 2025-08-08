"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);
      
      if (leftBound > 1) pages.push(1);
      if (leftBound > 2) pages.push("...");
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      if (rightBound < totalPages - 1) pages.push("...");
      if (rightBound < totalPages) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            page === currentPage
              ? "bg-primary text-white"
              : "border border-gray-300 dark:border-gray-700"
          }`}
          disabled={page === "..."}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

export default Pagination;