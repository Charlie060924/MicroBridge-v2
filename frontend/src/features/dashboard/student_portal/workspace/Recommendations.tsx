"use client";

import React, { useMemo } from "react";
import { Sparkles, TrendingUp, Clock, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  skills: string[];
  isBookmarked: boolean;
}

interface RecommendationsProps {
  jobs: Job[];
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
  userSkills: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ 
  jobs, 
  onBookmark, 
  onJobClick, 
  userSkills 
}) => {
  // Memoize the skill match calculation
  const getSkillMatchPercentage = useMemo(() => {
    return (jobSkills: string[]) => {
      if (userSkills.length === 0) return 0;
      
      const matchedSkills = jobSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      return Math.round((matchedSkills.length / jobSkills.length) * 100);
    };
  }, [userSkills]);

  // Early return for empty state
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200  p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100  rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-purple-600 />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Recommendations Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Complete your profile to get personalized job recommendations.
        </p>
        <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
          Update Profile
        </button>
      </div>
    );
  }

  // Limit the number of skills displayed initially
  const displayedUserSkills = userSkills.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200  p-6">
      {/* Header - Simplified animation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100  rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-600 />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900
              Recommended Jobs
            </h2>
            <p className="text-gray-600 text-sm">
              Based on your skills and preferences
            </p>
          </div>
        </div>
        <TrendingUp className="h-6 w-6 text-purple-600 />
      </div>

      {/* Skills Summary - Only render if there are user skills */}
      {displayedUserSkills.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50  rounded-lg border border-purple-200 
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Your Top Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {displayedUserSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800  text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {userSkills.length > 5 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700  text-xs rounded-full">
                +{userSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recommended Jobs - Optimized animations */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {jobs.map((job, index) => {
            const skillMatch = getSkillMatchPercentage(job.skills);
            const displayedJobSkills = job.skills.slice(0, 3);
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onClick={() => onJobClick(job)}
                whileHover={{ scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50  transition-all duration-150 cursor-pointer group relative overflow-hidden"
              >
                {skillMatch > 70 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-150">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600
                      {job.company}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600
                        {skillMatch}% match
                      </div>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${skillMatch}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div className="flex items-center text-gray-600
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center text-gray-600
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {displayedJobSkills.map((skill, skillIndex) => {
                      const isMatched = userSkills.some(userSkill => 
                        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                      );
                      
                      return (
                        <span
                          key={`${job.id}-skill-${skillIndex}`}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isMatched
                              ? "bg-green-100 text-green-800 "
                              : "bg-gray-100 text-gray-700 "
                          }`}
                        >
                          {skill}
                          {isMatched && " ✓"}
                        </span>
                      );
                    })}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700  text-xs rounded-full">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmark(job.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                  >
                    {job.isBookmarked ? (
                      <span className="text-primary">★</span>
                    ) : (
                      <span className="text-gray-400 hover:text-primary">☆</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View All Button - Simplified animation */}
      <div className="mt-6 pt-4 border-t border-gray-200
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2">
          View All Recommendations
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Recommendations;