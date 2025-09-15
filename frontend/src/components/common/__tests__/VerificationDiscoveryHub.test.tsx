import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationDiscoveryHub from '../VerificationDiscoveryHub';

// Mock child components
jest.mock('../VisualMilestoneCard', () => {
  return function MockVisualMilestoneCard({ title, onClaim }: any) {
    return (
      <div data-testid="milestone-card">
        <div>{title}</div>
        {onClaim && <button onClick={() => onClaim(title)}>Claim</button>}
      </div>
    );
  };
});

jest.mock('../VerificationBadge', () => {
  return function MockVerificationBadge({ type, status, onAction }: any) {
    return (
      <div data-testid="verification-badge">
        <div>{type} - {status}</div>
        {onAction && <button onClick={onAction}>Action</button>}
      </div>
    );
  };
});

jest.mock('../SmartSearchBar', () => {
  return function MockSmartSearchBar({ onSearch }: any) {
    return (
      <div data-testid="smart-search-bar">
        <button onClick={() => onSearch('test query', {})}>Search</button>
      </div>
    );
  };
});

describe('VerificationDiscoveryHub', () => {
  const defaultProps = {
    userType: 'student' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders hub with correct title and description', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      expect(screen.getByText('Verification & Discovery Hub')).toBeInTheDocument();
      expect(screen.getByText('Track progress, manage verifications, and discover opportunities')).toBeInTheDocument();
    });

    test('renders tab navigation', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('Verification')).toBeInTheDocument();
      expect(screen.getByText('Discovery')).toBeInTheDocument();
    });

    test('renders statistics correctly', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      // Should show milestone and verification counts
      expect(screen.getByText('Milestones')).toBeInTheDocument();
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    test('defaults to progress tab', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const progressTab = screen.getByRole('button', { name: /progress/i });
      expect(progressTab).toHaveClass('bg-white', 'text-primary');
    });

    test('switches to verification tab when clicked', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        expect(verificationTab).toHaveClass('bg-white', 'text-primary');
      });
    });

    test('switches to discovery tab when clicked', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      await user.click(discoveryTab);
      
      await waitFor(() => {
        expect(discoveryTab).toHaveClass('bg-white', 'text-primary');
      });
    });

    test('shows different content for each tab', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      // Progress tab content
      expect(screen.getAllByTestId('milestone-card')).toHaveLength(3);
      
      // Switch to verification tab
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        expect(screen.getAllByTestId('verification-badge')).toHaveLength(4);
      });
      
      // Switch to discovery tab
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      await user.click(discoveryTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('smart-search-bar')).toBeInTheDocument();
        expect(screen.getByText('Smart Search & Discovery')).toBeInTheDocument();
      });
    });
  });

  describe('User Type Differences', () => {
    test('renders student-specific milestones', () => {
      render(<VerificationDiscoveryHub userType="student" />);
      
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
      expect(screen.getByText('Skill Verification')).toBeInTheDocument();
      expect(screen.getByText('First Job Application')).toBeInTheDocument();
    });

    test('renders employer-specific milestones', () => {
      render(<VerificationDiscoveryHub userType="employer" />);
      
      expect(screen.getByText('Company Verification')).toBeInTheDocument();
      expect(screen.getByText('Post First Project')).toBeInTheDocument();
      expect(screen.getByText('Talent Network')).toBeInTheDocument();
    });

    test('shows correct statistics for students', () => {
      render(<VerificationDiscoveryHub userType="student" />);
      
      // Student should have 1 completed milestone and 2 verified items
      expect(screen.getByText('1')).toBeInTheDocument(); // Completed milestones
      expect(screen.getByText('2')).toBeInTheDocument(); // Verified items
    });

    test('shows correct statistics for employers', () => {
      render(<VerificationDiscoveryHub userType="employer" />);
      
      // Employer should have 1 completed milestone and 2 verified items
      expect(screen.getByText('1')).toBeInTheDocument(); // Completed milestones
      expect(screen.getByText('2')).toBeInTheDocument(); // Verified items
    });
  });

  describe('Progress Tab Functionality', () => {
    test('renders milestone cards', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const milestoneCards = screen.getAllByTestId('milestone-card');
      expect(milestoneCards).toHaveLength(3);
    });

    test('renders overall progress summary', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
      expect(screen.getByText('1 of 3 milestones completed')).toBeInTheDocument();
      expect(screen.getByText('33%')).toBeInTheDocument(); // (1/3) * 100
    });

    test('handles milestone claim', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const claimButton = screen.getByText('Claim');
      await user.click(claimButton);
      
      expect(console.log).toHaveBeenCalledWith('Claiming reward for: Complete Your Profile');
    });
  });

  describe('Verification Tab Functionality', () => {
    test('renders verification badges for students', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub userType="student" />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        const badges = screen.getAllByTestId('verification-badge');
        expect(badges).toHaveLength(4);
        
        expect(screen.getByText('identity - verified')).toBeInTheDocument();
        expect(screen.getByText('education - verified')).toBeInTheDocument();
        expect(screen.getByText('skills - pending')).toBeInTheDocument();
        expect(screen.getByText('background - requires_action')).toBeInTheDocument();
      });
    });

    test('renders verification badges for employers', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub userType="employer" />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        const badges = screen.getAllByTestId('verification-badge');
        expect(badges).toHaveLength(3);
        
        expect(screen.getByText('company - verified')).toBeInTheDocument();
        expect(screen.getByText('payment - verified')).toBeInTheDocument();
        expect(screen.getByText('background - pending')).toBeInTheDocument();
      });
    });

    test('renders verification progress bar', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        expect(screen.getByText('Verification Progress')).toBeInTheDocument();
        expect(screen.getByText('2/4 Complete')).toBeInTheDocument(); // 2 verified out of 4 total
      });
    });

    test('handles verification action', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      await user.click(verificationTab);
      
      await waitFor(() => {
        const actionButton = screen.getByText('Action');
        expect(actionButton).toBeInTheDocument();
      });
      
      const actionButton = screen.getByText('Action');
      await user.click(actionButton);
      
      expect(console.log).toHaveBeenCalledWith('Opening verification modal');
    });
  });

  describe('Discovery Tab Functionality', () => {
    test('renders smart search bar', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      await user.click(discoveryTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('smart-search-bar')).toBeInTheDocument();
      });
    });

    test('renders discovery features cards', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      await user.click(discoveryTab);
      
      await waitFor(() => {
        expect(screen.getByText('Auto-Complete')).toBeInTheDocument();
        expect(screen.getByText('Smart Filtering')).toBeInTheDocument();
        expect(screen.getByText('Saved Searches')).toBeInTheDocument();
        
        expect(screen.getByText('Smart suggestions for skills, companies, and locations as you type')).toBeInTheDocument();
        expect(screen.getByText('AI-powered filtering with suggested refinements for better matches')).toBeInTheDocument();
        expect(screen.getByText('Save and revisit your favorite search queries and filters')).toBeInTheDocument();
      });
    });

    test('handles search action', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      await user.click(discoveryTab);
      
      await waitFor(() => {
        const searchButton = screen.getByText('Search');
        expect(searchButton).toBeInTheDocument();
      });
      
      const searchButton = screen.getByText('Search');
      await user.click(searchButton);
      
      expect(console.log).toHaveBeenCalledWith('Search:', 'test query', {});
    });
  });

  describe('Custom Classes', () => {
    test('applies custom className', () => {
      render(<VerificationDiscoveryHub {...defaultProps} className="custom-class" />);
      
      const container = screen.getByText('Verification & Discovery Hub').closest('.custom-class');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Animation and Interactions', () => {
    test('tab switching animations work without errors', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      const progressTab = screen.getByRole('button', { name: /progress/i });
      
      // Switch between tabs rapidly
      await user.click(verificationTab);
      await user.click(discoveryTab);
      await user.click(progressTab);
      
      // Should not throw any errors
      expect(screen.getByText('Verification & Discovery Hub')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper heading structure', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    test('tab buttons have proper roles', () => {
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const progressTab = screen.getByRole('button', { name: /progress/i });
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      const discoveryTab = screen.getByRole('button', { name: /discovery/i });
      
      expect(progressTab).toBeInTheDocument();
      expect(verificationTab).toBeInTheDocument();
      expect(discoveryTab).toBeInTheDocument();
    });

    test('maintains focus management during tab switching', async () => {
      const user = userEvent.setup();
      render(<VerificationDiscoveryHub {...defaultProps} />);
      
      const verificationTab = screen.getByRole('button', { name: /verification/i });
      
      await user.click(verificationTab);
      
      // Tab should maintain focus after clicking
      expect(verificationTab).toHaveClass('bg-white', 'text-primary');
    });
  });
});