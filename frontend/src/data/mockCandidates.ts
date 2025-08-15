export interface Candidate {
  id: string;
  name: string;
  headline: string;
  location: string;
  availability: string;
  contact: {
    email: string;
    phone: string;
  };
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bulletPoints: string[];
  }>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }>;
  languages: string[];
  expectedSalary: {
    min: number;
    max: number;
    currency: string;
  };
  bio: string;
  profilePicture: string;
  matchScore: number;
}

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    headline: "Senior Frontend Developer",
    location: "San Francisco, CA",
    availability: "Available immediately",
    contact: {
      email: "sarah.wilson@email.com",
      phone: "+1 (415) 555-0123"
    },
    education: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      graduationYear: 2019
    },
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        duration: "2021 - Present",
        bulletPoints: [
          "Led development of responsive web applications using React and TypeScript",
          "Improved application performance by 40% through code optimization",
          "Mentored 3 junior developers and conducted code reviews"
        ]
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        bulletPoints: [
          "Built user interfaces for mobile and web applications",
          "Collaborated with UX designers to implement pixel-perfect designs",
          "Participated in agile development processes"
        ]
      }
    ],
    skills: [
      { name: "React", level: "Expert" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "JavaScript", level: "Expert" },
      { name: "HTML/CSS", level: "Expert" }
    ],
    languages: ["English", "Spanish"],
    expectedSalary: {
      min: 120000,
      max: 150000,
      currency: "USD"
    },
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications. I specialize in React ecosystem and modern JavaScript frameworks. I love creating intuitive user experiences and mentoring junior developers.",
    profilePicture: "/images/user/user-01.png",
    matchScore: 95
  },
  {
    id: "2",
    name: "Alex Chen",
    headline: "UI/UX Designer",
    location: "New York, NY",
    availability: "Available in 2 weeks",
    contact: {
      email: "alex.chen@email.com",
      phone: "+1 (212) 555-0456"
    },
    education: {
      degree: "Bachelor of Fine Arts in Design",
      institution: "Parsons School of Design",
      graduationYear: 2020
    },
    experience: [
      {
        title: "UI/UX Designer",
        company: "Design Studio Pro",
        duration: "2020 - Present",
        bulletPoints: [
          "Designed user interfaces for mobile and web applications",
          "Conducted user research and usability testing",
          "Created design systems and component libraries"
        ]
      },
      {
        title: "Junior Designer",
        company: "Creative Agency",
        duration: "2019 - 2020",
        bulletPoints: [
          "Assisted senior designers with project deliverables",
          "Created wireframes and prototypes",
          "Participated in client presentations"
        ]
      }
    ],
    skills: [
      { name: "Figma", level: "Expert" },
      { name: "Adobe XD", level: "Advanced" },
      { name: "Sketch", level: "Advanced" },
      { name: "Prototyping", level: "Expert" },
      { name: "User Research", level: "Advanced" },
      { name: "Design Systems", level: "Advanced" }
    ],
    languages: ["English", "Mandarin"],
    expectedSalary: {
      min: 80000,
      max: 110000,
      currency: "USD"
    },
    bio: "Creative UI/UX designer focused on creating meaningful user experiences. I believe in user-centered design and data-driven decisions. My work spans across mobile apps, web platforms, and design systems.",
    profilePicture: "/images/user/user-02.png",
    matchScore: 88
  },
  {
    id: "3",
    name: "David Brown",
    headline: "Full Stack Developer",
    location: "Austin, TX",
    availability: "Available immediately",
    contact: {
      email: "david.brown@email.com",
      phone: "+1 (512) 555-0789"
    },
    education: {
      degree: "Master of Science in Software Engineering",
      institution: "University of Texas",
      graduationYear: 2018
    },
    experience: [
      {
        title: "Full Stack Developer",
        company: "Innovation Labs",
        duration: "2018 - Present",
        bulletPoints: [
          "Developed full-stack applications using React, Node.js, and PostgreSQL",
          "Implemented CI/CD pipelines and automated testing",
          "Led technical architecture decisions for new features"
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "Tech Startup",
        duration: "2017 - 2018",
        bulletPoints: [
          "Built RESTful APIs and database schemas",
          "Collaborated with cross-functional teams",
          "Participated in code reviews and pair programming"
        ]
      }
    ],
    skills: [
      { name: "React", level: "Advanced" },
      { name: "Node.js", level: "Expert" },
      { name: "Python", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Docker", level: "Intermediate" },
      { name: "AWS", level: "Intermediate" }
    ],
    languages: ["English", "French"],
    expectedSalary: {
      min: 100000,
      max: 130000,
      currency: "USD"
    },
    bio: "Full stack developer with expertise in modern web technologies. I enjoy solving complex problems and building scalable applications. Passionate about clean code, testing, and continuous learning.",
    profilePicture: "/images/user/user-03.png",
    matchScore: 82
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    headline: "Product Manager",
    location: "Seattle, WA",
    availability: "Available in 1 month",
    contact: {
      email: "emily.rodriguez@email.com",
      phone: "+1 (206) 555-0321"
    },
    education: {
      degree: "MBA in Business Administration",
      institution: "University of Washington",
      graduationYear: 2017
    },
    experience: [
      {
        title: "Senior Product Manager",
        company: "Tech Giant",
        duration: "2020 - Present",
        bulletPoints: [
          "Led product strategy for B2B SaaS platform with $10M+ revenue",
          "Managed cross-functional team of 15 engineers and designers",
          "Increased user engagement by 35% through data-driven decisions"
        ]
      },
      {
        title: "Product Manager",
        company: "Startup Inc.",
        duration: "2017 - 2020",
        bulletPoints: [
          "Launched 3 new product features from concept to market",
          "Conducted market research and competitive analysis",
          "Collaborated with engineering and design teams"
        ]
      }
    ],
    skills: [
      { name: "Product Strategy", level: "Expert" },
      { name: "Data Analysis", level: "Advanced" },
      { name: "User Research", level: "Advanced" },
      { name: "Agile/Scrum", level: "Expert" },
      { name: "SQL", level: "Intermediate" },
      { name: "A/B Testing", level: "Advanced" }
    ],
    languages: ["English", "Spanish"],
    expectedSalary: {
      min: 130000,
      max: 160000,
      currency: "USD"
    },
    bio: "Strategic product manager with 6+ years of experience in B2B and B2C products. I focus on user-centric product development and data-driven decision making. Passionate about building products that solve real user problems.",
    profilePicture: "/images/user/user-04.png",
    matchScore: 91
  },
  {
    id: "5",
    name: "Michael Johnson",
    headline: "DevOps Engineer",
    location: "Denver, CO",
    availability: "Available immediately",
    contact: {
      email: "michael.johnson@email.com",
      phone: "+1 (303) 555-0654"
    },
    education: {
      degree: "Bachelor of Science in Information Technology",
      institution: "Colorado State University",
      graduationYear: 2016
    },
    experience: [
      {
        title: "DevOps Engineer",
        company: "Cloud Solutions",
        duration: "2019 - Present",
        bulletPoints: [
          "Managed AWS infrastructure for 50+ microservices",
          "Implemented automated deployment pipelines reducing deployment time by 70%",
          "Led migration from on-premise to cloud infrastructure"
        ]
      },
      {
        title: "System Administrator",
        company: "Enterprise Corp",
        duration: "2016 - 2019",
        bulletPoints: [
          "Maintained Linux servers and network infrastructure",
          "Implemented monitoring and alerting systems",
          "Provided technical support to development teams"
        ]
      }
    ],
    skills: [
      { name: "AWS", level: "Expert" },
      { name: "Docker", level: "Expert" },
      { name: "Kubernetes", level: "Advanced" },
      { name: "Terraform", level: "Advanced" },
      { name: "Jenkins", level: "Advanced" },
      { name: "Linux", level: "Expert" }
    ],
    languages: ["English"],
    expectedSalary: {
      min: 110000,
      max: 140000,
      currency: "USD"
    },
    bio: "DevOps engineer passionate about automation, scalability, and reliability. I specialize in cloud infrastructure and CI/CD pipelines. Always looking for ways to improve system performance and developer productivity.",
    profilePicture: "/images/user/user-05.png",
    matchScore: 87
  },
  {
    id: "6",
    name: "Lisa Wang",
    headline: "Data Scientist",
    location: "Boston, MA",
    availability: "Available in 3 weeks",
    contact: {
      email: "lisa.wang@email.com",
      phone: "+1 (617) 555-0987"
    },
    education: {
      degree: "PhD in Statistics",
      institution: "MIT",
      graduationYear: 2021
    },
    experience: [
      {
        title: "Senior Data Scientist",
        company: "AI Research Lab",
        duration: "2021 - Present",
        bulletPoints: [
          "Developed machine learning models for predictive analytics",
          "Led research projects resulting in 3 published papers",
          "Mentored junior data scientists and interns"
        ]
      },
      {
        title: "Data Analyst",
        company: "Analytics Firm",
        duration: "2019 - 2021",
        bulletPoints: [
          "Performed statistical analysis on large datasets",
          "Created data visualizations and dashboards",
          "Presented findings to stakeholders and clients"
        ]
      }
    ],
    skills: [
      { name: "Python", level: "Expert" },
      { name: "R", level: "Advanced" },
      { name: "Machine Learning", level: "Expert" },
      { name: "SQL", level: "Advanced" },
      { name: "TensorFlow", level: "Advanced" },
      { name: "Data Visualization", level: "Advanced" }
    ],
    languages: ["English", "Mandarin"],
    expectedSalary: {
      min: 120000,
      max: 150000,
      currency: "USD"
    },
    bio: "Data scientist with expertise in machine learning and statistical modeling. I enjoy turning complex data into actionable insights. Passionate about research and developing innovative solutions to business problems.",
    profilePicture: "/images/user/user-06.png",
    matchScore: 93
  }
];