import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProcessRoadmap from '../ProcessRoadmap/index';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe('ProcessRoadmap Component', () => {
  beforeEach(() => {
    render(<ProcessRoadmap />);
  });

  describe('Initial Render', () => {
    it('renders the main heading', () => {
      expect(screen.getByText('How MicroBridge Works')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      expect(screen.getByText(/A simple step-by-step process connecting students/)).toBeInTheDocument();
    });

    it('renders user type toggle buttons', () => {
      expect(screen.getByText('For Students')).toBeInTheDocument();
      expect(screen.getByText('For Companies')).toBeInTheDocument();
    });

    it('defaults to student view', () => {
      const studentButton = screen.getByText('For Students');
      expect(studentButton).toHaveClass('bg-secondary text-white shadow-sm');
    });
  });

  describe('Student Roadmap', () => {
    it('displays student-specific steps', () => {
      expect(screen.getByText('Discover Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Smart Matching & Application')).toBeInTheDocument();
      expect(screen.getByText('Collaborate & Deliver')).toBeInTheDocument();
      expect(screen.getByText('Build Experience & Network')).toBeInTheDocument();
    });

    it('displays student-specific step descriptions', () => {
      expect(screen.getByText(/Browse real projects from vetted startups/)).toBeInTheDocument();
      expect(screen.getByText(/Our algorithm matches you with relevant projects/)).toBeInTheDocument();
    });

    it('displays student-focused call-to-action buttons', () => {
      expect(screen.getByText('Get Started as Student')).toBeInTheDocument();
      expect(screen.getByText('Browse Projects')).toBeInTheDocument();
    });

    it('has correct links for student CTAs', () => {
      const studentSignupLink = screen.getByText('Get Started as Student').closest('a');
      const browseProjectsLink = screen.getByText('Browse Projects').closest('a');

      expect(studentSignupLink).toHaveAttribute('href', '/auth/signup');
      expect(browseProjectsLink).toHaveAttribute('href', '/projects');
    });
  });

  describe('Employer Roadmap', () => {
    beforeEach(() => {
      const employerButton = screen.getByText('For Companies');
      fireEvent.click(employerButton);
    });

    it('switches to employer view when employer button is clicked', () => {
      const employerButton = screen.getByText('For Companies');
      expect(employerButton).toHaveClass('bg-warning text-black shadow-sm');
    });

    it('displays employer-specific steps', async () => {
      await waitFor(() => {
        expect(screen.getByText('Post Projects')).toBeInTheDocument();
        expect(screen.getByText('Smart Matching & Review')).toBeInTheDocument();
        expect(screen.getByText('Collaborate & Manage')).toBeInTheDocument();
        expect(screen.getByText('Access Fresh Talent')).toBeInTheDocument();
      });
    });

    it('displays employer-specific step descriptions', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Share your real business challenges/)).toBeInTheDocument();
        expect(screen.getByText(/Our algorithm matches you with skilled students/)).toBeInTheDocument();
      });
    });

    it('displays employer-focused call-to-action buttons', async () => {
      await waitFor(() => {
        expect(screen.getByText('Post Your First Project')).toBeInTheDocument();
        expect(screen.getByText('Find Talent')).toBeInTheDocument();
      });
    });

    it('has correct links for employer CTAs', async () => {
      await waitFor(() => {
        const employerSignupLink = screen.getByText('Post Your First Project').closest('a');
        const findTalentLink = screen.getByText('Find Talent').closest('a');

        expect(employerSignupLink).toHaveAttribute('href', '/auth/employer-signup');
        expect(findTalentLink).toHaveAttribute('href', '/talent');
      });
    });
  });

  describe('User Type Toggle Functionality', () => {
    it('switches between student and employer views', async () => {
      // Initially should show student content
      expect(screen.getByText('Discover Opportunities')).toBeInTheDocument();

      // Click employer button
      const employerButton = screen.getByText('For Companies');
      fireEvent.click(employerButton);

      // Should show employer content
      await waitFor(() => {
        expect(screen.getByText('Post Projects')).toBeInTheDocument();
        expect(screen.queryByText('Discover Opportunities')).not.toBeInTheDocument();
      });

      // Click student button
      const studentButton = screen.getByText('For Students');
      fireEvent.click(studentButton);

      // Should show student content again
      await waitFor(() => {
        expect(screen.getByText('Discover Opportunities')).toBeInTheDocument();
        expect(screen.queryByText('Post Projects')).not.toBeInTheDocument();
      });
    });
  });

  describe('Step Cards Structure', () => {
    it('displays step numbers correctly', () => {
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText('04')).toBeInTheDocument();
    });

    it('displays user type badges for each step', () => {
      const badges = screen.getAllByText('For Students');
      // Should have at least 4 badges (one for each step) plus the toggle button
      expect(badges.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Responsive Design Classes', () => {
    it('has responsive grid layout classes', () => {
      const container = document.querySelector('.grid');
      expect(container).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('has responsive padding classes', () => {
      const section = document.querySelector('section');
      expect(section).toHaveClass('py-16', 'lg:py-20');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('How MicroBridge Works');

      const stepHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(stepHeadings.length).toBe(4); // Should have 4 step headings
    });

    it('has clickable buttons for user type toggle', () => {
      const studentButton = screen.getByRole('button', { name: 'For Students' });
      const employerButton = screen.getByRole('button', { name: 'For Companies' });

      expect(studentButton).toBeInTheDocument();
      expect(employerButton).toBeInTheDocument();
    });

    it('has proper link accessibility', () => {
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Animation and Interaction', () => {
    it('applies hover effects on step cards', () => {
      const stepCards = document.querySelectorAll('.hover\\:shadow-md');
      expect(stepCards.length).toBe(4); // Should have 4 step cards with hover effects
    });

    it('has transition classes for smooth interactions', () => {
      const toggleButtons = screen.getByText('For Students').parentElement?.children;
      expect(toggleButtons?.[0]).toHaveClass('transition-all', 'duration-300');
      expect(toggleButtons?.[1]).toHaveClass('transition-all', 'duration-300');
    });
  });
});