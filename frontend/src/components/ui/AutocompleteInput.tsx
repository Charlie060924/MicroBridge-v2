'use client';
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

export interface AutocompleteOption {
  value: string;
  label: string;
  category?: string;
}

interface AutocompleteInputProps {
  options: AutocompleteOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowFreeText?: boolean;
  searchable?: boolean;
  groupByCategory?: boolean;
  onSelect?: (option: AutocompleteOption) => void;
  emptyMessage?: string;
  maxHeight?: string;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(({
  options,
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  className = '',
  allowFreeText = true,
  searchable = true,
  groupByCategory = false,
  onSelect,
  emptyMessage = 'No options found',
  maxHeight = '200px'
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options by category if needed
  const groupedOptions = groupByCategory
    ? filteredOptions.reduce((acc, option) => {
        const category = option.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(option);
        return acc;
      }, {} as Record<string, AutocompleteOption[]>)
    : { '': filteredOptions };

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    if (allowFreeText) {
      onChange(newValue);
    }
    
    if (!isOpen && newValue) {
      setIsOpen(true);
    }
    
    setHighlightedIndex(-1);
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    setSearchTerm(option.label);
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(option);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    const flatOptions = Object.values(groupedOptions).flat();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
          handleOptionSelect(flatOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const clearValue = () => {
    setSearchTerm('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={ref || inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-800 dark:text-white 
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            ${searchable ? 'pl-10' : 'pl-4'}
          `}
        />
        
        {/* Search icon */}
        {searchable && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        
        {/* Clear button */}
        {searchTerm && !disabled && (
          <button
            onClick={clearValue}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Dropdown arrow */}
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Options dropdown */}
      {isOpen && !disabled && (
        <div 
          ref={optionsRef}
          className={`
            absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
            rounded-lg shadow-lg overflow-hidden
          `}
          style={{ maxHeight }}
        >
          <div className="overflow-y-auto max-h-full">
            {Object.keys(groupedOptions).length === 0 || filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                {emptyMessage}
              </div>
            ) : (
              Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                <div key={category}>
                  {/* Category header */}
                  {groupByCategory && category && (
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                    </div>
                  )}
                  
                  {/* Options */}
                  {categoryOptions.map((option, optionIndex) => {
                    const globalIndex = Object.values(groupedOptions)
                      .flat()
                      .findIndex(opt => opt.value === option.value);
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option)}
                        className={`
                          w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                          ${globalIndex === highlightedIndex ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}
                        `}
                      >
                        <div className="truncate">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput;