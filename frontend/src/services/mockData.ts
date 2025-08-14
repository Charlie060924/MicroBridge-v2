// Mock data service for UI/UX development
// This replaces all backend API calls with static data

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'employer' | 'admin';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  applications: number;
  // Additional properties to match JobCategoryCard interface
  duration: string;
  category: string;
  rating: number;
  isRemote: boolean;
  experienceLevel: "Entry" | "Intermediate" | "Advanced";
  isBookmarked: boolean; // Make this required instead of optional
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  updatedDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    company: string;
    status: "Ongoing" | "Upcoming" | "Completed";
    description: string;
    deadline: string;
    payment: string;
    jobId?: string;
    studentId?: string;
  };
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/user/user-01.png',
    role: 'student'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '/images/user/user-02.png',
    role: 'employer'
  }
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: '$80,000 - $120,000',
    description: 'We are looking for a talented Frontend Developer to join our team...',
    requirements: [
      '3+ years of experience with React',
      'Strong knowledge of TypeScript',
      'Experience with modern CSS frameworks',
      'Understanding of responsive design'
    ],
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    applications: 45,
    isBookmarked: false,
    duration: 'Full-time',
    category: 'Development',
    rating: 4.5,
    isRemote: true,
    experienceLevel: 'Intermediate'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    type: 'contract',
    salary: '$60,000 - $90,000',
    description: 'Join our creative team as a UX/UI Designer...',
    requirements: [
      '5+ years of design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio showcasing user-centered design',
      'Experience with design systems'
    ],
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
    postedDate: '2024-01-10',
    deadline: '2024-02-10',
    status: 'active',
    applications: 32,
    isBookmarked: true,
    duration: 'Contract',
    category: 'Design',
    rating: 4.8,
    isRemote: false,
    experienceLevel: 'Advanced'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataTech',
    location: 'Remote',
    type: 'full-time',
    salary: '$100,000 - $150,000',
    description: 'We are seeking a Data Scientist to help us build predictive models...',
    requirements: [
      'Masters degree in Statistics, Computer Science, or related field',
      'Experience with Python and R',
      'Knowledge of machine learning algorithms',
      'Experience with big data technologies'
    ],
    skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow'],
    postedDate: '2024-01-05',
    deadline: '2024-02-05',
    status: 'active',
    applications: 28,
    isBookmarked: false,
    duration: 'Full-time',
    category: 'Data Science',
    rating: 4.6,
    isRemote: true,
    experienceLevel: 'Advanced'
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'full-time',
    salary: '$90,000 - $130,000',
    description: 'Lead product development for our innovative platform...',
    requirements: [
      '3+ years of product management experience',
      'Experience with agile methodologies',
      'Strong analytical and communication skills',
      'Technical background preferred'
    ],
    skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'],
    postedDate: '2024-01-12',
    deadline: '2024-02-12',
    status: 'active',
    applications: 56,
    isBookmarked: false,
    duration: 'Full-time',
    category: 'Product Management',
    rating: 4.3,
    isRemote: false,
    experienceLevel: 'Intermediate'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'full-time',
    salary: '$110,000 - $160,000',
    description: 'Help us build and maintain our cloud infrastructure...',
    requirements: [
      'Experience with AWS, Azure, or GCP',
      'Knowledge of Docker and Kubernetes',
      'Experience with CI/CD pipelines',
      'Strong scripting skills'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    postedDate: '2024-01-08',
    deadline: '2024-02-08',
    status: 'active',
    applications: 23,
    isBookmarked: true,
    duration: 'Full-time',
    category: 'DevOps',
    rating: 4.7,
    isRemote: false,
    experienceLevel: 'Advanced'
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Frontend Developer',
    company: 'TechCorp',
    status: 'pending',
    appliedDate: '2024-01-20',
    updatedDate: '2024-01-20'
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'UX/UI Designer',
    company: 'DesignStudio',
    status: 'reviewed',
    appliedDate: '2024-01-18',
    updatedDate: '2024-01-25'
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'Data Scientist',
    company: 'DataTech',
    status: 'accepted',
    appliedDate: '2024-01-15',
    updatedDate: '2024-01-30'
  }
];

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "job-123",
    title: "UX Research Analysis",
    start: "2024-12-15",
    end: "2024-12-20",
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
    extendedProps: {
      company: "TechNova",
      status: "Ongoing",
      description: "Conduct user research and analyze findings for mobile app redesign",
      deadline: "2024-12-20",
      payment: "$500"
    }
  },
  {
    id: "job-124",
    title: "Content Writing",
    start: "2024-12-25",
    end: "2024-12-28",
    backgroundColor: "#10B981",
    borderColor: "#10B981",
    extendedProps: {
      company: "ContentPro",
      status: "Upcoming",
      description: "Write blog posts for company website",
      deadline: "2024-12-28",
      payment: "$300"
    }
  },
  {
    id: "job-125",
    title: "Data Analysis",
    start: "2024-12-10",
    end: "2024-12-12",
    backgroundColor: "#6B7280",
    borderColor: "#6B7280",
    extendedProps: {
      company: "DataCorp",
      status: "Completed",
      description: "Analyze customer data and create reports",
      deadline: "2024-12-12",
      payment: "$400"
    }
  }
];

// Mock API functions that simulate backend calls
export const mockApi = {
  // Jobs
  getJobs: async (filters?: any): Promise<{ jobs: Job[]; total: number }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredJobs = [...mockJobs];
    
    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.type) {
        filteredJobs = filteredJobs.filter(job => job.type === filters.type);
      }
      
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
    }
    
    return {
      jobs: filteredJobs,
      total: filteredJobs.length
    };
  },
  
  getJob: async (id: string): Promise<Job | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockJobs.find(job => job.id === id) || null;
  },
  
  // Applications
  getApplications: async (): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockApplications;
  },
  
  // Calendar
  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCalendarEvents;
  },
  
  // User
  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // For testing: check if we want to simulate different user types
    const mockUserRole = localStorage.getItem('mock_user_role');
    
    if (mockUserRole === 'employer') {
      return mockUsers[1]; // Jane Smith (employer)
    } else if (mockUserRole === 'student') {
      return mockUsers[0]; // John Doe (student)
    } else {
      // Return null for 'none' role (preview mode)
      throw new Error('No authenticated user');
    }
  },
  
  // Authentication (mock)
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication logic for different test accounts
    const mockUserRole = localStorage.getItem('mock_user_role');
    
    let user: User;
    
    if (mockUserRole === 'employer') {
      user = mockUsers[1]; // Jane Smith (employer)
    } else if (mockUserRole === 'student') {
      user = mockUsers[0]; // John Doe (student)
    } else {
      // Default to student if no role is set
      user = mockUsers[0];
    }
    
    return {
      user,
      token: 'mock-jwt-token-12345'
    };
  },
  
  register: async (userData: any): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: { ...userData, id: Date.now().toString(), role: 'student' },
      token: 'mock-jwt-token-12345'
    };
  }
};
