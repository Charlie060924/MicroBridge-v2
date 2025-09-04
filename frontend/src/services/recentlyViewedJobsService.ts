import { Job } from '@/components/dashboard/student_portal/workspace/JobCategoryCard';

const RECENTLY_VIEWED_KEY = 'microbridge-recently-viewed-jobs';
const MAX_RECENT_JOBS = 10;

export interface RecentlyViewedJob extends Job {
  viewedAt: string;
}

class RecentlyViewedJobsService {
  private getStorageKey(userId?: string): string {
    return userId ? `${RECENTLY_VIEWED_KEY}-${userId}` : RECENTLY_VIEWED_KEY;
  }

  // Get recently viewed jobs from localStorage
  getRecentlyViewedJobs(userId?: string): RecentlyViewedJob[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);
      
      if (!stored) return [];
      
      const jobs = JSON.parse(stored) as RecentlyViewedJob[];
      return jobs.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
    } catch {
      // console.error('Error getting recently viewed jobs:', error);
      return [];
    }
  }

  // Add a job to recently viewed
  addRecentlyViewedJob(job: Job, userId?: string): void {
    try {
      if (typeof window === 'undefined') return;
      
      const key = this.getStorageKey(userId);
      const existingJobs = this.getRecentlyViewedJobs(userId);
      
      // Remove if already exists
      const filteredJobs = existingJobs.filter(j => j.id !== job.id);
      
      // Add new job with timestamp
      const recentlyViewedJob: RecentlyViewedJob = {
        ...job,
        viewedAt: new Date().toISOString()
      };
      
      // Add to beginning and limit to MAX_RECENT_JOBS
      const updatedJobs = [recentlyViewedJob, ...filteredJobs].slice(0, MAX_RECENT_JOBS);
      
      localStorage.setItem(key, JSON.stringify(updatedJobs));
    } catch {
      // console.error('Error adding recently viewed job:', error);
    }
  }

  // Remove a job from recently viewed
  removeRecentlyViewedJob(jobId: string, userId?: string): void {
    try {
      if (typeof window === 'undefined') return;
      
      const key = this.getStorageKey(userId);
      const existingJobs = this.getRecentlyViewedJobs(userId);
      const updatedJobs = existingJobs.filter(job => job.id !== jobId);
      
      localStorage.setItem(key, JSON.stringify(updatedJobs));
    } catch {
      // console.error('Error removing recently viewed job:', error);
    }
  }

  // Clear all recently viewed jobs
  clearRecentlyViewedJobs(userId?: string): void {
    try {
      if (typeof window === 'undefined') return;
      
      const key = this.getStorageKey(userId);
      localStorage.removeItem(key);
    } catch {
      // console.error('Error clearing recently viewed jobs:', error);
    }
  }

  // Get recently viewed jobs from API (if available)
  async fetchRecentlyViewedJobsFromAPI(_userId?: string): Promise<RecentlyViewedJob[]> {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await fetch(`/api/jobs/recently-viewed${_userId ? `?userId=${_userId}` : ''}`);
      // if (!response.ok) throw new Error('Failed to fetch recently viewed jobs');
      // return await response.json();
      
      // For now, return empty array - will be replaced with actual API call
      return [];
    } catch {
      // console.error('Error fetching recently viewed jobs from API:', error);
      return [];
    }
  }

  // Sync with API (when backend is ready)
  async syncWithAPI(_userId?: string): Promise<void> {
    try {
      // TODO: Implement API sync when backend is ready
      // const apiJobs = await this.fetchRecentlyViewedJobsFromAPI(_userId);
      // const localJobs = this.getRecentlyViewedJobs(_userId);
      // 
      // // Merge and sync logic here
      // const mergedJobs = this.mergeJobs(apiJobs, localJobs);
      // localStorage.setItem(this.getStorageKey(_userId), JSON.stringify(mergedJobs));
    } catch {
      // console.error('Error syncing recently viewed jobs with API:', error);
    }
  }

  // Get mock data for development/testing
  getMockRecentlyViewedJobs(): RecentlyViewedJob[] {
    const mockJobs: Job[] = [
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
      },
      {
        id: "3",
        title: "Data Analyst",
        company: "Analytics Inc",
        location: "San Francisco, CA",
        salary: "$28-40/hr",
        duration: "4 months",
        category: "Analytics",
        description: "Analyze data and create insights for business decisions",
        skills: ["Python", "SQL", "Tableau"],
        rating: 4.2,
        isBookmarked: false,
        postedDate: "2024-01-12",
        deadline: "2024-03-12",
        isRemote: true,
        experienceLevel: "Intermediate"
      }
    ];

    return mockJobs.map((job, index) => ({
      ...job,
      viewedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString() // Different timestamps
    }));
  }
}

export const recentlyViewedJobsService = new RecentlyViewedJobsService();
export default recentlyViewedJobsService;
