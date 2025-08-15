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

  // Check for existing token and mock role on mount and when mock role changes
  useEffect(() => {
    const checkAuth = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const token = localStorage.getItem('auth_token');
      const mockRole = localStorage.getItem('mock_user_role');
      
      if (token && mockRole !== 'none') {
        try {
          // Mock: validate token and get user
          const user = await mockApi.getCurrentUser();
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.log('🔐 Token invalid, clearing auth state');
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        console.log('🔐 No token or mock role is "none", setting unauthenticated');
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();

    // Listen for storage changes (when mock role changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mock_user_role' || e.key === 'auth_token') {
        console.log('🔄 Storage changed, rechecking auth state');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
      console.log('🔐 Login successful:', user.role);
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('🔐 Login failed:', error);
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
      console.log('🔐 Registration successful:', user.role);
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('🔐 Registration failed:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    console.log('🔐 Logging out user');
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
