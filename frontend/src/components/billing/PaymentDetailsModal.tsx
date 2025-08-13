"use client";

import React from 'react';
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  User, 
  Building, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  FileText,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import Modal from '@/components/common/ui/modal';
import Button from '@/components/common/ui/Button';
import Badge from '@/components/common/ui/Badge';

interface PaymentDetails {
  id: string;
  projectName: string;
  studentName?: string;
  employerName?: string;
  amount: number;
  deposit?: number;
  status: string;
  date: string;
  dueDate?: string;
  transactionId?: string;
  paymentMethod?: string;
  planName?: string;
  subscriptionType?: string;
  failureReason?: string;
  retryInstructions?: string;
  notes?: string;
  payoutDetails?: {
    method: string;
    account: string;
    estimatedDate: string;
  };
}

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentDetails | null;
  role: 'student' | 'employer';
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
  role
}) => {
  if (!payment) return null;

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'released':
        return {
          variant: 'completed' as const,
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          description: 'Payment has been successfully processed'
        };
      case 'pending':
        return {
          variant: 'pending' as const,
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          description: 'Payment is awaiting processing'
        };
      case 'processing':
        return {
          variant: 'processing' as const,
          icon: Clock,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          description: 'Payment is being processed'
        };
      case 'confirmed':
      case 'secured':
        return {
          variant: 'secured' as const,
          icon: CheckCircle,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          description: 'Payment has been confirmed and secured'
        };
      case 'failed':
        return {
          variant: 'failed' as const,
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          description: 'Payment processing failed'
        };
      default:
        return {
          variant: 'default' as const,
          icon: Clock,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          description: 'Payment status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleSpecificInfo = () => {
    if (role === 'student') {
      return {
        counterpartLabel: 'Employer',
        counterpartName: payment.employerName,
        counterpartIcon: Building,
        amountLabel: 'Amount Received',
        amountColor: 'text-green-600 dark:text-green-400',
        additionalInfo: payment.payoutDetails ? {
          title: 'Payout Details',
          items: [
            { label: 'Method', value: payment.payoutDetails.method },
            { label: 'Account', value: payment.payoutDetails.account },
            { label: 'Estimated Date', value: formatDate(payment.payoutDetails.estimatedDate) }
          ]
        } : null
      };
    } else {
      return {
        counterpartLabel: 'Student',
        counterpartName: payment.studentName,
        counterpartIcon: User,
        amountLabel: 'Amount Paid',
        amountColor: 'text-gray-900 dark:text-white',
        additionalInfo: payment.subscriptionType ? {
          title: 'Subscription Details',
          items: [
            { label: 'Plan', value: payment.planName || 'N/A' },
            { label: 'Type', value: payment.subscriptionType },
            { label: 'Deposit', value: payment.deposit ? `$${payment.deposit.toLocaleString()}` : 'N/A' }
          ]
        } : null
      };
    }
  };

  const roleInfo = getRoleSpecificInfo();
  const CounterpartIcon = roleInfo.counterpartIcon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Details"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={onClose}
            icon={ArrowLeft}
          >
            Back to Billing
          </Button>
          <div className="flex items-center space-x-3">
            {payment.status === 'failed' && (
              <Button
                variant="primary"
                onClick={() => {
                  // Handle retry logic
                  console.log('Retry payment:', payment.id);
                }}
              >
                Retry Payment
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                // Handle download receipt logic
                console.log('Download receipt:', payment.id);
              }}
              icon={FileText}
            >
              Download Receipt
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div className={`p-4 rounded-lg ${statusConfig.bgColor} border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Payment {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {statusConfig.description}
                </p>
              </div>
            </div>
            <Badge variant={statusConfig.variant}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Payment Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Payment Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Payment Information</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Project</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{payment.projectName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{roleInfo.counterpartLabel}</span>
                <div className="flex items-center space-x-2">
                  <CounterpartIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{roleInfo.counterpartName}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{roleInfo.amountLabel}</span>
                <span className={`text-lg font-bold ${roleInfo.amountColor}`}>
                  ${payment.amount.toLocaleString()}
                </span>
              </div>
              
              {payment.deposit && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Deposit</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${payment.deposit.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Transaction Details</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(payment.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(payment.date)}
                </span>
              </div>
              
              {payment.dueDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(payment.dueDate)}
                  </span>
                </div>
              )}
              
              {payment.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {payment.transactionId}
                  </span>
                </div>
              )}
              
              {payment.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.paymentMethod}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {roleInfo.additionalInfo && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">{roleInfo.additionalInfo.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleInfo.additionalInfo.items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failure Information */}
        {payment.status === 'failed' && (payment.failureReason || payment.retryInstructions) && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="space-y-2">
                {payment.failureReason && (
                  <div>
                    <h5 className="font-medium text-red-900 dark:text-red-100">Failure Reason</h5>
                    <p className="text-sm text-red-700 dark:text-red-300">{payment.failureReason}</p>
                  </div>
                )}
                {payment.retryInstructions && (
                  <div>
                    <h5 className="font-medium text-red-900 dark:text-red-100">Retry Instructions</h5>
                    <p className="text-sm text-red-700 dark:text-red-300">{payment.retryInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {payment.notes && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">Notes</h4>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{payment.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;
