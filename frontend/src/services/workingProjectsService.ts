import { api } from './api';

export interface WorkingProject {
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
  billingStatus: "Paid" | "Pending" | "Overdue";
  projectUrl?: string;
}

export interface WorkingProjectsResponse {
  projects: WorkingProject[];
  total: number;
  stats: {
    inProgress: number;
    review: number;
    completed: number;
    overdue: number;
    pendingPayment: number;
  };
}

class WorkingProjectsService {
  private baseUrl = '/student/working_projects';

  async getWorkingProjects(): Promise<WorkingProjectsResponse> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching working projects:', error);
      throw error;
    }
  }

  async getWorkingProjectById(id: string): Promise<WorkingProject> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching working project:', error);
      throw error;
    }
  }

  async updateProjectProgress(id: string, progress: number): Promise<WorkingProject> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error('Error updating project progress:', error);
      throw error;
    }
  }

  async submitProjectForReview(id: string): Promise<WorkingProject> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/submit`);
      return response.data;
    } catch (error) {
      console.error('Error submitting project for review:', error);
      throw error;
    }
  }

  // Mock data for development
  getMockWorkingProjects(): WorkingProject[] {
    return [
      {
        id: "1",
        title: "E-commerce Website Development",
        company: "TechStartup Inc.",
        status: "In Progress",
        progress: 75,
        dueDate: "2024-03-15",
        startDate: "2024-01-15",
        description: "Building a modern e-commerce platform with React and Node.js",
        payment: "$2,500",
        category: "Web Development",
        billingStatus: "Paid",
        projectUrl: "https://github.com/project1"
      },
      {
        id: "2",
        title: "Mobile App UI Design",
        company: "DesignStudio Pro",
        status: "Review",
        progress: 90,
        dueDate: "2024-02-28",
        startDate: "2024-01-20",
        description: "Creating user interface designs for a mobile application",
        payment: "$1,800",
        category: "Design",
        billingStatus: "Pending"
      },
      {
        id: "3",
        title: "Data Analysis Dashboard",
        company: "Analytics Corp",
        status: "In Progress",
        progress: 45,
        dueDate: "2024-04-01",
        startDate: "2024-02-01",
        description: "Developing a data visualization dashboard using Python and D3.js",
        payment: "$3,200",
        category: "Data Science",
        billingStatus: "Pending"
      },
      {
        id: "4",
        title: "Content Management System",
        company: "WebSolutions Ltd",
        status: "Completed",
        progress: 100,
        dueDate: "2024-02-15",
        startDate: "2024-01-01",
        description: "Built a custom CMS for client's business needs",
        payment: "$4,000",
        category: "Web Development",
        billingStatus: "Paid"
      },
      {
        id: "5",
        title: "SEO Optimization Project",
        company: "Digital Marketing Pro",
        status: "Overdue",
        progress: 60,
        dueDate: "2024-02-10",
        startDate: "2024-01-05",
        description: "Optimizing website SEO and improving search rankings",
        payment: "$1,500",
        category: "Marketing",
        billingStatus: "Overdue"
      }
    ];
  }

  getMockWorkingProjectsResponse(): WorkingProjectsResponse {
    const projects = this.getMockWorkingProjects();
    return {
      projects,
      total: projects.length,
      stats: {
        inProgress: projects.filter(p => p.status === "In Progress").length,
        review: projects.filter(p => p.status === "Review").length,
        completed: projects.filter(p => p.status === "Completed").length,
        overdue: projects.filter(p => p.status === "Overdue").length,
        pendingPayment: projects.filter(p => p.billingStatus === "Pending").length,
      }
    };
  }
}

export const workingProjectsService = new WorkingProjectsService();
