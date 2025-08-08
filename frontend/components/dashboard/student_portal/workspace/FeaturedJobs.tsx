"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import JobCategoryCard, { Job } from "./JobCategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface FeaturedJobsProps {
  jobs: Job[];
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
}

const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ jobs, onBookmark, onJobClick }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Calculate max scroll position
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setMaxScroll(container.scrollWidth - container.clientWidth);
      
      const handleResize = () => {
        setMaxScroll(container.scrollWidth - container.clientWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [jobs]);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -400,
        behavior: "smooth"
      });
      setScrollPosition(prev => Math.max(0, prev - 400));
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 400,
        behavior: "smooth"
      });
      setScrollPosition(prev => Math.min(maxScroll, prev + 400));
    }
  };

  // Handle scroll events to update position
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  // Add touch/swipe support
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Featured Jobs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-gray-600 dark:text-gray-400 mt-1"
          >
            Discover the best micro-internship opportunities
          </motion.p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/student_portal/workspace/jobs')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
          >
            <span>View All Jobs</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollLeft}
              disabled={scrollPosition === 0}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollRight}
              disabled={scrollPosition >= maxScroll}
              className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Jobs Container */}
      <div className="relative">
        <motion.div
          ref={containerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="flex-shrink-0 w-80"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <JobCategoryCard
                  job={job}
                  onBookmark={onBookmark}
                  onClick={onJobClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Gradient Overlays */}
        {scrollPosition > 10 && (
          <motion.div 
            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {scrollPosition < maxScroll - 10 && (
          <motion.div 
            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="flex justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(jobs.length / 3) }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === Math.floor(scrollPosition / (window.innerWidth * 0.8))
                  ? "bg-primary w-4"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              whileHover={{ scale: 1.5 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedJobs;