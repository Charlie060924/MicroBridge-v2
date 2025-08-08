export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: "Entry" | "Intermediate" | "Advanced";
}

export interface Project {
  id: string;
  title: string;
  company: string;
  status: "In Progress" | "Review" | "Completed" | "Overdue";
  progress: number;
  dueDate: string;
  startDate: string;
  description: string;
  payment: string;
  category: string;
}

export const featuredJobsData: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$25-35/hr",
    duration: "3 months",
    category: "Development",
    description: "Build responsive web applications using modern technologies",
    skills: ["React", "TypeScript", "CSS"],
    rating: 4.5,
    isBookmarked: false,
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    isRemote: true,
    experienceLevel: "Intermediate"
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "New York, NY",
    salary: "$30-45/hr",
    duration: "2 months",
    category: "Design",
    description: "Create beautiful and intuitive user interfaces",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    rating: 4.8,
    isBookmarked: true,
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
    isRemote: false,
    experienceLevel: "Entry"
  }
];

export const ongoingProjectsData: Project[] = [
  {
    id: "1",
    title: "E-commerce Website",
    company: "StartupXYZ",
    status: "In Progress",
    progress: 75,
    dueDate: "2024-03-01",
    startDate: "2024-01-01",
    description: "Building a modern e-commerce platform",
    payment: "$2,500",
    category: "Web Development"
  },
  {
    id: "2",
    title: "Mobile App Design",
    company: "AppCorp",
    status: "Review",
    progress: 90,
    dueDate: "2024-02-15",
    startDate: "2024-01-15",
    description: "Designing user interface for mobile application",
    payment: "$1,800",
    category: "Design"
  }
];

export const userSkillsData: string[] = [
  "React", "TypeScript", "Node.js", "Python"
]; 