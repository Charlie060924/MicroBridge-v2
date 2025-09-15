import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProjectTechnologiesFormProps {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}

const ProjectTechnologiesForm: React.FC<ProjectTechnologiesFormProps> = ({
  technologies,
  onChange
}) => {
  const [techInput, setTechInput] = useState('');

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      onChange([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    onChange(technologies.filter(t => t !== tech));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  // Predefined popular technologies for quick selection
  const popularTechs = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
    'Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Java',
    'Spring Boot', 'C++', 'C#', 'PHP', 'Laravel', 'Ruby on Rails',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS', 'Less',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD', 'Photoshop'
  ];

  const suggestedTechs = popularTechs.filter(tech => 
    !technologies.includes(tech) && 
    tech.toLowerCase().includes(techInput.toLowerCase())
  ).slice(0, 6);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Technologies Used
      </label>
      
      {/* Input for adding technologies */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            placeholder="e.g., React, Node.js, TypeScript"
          />
          
          {/* Suggestions dropdown */}
          {techInput && suggestedTechs.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {suggestedTechs.map((tech, index) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => {
                    onChange([...technologies, tech]);
                    setTechInput('');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none text-gray-900 dark:text-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={handleAddTechnology}
          disabled={!techInput.trim() || technologies.includes(techInput.trim())}
          className="px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Selected technologies */}
      {technologies.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected Technologies ({technologies.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(tech)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick add popular technologies */}
      {technologies.length < 5 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Popular Technologies (click to add)
          </p>
          <div className="flex flex-wrap gap-2">
            {popularTechs
              .filter(tech => !technologies.includes(tech))
              .slice(0, 8)
              .map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => onChange([...technologies, tech])}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  + {tech}
                </button>
              ))}
          </div>
        </div>
      )}

      {technologies.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Add technologies to help employers understand your technical skills
        </p>
      )}
    </div>
  );
};

export default ProjectTechnologiesForm;