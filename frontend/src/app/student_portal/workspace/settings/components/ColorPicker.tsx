import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ACCENT_COLORS } from '../utils/settingsConstants';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  label?: string;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  label,
  description,
}) => {
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
      
      <div className="flex flex-wrap gap-3">
        {ACCENT_COLORS.map((colorOption) => (
          <motion.button
            key={colorOption.value}
            onClick={() => onColorChange(colorOption.value)}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all duration-200
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${selectedColor === colorOption.value 
                ? 'border-gray-900 dark:border-white shadow-lg' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
            style={{ backgroundColor: colorOption.color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedColor === colorOption.value && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white drop-shadow-sm" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Selected: {ACCENT_COLORS.find(c => c.value === selectedColor)?.label}
      </div>
    </div>
  );
};

export default ColorPicker;
