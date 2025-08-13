"use client";
import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'completed' | 'failed' | 'processing' | 'secured' | 'released';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: CheckCircle,
          text: 'Completed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: Clock,
          text: 'Pending'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          icon: Clock,
          text: 'Processing'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: XCircle,
          text: 'Failed'
        };
      case 'secured':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          icon: CheckCircle,
          text: 'Secured'
        };
      case 'released':
        return {
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
          icon: CheckCircle,
          text: 'Released'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: AlertCircle,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${getSizeClasses()}`}>
      {showIcon && <IconComponent className={getIconSize()} />}
      {config.text}
    </span>
  );
};

export default PaymentStatusBadge;
