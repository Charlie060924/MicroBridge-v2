import { useState, useEffect } from 'react';
import { authService, type UserResponse } from '@/services/authService';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing token on mount and validate it
  useEffect(() => {
    const checkAuth = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const token = authService.getToken();
      
      if (token) {
        try {
          // Validate token by getting current user
          const result = await authService.getCurrentUser();
          if (result.success && result.data) {
            setAuthState({
              user: result.data,
              token,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            console.log('🔐 Token invalid, clearing auth state');
            authService.clearTokens();
            setAuthState({
              user: null,
              token: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.log('🔐 Error validating token, clearing auth state');
          authService.clearTokens();
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        console.log('🔐 No token found, setting unauthenticated');
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();

    // Listen for storage changes (when tokens change)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        console.log('🔄 Auth token changed, rechecking auth state');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.data) {
        const token = authService.getToken();
        setAuthState({
          user: result.data.user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        console.log('🔐 Login successful:', result.data.user.user_type);
        return { success: true, data: result.data };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        console.log('🔐 Login failed:', result.message);
        return { success: false, error: result.message, errors: result.errors };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('🔐 Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: {
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
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await authService.register(userData);
      
      if (result.success && result.data) {
        const token = authService.getToken();
        setAuthState({
          user: result.data.user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        console.log('🔐 Registration successful:', result.data.user.user_type);
        return { success: true, data: result.data };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        console.log('🔐 Registration failed:', result.message);
        return { success: false, error: result.message, errors: result.errors };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('🔐 Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    console.log('🔐 Logging out user');
    authService.clearTokens();
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  // Add token refresh function
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      if (result.success && result.data) {
        const token = authService.getToken();
        setAuthState(prev => ({
          ...prev,
          token,
        }));
        return { success: true };
      } else {
        // Refresh failed, logout user
        logout();
        return { success: false, error: result.message };
      }
    } catch (error) {
      logout();
      return { success: false, error: 'Token refresh failed' };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
  };
}
