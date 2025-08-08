"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Job } from "../JobCategoryCard";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import for better performance
const JobCategoryCard = dynamic(() => import("../JobCategoryCard"));
const EmptyState = dynamic(() => import("../EmptyState"));
const Pagination = dynamic(() => import("@/components/common/Pagination"));

const JobList = () => {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Fetch jobs based on filters
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Use mock API instead of real backend
        const { mockApi } = await import('@/services/mockData');
        const filters = Object.fromEntries(searchParams.entries());
        const data = await mockApi.getJobs(filters);
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState 
        searchQuery=""
        onClearFilters={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Found
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, jobs.length)} of {jobs.length}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {currentJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobCategoryCard 
                job={job} 
                onBookmark={(id) => console.log("Bookmarked:", id)}
                onClick={(job) => console.log("Selected:", job)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default JobList;