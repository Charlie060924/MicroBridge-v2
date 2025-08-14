"use client";

import React from "react";
import { Clock, MapPin, DollarSign, Star, Bookmark, BookmarkPlus } from "lucide-react";
import { usePreviewMode } from "@/context/PreviewModeContext";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: "Entry" | "Intermediate" | "Advanced";
}

interface JobCategoryCardProps {
  job: Job;
  onBookmark: (jobId: string) => void;
  onClick: (job: Job) => void;
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({ job, onBookmark, onClick }) => {
  const { isFeatureLocked } = usePreviewMode();
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFeatureLocked('bookmark_job')) {
      return; // Don't allow bookmarking in preview mode
    }
    onBookmark(job.id);
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {job.company}
          </p>
        </div>
        <button
          onClick={handleBookmarkClick}
          className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
        >
          {job.isBookmarked ? (
            <Bookmark className="h-5 w-5 text-primary fill-primary" />
          ) : (
            <BookmarkPlus className="h-5 w-5 text-gray-400 hover:text-primary" />
          )}
        </button>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="flex items-center">
            {job.location}
            {job.isRemote && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                Remote
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>{job.salary}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          <span>{job.duration}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(job.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {job.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getExperienceColor(
              job.experienceLevel
            )}`}
          >
            {job.experienceLevel}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Posted {job.postedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCategoryCard; 