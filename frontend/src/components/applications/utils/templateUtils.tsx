import { JobResponse } from '@/services/jobService';
import { PortfolioItem } from '../steps/PortfolioSelectionStep';

export const populateTemplate = (
  template: string,
  job: JobResponse,
  portfolioItems: PortfolioItem[],
  userName?: string
): string => {
  const relevantSkills = job.skills?.slice(0, 3).map(s => s.name).join(', ') || 'relevant technologies';
  const keySkills = job.skills?.slice(0, 2).map(s => s.name).join(' and ') || 'key technologies';
  const topPortfolioItem = portfolioItems.find(item => item.relevanceScore >= 0.8);
  
  return template
    .replace(/\{\{company\}\}/g, job.company || 'Hiring Team')
    .replace(/\{\{position\}\}/g, job.title)
    .replace(/\{\{relevant_skills\}\}/g, relevantSkills)
    .replace(/\{\{key_skills\}\}/g, keySkills)
    .replace(/\{\{applicant_name\}\}/g, userName || '[Your Name]')
    .replace(/\{\{achievement_1\}\}/g, 'Successfully delivered multiple projects using modern development practices')
    .replace(/\{\{achievement_2\}\}/g, 'Collaborated effectively with cross-functional teams')
    .replace(/\{\{achievement_3\}\}/g, 'Maintained high code quality and documentation standards')
    .replace(/\{\{why_interested\}\}/g, 'your commitment to innovation and technical excellence')
    .replace(/\{\{specific_tech\}\}/g, keySkills)
    .replace(/\{\{portfolio_highlight\}\}/g, topPortfolioItem?.title || 'my recent projects')
    .replace(/\{\{relevant_area\}\}/g, job.category || 'this field')
    .replace(/\{\{approach_step_1\}\}/g, 'Thorough analysis of requirements and stakeholder needs')
    .replace(/\{\{approach_step_2\}\}/g, 'Iterative development with regular progress updates')
    .replace(/\{\{approach_step_3\}\}/g, 'Quality assurance and comprehensive testing')
    .replace(/\{\{business_achievement\}\}/g, 'delivered projects that exceeded client expectations')
    .replace(/\{\{quantifiable_result\}\}/g, 'improved efficiency and user satisfaction')
    .replace(/\{\{business_challenge\}\}/g, 'success in this project requires both technical skill and business acumen')
    .replace(/\{\{solution_area\}\}/g, relevantSkills)
    .replace(/\{\{unique_value_proposition\}\}/g, 'bridge technical implementation with business objectives')
    .replace(/\{\{creative_skills\}\}/g, relevantSkills)
    .replace(/\{\{creative_achievement\}\}/g, 'create compelling user experiences')
    .replace(/\{\{key_creative_skill\}\}/g, job.skills?.[0]?.name || 'creative problem-solving')
    .replace(/\{\{creative_motivation\}\}/g, 'the opportunity to create something meaningful and impactful')
    .replace(/\{\{design_philosophy\}\}/g, 'user-centered design and innovative solutions');
};

export const getMockPortfolioItems = (): PortfolioItem[] => [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Full-stack web application with React and Node.js',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    relevanceScore: 0.95,
    url: 'https://github.com/user/ecommerce-app'
  },
  {
    id: '2',
    title: 'Mobile Task Manager',
    description: 'React Native app with real-time synchronization',
    technologies: ['React Native', 'Firebase', 'Redux'],
    relevanceScore: 0.82,
    url: 'https://github.com/user/task-manager'
  },
  {
    id: '3',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard using D3.js and Python',
    technologies: ['D3.js', 'Python', 'Flask', 'PostgreSQL'],
    relevanceScore: 0.78,
    url: 'https://github.com/user/data-viz'
  },
  {
    id: '4',
    title: 'Social Media Analytics Tool',
    description: 'Real-time social media monitoring and analytics platform',
    technologies: ['Vue.js', 'Python', 'Redis', 'Docker'],
    relevanceScore: 0.72,
    url: 'https://github.com/user/social-analytics'
  },
  {
    id: '5',
    title: 'Personal Finance Tracker',
    description: 'Mobile app for expense tracking and budget management',
    technologies: ['Flutter', 'Dart', 'SQLite', 'Chart.js'],
    relevanceScore: 0.68,
    url: 'https://github.com/user/finance-tracker'
  }
];

export const validateApplicationData = (data: {
  cover_letter: string;
  selected_portfolio_items: string[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.cover_letter.trim()) {
    errors.push('Cover letter is required');
  } else if (data.cover_letter.trim().length < 100) {
    errors.push('Cover letter should be at least 100 characters long');
  }

  if (data.selected_portfolio_items.length === 0) {
    errors.push('Please select at least one portfolio item');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};