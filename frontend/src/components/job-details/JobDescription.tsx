import React from "react";

interface JobDescriptionProps {
  description: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Job Description
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default JobDescription;
