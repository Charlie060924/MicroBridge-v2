import React from 'react';
import { Calendar, User, Building } from 'lucide-react';
import Badge from '@/components/ui/badge';

interface BillingHistoryItem {
  id: string;
  projectName: string;
  amount: number;
  date: string;
  status: string;
  [key: string]: any; // Allow additional properties
}

interface BillingHistoryTableProps {
  history: BillingHistoryItem[];
  role: 'student' | 'employer';
  onItemClick?: (item: BillingHistoryItem) => void;
}

const BillingHistoryTable: React.FC<BillingHistoryTableProps> = ({
  history,
  role,
  onItemClick
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'processing':
        return 'processing';
      case 'pending':
        return 'pending';
      default:
        return 'default';
    }
  };

  const getRoleSpecificIcon = () => {
    return role === 'student' ? Building : User;
  };

  const getRoleSpecificField = (item: BillingHistoryItem) => {
    return role === 'student' ? item.employerName : item.studentName;
  };

  const getRoleSpecificLabel = () => {
    return role === 'student' ? 'Employer Name' : 'Student Name';
  };

  const getAmountLabel = () => {
    return role === 'student' ? 'Amount Received' : 'Amount';
  };

  const RoleIcon = getRoleSpecificIcon();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {role === 'student' ? 'Transaction ID' : 'Invoice ID'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Project
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {getRoleSpecificLabel()}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {getAmountLabel()}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((item) => (
            <tr 
              key={item.id} 
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${onItemClick ? 'cursor-pointer' : ''}`}
              onClick={() => onItemClick?.(item)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {item.id}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.projectName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <RoleIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getRoleSpecificField(item)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${
                  role === 'student' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  ${item.amount.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistoryTable;
