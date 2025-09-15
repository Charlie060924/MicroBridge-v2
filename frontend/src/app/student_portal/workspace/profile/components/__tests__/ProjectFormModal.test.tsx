import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectFormModal from '../ProjectFormModal';
import { Project } from '../types';

// Mock dependencies
jest.mock('@/components/ui/modal', () => {
  return function MockModal({ children, isOpen, title, footer }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
        <div data-testid="modal-footer">{footer}</div>
      </div>
    );
  };
});

jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, onClick, loading, disabled, variant }: any) {
    return (
      <button 
        onClick={onClick}
        disabled={loading || disabled}
        data-loading={loading}
        data-variant={variant}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  };
});

jest.mock('../forms/ProjectBasicInfoForm', () => {
  return function MockProjectBasicInfoForm({ formData, onChange, errors }: any) {
    return (
      <div data-testid="basic-info-form">
        <input
          data-testid="title-input"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
        <textarea
          data-testid="description-input"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
        <select
          data-testid="category-select"
          value={formData.category}
          onChange={(e) => onChange('category', e.target.value)}
        >
          <option value="web-development">Web Development</option>
          <option value="mobile-development">Mobile Development</option>
        </select>
        {errors.title && <span data-testid="title-error">{errors.title}</span>}
        {errors.description && <span data-testid="description-error">{errors.description}</span>}
      </div>
    );
  };
});

jest.mock('../forms/ProjectTechnologiesForm', () => {
  return function MockProjectTechnologiesForm({ technologies, onChange }: any) {
    return (
      <div data-testid="technologies-form">
        <input
          data-testid="tech-input"
          onChange={(e) => onChange([...technologies, e.target.value])}
        />
        <div data-testid="selected-technologies">
          {technologies.map((tech: string, index: number) => (
            <span key={index} data-testid={`tech-${index}`}>{tech}</span>
          ))}
        </div>
      </div>
    );
  };
});

jest.mock('../forms/ProjectLinksForm', () => {
  return function MockProjectLinksForm({ githubUrl, liveUrl, featured, onGithubChange, onLiveUrlChange, onFeaturedChange, errors }: any) {
    return (
      <div data-testid="links-form">
        <input
          data-testid="github-input"
          value={githubUrl}
          onChange={(e) => onGithubChange(e.target.value)}
        />
        <input
          data-testid="live-url-input"
          value={liveUrl}
          onChange={(e) => onLiveUrlChange(e.target.value)}
        />
        <input
          type="checkbox"
          data-testid="featured-checkbox"
          checked={featured}
          onChange={(e) => onFeaturedChange(e.target.checked)}
        />
        {errors.githubUrl && <span data-testid="github-error">{errors.githubUrl}</span>}
        {errors.liveUrl && <span data-testid="live-url-error">{errors.liveUrl}</span>}
      </div>
    );
  };
});

describe('ProjectFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('renders add project modal by default', () => {
      render(<ProjectFormModal {...defaultProps} />);

      expect(screen.getByText('Add New Project')).toBeInTheDocument();
      expect(screen.getByText('Add Project')).toBeInTheDocument();
    });

    test('renders edit project modal with initial data', () => {
      const initialData: Partial<Project> = {
        title: 'Test Project',
        description: 'Test Description',
        category: 'web-development',
        technologies: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/repo',
        liveUrl: 'https://test.com',
        featured: true
      };

      render(<ProjectFormModal {...defaultProps} initialData={initialData} />);

      expect(screen.getByText('Edit Project')).toBeInTheDocument();
      expect(screen.getByText('Update Project')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
      render(<ProjectFormModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error for empty title', async () => {
      render(<ProjectFormModal {...defaultProps} />);

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('title-error')).toHaveTextContent('Project title is required');
      });
    });

    test('shows error for empty description', async () => {
      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('description-error')).toHaveTextContent('Project description is required');
      });
    });

    test('shows error for invalid GitHub URL', async () => {
      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');
      const githubInput = screen.getByTestId('github-input');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descInput, { target: { value: 'Test Description' } });
      fireEvent.change(githubInput, { target: { value: 'invalid-url' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('github-error')).toHaveTextContent('Please enter a valid GitHub URL');
      });
    });

    test('shows error for invalid live URL', async () => {
      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');
      const liveUrlInput = screen.getByTestId('live-url-input');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descInput, { target: { value: 'Test Description' } });
      fireEvent.change(liveUrlInput, { target: { value: 'invalid-url' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('live-url-error')).toHaveTextContent('Please enter a valid live demo URL');
      });
    });

    test('accepts valid URLs', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');
      const githubInput = screen.getByTestId('github-input');
      const liveUrlInput = screen.getByTestId('live-url-input');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descInput, { target: { value: 'Test Description' } });
      fireEvent.change(githubInput, { target: { value: 'https://github.com/test/repo' } });
      fireEvent.change(liveUrlInput, { target: { value: 'https://test.com' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    test('submits form with correct data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ProjectFormModal {...defaultProps} />);

      // Fill out form
      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');
      const categorySelect = screen.getByTestId('category-select');
      const githubInput = screen.getByTestId('github-input');
      const liveUrlInput = screen.getByTestId('live-url-input');
      const featuredCheckbox = screen.getByTestId('featured-checkbox');

      fireEvent.change(titleInput, { target: { value: 'My Project' } });
      fireEvent.change(descInput, { target: { value: 'Project Description' } });
      fireEvent.change(categorySelect, { target: { value: 'mobile-development' } });
      fireEvent.change(githubInput, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.change(liveUrlInput, { target: { value: 'https://demo.com' } });
      fireEvent.click(featuredCheckbox);

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'My Project',
          description: 'Project Description',
          category: 'mobile-development',
          technologies: [],
          images: [],
          githubUrl: 'https://github.com/user/repo',
          liveUrl: 'https://demo.com',
          featured: true,
          dateCompleted: expect.any(String)
        });
      });
    });

    test('shows loading state during submission', async () => {
      render(<ProjectFormModal {...defaultProps} isLoading={true} />);

      const submitButton = screen.getByText('Saving...');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('data-loading', 'true');
    });

    test('closes modal after successful submission', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descInput, { target: { value: 'Test Description' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    test('handles submission error gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      const descInput = screen.getByTestId('description-input');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(descInput, { target: { value: 'Test Description' } });

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Failed to submit project:', expect.any(Error));
      });

      // Modal should not close on error
      expect(mockOnClose).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('Form State Management', () => {
    test('updates form data when input changes', () => {
      render(<ProjectFormModal {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      expect(titleInput).toHaveValue('New Title');
    });

    test('clears error when field is corrected', () => {
      render(<ProjectFormModal {...defaultProps} />);

      // Trigger validation error
      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      expect(screen.getByTestId('title-error')).toBeInTheDocument();

      // Fix the error
      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });

      expect(screen.queryByTestId('title-error')).not.toBeInTheDocument();
    });

    test('manages technologies array correctly', () => {
      render(<ProjectFormModal {...defaultProps} />);

      const techInput = screen.getByTestId('tech-input');
      fireEvent.change(techInput, { target: { value: 'React' } });

      expect(screen.getByTestId('tech-0')).toHaveTextContent('React');
    });
  });

  describe('Modal Controls', () => {
    test('closes modal when cancel is clicked', () => {
      render(<ProjectFormModal {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('resets form when modal reopens', () => {
      const { rerender } = render(<ProjectFormModal {...defaultProps} />);

      // Fill out form
      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });

      // Close modal
      rerender(<ProjectFormModal {...defaultProps} isOpen={false} />);

      // Reopen modal
      rerender(<ProjectFormModal {...defaultProps} isOpen={true} />);

      // Form should be reset
      expect(screen.getByTestId('title-input')).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    test('renders all form sections', () => {
      render(<ProjectFormModal {...defaultProps} />);

      expect(screen.getByTestId('basic-info-form')).toBeInTheDocument();
      expect(screen.getByTestId('technologies-form')).toBeInTheDocument();
      expect(screen.getByTestId('links-form')).toBeInTheDocument();
    });

    test('form submission is prevented when validation fails', () => {
      render(<ProjectFormModal {...defaultProps} />);

      const submitButton = screen.getByText('Add Project');
      fireEvent.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});