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

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
    email_verified: boolean;
    level: number;
    xp: number;
    career_coins: number;
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
      const data = response.data;
      
      if (data.access_token) {
        this.setTokens(data.access_token, data.refresh_token);
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;
      
      if (data.access_token) {
        this.setTokens(data.access_token, data.refresh_token);
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
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
      await api.post('/auth/forgot-password', request);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send reset email'
      };
    }
  }

  // Reset Password
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      await api.post('/auth/reset-password', request);
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to reset password'
      };
    }
  }

  // Verify Email
  async verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse> {
    try {
      await api.post('/auth/verify-email', request);
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to verify email'
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

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<unknown>> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No authentication token'
        };
      }

      const response = await api.get('/users/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      if (error.response?.status === 401) {
        this.clearTokens();
      }
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user data'
      };
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ access_token: string; expires_at: string }>> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token'
        };
      }

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      const data = response.data;
      
      if (data.access_token) {
        localStorage.setItem(this.tokenKey, data.access_token);
      }
      
      return {
        success: true,
        data: {
          access_token: data.access_token,
          expires_at: data.expires_at
        }
      };
    } catch (error: unknown) {
      this.clearTokens();
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to refresh token'
      };
    }
  }
}

export const authService = new AuthService();
export default authService;
