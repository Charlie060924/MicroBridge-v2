'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, AlertCircle, CheckCircle, X } from 'lucide-react';

export type TooltipVariant = 'default' | 'info' | 'warning' | 'success' | 'help';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  position?: TooltipPosition;
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  className?: string;
  maxWidth?: string;
  showArrow?: boolean;
  interactive?: boolean;
  delay?: number;
}

const iconMap = {
  default: Info,
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  help: HelpCircle
};

const variantStyles = {
  default: 'bg-gray-900 text-white border-gray-700',
  info: 'bg-blue-600 text-white border-blue-500',
  warning: 'bg-amber-500 text-white border-amber-400',
  success: 'bg-green-600 text-white border-green-500',
  help: 'bg-purple-600 text-white border-purple-500'
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  variant = 'default',
  position = 'auto',
  trigger = 'hover',
  disabled = false,
  className = '',
  maxWidth = '300px',
  showArrow = true,
  interactive = false,
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [computedPosition, setComputedPosition] = useState<TooltipPosition>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!interactive || !isVisible) {
      setIsVisible(false);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') hideTooltip();
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };

  // Calculate optimal position
  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition: TooltipPosition = position;

    if (position === 'auto') {
      // Calculate which position has the most space
      const spaces = {
        top: triggerRect.top,
        bottom: viewport.height - triggerRect.bottom,
        left: triggerRect.left,
        right: viewport.width - triggerRect.right
      };

      optimalPosition = Object.entries(spaces).reduce((a, b) => 
        spaces[a[0] as TooltipPosition] > spaces[b[0] as TooltipPosition] ? a : b
      )[0] as TooltipPosition;
    }

    setComputedPosition(optimalPosition);
  }, [isVisible, position]);

  // Handle click outside for click trigger
  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        tooltipRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger, isVisible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipStyles = (): string => {
    const baseClasses = 'absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg border transition-all duration-200';
    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    return `${baseClasses} ${variantStyles[variant]} ${positionClasses[computedPosition]}`;
  };

  const getArrowStyles = (): string => {
    const arrowBase = 'absolute w-2 h-2 transform rotate-45';
    const arrowColors = {
      default: 'bg-gray-900 border-gray-700',
      info: 'bg-blue-600 border-blue-500',
      warning: 'bg-amber-500 border-amber-400',
      success: 'bg-green-600 border-green-500',
      help: 'bg-purple-600 border-purple-500'
    };

    const positions = {
      top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-t border-l',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2 border-b border-r',
      left: 'left-full top-1/2 transform -translate-y-1/2 translate-x-1/2 border-l border-b',
      right: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 border-r border-t'
    };

    return `${arrowBase} ${arrowColors[variant]} ${positions[computedPosition]}`;
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={getTooltipStyles()}
          style={{ maxWidth }}
          onMouseEnter={() => interactive && setIsVisible(true)}
          onMouseLeave={() => interactive && hideTooltip()}
        >
          {showArrow && <div className={getArrowStyles()} />}
          
          <div className="relative">
            {trigger === 'click' && (
              <button
                onClick={() => setIsVisible(false)}
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for simple help tooltips
interface HelpTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
  iconSize?: number;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  position = 'top',
  className = '',
  iconSize = 16
}) => {
  return (
    <Tooltip content={content} position={position} variant="help" className={className}>
      <HelpCircle 
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-help"
        size={iconSize}
      />
    </Tooltip>
  );
};

// Helper component for contextual guidance
interface GuidanceTooltipProps {
  title: string;
  description: string;
  tips?: string[];
  variant?: TooltipVariant;
  position?: TooltipPosition;
  children: React.ReactNode;
}

export const GuidanceTooltip: React.FC<GuidanceTooltipProps> = ({
  title,
  description,
  tips = [],
  variant = 'info',
  position = 'auto',
  children
}) => {
  const Icon = iconMap[variant];

  const content = (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm opacity-90 mt-1">{description}</div>
        </div>
      </div>
      
      {tips.length > 0 && (
        <div className="pt-2 border-t border-white/20">
          <div className="text-xs font-medium mb-1">Tips:</div>
          <ul className="text-xs space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      content={content}
      variant={variant}
      position={position}
      trigger="hover"
      interactive={true}
      maxWidth="320px"
    >
      {children}
    </Tooltip>
  );
};

export default Tooltip;