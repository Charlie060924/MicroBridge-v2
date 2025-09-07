import { api } from './api';
import type { ApiResponse } from './authService';

export interface SkillRequest {
  name: string;
  level: number;
  is_required: boolean;
  importance: number;
  can_learn: boolean;
}

export interface SkillResponse {
  name: string;
  level: number;
  is_required: boolean;
  importance: number;
  can_learn: boolean;
}

export interface SalaryRange {
  currency: string;
  min_amount: number;
  max_amount: number;
  negotiable: boolean;
}

export interface WorkArrangement {
  schedule_type: string;
  hours_per_week: number;
  timezone: string;
  meeting_frequency: string;
}

export interface CandidatePreferences {
  preferred_locations: string[];
  min_experience_level: string;
  required_skills: string[];
  preferred_languages: string[];
  cultural_fit_requirements: string[];
}

export interface CreateJobRequest {
  title: string;
  description: string;
  company?: string;
  skills: SkillRequest[];
  experience_level: 'entry' | 'intermediate' | 'advanced' | 'senior' | 'expert';
  location?: string;
  duration?: number;
  category: string;
  is_remote: boolean;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: SalaryRange;
  benefits?: string[];
  requirements?: string[];
  work_arrangement?: WorkArrangement;
  preferred_candidates?: CandidatePreferences;
  application_deadline?: string; // ISO date string
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  skills?: SkillRequest[];
  experience_level?: 'entry' | 'intermediate' | 'advanced' | 'senior' | 'expert';
  location?: string;
  duration?: number;
  is_remote?: boolean;
  job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  category?: string;
  status?: 'draft' | 'posted' | 'hired' | 'in_progress' | 'submitted' | 'review_pending' | 'completed' | 'disputed' | 'archived';
  salary?: SalaryRange;
  benefits?: string[];
  requirements?: string[];
  work_arrangement?: WorkArrangement;
  preferred_candidates?: CandidatePreferences;
  application_deadline?: string; // ISO date string
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
}

export interface JobFilters {
  category?: string;
  skills?: string[];
  location?: string;
  is_remote?: boolean;
  job_type?: string;
  experience_level?: string;
  status?: string;
  employer_id?: string;
}

export interface JobResponse {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  company: string;
  company_id: string;
  skills: SkillResponse[];
  experience_level: string;
  location: string;
  duration: number;
  category: string;
  is_remote: boolean;
  job_type: string;
  salary: SalaryRange;
  benefits: string[];
  requirements: string[];
  work_arrangement: WorkArrangement;
  application_deadline?: string;
  start_date?: string;
  end_date?: string;
  preferred_candidates: CandidatePreferences;
  status: string;
  views: number;
  applications: number;
  review_due_date?: string;
  completed_at?: string;
  hired_student_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedJobResponse {
  jobs: JobResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

export interface JobRecommendation {
  job_id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  location: string;
  is_remote: boolean;
  match_score: number;
  reasons: string[];
  created_at: string;
}

class JobService {
  // Create a new job posting
  async createJob(jobData: CreateJobRequest): Promise<ApiResponse<JobResponse>> {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create job',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get a job by ID
  async getJob(jobId: string): Promise<ApiResponse<JobResponse>> {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get job',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update a job posting
  async updateJob(jobId: string, jobData: UpdateJobRequest): Promise<ApiResponse<JobResponse>> {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update job',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Delete a job posting
  async deleteJob(jobId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete job',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // List jobs with filtering and pagination
  async listJobs(
    filters?: JobFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedJobResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      // Handle boolean and array parameters
      if (filters?.is_remote !== undefined) {
        params.set('is_remote', filters.is_remote.toString());
      }
      if (filters?.skills && filters.skills.length > 0) {
        params.set('skills', filters.skills.join(','));
      }

      const response = await api.get(`/jobs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to list jobs',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Search jobs
  async searchJobs(
    query: string,
    filters?: JobFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedJobResponse>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      // Handle boolean and array parameters
      if (filters?.is_remote !== undefined) {
        params.set('is_remote', filters.is_remote.toString());
      }
      if (filters?.skills && filters.skills.length > 0) {
        params.set('skills', filters.skills.join(','));
      }

      const response = await api.get(`/jobs/search?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search jobs',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get jobs by employer
  async getJobsByEmployer(
    employerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedJobResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get(`/jobs/employer/${employerId}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get jobs by employer',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get job recommendations (from matching service)
  async getJobRecommendations(
    userId?: string,
    limit: number = 10
  ): Promise<ApiResponse<JobRecommendation[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });
      
      if (userId) {
        params.set('user_id', userId);
      }

      const response = await api.get(`/jobs/recommendations?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get job recommendations',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get jobs the current user has applied to
  async getAppliedJobs(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedJobResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get(`/jobs/applied?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get applied jobs',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get jobs posted by the current user (for employers)
  async getMyJobs(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedJobResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get(`/jobs/my-jobs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get my jobs',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }
}

export const jobService = new JobService();
export default jobService;