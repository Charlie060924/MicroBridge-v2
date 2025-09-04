export const universities = [ 
  "University of Hong Kong",
  "The Chinese University of Hong Kong",
  "The Hong Kong University of Science and Technology",
  "City University of Hong Kong",
  "The Hong Kong Polytechnic University",
  "Hong Kong Baptist University",
  "The Education University of Hong Kong",
  "Lingnan University",
  "Hong Kong Metropolitan University",
  "The Hang Seng University of Hong Kong",
  "Other",
];

export const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "undergrad_freshman", label: "Undergraduate - Freshman" },
  { value: "undergrad_sophomore", label: "Undergraduate - Sophomore" },
  { value: "undergrad_junior", label: "Undergraduate - Junior" },
  { value: "undergrad_senior", label: "Undergraduate - Senior" },
  { value: "masters", label: "Master's Student" },
  { value: "phd", label: "PhD Candidate" },
  { value: "recent_grad", label: "Recent Graduate (<2 years)" },
  { value: "career_changer", label: "Career Changer" },
  { value: "other", label: "Other" }
] as const;

export const academicMajors = [
  // Technology
  { value: "cs", label: "Computer Science" },
  { value: "it", label: "Information Technology" },
  { value: "ds", label: "Data Science" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "cybersecurity", label: "Cybersecurity" },
  
  // Engineering
  { value: "software_eng", label: "Software Engineering" },
  { value: "computer_eng", label: "Computer Engineering" },
  { value: "electrical_eng", label: "Electrical Engineering" },
  
  // Business & Design
  { value: "business_it", label: "Business IT" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "ux_design", label: "UX/UI Design" },
  
  // Emerging Fields
  { value: "bioinformatics", label: "Bioinformatics" },
  { value: "fintech", label: "Financial Technology" },
  
  { value: "other", label: "Other" }
] as const;

export const technicalSkills = [
  // Programming Languages
  { value: "python", label: "Python", category: "language" },
  { value: "javascript", label: "JavaScript", category: "language" },
  { value: "typescript", label: "TypeScript", category: "language" },
  
  // Web Development
  { value: "react", label: "React", category: "web" },
  { value: "nextjs", label: "Next.js", category: "web" },
  
  // Data
  { value: "sql", label: "SQL", category: "data" },
  { value: "pandas", label: "Pandas", category: "data" },
  
  // Tools
  { value: "git", label: "Git", category: "tool" },
  { value: "docker", label: "Docker", category: "tool" }
] as const;

export const careerGoals = [
  { value: "software_engineer", label: "Software Engineer" },
  { value: "frontend_engineer", label: "Frontend Engineer" },
  { value: "backend_engineer", label: "Backend Engineer" },
  { value: "data_scientist", label: "Data Scientist" },
  { value: "ux_designer", label: "UX Designer" },
  { value: "product_manager", label: "Product Manager" },
  { value: "technical_consultant", label: "Technical Consultant" },
  { value: "research_scientist", label: "Research Scientist" },
  { value: "entrepreneur", label: "Startup Founder" }
] as const;

export const industries = [
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ai_ml", label: "AI/ML" },
  { value: "blockchain", label: "Web3/Blockchain" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "gaming", label: "Gaming" },
  { value: "climate", label: "Climate Tech" }
] as const;

export const projectTypes = [
  { value: "open_source", label: "Open Source" },
  { value: "startup", label: "Startup Project" },
  { value: "research", label: "Research Project" },
  { value: "freelance", label: "Freelance Work" },
  { value: "hackathon", label: "Hackathon Project" },
  { value: "non_profit", label: "Non-Profit Initiative" }
] as const;

export const proficiencyLevels = [
  { value: 1, label: "Beginner (Can read code)" },
  { value: 2, label: "Basic (Can write simple programs)" },
  { value: 3, label: "Intermediate (Can build small projects)" },
  { value: 4, label: "Advanced (Can build complex systems)" },
  { value: 5, label: "Expert (Can architect solutions)" }
] as const;

export const availabilityOptions = [
  { value: "part_time_10", label: "10 hrs/week" },
  { value: "part_time_20", label: "20 hrs/week" },
  { value: "full_time", label: "30+ hrs/week" },
  { value: "flexible", label: "Flexible hours" },
  { value: "weekends", label: "Weekends only" }
] as const;

export  const durationOptions = [
  { value: "1_month", label: "1 month" },
  { value: "2_months", label: "2 months" },
  { value: "3_months", label: "3 months" },
  { value: "6_months", label: "6 months" },
  { value: "flexible", label: "Flexible" }
] as const;

// Payment Types
export const paymentTypes = [
  {
    value: "project_based",
    label: "Project-Based Payment",
    description: "Fixed amount upon project completion"
  },
  {
    value: "monthly_stipend",
    label: "Monthly Stipend",
    description: "Fixed amount paid monthly"
  },
] as const;

// Project-Based Salary Ranges (in HKD)
export const projectSalaryRanges = [
  { value: "500_1000", label: "HK$500 - HK$1,000" },
  { value: "1000_3000", label: "HK$1,000 - HK$3,000" },
  { value: "3000_5000", label: "HK$3,000 - HK$5,000" },
  { value: "5000_plus", label: "HK$5,000+" },
  { value: "custom", label: "Custom Amount" }
] as const;

// Optional: Currencies (if implementing currency selection)
export const currencies = [
  { value: "HKD", label: "Hong Kong Dollar (HKD)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "CNY", label: "Chinese Yuan (CNY)" }
] as const;