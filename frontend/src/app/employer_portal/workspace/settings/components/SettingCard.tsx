import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

const SettingCard: React.FC<SettingCardProps> = ({
  icon: Icon,
  title,
  description,
  children,
  isExpanded = true,
  onToggle,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.01] ${className}`}
    >
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-6 cursor-pointer ${onToggle ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {onToggle && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </div>
      
      {/* Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: 'easeOut' as const }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 space-y-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingCard;
