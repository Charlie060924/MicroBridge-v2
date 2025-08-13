"use client";
import React from 'react';
import { DollarSign, Calendar, User, Building } from 'lucide-react';

interface TransactionSummaryProps {
  transaction: {
    id: string;
    projectName: string;
    studentName?: string;
    employerName?: string;
    amount: number;
    deposit: number;
    date: string;
    status: 'pending' | 'completed' | 'failed' | 'processing';
    type: 'payment' | 'deposit' | 'refund';
  };
  showDetails?: boolean;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  transaction,
  showDetails = true
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'deposit':
        return <Building className="h-4 w-4" />;
      case 'refund':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon(transaction.type)}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Project:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {transaction.projectName}
          </span>
        </div>

        {transaction.studentName && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Student:</span>
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {transaction.studentName}
              </span>
            </div>
          </div>
        )}

        {transaction.employerName && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Employer:</span>
            <div className="flex items-center space-x-1">
              <Building className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {transaction.employerName}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${transaction.amount.toLocaleString()}
          </span>
        </div>

        {transaction.deposit > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Deposit:</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ${transaction.deposit.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {transaction.id.slice(0, 8)}...
            </span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionSummary;
