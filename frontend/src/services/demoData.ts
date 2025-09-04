// Preview Demo Data Service
// Provides realistic demo content for preview mode to showcase platform value

import { Job, Application, CalendarEvent, User } from './mockData';
import { Candidate } from '@/data/mockCandidates';

// Extended interfaces for demo-specific data
export interface DemoStats {
  totalEarnings: number;
  projectsCompleted: number;
  hoursWorked: number;
  rating: number;
  currentLevel: number;
  careerCoins: number;
  skillsVerified: number;
  applicationsSent: number;
  interviewsScheduled: number;
}

export interface DemoEmployerStats {
  jobsPosted: number;
  applicationsReceived: number;
  successfulHires: number;
  totalBudget: number;
  avgTimeToHire: number;
  candidatesInterviewed: number;
  companyRating: number;
  activeProjects: number;
}

export interface DemoTestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  projectType: string;
}

export interface DemoProject {
  id: string;
  title: string;
  company: string;
  category: string;
  budget: number;
  duration: string;
  status: 'active' | 'completed' | 'upcoming';
  progress: number;
  skills: string[];
  description: string;
  milestones: {
    name: string;
    completed: boolean;
    dueDate: string;
  }[];
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

// Student Demo Data
export const studentDemoStats: DemoStats = {
  totalEarnings: 8742,
  projectsCompleted: 23,
  hoursWorked: 467,
  rating: 4.8,
  currentLevel: 7,
  careerCoins: 2341,
  skillsVerified: 12,
  applicationsSent: 89,
  interviewsScheduled: 34
};

export const studentDemoProjects: DemoProject[] = [
  {
    id: 'demo-1',
    title: 'E-commerce Mobile App UI/UX Design',
    company: 'RetailTech Solutions',
    category: 'Design',
    budget: 1200,
    duration: '3 weeks',
    status: 'active',
    progress: 67,
    skills: ['Figma', 'Mobile Design', 'User Research'],
    description: 'Design a modern, user-friendly mobile app interface for an e-commerce platform with focus on conversion optimization.',
    milestones: [
      { name: 'User Research & Analysis', completed: true, dueDate: '2024-01-15' },
      { name: 'Wireframe Creation', completed: true, dueDate: '2024-01-20' },
      { name: 'High-Fidelity Mockups', completed: false, dueDate: '2024-01-25' },
      { name: 'Prototype & Testing', completed: false, dueDate: '2024-01-30' }
    ]
  },
  {
    id: 'demo-2',
    title: 'React Dashboard Development',
    company: 'DataViz Corp',
    category: 'Development',
    budget: 2500,
    duration: '4 weeks',
    status: 'completed',
    progress: 100,
    skills: ['React', 'TypeScript', 'Chart.js'],
    description: 'Build a comprehensive analytics dashboard with real-time data visualization and interactive charts.',
    milestones: [
      { name: 'Component Architecture', completed: true, dueDate: '2023-12-10' },
      { name: 'API Integration', completed: true, dueDate: '2023-12-15' },
      { name: 'Chart Implementation', completed: true, dueDate: '2023-12-20' },
      { name: 'Testing & Deployment', completed: true, dueDate: '2023-12-25' }
    ]
  },
  {
    id: 'demo-3',
    title: 'Content Strategy for SaaS Platform',
    company: 'TechStartup Inc',
    category: 'Content Writing',
    budget: 800,
    duration: '2 weeks',
    status: 'upcoming',
    progress: 0,
    skills: ['Content Strategy', 'SEO', 'Technical Writing'],
    description: 'Develop comprehensive content strategy including blog posts, documentation, and marketing materials.',
    milestones: [
      { name: 'Content Audit', completed: false, dueDate: '2024-02-05' },
      { name: 'Strategy Document', completed: false, dueDate: '2024-02-10' },
      { name: 'Content Creation', completed: false, dueDate: '2024-02-15' },
      { name: 'Review & Optimization', completed: false, dueDate: '2024-02-20' }
    ]
  }
];

export const studentTestimonials: DemoTestimonial[] = [
  {
    id: 'test-1',
    name: 'Jennifer Martinez',
    role: 'Product Manager at TechFlow',
    avatar: '/images/user/user-07.png',
    content: 'Outstanding work quality and communication. Delivered exactly what we needed, on time and within budget. Would definitely hire again!',
    rating: 5,
    projectType: 'UI/UX Design'
  },
  {
    id: 'test-2',
    name: 'Robert Chen',
    role: 'CTO at StartupLab',
    avatar: '/images/user/user-08.png',
    content: 'Exceptional technical skills and problem-solving ability. The React dashboard exceeded our expectations and improved our workflow significantly.',
    rating: 5,
    projectType: 'Web Development'
  },
  {
    id: 'test-3',
    name: 'Sarah Thompson',
    role: 'Marketing Director at GrowthCo',
    avatar: '/images/user/user-09.png',
    content: 'Great content strategy that increased our organic traffic by 40%. Professional, creative, and results-driven approach.',
    rating: 4.8,
    projectType: 'Content Strategy'
  }
];

// Employer Demo Data
export const employerDemoStats: DemoEmployerStats = {
  jobsPosted: 47,
  applicationsReceived: 1283,
  successfulHires: 34,
  totalBudget: 127500,
  avgTimeToHire: 12,
  candidatesInterviewed: 156,
  companyRating: 4.6,
  activeProjects: 8
};

export const employerDemoProjects: DemoProject[] = [
  {
    id: 'emp-demo-1',
    title: 'Senior Frontend Developer',
    company: 'Your Company',
    category: 'Development',
    budget: 8500,
    duration: '6 weeks',
    status: 'active',
    progress: 43,
    skills: ['React', 'TypeScript', 'Node.js'],
    description: 'Looking for an experienced developer to build our customer portal with modern tech stack.',
    milestones: [
      { name: 'Technical Interview', completed: true, dueDate: '2024-01-10' },
      { name: 'Project Kickoff', completed: true, dueDate: '2024-01-15' },
      { name: 'MVP Development', completed: false, dueDate: '2024-02-01' },
      { name: 'Testing & Launch', completed: false, dueDate: '2024-02-15' }
    ]
  },
  {
    id: 'emp-demo-2',
    title: 'Brand Identity Design',
    company: 'Your Company',
    category: 'Design',
    budget: 3200,
    duration: '3 weeks',
    status: 'completed',
    progress: 100,
    skills: ['Brand Design', 'Adobe Creative Suite', 'Logo Design'],
    description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
    milestones: [
      { name: 'Brand Discovery', completed: true, dueDate: '2023-12-05' },
      { name: 'Concept Development', completed: true, dueDate: '2023-12-12' },
      { name: 'Final Design', completed: true, dueDate: '2023-12-19' },
      { name: 'Brand Guidelines', completed: true, dueDate: '2023-12-26' }
    ]
  }
];

export const employerTestimonials: DemoTestimonial[] = [
  {
    id: 'emp-test-1',
    name: 'Michael Rodriguez',
    role: 'Freelance Developer',
    avatar: '/images/user/user-10.png',
    content: 'Amazing platform to find quality projects. The client communication tools and milestone system make project management seamless.',
    rating: 4.9,
    projectType: 'Web Development'
  },
  {
    id: 'emp-test-2',
    name: 'Amanda Foster',
    role: 'UX Designer',
    avatar: '/images/user/user-11.png',
    content: 'Love the transparent feedback system and fair payment process. Found consistent work with great clients through this platform.',
    rating: 4.7,
    projectType: 'Design'
  }
];

// Demo Notifications
export const demoNotifications: DemoNotification[] = [
  {
    id: 'notif-1',
    title: 'New Project Match!',
    message: 'A React development project matches your skills perfectly',
    type: 'success',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Milestone Completed',
    message: 'Your "Wireframe Creation" milestone has been approved',
    type: 'success',
    timestamp: '1 day ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Payment Received',
    message: 'You received $1,200 for "E-commerce Mobile App UI/UX Design"',
    type: 'success',
    timestamp: '3 days ago',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Interview Scheduled',
    message: 'TechStartup Inc scheduled an interview for tomorrow 2 PM',
    type: 'info',
    timestamp: '1 week ago',
    read: true
  }
];

// Social proof data
export const socialProofData = {
  totalStudentsHired: 2341,
  totalJobsPosted: 5847,
  totalEarningsDistributed: 2847593,
  averageRating: 4.7,
  companiesServed: 1247,
  successStories: 892
};

// CTA Messages
export const ctaMessages = {
  student: {
    primary: 'Sign Up to Unlock Your Dashboard',
    secondary: 'Join 2,341+ students already earning',
    features: [
      'Apply to 500+ active projects',
      'Earn up to $5,000+ per project', 
      'Build your professional portfolio',
      'Get matched with top companies'
    ]
  },
  employer: {
    primary: 'Sign Up to Post Your First Job',
    secondary: 'Join 1,247+ companies finding talent',
    features: [
      'Access 10,000+ verified candidates',
      'Average time to hire: 12 days',
      'Pay only for successful hires',
      'Dedicated project management tools'
    ]
  }
};

// A/B Test Variations
export const abTestVariations = {
  heroMessage: [
    'Transform your career with real projects',
    'Earn money while building your portfolio',
    'Connect with top companies looking for talent'
  ],
  ctaButton: [
    'Start Your Journey',
    'Join Now - It\'s Free',
    'Unlock Opportunities'
  ],
  socialProof: [
    '2,341+ students hired this month',
    'Over $2.8M earned by our community',
    '4.7/5 average project satisfaction'
  ]
};

// Demo Data Provider Class
export class PreviewDemoDataService {
  private currentVariation = 0;

  // Get demo data based on preview type
  getDemoData(previewType: 'student' | 'employer') {
    if (previewType === 'student') {
      return {
        stats: studentDemoStats,
        projects: studentDemoProjects,
        testimonials: studentTestimonials,
        notifications: demoNotifications,
        cta: ctaMessages.student,
        socialProof: socialProofData
      };
    } else {
      return {
        stats: employerDemoStats,
        projects: employerDemoProjects,
        testimonials: employerTestimonials,
        notifications: demoNotifications.slice(0, 2), // Fewer notifications for employers
        cta: ctaMessages.employer,
        socialProof: socialProofData
      };
    }
  }

  // Get A/B test variation
  getABTestVariation(element: keyof typeof abTestVariations) {
    const variations = abTestVariations[element];
    return variations[this.currentVariation % variations.length];
  }

  // Cycle to next A/B test variation
  setABTestVariation(variation: number) {
    this.currentVariation = variation;
  }

  // Get enhanced mock jobs with demo data
  getDemoJobs(): Job[] {
    return [
      {
        id: 'demo-job-1',
        title: 'Senior React Developer',
        company: 'InnovateTech',
        location: 'Remote',
        type: 'full-time',
        salary: '$90,000 - $130,000',
        description: 'Join our team to build cutting-edge web applications with React and TypeScript.',
        requirements: [
          '5+ years React experience',
          'TypeScript expertise',
          'Modern CSS/Styling',
          'API integration experience'
        ],
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        postedDate: '2024-01-28',
        deadline: '2024-02-28',
        status: 'active',
        applications: 127,
        duration: '6 months',
        category: 'Development',
        rating: 4.8,
        isRemote: true,
        experienceLevel: 'Advanced',
        isBookmarked: false
      },
      {
        id: 'demo-job-2',
        title: 'UX/UI Designer',
        company: 'DesignHub Pro',
        location: 'San Francisco, CA',
        type: 'contract',
        salary: '$75 - $95/hour',
        description: 'Create beautiful, user-centered designs for our B2B SaaS platform.',
        requirements: [
          'Figma proficiency',
          'User research experience',
          'Design system creation',
          'Mobile-first approach'
        ],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        postedDate: '2024-01-25',
        deadline: '2024-02-25',
        status: 'active',
        applications: 89,
        duration: '3 months',
        category: 'Design',
        rating: 4.9,
        isRemote: false,
        experienceLevel: 'Intermediate',
        isBookmarked: true
      },
      {
        id: 'demo-job-3',
        title: 'Content Marketing Specialist',
        company: 'GrowthCorp',
        location: 'New York, NY',
        type: 'part-time',
        salary: '$4,000 - $6,000/month',
        description: 'Drive our content strategy and create engaging materials for our target audience.',
        requirements: [
          'Content strategy experience',
          'SEO knowledge',
          'Analytics tracking',
          'Social media management'
        ],
        skills: ['Content Strategy', 'SEO', 'Analytics', 'Social Media'],
        postedDate: '2024-01-22',
        deadline: '2024-02-22',
        status: 'active',
        applications: 56,
        duration: '4 months',
        category: 'Marketing',
        rating: 4.6,
        isRemote: true,
        experienceLevel: 'Intermediate',
        isBookmarked: false
      }
    ];
  }

  // Get demo applications for students
  getDemoApplications(): Application[] {
    return [
      {
        id: 'demo-app-1',
        jobId: 'demo-job-1',
        jobTitle: 'Senior React Developer',
        company: 'InnovateTech',
        status: 'reviewed',
        appliedDate: '2024-01-29',
        updatedDate: '2024-01-30'
      },
      {
        id: 'demo-app-2',
        jobId: 'demo-job-2',
        jobTitle: 'UX/UI Designer',
        company: 'DesignHub Pro',
        status: 'accepted',
        appliedDate: '2024-01-26',
        updatedDate: '2024-01-31'
      },
      {
        id: 'demo-app-3',
        jobId: 'demo-job-3',
        jobTitle: 'Content Marketing Specialist',
        company: 'GrowthCorp',
        status: 'pending',
        appliedDate: '2024-01-30',
        updatedDate: '2024-01-30'
      }
    ];
  }
}

// Export singleton instance
export const previewDemoDataService = new PreviewDemoDataService();