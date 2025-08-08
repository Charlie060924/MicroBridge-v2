// Types for job events
export interface JobEvent {
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

// Mock calendar service for UI/UX development
import { mockCalendarEvents, mockApi } from '@/services/mockData';

export class CalendarService {
  // Fetch job events for a specific student
  static async fetchJobEvents(studentId: string): Promise<JobEvent[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCalendarEvents;
    } catch (error) {
      console.error('Error fetching job events:', error);
      throw error;
    }
  }

  // Transform job data to calendar events
  private static transformJobsToEvents(jobs: any[]): JobEvent[] {
    return jobs.map(job => ({
      id: `job-${job.id}`,
      title: job.title,
      start: job.startDate,
      end: job.dueDate,
      backgroundColor: this.getStatusColor(job.status),
      borderColor: this.getStatusColor(job.status),
      extendedProps: {
        company: job.company,
        status: job.status,
        description: job.description,
        deadline: job.dueDate,
        payment: `$${job.payment}`,
        jobId: job.id,
        studentId: job.studentId
      }
    }));
  }

  // Get color based on job status
  private static getStatusColor(status: string): string {
    switch (status) {
      case "Ongoing":
        return "#3B82F6"; // Blue
      case "Upcoming":
        return "#10B981"; // Green
      case "Completed":
        return "#6B7280"; // Gray
      default:
        return "#6B7280"; // Gray
    }
  }

  // Update job status (mock implementation)
  static async updateJobStatus(jobId: string, status: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`Mock: Updated job ${jobId} status to ${status}`);
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  // Get upcoming deadlines (for notifications)
  static async getUpcomingDeadlines(studentId: string, days: number = 7): Promise<JobEvent[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));
      return mockCalendarEvents.filter(event => 
        new Date(event.start) >= new Date() && 
        new Date(event.start) <= new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      );
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      throw error;
    }
  }
}

// Mock data for development/testing
export const mockJobEvents: JobEvent[] = [
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