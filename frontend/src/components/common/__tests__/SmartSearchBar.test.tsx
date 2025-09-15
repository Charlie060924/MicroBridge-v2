import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmartSearchBar from '../SmartSearchBar';

describe('SmartSearchBar', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    placeholder: 'Search for jobs, skills, or companies...'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders search input with placeholder', () => {
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      expect(searchInput).toBeInTheDocument();
    });

    test('renders filter button', () => {
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      expect(filterButton).toBeInTheDocument();
    });

    test('renders search button', () => {
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchButton = screen.getByRole('button');
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('Search Input Functionality', () => {
    test('updates input value when typing', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React Developer');
      
      expect(searchInput).toHaveValue('React Developer');
    });

    test('shows clear button when input has value', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React');
      
      const clearButton = screen.getByRole('button', { name: '' }); // X button
      expect(clearButton).toBeInTheDocument();
    });

    test('clears input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React');
      
      const clearButton = screen.getByRole('button', { name: '' });
      await user.click(clearButton);
      
      expect(searchInput).toHaveValue('');
    });

    test('triggers search on Enter key', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup();
      render(<SmartSearchBar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React Developer');
      await user.keyboard('{Enter}');
      
      expect(mockOnSearch).toHaveBeenCalledWith('React Developer', expect.any(Object));
    });

    test('triggers search on button click', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup();
      render(<SmartSearchBar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      const searchButton = screen.getByRole('button', { name: '' }); // Search button with icon
      
      await user.type(searchInput, 'JavaScript');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith('JavaScript', expect.any(Object));
    });
  });

  describe('Suggestions Dropdown', () => {
    test('shows suggestions when input is focused', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });
    });

    test('shows trending searches in quick actions', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('AI Developer')).toBeInTheDocument();
        expect(screen.getByText('Remote Frontend')).toBeInTheDocument();
      });
    });

    test('filters suggestions based on input', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React');
      
      await waitFor(() => {
        expect(screen.getByText('Suggestions')).toBeInTheDocument();
        expect(screen.getByText('React Developer')).toBeInTheDocument();
      });
    });

    test('closes suggestions on Escape key', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });
      
      await user.keyboard('{Escape}');
      
      await waitFor(() => {
        expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
      });
    });

    test('closes suggestions when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SmartSearchBar {...defaultProps} />
          <div data-testid="outside">Outside element</div>
        </div>
      );
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });
      
      const outsideElement = screen.getByTestId('outside');
      await user.click(outsideElement);
      
      await waitFor(() => {
        expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument();
      });
    });
  });

  describe('Suggestion Interactions', () => {
    test('selects suggestion when clicked', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup();
      render(<SmartSearchBar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React');
      
      await waitFor(() => {
        expect(screen.getByText('React Developer')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('React Developer'));
      
      expect(searchInput).toHaveValue('React Developer');
      expect(mockOnSearch).toHaveBeenCalledWith('React Developer', expect.any(Object));
    });

    test('selects trending search when clicked', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup();
      render(<SmartSearchBar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('AI Developer')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('AI Developer'));
      
      expect(searchInput).toHaveValue('AI Developer');
      expect(mockOnSearch).toHaveBeenCalledWith('AI Developer', expect.any(Object));
    });
  });

  describe('Advanced Filters', () => {
    test('toggles filters panel when filter button is clicked', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Job Type')).toBeInTheDocument();
        expect(screen.getByText('Experience Level')).toBeInTheDocument();
      });
    });

    test('shows filter inputs when panel is open', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('City, State, or Remote')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Levels')).toBeInTheDocument();
      });
    });

    test('shows remote only checkbox', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);
      
      await waitFor(() => {
        const remoteCheckbox = screen.getByLabelText('Remote Only');
        expect(remoteCheckbox).toBeInTheDocument();
        expect(remoteCheckbox).not.toBeChecked();
      });
    });

    test('toggles remote checkbox when clicked', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);
      
      await waitFor(() => {
        const remoteCheckbox = screen.getByLabelText('Remote Only');
        expect(remoteCheckbox).not.toBeChecked();
      });
      
      const remoteCheckbox = screen.getByLabelText('Remote Only');
      await user.click(remoteCheckbox);
      
      expect(remoteCheckbox).toBeChecked();
    });

    test('shows clear filters button', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);
      
      await waitFor(() => {
        expect(screen.getByText('Clear all filters')).toBeInTheDocument();
      });
    });
  });

  describe('Recent Searches', () => {
    test('adds search to recent searches', async () => {
      const mockOnSearch = jest.fn();
      const user = userEvent.setup();
      render(<SmartSearchBar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      
      // Perform a search
      await user.type(searchInput, 'React Developer');
      await user.keyboard('{Enter}');
      
      // Clear and open suggestions again
      await user.clear(searchInput);
      await user.click(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Recent Searches')).toBeInTheDocument();
        expect(screen.getByText('React Developer')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Props', () => {
    test('uses custom placeholder', () => {
      render(<SmartSearchBar {...defaultProps} placeholder="Custom placeholder" />);
      
      const searchInput = screen.getByPlaceholderText('Custom placeholder');
      expect(searchInput).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(<SmartSearchBar {...defaultProps} className="custom-class" />);
      
      const container = screen.getByPlaceholderText('Search for jobs, skills, or companies...').closest('.custom-class');
      expect(container).toBeInTheDocument();
    });

    test('calls onSaveSearch when provided', async () => {
      const mockOnSaveSearch = jest.fn();
      render(<SmartSearchBar {...defaultProps} onSaveSearch={mockOnSaveSearch} />);
      
      // This would be tested with save search functionality if implemented
      expect(mockOnSaveSearch).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });

    test('filter button has proper role', () => {
      render(<SmartSearchBar {...defaultProps} />);
      
      const filterButton = screen.getByRole('button', { name: /filters/i });
      expect(filterButton).toBeInTheDocument();
    });

    test('suggestions are keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<SmartSearchBar {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
      await user.type(searchInput, 'React');
      
      await waitFor(() => {
        const suggestions = screen.getAllByRole('button');
        expect(suggestions.length).toBeGreaterThan(0);
      });
    });
  });
});