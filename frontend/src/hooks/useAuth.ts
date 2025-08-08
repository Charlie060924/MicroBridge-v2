import { useState, useEffect } from 'react';
import { mockApi, User } from '@/services/mockData';

interface AuthState {
  user: User | null;
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

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Mock: validate token and get user
      mockApi.getCurrentUser().then(user => {
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      }).catch(() => {
        // Token invalid, clear it
        localStorage.removeItem('auth_token');
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await mockApi.login(email, password);
      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (userData: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await mockApi.register(userData);
      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
