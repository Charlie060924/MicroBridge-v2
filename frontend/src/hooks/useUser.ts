import { useState, useEffect } from 'react';
import { mockApi, User } from '@/services/mockData';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await mockApi.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
        // console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user to update');
      }
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      return { success: true };
    } catch {
      setError('Failed to update user');
      return { success: false, error: 'Update failed' };
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
  };
}
