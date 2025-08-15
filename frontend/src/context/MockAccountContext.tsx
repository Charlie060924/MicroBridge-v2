"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type MockAccountType = 'student' | 'employer' | 'none';

interface MockAccountContextType {
  currentRole: MockAccountType;
  switchRole: (role: MockAccountType) => void;
  isDevelopment: boolean;
}

const MockAccountContext = createContext<MockAccountContextType | undefined>(undefined);

interface MockAccountProviderProps {
  children: ReactNode;
}

export const MockAccountProvider: React.FC<MockAccountProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<MockAccountType>('none');
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (isDevelopment) {
      const savedRole = localStorage.getItem('mock_user_role') as MockAccountType;
      if (savedRole && ['student', 'employer', 'none'].includes(savedRole)) {
        setCurrentRole(savedRole);
      } else {
        // Default to 'none' if no valid role is saved
        localStorage.setItem('mock_user_role', 'none');
        setCurrentRole('none');
      }
    }
    setIsInitialized(true);
  }, [isDevelopment]);

  const switchRole = (role: MockAccountType) => {
    if (!isDevelopment) return;

    console.log(`🔄 Switching mock account from ${currentRole} to ${role}`);
    
    // Update localStorage
    localStorage.setItem('mock_user_role', role);
    setCurrentRole(role);

    // Clear any existing auth tokens
    localStorage.removeItem('auth_token');

    // Route to appropriate page based on role
    switch (role) {
      case 'student':
        router.push('/student_portal/workspace');
        console.log('📍 Redirecting to student portal');
        break;
      case 'employer':
        router.push('/employer_portal/workspace');
        console.log('📍 Redirecting to employer portal');
        break;
      case 'none':
        router.push('/');
        console.log('📍 Redirecting to landing page (preview mode)');
        break;
    }
  };

  // Don't render children until initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  return (
    <MockAccountContext.Provider value={{ currentRole, switchRole, isDevelopment }}>
      {children}
    </MockAccountContext.Provider>
  );
};

export const useMockAccount = (): MockAccountContextType => {
  const context = useContext(MockAccountContext);
  if (context === undefined) {
    throw new Error('useMockAccount must be used within a MockAccountProvider');
  }
  return context;
};
