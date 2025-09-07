import { api } from './api';
import type { ApiResponse } from './authService';

export interface HybridMatchResult {
  user_id?: string;
  job_id: string;
  final_score: number;
  confidence_level: number;
  success_probability: number;
  model_used: string;
  processing_time: number;
  explanation?: string;
  skill_gap_analysis?: SkillGapAnalysis;
  model_contributions?: { [key: string]: number };
  basic_algorithm_score?: any;
  ncf_score?: number;
  gnn_skill_alignment?: number;
  rl_recommendation_score?: number;
  features?: { [key: string]: any };
}

export interface SkillGapAnalysis {
  required_skills: string[];
  missing_skills: string[];
  skill_match_percentage: number;
  recommendations: string[];
}

export interface AIRecommendationsResponse {
  user_id: string;
  recommendations: HybridMatchResult[];
  total_count: number;
  model_version: string;
  generated_at: string;
  processing_time_ms: number;
  metadata: { [key: string]: any };
}

export interface AICandidateMatchesResponse {
  job_id: string;
  candidate_matches: HybridMatchResult[];
  total_count: number;
  min_confidence: number;
  model_version: string;
  generated_at: string;
  metadata: { [key: string]: any };
}

export interface AIMatchScoreResponse {
  user_id: string;
  job_id: string;
  final_score: number;
  confidence_level: number;
  success_probability: number;
  model_used: string;
  processing_time: number;
  generated_at: string;
  model_contributions?: { [key: string]: number };
  basic_algorithm_score?: any;
  ncf_score?: number;
  gnn_skill_alignment?: number;
  rl_recommendation_score?: number;
  features?: { [key: string]: any };
}

export interface UserFeedbackRequest {
  user_id: string;
  job_id: string;
  match_id?: string;
  action: 'viewed' | 'applied' | 'hired' | 'dismissed' | 'not_interested';
  outcome: number; // 0.0-1.0 satisfaction/success score
  context?: { [key: string]: any };
}

export interface ModelPerformanceResponse {
  total_requests: number;
  successful_matches: number;
  average_processing_time: number;
  model_performance: { [key: string]: ModelPerformanceDetail };
  fallback_count: number;
  last_updated: string;
  overall_health_score: number;
}

export interface ModelPerformanceDetail {
  total_predictions: number;
  average_score: number;
  average_confidence: number;
  error_count: number;
  error_rate: number;
  contribution_weight: number;
}

export interface ABTestStatusResponse {
  current_test: string;
  status: string;
  start_date: string;
  planned_end_date: string;
  traffic_split: { [key: string]: number };
  results: ABTestResults;
  last_updated: string;
}

export interface ABTestResults {
  control: ABTestGroupResult;
  treatment: ABTestGroupResult;
  statistical_significance: number;
  recommended_action: string;
  confidence: string;
}

export interface ABTestGroupResult {
  users: number;
  average_match_score: number;
  click_through_rate: number;
  application_rate: number;
  hire_rate: number;
  user_satisfaction: number;
}

class MatchingService {
  // Get AI-powered job recommendations for a user
  async getAIJobRecommendations(
    userId: string,
    options: {
      limit?: number;
      include_explanations?: boolean;
      include_skill_analysis?: boolean;
    } = {}
  ): Promise<ApiResponse<AIRecommendationsResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.include_explanations) params.set('include_explanations', 'true');
      if (options.include_skill_analysis) params.set('include_skill_analysis', 'true');

      const response = await api.get(`/matching/ai/jobs/${userId}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get AI job recommendations',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get AI-powered candidate matches for a job
  async getAICandidateMatches(
    jobId: string,
    options: {
      limit?: number;
      min_confidence?: number;
    } = {}
  ): Promise<ApiResponse<AICandidateMatchesResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.min_confidence) params.set('min_confidence', options.min_confidence.toString());

      const response = await api.get(`/matching/ai/candidates/${jobId}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get AI candidate matches',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get detailed AI match score between user and job
  async getAIMatchScore(
    userId: string,
    jobId: string,
    includeBreakdown: boolean = false
  ): Promise<ApiResponse<AIMatchScoreResponse>> {
    try {
      const params = new URLSearchParams();
      if (includeBreakdown) params.set('include_breakdown', 'true');

      const response = await api.get(`/matching/ai/score/${userId}/${jobId}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get AI match score',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Submit user feedback for AI model training
  async submitUserFeedback(feedback: UserFeedbackRequest): Promise<ApiResponse<{
    status: string;
    message: string;
    processed_at: string;
    user_id: string;
    job_id: string;
    action: string;
    outcome: number;
  }>> {
    try {
      const response = await api.post('/matching/ai/feedback', feedback);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit user feedback',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get AI model performance metrics
  async getModelPerformance(): Promise<ApiResponse<ModelPerformanceResponse>> {
    try {
      const response = await api.get('/matching/ai/performance');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get model performance',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get current A/B test status and results
  async getABTestStatus(): Promise<ApiResponse<ABTestStatusResponse>> {
    try {
      const response = await api.get('/matching/ai/ab-test');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get A/B test status',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get basic job recommendations (non-AI fallback)
  async getBasicJobRecommendations(
    userId?: string,
    options: {
      limit?: number;
      category?: string;
      location?: string;
      experience_level?: string;
    } = {}
  ): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (userId) params.set('user_id', userId);
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.category) params.set('category', options.category);
      if (options.location) params.set('location', options.location);
      if (options.experience_level) params.set('experience_level', options.experience_level);

      const response = await api.get(`/matching/basic/jobs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get basic job recommendations',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get user matching preferences
  async getMatchingPreferences(userId: string): Promise<ApiResponse<{
    preferred_job_types: string[];
    preferred_locations: string[];
    min_salary: number;
    max_salary: number;
    work_arrangement: string;
    experience_level: string;
    skills_focus: string[];
    company_size_preference: string;
    industry_preferences: string[];
    ai_recommendations_enabled: boolean;
  }>> {
    try {
      const response = await api.get(`/users/${userId}/matching-preferences`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get matching preferences',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update user matching preferences
  async updateMatchingPreferences(
    userId: string,
    preferences: {
      preferred_job_types?: string[];
      preferred_locations?: string[];
      min_salary?: number;
      max_salary?: number;
      work_arrangement?: string;
      experience_level?: string;
      skills_focus?: string[];
      company_size_preference?: string;
      industry_preferences?: string[];
      ai_recommendations_enabled?: boolean;
    }
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/users/${userId}/matching-preferences`, preferences);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update matching preferences',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get skill gap analysis for a user-job pair
  async getSkillGapAnalysis(
    userId: string,
    jobId: string
  ): Promise<ApiResponse<SkillGapAnalysis>> {
    try {
      const response = await api.get(`/matching/skill-gap/${userId}/${jobId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get skill gap analysis',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get personalized learning recommendations based on skill gaps
  async getLearningRecommendations(
    userId: string,
    options: {
      job_id?: string;
      skill_focus?: string[];
      limit?: number;
    } = {}
  ): Promise<ApiResponse<{
    recommendations: Array<{
      skill: string;
      current_level: number;
      target_level: number;
      learning_resources: Array<{
        title: string;
        type: string;
        provider: string;
        duration: string;
        difficulty: string;
        url: string;
      }>;
      priority: number;
      estimated_time: string;
    }>;
    total_count: number;
  }>> {
    try {
      const params = new URLSearchParams();
      
      if (options.job_id) params.set('job_id', options.job_id);
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.skill_focus && options.skill_focus.length > 0) {
        params.set('skill_focus', options.skill_focus.join(','));
      }

      const response = await api.get(`/matching/learning-recommendations/${userId}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get learning recommendations',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }
}

export const matchingService = new MatchingService();
export default matchingService;