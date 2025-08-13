"use client";
import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import PaymentSetupModal from './PaymentSetupModal';
import PaymentStatusBadge from './PaymentStatusBadge';
import TransactionSummary from './TransactionSummary';
import Card from '@/components/common/ui/Card';
import Badge from '@/components/common/ui/Badge';
import Button from '@/components/common/ui/Button';

interface Payment {
  id: string;
  projectName: string;
  studentName: string;
  agreedSalary: number;
  deposit: number;
  status: 'pending' | 'secured' | 'released';
  date: string;
  dueDate: string;
}

interface BillingHistory {
  id: string;
  projectName: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed' | 'processing';
}

const EmployerBillingDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const [pendingPayments] = useState<Payment[]>([
    {
      id: '1',
      projectName: 'E-commerce Website Development',
      studentName: 'Alex Johnson',
      agreedSalary: 2500,
      deposit: 250,
      status: 'pending',
      date: '2024-01-15',
      dueDate: '2024-01-25'
    },
    {
      id: '2',
      projectName: 'Mobile App Design',
      studentName: 'Sarah Wilson',
      agreedSalary: 1800,
      deposit: 180,
      status: 'pending',
      date: '2024-01-18',
      dueDate: '2024-01-28'
    }
  ]);

  const [activePayments] = useState<Payment[]>([
    {
      id: '3',
      projectName: 'Data Analysis Project',
      studentName: 'Mike Chen',
      agreedSalary: 3200,
      deposit: 320,
      status: 'secured',
      date: '2024-01-10',
      dueDate: '2024-02-10'
    },
    {
      id: '4',
      projectName: 'Content Writing',
      studentName: 'Emily Davis',
      agreedSalary: 1200,
      deposit: 120,
      status: 'released',
      date: '2024-01-05',
      dueDate: '2024-01-15'
    }
  ]);

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: 'INV-001',
      projectName: 'Logo Design',
      studentName: 'John Smith',
      amount: 800,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 'INV-002',
      projectName: 'Social Media Management',
      studentName: 'Lisa Brown',
      amount: 1500,
      date: '2024-01-18',
      status: 'completed'
    }
  ]);

  const handleCompletePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = (paymentData: any) => {
    // Handle payment confirmation
    console.log('Payment confirmed:', paymentData);
    // Redirect to checkout with context
    router.push(`/billing/checkout?projectId=${selectedPayment?.id}&amount=${paymentData.salary}&deposit=${paymentData.deposit}`);
  };

  const handleManagePayments = (projectId: string) => {
    // Save navigation state using utility
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);
    });
    
    // Navigate to project
    router.push(`/employer_portal/workspace/projects/${projectId}`);
  };

  const filteredPendingPayments = pendingPayments.filter(payment =>
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivePayments = activePayments.filter(payment =>
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBillingHistory = billingHistory.filter(item =>
    item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Billing & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your project payments and billing history
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'pending', label: 'Pending Payments', count: pendingPayments.length },
            { id: 'active', label: 'Active Payments', count: activePayments.length },
            { id: 'history', label: 'Billing History', count: billingHistory.length }
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
        {/* Pending Payments */}
        {activeTab === 'pending' && (
          <Card
            title="Pending Payments"
            subtitle="Complete payments for projects to secure deposits"
            icon={Clock}
            headerAction={
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Setup Payment
              </Button>
            }
          >
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Agreed Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Deposit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPendingPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.projectName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {payment.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${payment.agreedSalary.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            ${payment.deposit.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCompletePayment(payment)}
                          >
                            Complete Payment
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        {/* Active Payments */}
        {activeTab === 'active' && (
          <Card
            title="Active Payments"
            subtitle="Secured deposits linked to active projects"
            icon={CheckCircle}
          >
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Agreed Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Deposit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActivePayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.projectName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {payment.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${payment.agreedSalary.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            ${payment.deposit.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManagePayments(payment.id)}
                          >
                            Manage Payments
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        {/* Billing History */}
        {activeTab === 'history' && (
          <Card
            title="Billing History"
            subtitle="Complete history of all transactions"
            icon={DollarSign}
          >
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student Name
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
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBillingHistory.map((item) => (
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
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {item.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
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

      {/* Payment Setup Modal */}
      <PaymentSetupModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        projectData={selectedPayment ? {
          projectName: selectedPayment.projectName,
          studentName: selectedPayment.studentName,
          agreedSalary: selectedPayment.agreedSalary
        } : undefined}
      />
    </div>
  );
};

export default EmployerBillingDashboard;
