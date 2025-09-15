import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VisualMilestoneCard from '../VisualMilestoneCard';

describe('VisualMilestoneCard', () => {
  const defaultProps = {
    title: 'Complete Profile',
    description: 'Add your skills and experience',
    progress: 75,
    reward: '50 XP + Badge',
    type: 'profile' as const,
    isUnlocked: false,
    isCompleted: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders milestone card with basic props', () => {
      render(<VisualMilestoneCard {...defaultProps} />);
      
      expect(screen.getByText('Complete Profile')).toBeInTheDocument();
      expect(screen.getByText('Add your skills and experience')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Reward: 50 XP + Badge')).toBeInTheDocument();
    });

    test('displays correct progress bar width', () => {
      render(<VisualMilestoneCard {...defaultProps} progress={60} />);
      
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    test('shows due date when provided', () => {
      render(<VisualMilestoneCard {...defaultProps} dueDate="2025-09-15" />);
      
      expect(screen.getByText(/Due: Sep 15/)).toBeInTheDocument();
    });
  });

  describe('Milestone Types', () => {
    test('renders profile type with correct icon and color', () => {
      render(<VisualMilestoneCard {...defaultProps} type="profile" />);
      
      const iconContainer = screen.getByText('Complete Profile').previousSibling;
      expect(iconContainer).toHaveClass('from-blue-500', 'to-blue-600');
    });

    test('renders achievement type with correct styling', () => {
      render(<VisualMilestoneCard {...defaultProps} type="achievement" />);
      
      const iconContainer = screen.getByText('Complete Profile').previousSibling;
      expect(iconContainer).toHaveClass('from-yellow-500', 'to-yellow-600');
    });

    test('renders career type with correct styling', () => {
      render(<VisualMilestoneCard {...defaultProps} type="career" />);
      
      const iconContainer = screen.getByText('Complete Profile').previousSibling;
      expect(iconContainer).toHaveClass('from-green-500', 'to-green-600');
    });

    test('renders social type with correct styling', () => {
      render(<VisualMilestoneCard {...defaultProps} type="social" />);
      
      const iconContainer = screen.getByText('Complete Profile').previousSibling;
      expect(iconContainer).toHaveClass('from-purple-500', 'to-purple-600');
    });
  });

  describe('Completion States', () => {
    test('shows completed state correctly', () => {
      render(<VisualMilestoneCard {...defaultProps} isCompleted={true} progress={100} />);
      
      expect(screen.getByText('Complete Profile')).toHaveClass('text-success');
      expect(screen.getByText('Earned!')).toBeInTheDocument();
    });

    test('shows claimable state with claim button', () => {
      const mockOnClaim = jest.fn();
      render(
        <VisualMilestoneCard 
          {...defaultProps} 
          isCompleted={true} 
          isUnlocked={false}
          progress={100}
          onClaim={mockOnClaim}
        />
      );
      
      const claimButton = screen.getByText('Claim Reward');
      expect(claimButton).toBeInTheDocument();
      
      fireEvent.click(claimButton);
      expect(mockOnClaim).toHaveBeenCalledTimes(1);
    });

    test('shows in progress state correctly', () => {
      render(<VisualMilestoneCard {...defaultProps} progress={45} />);
      
      expect(screen.getByText('45% Complete')).toBeInTheDocument();
    });
  });

  describe('Overdue Functionality', () => {
    test('shows overdue status for past due dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      render(
        <VisualMilestoneCard 
          {...defaultProps} 
          dueDate={pastDate.toISOString()}
          isCompleted={false}
        />
      );
      
      expect(screen.getByText('(Overdue)')).toBeInTheDocument();
      expect(screen.getByText('Complete Profile')).toHaveClass('text-error');
    });

    test('does not show overdue for completed milestones', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      render(
        <VisualMilestoneCard 
          {...defaultProps} 
          dueDate={pastDate.toISOString()}
          isCompleted={true}
        />
      );
      
      expect(screen.queryByText('(Overdue)')).not.toBeInTheDocument();
    });
  });

  describe('Progress Threshold Features', () => {
    test('shows achievement preview at 75% progress', () => {
      render(<VisualMilestoneCard {...defaultProps} progress={75} />);
      
      expect(screen.getByText('Almost there! Complete to unlock your achievement badge')).toBeInTheDocument();
    });

    test('does not show achievement preview below 75% progress', () => {
      render(<VisualMilestoneCard {...defaultProps} progress={70} />);
      
      expect(screen.queryByText('Almost there! Complete to unlock your achievement badge')).not.toBeInTheDocument();
    });

    test('does not show achievement preview for completed milestones', () => {
      render(<VisualMilestoneCard {...defaultProps} progress={100} isCompleted={true} />);
      
      expect(screen.queryByText('Almost there! Complete to unlock your achievement badge')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper button roles and labels', () => {
      const mockOnClaim = jest.fn();
      render(
        <VisualMilestoneCard 
          {...defaultProps} 
          isCompleted={true} 
          isUnlocked={false}
          onClaim={mockOnClaim}
        />
      );
      
      const claimButton = screen.getByRole('button', { name: /claim reward/i });
      expect(claimButton).toBeInTheDocument();
    });

    test('has proper text contrast for different states', () => {
      render(<VisualMilestoneCard {...defaultProps} isCompleted={true} />);
      
      expect(screen.getByText('Complete Profile')).toHaveClass('text-success');
    });
  });

  describe('Custom Classes', () => {
    test('applies custom className', () => {
      render(<VisualMilestoneCard {...defaultProps} className="custom-class" />);
      
      const container = screen.getByText('Complete Profile').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Reward System', () => {
    test('displays different reward types', () => {
      render(<VisualMilestoneCard {...defaultProps} reward="100 XP + Premium Badge" />);
      
      expect(screen.getByText('Reward: 100 XP + Premium Badge')).toBeInTheDocument();
    });

    test('handles missing onClaim handler gracefully', () => {
      render(
        <VisualMilestoneCard 
          {...defaultProps} 
          isCompleted={true} 
          isUnlocked={false}
        />
      );
      
      expect(screen.queryByText('Claim Reward')).not.toBeInTheDocument();
    });
  });
});