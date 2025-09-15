import React, { useState } from 'react';
import { MapPin, ArrowRight, Clock, TrendingUp, Award, Target } from 'lucide-react';

interface CareerPathVisualizationProps {
  selectedInterests: string[];
  selectedIndustries: string[];
  disabled?: boolean;
}

interface CareerStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  opportunities: string[];
  averageSalary: string;
  icon: React.ComponentType<any>;
}

const CAREER_PATHS = {
  'software_development': {
    title: 'Software Development Career Path',
    stages: [
      {
        id: 'junior',
        title: 'Junior Developer',
        description: 'Entry-level position focusing on learning and basic development tasks',
        duration: '0-2 years',
        skills: ['Basic programming', 'Version control', 'Testing', 'Documentation'],
        opportunities: ['Bug fixes', 'Feature implementation', 'Code reviews'],
        averageSalary: 'HKD 25,000-35,000/month',
        icon: Target
      },
      {
        id: 'mid',
        title: 'Mid-Level Developer',
        description: 'Independent contributor with specialized skills and project ownership',
        duration: '2-5 years',
        skills: ['System design', 'Architecture', 'Team collaboration', 'Mentoring'],
        opportunities: ['Feature ownership', 'Technical decisions', 'Process improvement'],
        averageSalary: 'HKD 40,000-60,000/month',
        icon: TrendingUp
      },
      {
        id: 'senior',
        title: 'Senior Developer / Tech Lead',
        description: 'Technical leadership role with strategic impact and team responsibility',
        duration: '5+ years',
        skills: ['Leadership', 'Strategic thinking', 'Cross-team collaboration', 'Business acumen'],
        opportunities: ['Team leadership', 'Architecture decisions', 'Product strategy'],
        averageSalary: 'HKD 70,000-100,000/month',
        icon: Award
      }
    ]
  },
  'ux_ui_design': {
    title: 'UX/UI Design Career Path',
    stages: [
      {
        id: 'junior',
        title: 'Junior UX/UI Designer',
        description: 'Learning design fundamentals and working on guided design tasks',
        duration: '0-2 years',
        skills: ['Design tools', 'User research basics', 'Prototyping', 'Design systems'],
        opportunities: ['UI mockups', 'User testing', 'Design system maintenance'],
        averageSalary: 'HKD 20,000-30,000/month',
        icon: Target
      },
      {
        id: 'mid',
        title: 'UX/UI Designer',
        description: 'Independent designer handling full project lifecycle',
        duration: '2-5 years',
        skills: ['Advanced research', 'Information architecture', 'Interaction design', 'Stakeholder management'],
        opportunities: ['Full project ownership', 'User research leadership', 'Design strategy'],
        averageSalary: 'HKD 35,000-55,000/month',
        icon: TrendingUp
      },
      {
        id: 'senior',
        title: 'Senior Designer / Design Lead',
        description: 'Design leadership with strategic impact and team management',
        duration: '5+ years',
        skills: ['Team leadership', 'Design strategy', 'Business alignment', 'Innovation'],
        opportunities: ['Design team leadership', 'Product strategy', 'Design system architecture'],
        averageSalary: 'HKD 60,000-90,000/month',
        icon: Award
      }
    ]
  },
  'data_science': {
    title: 'Data Science Career Path',
    stages: [
      {
        id: 'junior',
        title: 'Junior Data Analyst',
        description: 'Learning data analysis fundamentals and basic modeling',
        duration: '0-2 years',
        skills: ['SQL', 'Python/R', 'Statistics', 'Data visualization'],
        opportunities: ['Data cleaning', 'Basic analysis', 'Report generation'],
        averageSalary: 'HKD 30,000-40,000/month',
        icon: Target
      },
      {
        id: 'mid',
        title: 'Data Scientist',
        description: 'Independent contributor building models and driving insights',
        duration: '2-5 years',
        skills: ['Machine learning', 'Advanced statistics', 'Business acumen', 'Communication'],
        opportunities: ['Predictive modeling', 'Insight generation', 'Strategy support'],
        averageSalary: 'HKD 50,000-75,000/month',
        icon: TrendingUp
      },
      {
        id: 'senior',
        title: 'Senior Data Scientist / ML Lead',
        description: 'Technical leadership in data strategy and advanced analytics',
        duration: '5+ years',
        skills: ['Team leadership', 'Strategic thinking', 'Advanced ML', 'Product impact'],
        opportunities: ['Data strategy', 'Team leadership', 'Innovation projects'],
        averageSalary: 'HKD 80,000-120,000/month',
        icon: Award
      }
    ]
  },
  'digital_marketing': {
    title: 'Digital Marketing Career Path',
    stages: [
      {
        id: 'junior',
        title: 'Junior Marketing Specialist',
        description: 'Learning marketing fundamentals and executing campaigns',
        duration: '0-2 years',
        skills: ['Campaign execution', 'Content creation', 'Analytics basics', 'Social media'],
        opportunities: ['Campaign support', 'Content creation', 'Performance tracking'],
        averageSalary: 'HKD 18,000-28,000/month',
        icon: Target
      },
      {
        id: 'mid',
        title: 'Marketing Manager',
        description: 'Managing campaigns and developing marketing strategies',
        duration: '2-5 years',
        skills: ['Strategy development', 'Team coordination', 'Budget management', 'ROI optimization'],
        opportunities: ['Campaign management', 'Strategy development', 'Team leadership'],
        averageSalary: 'HKD 35,000-50,000/month',
        icon: TrendingUp
      },
      {
        id: 'senior',
        title: 'Senior Marketing Manager / Director',
        description: 'Strategic marketing leadership and business growth focus',
        duration: '5+ years',
        skills: ['Strategic leadership', 'Business development', 'Cross-functional collaboration', 'Innovation'],
        opportunities: ['Marketing strategy', 'Business growth', 'Team development'],
        averageSalary: 'HKD 60,000-100,000/month',
        icon: Award
      }
    ]
  }
} as const;

const CareerPathVisualization: React.FC<CareerPathVisualizationProps> = ({
  selectedInterests,
  selectedIndustries,
  disabled = false
}) => {
  const [selectedPath, setSelectedPath] = useState<string>('');

  // Get relevant career paths based on selected interests
  const getRelevantPaths = () => {
    if (selectedInterests.length === 0) return [];
    
    return selectedInterests
      .map(interest => ({
        key: interest,
        path: CAREER_PATHS[interest as keyof typeof CAREER_PATHS],
        interest
      }))
      .filter(item => item.path)
      .slice(0, 3); // Show up to 3 paths
  };

  const relevantPaths = getRelevantPaths();

  if (relevantPaths.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          Select career interests to see potential career paths
        </p>
      </div>
    );
  }

  const currentPath = selectedPath ? relevantPaths.find(p => p.key === selectedPath) : relevantPaths[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-purple-600" />
        <h4 className="font-medium text-gray-900 dark:text-white">
          Career Path Visualization
        </h4>
      </div>

      {/* Path Selection */}
      {relevantPaths.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {relevantPaths.map(({ key, path, interest }) => (
            <button
              key={key}
              onClick={() => setSelectedPath(key)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                (selectedPath === key || (!selectedPath && key === relevantPaths[0].key))
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {path.title}
            </button>
          ))}
        </div>
      )}

      {/* Career Path Timeline */}
      {currentPath && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {currentPath.path.title}
          </h3>

          <div className="space-y-6">
            {currentPath.path.stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                {/* Connection Line */}
                {index < currentPath.path.stages.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-blue-300 dark:from-purple-600 dark:to-blue-600"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Stage Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 rounded-full flex items-center justify-center">
                      <stage.icon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {stage.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{stage.duration}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {stage.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Key Skills */}
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Key Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {stage.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Opportunities */}
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Opportunities
                        </p>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                          {stage.opportunities.map((opp, oppIndex) => (
                            <li key={oppIndex} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Salary Range */}
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Average Salary
                        </p>
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          {stage.averageSalary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Industry Impact */}
          {selectedIndustries.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Industry Impact
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Your selected industries ({selectedIndustries.join(', ')}) may offer higher compensation 
                and specialized opportunities in this career path.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Career Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Career Development Tips
        </h5>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-center space-x-2">
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span>Build a strong portfolio showcasing your work and growth</span>
          </li>
          <li className="flex items-center space-x-2">
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span>Seek mentorship from professionals in your target role</span>
          </li>
          <li className="flex items-center space-x-2">
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span>Continuously learn new skills and stay updated with industry trends</span>
          </li>
          <li className="flex items-center space-x-2">
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span>Network within your industry and attend relevant events</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CareerPathVisualization;