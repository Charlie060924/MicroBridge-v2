"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star,
  Award,
  Zap,
  Eye,
  Lock
} from 'lucide-react';

export type VerificationStatus = 'verified' | 'pending' | 'requires_action' | 'unverified';
export type VerificationType = 'identity' | 'education' | 'skills' | 'company' | 'payment' | 'background';

interface VerificationBadgeProps {
  type: VerificationType;
  status: VerificationStatus;
  level?: 'basic' | 'enhanced' | 'premium';
  details?: string;
  onAction?: () => void;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  status,
  level = 'basic',
  details,
  onAction,
  showTooltip = true,
  size = 'md',
  className = ''
}) => {
  const getVerificationIcon = () => {
    switch (type) {
      case 'identity':
        return Shield;
      case 'education':
        return Award;
      case 'skills':
        return Star;
      case 'company':
        return CheckCircle;
      case 'payment':
        return Lock;
      case 'background':
        return Eye;
      default:
        return Shield;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'requires_action':
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return level === 'premium' 
          ? 'from-yellow-500 to-yellow-600' 
          : level === 'enhanced'
            ? 'from-blue-500 to-blue-600'
            : 'from-success to-green-600';
      case 'pending':
        return 'from-warning to-orange-500';
      case 'requires_action':
        return 'from-error to-red-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'identity':
        return 'Identity';
      case 'education':
        return 'Education';
      case 'skills':
        return 'Skills';
      case 'company':
        return 'Company';
      case 'payment':
        return 'Payment';
      case 'background':
        return 'Background';
      default:
        return 'Verification';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return level === 'premium' ? 'Premium Verified' : level === 'enhanced' ? 'Enhanced Verified' : 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'requires_action':
        return 'Action Required';
      default:
        return 'Not Verified';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const IconComponent = getVerificationIcon();
  const StatusIconComponent = getStatusIcon();

  const badgeContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center space-x-1.5 bg-gradient-to-r ${getStatusColor()} text-white font-semibold rounded-full shadow-sm ${getSizeClasses()} ${className}`}
    >
      {/* Primary verification icon */}
      <IconComponent className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      
      {/* Status indicator */}
      <StatusIconComponent className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`} />
      
      {/* Level indicator for premium/enhanced */}
      {level !== 'basic' && status === 'verified' && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className={`${size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} text-yellow-200`} />
        </motion.div>
      )}
      
      <span>
        {size === 'lg' ? getStatusText() : getTypeLabel()}
      </span>
    </motion.div>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <div className="relative group">
      {badgeContent}
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        whileHover={{ opacity: 1, y: -5, scale: 1 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <div className="font-semibold">{getTypeLabel()} {getStatusText()}</div>
        {details && <div className="text-gray-300 mt-1">{details}</div>}
        
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </motion.div>

      {/* Action button for pending/requires_action states */}
      {(status === 'pending' || status === 'requires_action') && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
            status === 'requires_action' 
              ? 'bg-error text-white hover:bg-red-600' 
              : 'bg-warning text-white hover:bg-orange-500'
          } transition-colors duration-200`}
        >
          {status === 'requires_action' ? 'Fix Now' : 'View Status'}
        </motion.button>
      )}
    </div>
  );
};

export default VerificationBadge;