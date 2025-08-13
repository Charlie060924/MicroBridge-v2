import React from 'react';
import { Calendar, User, Building } from 'lucide-react';
import Button from '@/components/common/ui/Button';
import Badge from '@/components/common/ui/Badge';

interface PaymentItem {
  id: string;
  projectName: string;
  amount: number;
  date: string;
  status: string;
  [key: string]: any; // Allow additional properties
}

interface PaymentListProps {
  title: string;
  subtitle: string;
  payments: PaymentItem[];
  role: 'student' | 'employer';
  onActionClick?: (payment: PaymentItem) => void;
  actionButtonText?: string;
  actionButtonVariant?: 'primary' | 'outline' | 'danger';
  showActionButton?: boolean;
  onItemClick?: (payment: PaymentItem) => void;
}

const PaymentList: React.FC<PaymentListProps> = ({
  title,
  subtitle,
  payments,
  role,
  onActionClick,
  actionButtonText = 'Complete Payment',
  actionButtonVariant = 'primary',
  showActionButton = true,
  onItemClick
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'confirmed':
      case 'secured':
        return 'secured';
      case 'released':
      case 'completed':
        return 'released';
      case 'processing':
        return 'processing';
      case 'failed':
        return 'failed';
      default:
        return 'default';
    }
  };

  const getRoleSpecificIcon = () => {
    return role === 'student' ? Building : User;
  };

  const getRoleSpecificField = (payment: PaymentItem) => {
    return role === 'student' ? payment.employerName : payment.studentName;
  };

  const getRoleSpecificLabel = () => {
    return role === 'student' ? 'Employer' : 'Student';
  };

  const RoleIcon = getRoleSpecificIcon();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {getRoleSpecificLabel()}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            {showActionButton && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment) => (
            <tr 
              key={payment.id} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${onItemClick ? 'cursor-pointer' : ''}`}
              onClick={() => onItemClick?.(payment)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {payment.projectName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <RoleIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getRoleSpecificField(payment)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${payment.amount.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(payment.date).toLocaleDateString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusBadgeVariant(payment.status)}>
                  {payment.status}
                </Badge>
              </td>
              {showActionButton && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant={actionButtonVariant}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick?.(payment);
                    }}
                  >
                    {actionButtonText}
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
