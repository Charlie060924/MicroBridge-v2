import React from "react";
import { MapPin, DollarSign, Clock, Calendar, Star } from "lucide-react";

interface Job {
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
  experienceLevel: string;
  status?: 'active' | 'draft' | 'closed';
  applications?: number;
  views?: number;
}

interface JobHeaderProps {
  job: Job;
  showRating?: boolean;
}

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

const JobHeader: React.FC<JobHeaderProps> = ({ job, showRating = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {job.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {job.company}
          </p>
        </div>
        {showRating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(job.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {job.rating}
            </span>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="h-5 w-5 mr-3" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <DollarSign className="h-5 w-5 mr-3" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="h-5 w-5 mr-3" />
          <span>{job.duration}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-5 w-5 mr-3" />
          <span>Posted {job.postedDate}</span>
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(
            job.experienceLevel
          )}`}
        >
          {job.experienceLevel} Level
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Deadline: {job.deadline}
        </span>
      </div>
    </div>
  );
};

export default JobHeader;
