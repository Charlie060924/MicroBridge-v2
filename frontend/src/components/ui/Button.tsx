import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-primary hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'text-white bg-secondary hover:brightness-90 focus:ring-secondary shadow-sm hover:shadow-md',
    success: 'text-white bg-success hover:brightness-90 focus:ring-success shadow-sm hover:shadow-md',
    warning: 'text-black bg-warning hover:brightness-90 focus:ring-warning shadow-sm hover:shadow-md',
    error: 'text-white bg-error hover:brightness-90 focus:ring-error shadow-sm hover:shadow-md',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary',
    outline: 'text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      {...props}
    >
      {loading && (
        <motion.div
          className={`${iconSizes[size]} mr-2`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizes[size]} mr-2`} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes[size]} ml-2`} />
      )}
    </motion.button>
  );
};

export { Button };
export default Button;
export type { ButtonProps };
