import React from 'react';
import { motion } from 'framer-motion';
import { FONT_SIZE_OPTIONS } from '../utils/settingsConstants';

interface FontSizeSliderProps {
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  label?: string;
  description?: string;
}

const FontSizeSlider: React.FC<FontSizeSliderProps> = ({
  fontSize,
  onFontSizeChange,
  label,
  description,
}) => {
  const currentOption = FONT_SIZE_OPTIONS.find(option => option.value === fontSize);
  const currentIndex = FONT_SIZE_OPTIONS.findIndex(option => option.value === fontSize);

  return (
    <div className="space-y-4">
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
      
      {/* Slider */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Small</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Large</span>
        </div>
        
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentIndex + 1) / FONT_SIZE_OPTIONS.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-600 dark:border-blue-500 rounded-full shadow-sm -translate-y-1/2 cursor-pointer"
            initial={{ left: 0 }}
            animate={{ 
              left: `${(currentIndex / (FONT_SIZE_OPTIONS.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const containerWidth = 100;
              const percentage = (info.point.x / containerWidth) * 100;
              const newIndex = Math.round((percentage / 100) * (FONT_SIZE_OPTIONS.length - 1));
              const clampedIndex = Math.max(0, Math.min(newIndex, FONT_SIZE_OPTIONS.length - 1));
              onFontSizeChange(FONT_SIZE_OPTIONS[clampedIndex].value);
            }}
          />
        </div>
        
        {/* Click areas for each option */}
        <div className="absolute top-0 left-0 right-0 h-2 flex justify-between">
          {FONT_SIZE_OPTIONS.map((_, index) => (
            <button
              key={index}
              className="w-4 h-4 -mt-1"
              onClick={() => onFontSizeChange(FONT_SIZE_OPTIONS[index].value)}
            />
          ))}
        </div>
      </div>
      
      {/* Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
        <p 
          className="text-gray-900 dark:text-white transition-all duration-300"
          style={{ fontSize: currentOption?.size }}
        >
          This is how your text will appear with {currentOption?.label.toLowerCase()} font size.
        </p>
      </div>
      
      {/* Size labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {FONT_SIZE_OPTIONS.map((option) => (
          <span
            key={option.value}
            className={`cursor-pointer transition-colors ${
              fontSize === option.value 
                ? 'text-blue-600 dark:text-blue-400 font-medium' 
                : 'hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => onFontSizeChange(option.value)}
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FontSizeSlider;
