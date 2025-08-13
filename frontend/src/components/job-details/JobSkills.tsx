import React from "react";

interface JobSkillsProps {
  skills: string[];
}

const JobSkills: React.FC<JobSkillsProps> = ({ skills }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Required Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobSkills;
