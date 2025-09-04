"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Eye } from "lucide-react";
import JobCategoryCard, { Job } from "./JobCategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { RecentlyViewedJob } from "@/services/recentlyViewedJobsService";

interface RecentlyViewedJobsProps {
  jobs: RecentlyViewedJob[];
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
}

const RecentlyViewedJobs: React.FC<RecentlyViewedJobsProps> = ({ 
  jobs, 
  onBookmark, 
  onJobClick 
}) => {
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

  const formatTimeAgo = (viewedAt: string) => {
    const now = new Date();
    const viewed = new Date(viewedAt);
    const diffInHours = Math.floor((now.getTime() - viewed.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  if (jobs.length === 0) {
    return (
      <div className="py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-gray-900
            >
              Recently Viewed Jobs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-gray-600 mt-2 text-lg leading-relaxed"
            >
              Jobs you've recently viewed will appear here
            </motion.p>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-xl border border-gray-200  p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100  rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="h-10 w-10 text-blue-600 />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Recently Viewed Jobs
          </h3>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Start browsing jobs to see your recently viewed items here.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/student_portal/workspace/jobs')}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-gray-900
          >
            Recently Viewed Jobs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-gray-600 mt-2 text-lg leading-relaxed"
          >
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} you've recently viewed
          </motion.p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/student_portal/workspace/jobs')}
            className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all font-medium"
          >
            <span>View All Jobs</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollLeft}
              disabled={scrollPosition === 0}
              className="p-3 rounded-full bg-white border border-gray-200  text-gray-600  hover:bg-gray-50  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleScrollRight}
              disabled={scrollPosition >= maxScroll}
              className="p-3 rounded-full bg-white border border-gray-200  text-gray-600  hover:bg-gray-50  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Jobs Container */}
      <div className="relative">
        <motion.div
          ref={containerRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide pb-6"
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
                className="flex-shrink-0 w-96"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-full">
                  <JobCategoryCard
                    job={job}
                    onBookmark={onBookmark}
                    onClick={onJobClick}
                  />
                  
                  {/* Viewed Time Badge - Bottom Right */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="absolute bottom-3 right-3 flex items-center space-x-1 px-3 py-1.5 bg-gray-100/90 text-gray-600  text-xs rounded-full backdrop-blur-sm border border-gray-200/50 
                  >
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">{formatTimeAgo(job.viewedAt)}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Gradient Overlays */}
        {scrollPosition > 10 && (
          <motion.div 
            className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {scrollPosition < maxScroll - 10 && (
          <motion.div 
            className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>


    </div>
  );
};

export default RecentlyViewedJobs;