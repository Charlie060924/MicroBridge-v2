"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Users, 
  Briefcase, 
  Star,
  TrendingUp,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface SmartEmptyStateProps {
  type: 'jobs' | 'applications' | 'candidates' | 'projects' | 'reviews' | 'notifications';
  userType: 'student' | 'employer';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

const SmartEmptyState: React.FC<SmartEmptyStateProps> = ({
  type,
  userType,
  title,
  description,
  actionText,
  actionHref,
  className = ''
}) => {
  const getEmptyStateConfig = () => {
    const configs = {
      student: {
        jobs: {
          icon: Search,
          title: "No jobs found matching your criteria",
          description: "Try adjusting your filters or browse recommended opportunities below.",
          actionText: "Browse All Jobs",
          actionHref: "/student_portal/workspace/jobs",
          suggestions: [
            { text: "Update your skills in profile", href: "/student_portal/workspace/profile#skills" },
            { text: "Set job preferences", href: "/student_portal/workspace/settings" },
            { text: "View recommended jobs", href: "/student_portal/workspace/jobs?recommended=true" }
          ]
        },
        applications: {
          icon: FileText,
          title: "You haven't applied to any projects yet",
          description: "Start applying to projects to gain real-world experience and build your portfolio.",
          actionText: "Find Projects",
          actionHref: "/student_portal/workspace/jobs",
          suggestions: [
            { text: "Complete your profile first", href: "/student_portal/workspace/profile" },
            { text: "Browse featured projects", href: "/student_portal/workspace/jobs?featured=true" },
            { text: "View projects by skill", href: "/student_portal/workspace/jobs?filter=skills" }
          ]
        },
        projects: {
          icon: Briefcase,
          title: "No ongoing projects",
          description: "When you get selected for projects, they'll appear here.",
          actionText: "Apply to Projects",
          actionHref: "/student_portal/workspace/jobs",
          suggestions: [
            { text: "Improve your profile score", href: "/student_portal/workspace/profile" },
            { text: "Take skill assessments", href: "/student_portal/workspace/skills" },
            { text: "View application tips", href: "/help/application-tips" }
          ]
        },
        reviews: {
          icon: Star,
          title: "No reviews yet",
          description: "Reviews will appear here after you complete projects with employers.",
          actionText: "Find Projects",
          actionHref: "/student_portal/workspace/jobs",
          suggestions: [
            { text: "Complete your first project", href: "/student_portal/workspace/jobs" },
            { text: "Learn about the review process", href: "/help/reviews" }
          ]
        }
      },
      employer: {
        candidates: {
          icon: Users,
          title: "No candidates match your criteria",
          description: "Try adjusting your search filters or post a project to attract students.",
          actionText: "Post a Project",
          actionHref: "/employer_portal/workspace/post-job",
          suggestions: [
            { text: "Browse all candidates", href: "/employer_portal/workspace/candidates?all=true" },
            { text: "Adjust skill requirements", href: "/employer_portal/workspace/candidates?filters=true" },
            { text: "View candidate recommendations", href: "/employer_portal/workspace/candidates?recommended=true" }
          ]
        },
        applications: {
          icon: FileText,
          title: "No applications received yet",
          description: "Applications will appear here when students apply to your projects.",
          actionText: "Post Your First Project",
          actionHref: "/employer_portal/workspace/post-job",
          suggestions: [
            { text: "Improve job posting visibility", href: "/help/posting-tips" },
            { text: "Reach out to candidates directly", href: "/employer_portal/workspace/candidates" },
            { text: "Review posting best practices", href: "/help/employer-guide" }
          ]
        },
        jobs: {
          icon: Briefcase,
          title: "No projects posted yet",
          description: "Create your first project posting to start connecting with talented students.",
          actionText: "Post a Project",
          actionHref: "/employer_portal/workspace/post-job",
          suggestions: [
            { text: "Use project templates", href: "/employer_portal/workspace/post-job?template=true" },
            { text: "See successful project examples", href: "/help/project-examples" },
            { text: "Learn about pricing", href: "/help/pricing-guide" }
          ]
        },
        reviews: {
          icon: Star,
          title: "No reviews yet",
          description: "Reviews from students will appear here after project completion.",
          actionText: "Start a Project",
          actionHref: "/employer_portal/workspace/post-job",
          suggestions: [
            { text: "Complete your first project", href: "/employer_portal/workspace/manage-jobs" },
            { text: "Learn about the review process", href: "/help/reviews" }
          ]
        }
      }
    };

    const config = configs[userType]?.[type];
    if (!config) {
      return {
        icon: Lightbulb,
        title: title || "Nothing here yet",
        description: description || "Content will appear here when available.",
        actionText: actionText || "Get Started",
        actionHref: actionHref || "#",
        suggestions: []
      };
    }

    return {
      icon: config.icon,
      title: title || config.title,
      description: description || config.description,
      actionText: actionText || config.actionText,
      actionHref: actionHref || config.actionHref,
      suggestions: config.suggestions || []
    };
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-16 px-6 ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-24 h-24 mx-auto mb-6 bg-neutral-light rounded-full flex items-center justify-center"
      >
        <IconComponent className="w-12 h-12 text-gray-400" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="max-w-md mx-auto"
      >
        <h3 className="text-xl font-semibold text-black mb-4">
          {config.title}
        </h3>
        <p className="text-waterloo mb-8 leading-relaxed">
          {config.description}
        </p>

        {/* Primary Action */}
        <motion.a
          href={config.actionHref}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary inline-flex items-center mb-8"
        >
          {config.actionText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.a>
      </motion.div>

      {/* Suggestions */}
      {config.suggestions && config.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <h4 className="text-sm font-medium text-black mb-4">
            Helpful suggestions:
          </h4>
          <div className="space-y-2">
            {config.suggestions.map((suggestion, index) => (
              <motion.a
                key={index}
                href={suggestion.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-primary hover:bg-neutral-light transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">
                    {suggestion.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-12 pt-8 border-t border-gray-100"
      >
        <p className="text-sm text-waterloo mb-4">
          Need help getting started?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/help"
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            View Help Center
          </a>
          <a
            href="/help/contact"
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Contact Support
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartEmptyState;