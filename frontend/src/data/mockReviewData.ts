// Mock data for testing the review system
// This data matches the backend structure and can be used for frontend testing

export interface MockUser {
  id: string;
  email: string;
  name: string;
  userType: "student" | "employer";
  bio: string;
  skills: MockSkill[];
  interests: string[];
  experienceLevel: string;
  location: string;
  workPreference: string;
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockSkill {
  name: string;
  level: number;
  experience: string;
  verified: boolean;
}

export interface MockJob {
  id: string;
  employerId: string;
  title: string;
  description: string;
  company: string;
  location: string;
  duration: number; // weeks
  category: string;
  isRemote: boolean;
  jobType: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
    isNegotiable: boolean;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockApplication {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  coverLetter: string;
  matchScore: number;
  appliedAt: string;
  reviewedAt?: string;
  responseAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockReview {
  id: string;
  reviewerId: string;
  revieweeId: string;
  jobId: string;
  rating: number;
  comment: string;
  categoryRatings: {
    qualityOfWork?: number;
    communication?: number;
    timeliness?: number;
    clearRequirements?: number;
    professionalism?: number;
    paymentReliability?: number;
  };
  isVisible: boolean;
  visibleAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Users
export const mockStudents: MockUser[] = [
  {
    id: "student-001",
    email: "sarah.chen@example.com",
    name: "Sarah Chen",
    userType: "student",
    bio: "Passionate frontend developer with 2 years of experience in React and TypeScript. Love creating beautiful user interfaces and solving complex problems.",
    skills: [
      { name: "React", level: 4, experience: "2-3 years", verified: true },
      { name: "TypeScript", level: 3, experience: "1-2 years", verified: true },
      { name: "JavaScript", level: 4, experience: "2-3 years", verified: true },
      { name: "CSS", level: 4, experience: "2-3 years", verified: true },
      { name: "Node.js", level: 2, experience: "0-1 years", verified: false },
    ],
    interests: ["Web Development", "UI/UX Design", "Mobile Development"],
    experienceLevel: "intermediate",
    location: "San Francisco, CA",
    workPreference: "remote",
    level: 3,
    xp: 1500,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "student-002",
    email: "mike.rodriguez@example.com",
    name: "Mike Rodriguez",
    userType: "student",
    bio: "Full-stack developer specializing in Python and Django. Experienced in building scalable web applications and APIs.",
    skills: [
      { name: "Python", level: 4, experience: "2-3 years", verified: true },
      { name: "Django", level: 4, experience: "2-3 years", verified: true },
      { name: "PostgreSQL", level: 3, experience: "1-2 years", verified: true },
      { name: "JavaScript", level: 3, experience: "1-2 years", verified: false },
      { name: "Docker", level: 2, experience: "0-1 years", verified: false },
    ],
    interests: ["Backend Development", "API Design", "DevOps"],
    experienceLevel: "intermediate",
    location: "Austin, TX",
    workPreference: "hybrid",
    level: 4,
    xp: 2200,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "student-003",
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    userType: "student",
    bio: "UI/UX designer with a passion for creating intuitive and beautiful user experiences. Skilled in Figma, Adobe Creative Suite, and user research.",
    skills: [
      { name: "Figma", level: 5, experience: "3-5 years", verified: true },
      { name: "Adobe XD", level: 4, experience: "2-3 years", verified: true },
      { name: "Photoshop", level: 4, experience: "2-3 years", verified: true },
      { name: "User Research", level: 3, experience: "1-2 years", verified: true },
      { name: "Prototyping", level: 4, experience: "2-3 years", verified: true },
    ],
    interests: ["UI/UX Design", "User Research", "Design Systems"],
    experienceLevel: "advanced",
    location: "New York, NY",
    workPreference: "onsite",
    level: 5,
    xp: 3200,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const mockEmployers: MockUser[] = [
  {
    id: "employer-001",
    email: "john.techcorp@example.com",
    name: "John Smith",
    userType: "employer",
    bio: "CTO at TechCorp, a fast-growing startup focused on building innovative web applications. Looking for talented developers to join our team.",
    skills: [],
    interests: ["Web Development", "Startups", "Innovation"],
    experienceLevel: "expert",
    location: "San Francisco, CA",
    workPreference: "remote",
    level: 8,
    xp: 8500,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "employer-002",
    email: "lisa.designstudio@example.com",
    name: "Lisa Johnson",
    userType: "employer",
    bio: "Creative Director at DesignStudio, a boutique design agency specializing in digital products and branding. Passionate about design excellence.",
    skills: [],
    interests: ["Design", "Creative Direction", "Branding"],
    experienceLevel: "expert",
    location: "New York, NY",
    workPreference: "hybrid",
    level: 7,
    xp: 7200,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "employer-003",
    email: "david.datatech@example.com",
    name: "David Chen",
    userType: "employer",
    bio: "VP of Engineering at DataTech, a data analytics company. Leading a team of engineers building cutting-edge data processing solutions.",
    skills: [],
    interests: ["Data Science", "Engineering", "Analytics"],
    experienceLevel: "expert",
    location: "Seattle, WA",
    workPreference: "remote",
    level: 9,
    xp: 9200,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock Jobs
export const mockJobs: MockJob[] = [
  {
    id: "job-001",
    employerId: "employer-001",
    title: "Senior Frontend Developer",
    description: "We're looking for a talented frontend developer to join our team and help build amazing user experiences. You'll work with React, TypeScript, and modern web technologies.",
    company: "TechCorp",
    location: "San Francisco, CA",
    duration: 12,
    category: "Web Development",
    isRemote: true,
    jobType: "contract",
    salary: {
      min: 8000,
      max: 12000,
      currency: "USD",
      period: "monthly",
      isNegotiable: true,
    },
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "job-002",
    employerId: "employer-002",
    title: "UI/UX Designer",
    description: "Join our creative team as a UI/UX designer. You'll be responsible for creating beautiful and intuitive user interfaces for web and mobile applications.",
    company: "DesignStudio",
    location: "New York, NY",
    duration: 16,
    category: "Design",
    isRemote: false,
    jobType: "contract",
    salary: {
      min: 6000,
      max: 9000,
      currency: "USD",
      period: "monthly",
      isNegotiable: true,
    },
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "job-003",
    employerId: "employer-003",
    title: "Full-Stack Python Developer",
    description: "We need a skilled Python developer to help build our data processing platform. Experience with Django, PostgreSQL, and API development required.",
    company: "DataTech",
    location: "Seattle, WA",
    duration: 20,
    category: "Backend Development",
    isRemote: true,
    jobType: "contract",
    salary: {
      min: 7000,
      max: 11000,
      currency: "USD",
      period: "monthly",
      isNegotiable: true,
    },
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock Completed Jobs
export const mockCompletedJobs: MockJob[] = mockJobs.map(job => ({
  ...job,
  id: `completed-${job.id}`,
  status: "completed",
  updatedAt: "2024-01-01T00:00:00Z", // Completed 1 month ago
}));

// Mock Applications
export const mockApplications: MockApplication[] = [
  {
    id: "app-001",
    userId: "student-001",
    jobId: "job-001",
    status: "accepted",
    coverLetter: "I'm excited to apply for the Senior Frontend Developer position at TechCorp. With 2 years of experience in React and TypeScript, I believe I can contribute significantly to your team...",
    matchScore: 92.5,
    appliedAt: "2024-01-01T00:00:00Z",
    reviewedAt: "2024-01-01T00:00:00Z",
    responseAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "app-002",
    userId: "student-003",
    jobId: "job-002",
    status: "accepted",
    coverLetter: "As a passionate UI/UX designer with 3 years of experience, I'm thrilled to apply for the design position at DesignStudio. I love creating intuitive user experiences...",
    matchScore: 95.2,
    appliedAt: "2024-01-01T00:00:00Z",
    reviewedAt: "2024-01-01T00:00:00Z",
    responseAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "app-003",
    userId: "student-002",
    jobId: "job-003",
    status: "accepted",
    coverLetter: "I'm applying for the Full-Stack Python Developer position at DataTech. With my experience in Django and PostgreSQL, I'm confident I can help build your data processing platform...",
    matchScore: 88.7,
    appliedAt: "2024-01-01T00:00:00Z",
    reviewedAt: "2024-01-01T00:00:00Z",
    responseAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock Reviews
export const mockReviews: MockReview[] = [
  // Job 1: TechCorp Frontend Developer (Sarah Chen) - Excellent reviews
  {
    id: "review-001",
    reviewerId: "student-001",
    revieweeId: "employer-001",
    jobId: "completed-job-001",
    rating: 5,
    comment: "Excellent experience working with TechCorp! John was very clear about requirements and provided great feedback throughout the project. The payment process was smooth and professional. Highly recommend working with this team.",
    categoryRatings: {
      clearRequirements: 5,
      professionalism: 5,
      paymentReliability: 5,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "review-002",
    reviewerId: "employer-001",
    revieweeId: "student-001",
    jobId: "completed-job-001",
    rating: 5,
    comment: "Sarah is an exceptional developer! Her React and TypeScript skills are top-notch, and she delivered the project ahead of schedule. Communication was excellent throughout, and the code quality was outstanding. Would definitely hire again.",
    categoryRatings: {
      qualityOfWork: 5,
      communication: 5,
      timeliness: 5,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  
  // Job 2: DesignStudio UI/UX Designer (Emma Wilson) - Good reviews
  {
    id: "review-003",
    reviewerId: "student-003",
    revieweeId: "employer-002",
    jobId: "completed-job-002",
    rating: 4,
    comment: "Great experience working with DesignStudio! Lisa was very professional and provided clear direction. The project requirements were well-defined, though there were some last-minute changes. Payment was reliable and on time.",
    categoryRatings: {
      clearRequirements: 4,
      professionalism: 5,
      paymentReliability: 5,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "review-004",
    reviewerId: "employer-002",
    revieweeId: "student-003",
    jobId: "completed-job-002",
    rating: 5,
    comment: "Emma is a fantastic designer! Her work exceeded our expectations. She has a great eye for detail and created beautiful, user-friendly interfaces. Communication was excellent, and she was very responsive to feedback. Highly recommend!",
    categoryRatings: {
      qualityOfWork: 5,
      communication: 5,
      timeliness: 4,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  
  // Job 3: DataTech Python Developer (Mike Rodriguez) - Mixed reviews
  {
    id: "review-005",
    reviewerId: "student-002",
    revieweeId: "employer-003",
    jobId: "completed-job-003",
    rating: 3,
    comment: "The project was challenging but rewarding. David was knowledgeable about the domain, though requirements could have been clearer from the start. Payment was reliable, but communication could have been more frequent.",
    categoryRatings: {
      clearRequirements: 3,
      professionalism: 4,
      paymentReliability: 5,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "review-006",
    reviewerId: "employer-003",
    revieweeId: "student-002",
    jobId: "completed-job-003",
    rating: 4,
    comment: "Mike is a solid developer with good Python skills. He delivered the project on time and the code quality was good. Communication was adequate, though I would have appreciated more proactive updates. Overall, a good experience.",
    categoryRatings: {
      qualityOfWork: 4,
      communication: 3,
      timeliness: 5,
    },
    isVisible: true,
    visibleAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Helper functions
export const getMockUserById = (userId: string): MockUser | undefined => {
  const allUsers = [...mockStudents, ...mockEmployers];
  return allUsers.find(user => user.id === userId);
};

export const getMockReviewsByUserId = (userId: string): MockReview[] => {
  return mockReviews.filter(review => review.revieweeId === userId && review.isVisible);
};

export const getMockCompletedJobs = (): MockJob[] => {
  return mockCompletedJobs;
};

export const getMockUserReviewStats = (userId: string) => {
  const userReviews = getMockReviewsByUserId(userId);
  
  if (userReviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      },
      badges: []
    };
  }

  const totalReviews = userReviews.length;
  const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  const ratingBreakdown = {
    1: userReviews.filter(r => r.rating === 1).length,
    2: userReviews.filter(r => r.rating === 2).length,
    3: userReviews.filter(r => r.rating === 3).length,
    4: userReviews.filter(r => r.rating === 4).length,
    5: userReviews.filter(r => r.rating === 5).length,
  };

  // Calculate badges based on performance
  const badges: string[] = [];
  if (averageRating >= 4.5 && totalReviews >= 2) {
    badges.push("Top Rated");
  }
  if (averageRating >= 4.0 && totalReviews >= 3) {
    badges.push("Highly Recommended");
  }
  if (ratingBreakdown[5] >= 2) {
    badges.push("Excellence Award");
  }

  return {
    totalReviews,
    averageRating,
    ratingBreakdown,
    badges
  };
};
