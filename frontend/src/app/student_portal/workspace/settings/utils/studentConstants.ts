// Hong Kong-specific constants for student settings
export const HK_UNIVERSITIES = [
  "The University of Hong Kong",
  "The Chinese University of Hong Kong", 
  "The Hong Kong University of Science and Technology",
  "City University of Hong Kong",
  "The Hong Kong Polytechnic University",
  "Hong Kong Baptist University",
  "The Education University of Hong Kong",
  "Lingnan University",
  "Hong Kong Metropolitan University",
  "The Hang Seng University of Hong Kong",
  "Other"
] as const;

export const STUDENT_MAJORS = [
  // Technology & Computing
  { value: "computer_science", label: "Computer Science", category: "Technology" },
  { value: "information_technology", label: "Information Technology", category: "Technology" },
  { value: "data_science", label: "Data Science", category: "Technology" },
  { value: "artificial_intelligence", label: "Artificial Intelligence", category: "Technology" },
  { value: "cybersecurity", label: "Cybersecurity", category: "Technology" },
  { value: "software_engineering", label: "Software Engineering", category: "Technology" },
  
  // Business & Finance
  { value: "business_administration", label: "Business Administration", category: "Business" },
  { value: "finance", label: "Finance", category: "Business" },
  { value: "accounting", label: "Accounting", category: "Business" },
  { value: "marketing", label: "Marketing", category: "Business" },
  { value: "economics", label: "Economics", category: "Business" },
  { value: "international_business", label: "International Business", category: "Business" },
  
  // Engineering
  { value: "electrical_engineering", label: "Electrical Engineering", category: "Engineering" },
  { value: "mechanical_engineering", label: "Mechanical Engineering", category: "Engineering" },
  { value: "civil_engineering", label: "Civil Engineering", category: "Engineering" },
  { value: "biomedical_engineering", label: "Biomedical Engineering", category: "Engineering" },
  
  // Design & Media
  { value: "graphic_design", label: "Graphic Design", category: "Design" },
  { value: "ux_ui_design", label: "UX/UI Design", category: "Design" },
  { value: "media_communication", label: "Media & Communication", category: "Design" },
  { value: "digital_media", label: "Digital Media", category: "Design" },
  
  // Other
  { value: "psychology", label: "Psychology", category: "Social Sciences" },
  { value: "sociology", label: "Sociology", category: "Social Sciences" },
  { value: "other", label: "Other", category: "Other" }
] as const;

export const YEAR_OF_STUDY = [
  { value: "year_1", label: "Year 1" },
  { value: "year_2", label: "Year 2" },
  { value: "year_3", label: "Year 3" },
  { value: "year_4", label: "Year 4" },
  { value: "year_5", label: "Year 5+" },
  { value: "masters", label: "Master's Student" },
  { value: "phd", label: "PhD Student" },
  { value: "recent_graduate", label: "Recent Graduate" }
] as const;

export const SKILL_CATEGORIES = [
  {
    category: "Programming Languages",
    skills: [
      { value: "python", label: "Python" },
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "java", label: "Java" },
      { value: "cpp", label: "C++" },
      { value: "csharp", label: "C#" },
      { value: "php", label: "PHP" },
      { value: "swift", label: "Swift" },
      { value: "kotlin", label: "Kotlin" }
    ]
  },
  {
    category: "Web Development",
    skills: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "nextjs", label: "Next.js" },
      { value: "nodejs", label: "Node.js" },
      { value: "html_css", label: "HTML/CSS" },
      { value: "tailwind", label: "Tailwind CSS" }
    ]
  },
  {
    category: "Data & Analytics",
    skills: [
      { value: "sql", label: "SQL" },
      { value: "mongodb", label: "MongoDB" },
      { value: "pandas", label: "Pandas" },
      { value: "numpy", label: "NumPy" },
      { value: "tableau", label: "Tableau" },
      { value: "power_bi", label: "Power BI" },
      { value: "excel", label: "Excel" }
    ]
  },
  {
    category: "Design",
    skills: [
      { value: "figma", label: "Figma" },
      { value: "sketch", label: "Sketch" },
      { value: "adobe_xd", label: "Adobe XD" },
      { value: "photoshop", label: "Photoshop" },
      { value: "illustrator", label: "Illustrator" },
      { value: "canva", label: "Canva" }
    ]
  },
  {
    category: "Business & Marketing",
    skills: [
      { value: "project_management", label: "Project Management" },
      { value: "digital_marketing", label: "Digital Marketing" },
      { value: "social_media", label: "Social Media Marketing" },
      { value: "seo", label: "SEO" },
      { value: "content_writing", label: "Content Writing" },
      { value: "market_research", label: "Market Research" }
    ]
  }
] as const;

export const CAREER_INTERESTS = [
  { value: "software_development", label: "Software Development" },
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "data_science", label: "Data Science" },
  { value: "machine_learning", label: "Machine Learning" },
  { value: "artificial_intelligence", label: "Artificial Intelligence" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "devops", label: "DevOps & Infrastructure" },
  { value: "blockchain", label: "Blockchain Development" },
  { value: "game_development", label: "Game Development" },
  { value: "ux_ui_design", label: "UX/UI Design" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "motion_graphics", label: "Motion Graphics & Animation" },
  { value: "product_design", label: "Product Design" },
  { value: "product_management", label: "Product Management" },
  { value: "project_management", label: "Project Management" },
  { value: "business_operations", label: "Business Operations" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "content_marketing", label: "Content Marketing" },
  { value: "social_media", label: "Social Media Management" },
  { value: "seo_sem", label: "SEO & SEM" },
  { value: "business_analysis", label: "Business Analysis" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "financial_analysis", label: "Financial Analysis" },
  { value: "market_research", label: "Market Research" },
  { value: "consulting", label: "Consulting" },
  { value: "strategy", label: "Strategy & Planning" },
  { value: "sales", label: "Sales & Business Development" },
  { value: "customer_success", label: "Customer Success" },
  { value: "hr_recruiting", label: "HR & Recruiting" },
  { value: "content_writing", label: "Content Writing & Copywriting" },
  { value: "video_production", label: "Video Production" },
  { value: "photography", label: "Photography" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "startup", label: "Startup Environment" },
  { value: "research", label: "Research & Development" },
  { value: "quality_assurance", label: "Quality Assurance" },
  { value: "teaching", label: "Teaching & Education" },
  { value: "training", label: "Training & Development" },
  { value: "nonprofit", label: "Nonprofit & Social Impact" },
  { value: "sustainability", label: "Sustainability & ESG" },
  { value: "legal_tech", label: "Legal Tech & Compliance" },
  { value: "event_management", label: "Event Management" }
] as const;

export const TARGET_INDUSTRIES = [
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "gaming", label: "Gaming" },
  { value: "ai_ml", label: "AI/Machine Learning" },
  { value: "blockchain", label: "Blockchain/Web3" },
  { value: "climate_tech", label: "Climate Tech" },
  { value: "social_impact", label: "Social Impact" },
  { value: "media_entertainment", label: "Media & Entertainment" },
  { value: "travel_tourism", label: "Travel & Tourism" },
  { value: "real_estate", label: "Real Estate" },
  { value: "logistics", label: "Logistics" },
  { value: "retail", label: "Retail" },
  { value: "consulting", label: "Consulting" },
  { value: "government", label: "Government" }
] as const;

export const AVAILABILITY_PREFERENCES = [
  { value: "part_time_flexible", label: "Part-time (Flexible Schedule)" },
  { value: "part_time_evenings", label: "Part-time (Evenings)" },
  { value: "part_time_weekends", label: "Part-time (Weekends)" },
  { value: "full_time_summer", label: "Full-time (Summer Break)" },
  { value: "project_based", label: "Project-based (As Available)" },
  { value: "remote_only", label: "Remote Work Only" },
  { value: "hybrid", label: "Hybrid (Office + Remote)" },
  { value: "on_site", label: "On-site Work" }
] as const;

export const DEFAULT_STUDENT_SETTINGS = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
    bio: ""
  },
  education: {
    university: "",
    major: "",
    yearOfStudy: "",
    graduationDate: "",
    gpa: "",
    relevantCoursework: []
  },
  careerGoals: {
    interests: [],
    targetIndustries: [],
    careerStatement: "",
    availability: [],
    compensationExpectation: {
      hourlyMin: 80,
      hourlyMax: 150,
      projectMin: 3000,
      projectMax: 8000,
      preferredType: 'both'
    }
  },
  skills: {
    technicalSkills: [],
    softSkills: [],
    languages: []
  },
  privacy: {
    profileVisibility: "public",
    contactPreference: "platform_only",
    dataSharing: false,
    jobAlerts: true
  },
  notifications: {
    newOpportunities: true,
    applicationUpdates: true,
    messages: true,
    marketing: false,
    email: true,
    push: false
  },
  preferences: {
    language: "en",
    timezone: "Asia/Hong_Kong",
    currency: "HKD",
    theme: "system"
  }
} as const;
