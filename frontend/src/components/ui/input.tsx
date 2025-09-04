import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  error?: string;
  success?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  icon: Icon,
  iconPosition = 'left',
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 min-h-[48px]';
  
  const stateClasses = {
    default: 'border-gray-200 bg-white text-black placeholder:text-gray-500 focus:ring-primary focus:border-primary',
    error: 'border-error bg-white text-black placeholder:text-gray-500 focus:ring-error focus:border-error',
    success: 'border-success bg-white text-black placeholder:text-gray-500 focus:ring-success focus:border-success',
    disabled: 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
  };

  const getStateClass = () => {
    if (props.disabled) return stateClasses.disabled;
    if (error) return stateClasses.error;
    if (success) return stateClasses.success;
    return stateClasses.default;
  };

  const iconClasses = 'absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400';
  const paddingClasses = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${getStateClass()} ${paddingClasses} ${className}`}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          {...props}
        />
        
        {Icon && iconPosition === 'left' && (
          <Icon className={`${iconClasses} left-3`} />
        )}
        
        {Icon && iconPosition === 'right' && (
          <Icon className={`${iconClasses} right-3`} />
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${
            error 
              ? 'text-error' 
              : success 
                ? 'text-success' 
                : 'text-gray-500'
          }`}
        >
          {error || success || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
