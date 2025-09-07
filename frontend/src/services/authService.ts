import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  user_type: 'student' | 'employer';
  phone?: string;
  experience_level?: string;
  location?: string;
  work_preference?: string;
  bio?: string;
  portfolio?: string;
  skills?: string[];
  interests?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  user_type: string;
  email_verified: boolean;
  is_active: boolean;
  bio: string;
  skills: string[];
  interests: string[];
  experience_level: string;
  location: string;
  portfolio: string;
  preferred_salary: string;
  work_preference: string;
  level: number;
  xp: number;
  career_coins: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  // Get stored token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  // Store tokens
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Clear tokens
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/login', credentials);
      const apiResponse = response.data;
      
      if (apiResponse.success && apiResponse.data?.access_token) {
        this.setTokens(apiResponse.data.access_token, apiResponse.data.refresh_token);
      }
      
      return apiResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/register', userData);
      const apiResponse = response.data;
      
      if (apiResponse.success && apiResponse.data?.access_token) {
        this.setTokens(apiResponse.data.access_token, apiResponse.data.refresh_token);
      }
      
      return apiResponse;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Logout
  logout(): void {
    this.clearTokens();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  }

  // Forgot Password
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Reset Password
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/reset-password', request);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Verify Email
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify email',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Resend Verification
  async resendVerification(request: ResendVerificationRequest): Promise<ApiResponse> {
    try {
      await api.post('/auth/resend-verification', request);
      return {
        success: true,
        message: 'Verification email sent'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send verification email'
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token',
          errors: ['No authentication token']
        };
      }

      const response = await api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.clearTokens();
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user data',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ access_token: string; refresh_token: string; expires_in: number }>> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return {
          success: false,
          message: 'No refresh token',
          errors: ['No refresh token']
        };
      }

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      const apiResponse = response.data;
      
      if (apiResponse.success && apiResponse.data?.access_token) {
        this.setTokens(apiResponse.data.access_token, apiResponse.data.refresh_token);
      }
      
      return apiResponse;
    } catch (error: any) {
      this.clearTokens();
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh token',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
