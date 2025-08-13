"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  TrendingUp
} from 'lucide-react';
import PaymentStatusBadge from './PaymentStatusBadge';
import TransactionSummary from './TransactionSummary';
import Card from '@/components/common/ui/Card';
import Badge from '@/components/common/ui/Badge';
import Button from '@/components/common/ui/Button';

interface UpcomingPayment {
  id: string;
  projectName: string;
  employerName: string;
  amount: number;
  estimatedDate: string;
  status: 'pending' | 'confirmed' | 'processing';
}

interface ActiveService {
  id: string;
  projectName: string;
  employerName: string;
  agreedSalary: number;
  progress: number;
  startDate: string;
  endDate: string;
}

interface PaymentHistory {
  id: string;
  projectName: string;
  employerName: string;
  amountReceived: number;
  date: string;
  status: 'completed' | 'failed' | 'processing';
}

const StudentBillingDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const [upcomingPayments] = useState<UpcomingPayment[]>([
    {
      id: '1',
      projectName: 'E-commerce Website Development',
      employerName: 'TechCorp Inc.',
      amount: 2500,
      estimatedDate: '2024-01-25',
      status: 'confirmed'
    },
    {
      id: '2',
      projectName: 'Mobile App Design',
      employerName: 'DesignStudio',
      amount: 1800,
      estimatedDate: '2024-01-28',
      status: 'pending'
    }
  ]);

  const [activeServices] = useState<ActiveService[]>([
    {
      id: '1',
      projectName: 'Data Analysis Project',
      employerName: 'DataTech Solutions',
      agreedSalary: 3200,
      progress: 75,
      startDate: '2024-01-10',
      endDate: '2024-02-10'
    },
    {
      id: '2',
      projectName: 'Content Writing',
      employerName: 'ContentPro',
      agreedSalary: 1200,
      progress: 45,
      startDate: '2024-01-15',
      endDate: '2024-02-15'
    }
  ]);

  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      id: 'TXN-001',
      projectName: 'Logo Design',
      employerName: 'StartupXYZ',
      amountReceived: 800,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 'TXN-002',
      projectName: 'Social Media Management',
      employerName: 'MarketingPro',
      amountReceived: 1500,
      date: '2024-01-18',
      status: 'completed'
    }
  ]);

  const handleProjectClick = (projectId: string) => {
    // Save navigation state using utility
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);
    });
    
    // Navigate to project detail
    router.push(`/student_portal/workspace/projects/${projectId}`);
  };

  const filteredUpcomingPayments = upcomingPayments.filter(payment =>
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.employerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActiveServices = activeServices.filter(service =>
    service.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.employerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaymentHistory = paymentHistory.filter(item =>
    item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEarnings = paymentHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amountReceived, 0);

  const upcomingEarnings = upcomingPayments
    .filter(payment => payment.status === 'confirmed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Earnings & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your earnings, upcoming payments, and payment history
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${upcomingEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or employers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={Filter}
        >
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'upcoming', label: 'Upcoming Payments', count: upcomingPayments.length },
            { id: 'active', label: 'Active Services', count: activeServices.length },
            { id: 'history', label: 'Payment History', count: paymentHistory.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Upcoming Payments */}
        {activeTab === 'upcoming' && (
          <Card
            title="Upcoming Payments"
            subtitle="Payments scheduled to be received"
            icon={Clock}
          >
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Est. Payment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUpcomingPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleProjectClick(payment.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.projectName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {payment.employerName}
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
                              {new Date(payment.estimatedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={payment.status === 'confirmed' ? 'secured' : payment.status === 'processing' ? 'processing' : 'pending'}>
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        {/* Active Services */}
        {activeTab === 'active' && (
          <Card
            title="Active Services"
            subtitle="Projects currently in progress"
            icon={CheckCircle}
          >
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {filteredActiveServices.map((service) => (
                  <div 
                    key={service.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProjectClick(service.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.projectName}
                      </h4>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        ${service.agreedSalary.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {service.employerName}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${service.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Start: {new Date(service.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(service.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        {/* Payment History */}
        {activeTab === 'history' && (
          <Card
            title="Payment History"
            subtitle="Complete history of all received payments"
            icon={DollarSign}
          >
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount Received
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
                    {filteredPaymentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {item.employerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            ${item.amountReceived.toLocaleString()}
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
                          <Badge variant={item.status === 'completed' ? 'completed' : item.status === 'failed' ? 'failed' : 'processing'}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
      </div>
    </div>
  );
};

export default StudentBillingDashboard;
