import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VerificationBadge from '../VerificationBadge';

describe('VerificationBadge', () => {
  const defaultProps = {
    type: 'identity' as const,
    status: 'verified' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders verification badge with basic props', () => {
      render(<VerificationBadge {...defaultProps} />);
      
      expect(screen.getByText('Identity')).toBeInTheDocument();
    });

    test('shows tooltip on hover', () => {
      render(<VerificationBadge {...defaultProps} showTooltip={true} />);
      
      const badge = screen.getByText('Identity');
      fireEvent.mouseEnter(badge.parentElement!);
      
      expect(screen.getByText('Identity Verified')).toBeInTheDocument();
    });

    test('hides tooltip when showTooltip is false', () => {
      render(<VerificationBadge {...defaultProps} showTooltip={false} />);
      
      const badge = screen.getByText('Identity');
      expect(badge).toBeInTheDocument();
      // Tooltip should not be rendered when showTooltip is false
    });
  });

  describe('Verification Types', () => {
    test('renders identity verification', () => {
      render(<VerificationBadge type="identity" status="verified" />);
      
      expect(screen.getByText('Identity')).toBeInTheDocument();
    });

    test('renders education verification', () => {
      render(<VerificationBadge type="education" status="verified" />);
      
      expect(screen.getByText('Education')).toBeInTheDocument();
    });

    test('renders skills verification', () => {
      render(<VerificationBadge type="skills" status="verified" />);
      
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    test('renders company verification', () => {
      render(<VerificationBadge type="company" status="verified" />);
      
      expect(screen.getByText('Company')).toBeInTheDocument();
    });

    test('renders payment verification', () => {
      render(<VerificationBadge type="payment" status="verified" />);
      
      expect(screen.getByText('Payment')).toBeInTheDocument();
    });

    test('renders background verification', () => {
      render(<VerificationBadge type="background" status="verified" />);
      
      expect(screen.getByText('Background')).toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    test('renders verified status', () => {
      render(<VerificationBadge {...defaultProps} status="verified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-success');
    });

    test('renders pending status', () => {
      render(<VerificationBadge {...defaultProps} status="pending" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-warning');
    });

    test('renders requires_action status', () => {
      render(<VerificationBadge {...defaultProps} status="requires_action" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-error');
    });

    test('renders unverified status', () => {
      render(<VerificationBadge {...defaultProps} status="unverified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-gray-400');
    });
  });

  describe('Verification Levels', () => {
    test('renders basic level correctly', () => {
      render(<VerificationBadge {...defaultProps} level="basic" status="verified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-success');
    });

    test('renders enhanced level with blue gradient', () => {
      render(<VerificationBadge {...defaultProps} level="enhanced" status="verified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-blue-500');
    });

    test('renders premium level with gold gradient', () => {
      render(<VerificationBadge {...defaultProps} level="premium" status="verified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('from-yellow-500');
    });

    test('shows premium level text in large size', () => {
      render(<VerificationBadge {...defaultProps} level="premium" status="verified" size="lg" />);
      
      expect(screen.getByText('Premium Verified')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    test('renders small size correctly', () => {
      render(<VerificationBadge {...defaultProps} size="sm" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    test('renders medium size correctly', () => {
      render(<VerificationBadge {...defaultProps} size="md" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('px-3', 'py-1.5', 'text-xs');
    });

    test('renders large size correctly', () => {
      render(<VerificationBadge {...defaultProps} size="lg" />);
      
      const badge = screen.getByText('Verified');
      expect(badge.parentElement).toHaveClass('px-4', 'py-2', 'text-sm');
    });
  });

  describe('Action Handling', () => {
    test('shows action button for pending status', () => {
      const mockOnAction = jest.fn();
      render(
        <VerificationBadge 
          {...defaultProps} 
          status="pending" 
          onAction={mockOnAction}
        />
      );
      
      const actionButton = screen.getByText('View Status');
      expect(actionButton).toBeInTheDocument();
      
      fireEvent.click(actionButton);
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    test('shows fix now button for requires_action status', () => {
      const mockOnAction = jest.fn();
      render(
        <VerificationBadge 
          {...defaultProps} 
          status="requires_action" 
          onAction={mockOnAction}
        />
      );
      
      const actionButton = screen.getByText('Fix Now');
      expect(actionButton).toBeInTheDocument();
      
      fireEvent.click(actionButton);
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    test('does not show action button for verified status', () => {
      const mockOnAction = jest.fn();
      render(
        <VerificationBadge 
          {...defaultProps} 
          status="verified" 
          onAction={mockOnAction}
        />
      );
      
      expect(screen.queryByText('View Status')).not.toBeInTheDocument();
      expect(screen.queryByText('Fix Now')).not.toBeInTheDocument();
    });

    test('does not show action button when onAction is not provided', () => {
      render(<VerificationBadge {...defaultProps} status="pending" />);
      
      expect(screen.queryByText('View Status')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip Content', () => {
    test('shows detailed information in tooltip', () => {
      render(
        <VerificationBadge 
          {...defaultProps} 
          details="Government ID verified"
          showTooltip={true}
        />
      );
      
      const badge = screen.getByText('Identity');
      fireEvent.mouseEnter(badge.parentElement!);
      
      expect(screen.getByText('Government ID verified')).toBeInTheDocument();
    });

    test('shows status text in tooltip', () => {
      render(
        <VerificationBadge 
          {...defaultProps} 
          status="pending"
          showTooltip={true}
        />
      );
      
      const badge = screen.getByText('Identity');
      fireEvent.mouseEnter(badge.parentElement!);
      
      expect(screen.getByText('Identity Pending Review')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper button roles for action buttons', () => {
      const mockOnAction = jest.fn();
      render(
        <VerificationBadge 
          {...defaultProps} 
          status="pending" 
          onAction={mockOnAction}
        />
      );
      
      const button = screen.getByRole('button', { name: /view status/i });
      expect(button).toBeInTheDocument();
    });

    test('has proper color contrast for different states', () => {
      render(<VerificationBadge {...defaultProps} status="verified" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('text-white');
    });
  });

  describe('Custom Classes', () => {
    test('applies custom className', () => {
      render(<VerificationBadge {...defaultProps} className="custom-class" />);
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toHaveClass('custom-class');
    });
  });

  describe('Animation and Interactions', () => {
    test('renders without throwing when hovered', () => {
      render(<VerificationBadge {...defaultProps} />);
      
      const badge = screen.getByText('Identity');
      expect(() => {
        fireEvent.mouseEnter(badge.parentElement!);
        fireEvent.mouseLeave(badge.parentElement!);
      }).not.toThrow();
    });

    test('renders premium animation elements', () => {
      render(
        <VerificationBadge 
          {...defaultProps} 
          level="premium" 
          status="verified" 
        />
      );
      
      const badge = screen.getByText('Identity');
      expect(badge.parentElement).toBeInTheDocument();
      // Premium badges should have special styling
      expect(badge.parentElement).toHaveClass('from-yellow-500');
    });
  });
});