import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GitHubImportModal from '../GitHubImportModal';
import { GitHubService } from '../../services/githubService';

// Mock dependencies
jest.mock('../../services/githubService');
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

const mockGitHubService = GitHubService as jest.Mocked<typeof GitHubService>;

describe('GitHubImportModal', () => {
  const mockOnClose = jest.fn();
  const mockOnImport = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onImport: mockOnImport,
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockGitHubService.parseRepositoryUrl.mockReturnValue({
      owner: 'testuser',
      repo: 'test-repo'
    });

    mockGitHubService.createMockRepository.mockReturnValue({
      name: 'test-repo',
      description: 'A test repository',
      language: 'JavaScript',
      topics: ['react', 'typescript'],
      html_url: 'https://github.com/testuser/test-repo',
      clone_url: 'https://github.com/testuser/test-repo.git',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      homepage: 'https://testuser.github.io/test-repo',
      stargazers_count: 42,
      forks_count: 8,
      size: 1024,
      default_branch: 'main'
    });

    mockGitHubService.determineCategory.mockReturnValue('web-development');
    mockGitHubService.extractTechnologies.mockReturnValue(['JavaScript', 'React', 'TypeScript']);
  });

  describe('Initial State', () => {
    test('renders input step initially', () => {
      render(<GitHubImportModal {...defaultProps} />);

      expect(screen.getByText('Import from GitHub')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('https://github.com/username/repository-name')).toBeInTheDocument();
      expect(screen.getByText('💡 What we\'ll import')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
      render(<GitHubImportModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('URL Validation', () => {
    test('shows error for empty URL', async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      expect(screen.getByText('Please enter a GitHub repository URL')).toBeInTheDocument();
    });

    test('shows error for invalid URL format', async () => {
      mockGitHubService.parseRepositoryUrl.mockReturnValue(null);

      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'invalid-url' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      expect(screen.getByText('Invalid GitHub URL format. Please enter a valid repository URL.')).toBeInTheDocument();
    });

    test('accepts valid GitHub URL', async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(mockGitHubService.parseRepositoryUrl).toHaveBeenCalledWith('https://github.com/testuser/test-repo');
      });
    });
  });

  describe('Repository Fetching', () => {
    test('shows loading state during fetch', async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      expect(screen.getByText('Fetching...')).toBeInTheDocument();
    });

    test('transitions to preview step on successful fetch', async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByText('Repository found!')).toBeInTheDocument();
        expect(screen.getByText('Test Repo')).toBeInTheDocument();
        expect(screen.getByText('A test repository')).toBeInTheDocument();
      });
    });

    test('handles fetch error gracefully', async () => {
      mockGitHubService.createMockRepository.mockImplementation(() => {
        throw new Error('API Error');
      });

      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch repository data. Please check the URL and try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Preview Step', () => {
    beforeEach(async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByText('Repository found!')).toBeInTheDocument();
      });
    });

    test('displays repository information', () => {
      expect(screen.getByText('Test Repo')).toBeInTheDocument();
      expect(screen.getByText('A test repository')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    test('shows external link to repository', () => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://github.com/testuser/test-repo');
      expect(link).toHaveAttribute('target', '_blank');
    });

    test('shows import button', () => {
      expect(screen.getByText('Import Project')).toBeInTheDocument();
    });
  });

  describe('Project Import', () => {
    beforeEach(async () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(screen.getByText('Repository found!')).toBeInTheDocument();
      });
    });

    test('calls onImport with correct project data', async () => {
      mockOnImport.mockResolvedValue(undefined);

      const importButton = screen.getByText('Import Project');
      fireEvent.click(importButton);

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledWith({
          title: 'Test Repo',
          description: 'A test repository',
          category: 'web-development',
          technologies: ['JavaScript', 'React', 'TypeScript'],
          images: [],
          githubUrl: 'https://github.com/testuser/test-repo',
          liveUrl: 'https://testuser.github.io/test-repo',
          featured: false,
          dateCompleted: '2024-03-01'
        });
      });
    });

    test('shows importing state', async () => {
      mockOnImport.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      const importButton = screen.getByText('Import Project');
      fireEvent.click(importButton);

      expect(screen.getByText('Importing your project...')).toBeInTheDocument();
    });

    test('closes modal on successful import', async () => {
      mockOnImport.mockResolvedValue(undefined);

      const importButton = screen.getByText('Import Project');
      fireEvent.click(importButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    test('handles import error', async () => {
      mockOnImport.mockRejectedValue(new Error('Import failed'));

      const importButton = screen.getByText('Import Project');
      fireEvent.click(importButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to import project. Please try again.')).toBeInTheDocument();
      });

      // Should stay in preview step
      expect(screen.getByText('Import Project')).toBeInTheDocument();
    });
  });

  describe('Modal Controls', () => {
    test('closes modal when cancel is clicked', () => {
      render(<GitHubImportModal {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('resets state when modal is closed and reopened', async () => {
      const { rerender } = render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('https://github.com/username/repository-name');
      fireEvent.change(input, { target: { value: 'https://github.com/testuser/test-repo' } });

      // Close modal
      rerender(<GitHubImportModal {...defaultProps} isOpen={false} />);

      // Reopen modal
      rerender(<GitHubImportModal {...defaultProps} isOpen={true} />);

      // Should be back to input step with empty URL
      expect(screen.getByPlaceholderText('https://github.com/username/repository-name')).toHaveValue('');
      expect(screen.queryByText('Repository found!')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('applies appropriate size class to modal', () => {
      render(<GitHubImportModal {...defaultProps} />);
      // This would be tested via the Modal component props in a real scenario
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      render(<GitHubImportModal {...defaultProps} />);

      const input = screen.getByLabelText(/GitHub Repository URL/i);
      expect(input).toBeInTheDocument();
    });

    test('shows error messages with proper accessibility', () => {
      render(<GitHubImportModal {...defaultProps} />);

      const fetchButton = screen.getByText('Fetch Repository');
      fireEvent.click(fetchButton);

      const errorMessage = screen.getByText('Please enter a GitHub repository URL');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});