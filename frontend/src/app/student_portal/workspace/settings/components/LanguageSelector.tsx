import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../utils/settingsConstants';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  label?: string;
  description?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  label,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = LANGUAGE_OPTIONS.find(option => option.value === selectedLanguage);

  return (
    <div className="space-y-3">
      {(label || description) && (
        <div>
          {label && (
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="text-lg mr-2">{selectedOption?.flag}</span>
            <span className="text-gray-900 dark:text-white">{selectedOption?.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
            >
              <div className="py-1">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onLanguageChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedLanguage === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="text-lg">{option.flag}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageSelector;
