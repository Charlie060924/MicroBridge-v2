// Unit tests for PreviewModeShowcase component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { PreviewModeShowcase, usePreviewModeShowcase } from '../PreviewModeShowcase';
import { usePreviewMode } from '@/context/PreviewModeContext';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/PreviewModeContext', () => ({
  usePreviewMode: jest.fn(),
}));

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  writable: true,
  value: jest.fn(),
});

const mockRouter = {
  push: jest.fn(),
  prefetch: jest.fn(),
};

const mockPreviewModeContext = {
  previewType: 'student' as const,
  getDemoData: jest.fn(),
  getABTestVariation: jest.fn(),
};

describe('PreviewModeShowcase', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePreviewMode as jest.Mock).mockReturnValue(mockPreviewModeContext);
    
    // Mock demo data
    mockPreviewModeContext.getDemoData.mockReturnValue({
      cta: {
        primary: 'Sign Up to Unlock Your Dashboard',
        secondary: 'Join 2,341+ students already earning',
        features: [
          'Apply to 500+ active projects',
          'Earn up to $5,000+ per project',
          'Build your professional portfolio',
          'Get matched with top companies'
        ]
      },
      socialProof: {
        totalStudentsHired: 2341,
        totalJobsPosted: 5847,
        totalEarningsDistributed: 2847593,
        averageRating: 4.7,
        companiesServed: 1247,
        successStories: 892
      }
    });
    
    mockPreviewModeContext.getABTestVariation.mockImplementation((element: string) => {
      const variations = {
        heroMessage: 'Transform your career with real projects',
        ctaButton: 'Start Your Journey',
        socialProof: '2,341+ students hired this month'
      };
      return variations[element as keyof typeof variations] || 'Default';
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('Inline Variant', () => {
    test('renders inline showcase with demo data', () => {
      render(<PreviewModeShowcase variant="inline" />);
      
      expect(screen.getByText('Sign Up to Unlock Your Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Join 2,341+ students already earning')).toBeInTheDocument();
      expect(screen.getByText('Apply to 500+ active projects')).toBeInTheDocument();
      expect(screen.getByText('2,341+ students already hired')).toBeInTheDocument();
    });

    test('handles signup button click', () => {
      render(<PreviewModeShowcase variant="inline" />);
      
      const signupButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(signupButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signup?role=student&from=preview');
    });

    test('tracks analytics on signup click', () => {
      render(<PreviewModeShowcase variant="inline" />);
      
      const signupButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(signupButton);
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'preview_signup_clicked', {
        preview_type: 'student',
        cta_variant: 'Start Your Journey',
        location: 'inline'
      });
    });

    test('can be closed', () => {
      render(<PreviewModeShowcase variant="inline" />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Sign Up to Unlock Your Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Floating Variant', () => {
    test('renders floating showcase with condensed content', () => {
      render(<PreviewModeShowcase variant="floating" />);
      
      expect(screen.getByText('Try it Free!')).toBeInTheDocument();
      expect(screen.getByText('Transform your career with real projects')).toBeInTheDocument();
      expect(screen.getByText('2,341+ students hired this month')).toBeInTheDocument();
    });

    test('has different styling for floating variant', () => {
      render(<PreviewModeShowcase variant="floating" />);
      
      const container = screen.getByText('Try it Free!').closest('div');
      expect(container).toHaveClass('fixed', 'bottom-4', 'right-4');
    });
  });

  describe('Modal Variant', () => {
    test('renders modal showcase with full content', () => {
      render(<PreviewModeShowcase variant="modal" />);
      
      expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
      expect(screen.getByText('What You\'ll Get:')).toBeInTheDocument();
      expect(screen.getByText('Join the Community:')).toBeInTheDocument();
    });

    test('has backdrop and modal positioning', () => {
      render(<PreviewModeShowcase variant="modal" />);
      
      const backdrop = screen.getByText('Ready to Get Started?').closest('div');
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'z-50');
    });
  });

  describe('Employer Preview Type', () => {
    test('shows employer-specific content', () => {
      mockPreviewModeContext.previewType = 'employer';
      mockPreviewModeContext.getDemoData.mockReturnValue({
        cta: {
          primary: 'Sign Up to Post Your First Job',
          secondary: 'Join 1,247+ companies finding talent',
          features: [
            'Access 10,000+ verified candidates',
            'Average time to hire: 12 days',
            'Pay only for successful hires',
            'Dedicated project management tools'
          ]
        },
        socialProof: {
          totalStudentsHired: 2341,
          totalJobsPosted: 5847,
          totalEarningsDistributed: 2847593,
          averageRating: 4.7,
          companiesServed: 1247,
          successStories: 892
        }
      });

      render(<PreviewModeShowcase variant="inline" />);
      
      expect(screen.getByText('Sign Up to Post Your First Job')).toBeInTheDocument();
      expect(screen.getByText('Access 10,000+ verified candidates')).toBeInTheDocument();
    });

    test('navigates to employer signup', () => {
      mockPreviewModeContext.previewType = 'employer';
      
      render(<PreviewModeShowcase variant="inline" />);
      
      const signupButton = screen.getByRole('button', { name: /Start Your Journey/i });
      fireEvent.click(signupButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/employer-signup?from=preview');
    });
  });

  describe('Error Handling', () => {
    test('handles missing demo data gracefully', () => {
      mockPreviewModeContext.getDemoData.mockReturnValue(null);
      
      render(<PreviewModeShowcase variant="inline" />);
      
      // Should not render if no demo data
      expect(screen.queryByText('Sign Up to Unlock Your Dashboard')).not.toBeInTheDocument();
    });

    test('handles missing CTA data gracefully', () => {
      mockPreviewModeContext.getDemoData.mockReturnValue({
        cta: null,
        socialProof: null
      });
      
      render(<PreviewModeShowcase variant="inline" />);
      
      // Should not render if no CTA data
      expect(screen.queryByText('Sign Up to Unlock Your Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('applies mobile-specific classes', () => {
      render(<PreviewModeShowcase variant="floating" />);
      
      const button = screen.getByRole('button', { name: /Join Now|Start Your Journey/i });
      expect(button).toHaveClass('text-sm', 'sm:text-base');
    });

    test('shows mobile-specific button text', () => {
      render(<PreviewModeShowcase variant="floating" />);
      
      // Should have both mobile and desktop button text
      const button = screen.getByRole('button', { name: /Join Now|Start Your Journey/i });
      const mobileText = button.querySelector('.sm\\:hidden');
      const desktopText = button.querySelector('.hidden.sm\\:inline');
      
      expect(mobileText).toBeInTheDocument();
      expect(desktopText).toBeInTheDocument();
    });
  });
});

describe('usePreviewModeShowcase Hook', () => {
  test('manages showcase state correctly', () => {
    const TestComponent = () => {
      const {
        showModal,
        showFloating,
        triggerModal,
        closeModal,
        closeFloating,
        isPreviewMode
      } = usePreviewModeShowcase();

      return (
        <div>
          <div data-testid="showModal">{showModal.toString()}</div>
          <div data-testid="showFloating">{showFloating.toString()}</div>
          <div data-testid="isPreviewMode">{isPreviewMode.toString()}</div>
          <button onClick={triggerModal}>Trigger Modal</button>
          <button onClick={closeModal}>Close Modal</button>
          <button onClick={closeFloating}>Close Floating</button>
        </div>
      );
    };

    render(<TestComponent />);

    // Initial state
    expect(screen.getByTestId('showModal')).toHaveTextContent('false');
    expect(screen.getByTestId('showFloating')).toHaveTextContent('true');

    // Trigger modal
    fireEvent.click(screen.getByText('Trigger Modal'));
    expect(screen.getByTestId('showModal')).toHaveTextContent('true');

    // Close modal
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.getByTestId('showModal')).toHaveTextContent('false');

    // Close floating
    fireEvent.click(screen.getByText('Close Floating'));
    expect(screen.getByTestId('showFloating')).toHaveTextContent('false');
  });

  test('only triggers modal in preview mode', () => {
    mockPreviewModeContext.isPreviewMode = false;
    (usePreviewMode as jest.Mock).mockReturnValue({
      ...mockPreviewModeContext,
      isPreviewMode: false
    });

    const TestComponent = () => {
      const { showModal, triggerModal } = usePreviewModeShowcase();

      return (
        <div>
          <div data-testid="showModal">{showModal.toString()}</div>
          <button onClick={triggerModal}>Trigger Modal</button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Trigger Modal'));
    
    // Should remain false when not in preview mode
    expect(screen.getByTestId('showModal')).toHaveTextContent('false');
  });
});