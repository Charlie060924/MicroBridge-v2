import { api } from './api';

export interface CreateApplicationRequest {
  job_id: string;
  cover_letter: string;
  custom_resume?: string;
}

export interface UpdateApplicationRequest {
  status?: string;
  cover_letter?: string;
  custom_resume?: string;
  employer_feedback?: string;
  candidate_feedback?: string;
  internal_notes?: string;
}

export interface ApplicationStatusUpdateRequest {
  status: string;
  feedback?: string;
  interview_scheduled?: string;
  interview_notes?: string;
}

export interface ApplicationWithdrawalRequest {
  reason?: string;
}

export interface ApplicationResponse {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  cover_letter: string;
  custom_resume?: string;
  match_score: number;
  applied_at: string;
  reviewed_at?: string;
  response_at?: string;
  employer_feedback?: string;
  candidate_feedback?: string;
  internal_notes?: string;
  interview_scheduled?: string;
  interview_notes?: string;
  created_at: string;
  updated_at: string;
  job?: JobSummaryResponse;
  applicant?: UserSummaryResponse;
}

export interface JobSummaryResponse {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  is_remote: boolean;
  status: string;
}

export interface UserSummaryResponse {
  id: string;
  name: string;
  email: string;
  user_type: string;
  experience_level: string;
  location: string;
  bio: string;
  skills: string[];
  level: number;
  xp: number;
}

export interface ApplicationListResponse {
  applications: ApplicationResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

class ApplicationService {
  // Submit a new application
  async submitApplication(request: CreateApplicationRequest): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const response = await api.post('/applications', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit application',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get application by ID
  async getApplication(id: string): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get application',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update application
  async updateApplication(id: string, request: UpdateApplicationRequest): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const response = await api.put(`/applications/${id}`, request);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update application'
      };
    }
  }

  // Delete application
  async deleteApplication(id: string): Promise<ApiResponse> {
    try {
      await api.delete(`/applications/${id}`);
      return {
        success: true,
        message: 'Application deleted successfully'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete application'
      };
    }
  }

  // Get user applications
  async getUserApplications(page: number = 1, limit: number = 20, status?: string): Promise<ApiResponse<ApplicationListResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/applications/user?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user applications',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get job applications (for employers)
  async getJobApplications(jobId: string, page: number = 1, limit: number = 20, status?: string): Promise<ApiResponse<ApplicationListResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/jobs/${jobId}/applications?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get job applications',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update application status (for employers)
  async updateApplicationStatus(id: string, request: ApplicationStatusUpdateRequest): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const response = await api.put(`/applications/${id}/status`, request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update application status',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Withdraw application
  async withdrawApplication(id: string, request: ApplicationWithdrawalRequest = {}): Promise<ApiResponse> {
    try {
      const response = await api.put(`/applications/${id}/withdraw`, request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to withdraw application',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Check if user has already applied to a job
  async checkExistingApplication(jobId: string): Promise<ApiResponse<ApplicationResponse | null>> {
    try {
      const response = await api.get(`/applications/job/${jobId}/check`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null // No existing application
        };
      }
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to check existing application'
      };
    }
  }

  // Get application statistics for a user
  async getUserApplicationStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  }>> {
    try {
      const response = await api.get('/applications/user/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get application statistics'
      };
    }
  }

  // Get application statistics for a job (employer)
  async getJobApplicationStats(jobId: string): Promise<ApiResponse<{
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  }>> {
    try {
      const response = await api.get(`/applications/job/${jobId}/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get job application statistics'
      };
    }
  }
}

export const applicationService = new ApplicationService();
export default applicationService;
