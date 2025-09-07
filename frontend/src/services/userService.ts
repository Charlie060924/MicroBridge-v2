import { api } from './api';
import type { ApiResponse, UserResponse } from './authService';

export interface UpdateUserRequest {
  name?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  experience_level?: string;
  location?: string;
  portfolio?: string;
  preferred_salary?: string;
  work_preference?: string;
}

class UserService {
  // Get user profile (current user)
  async getProfile(): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user profile',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Update user profile (current user)
  async updateProfile(userData: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user profile',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Get any user by ID (public profile)
  async getUser(userId: string): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Upload user avatar/profile picture
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload avatar',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Delete user account
  async deleteAccount(): Promise<ApiResponse> {
    try {
      const response = await api.delete('/users/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete account',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }
}

export const userService = new UserService();
export default userService;