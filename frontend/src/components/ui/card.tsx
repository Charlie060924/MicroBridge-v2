import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  headerAction
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            {Icon && (
              <div className="p-2 bg-neutral-light rounded-lg mr-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-black">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-700 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && (
            <div className="flex items-center">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Additional Card component variants for better UX
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex items-center justify-between p-6 pb-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <h3 className={`text-lg font-semibold text-black ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };
export default Card;
