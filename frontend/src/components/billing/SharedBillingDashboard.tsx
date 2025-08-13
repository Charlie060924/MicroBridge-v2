"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';
import Card from '@/components/common/ui/Card';
import Button from '@/components/common/ui/Button';
import PaymentList from './PaymentList';
import BillingHistoryTable from './BillingHistoryTable';
import PaymentSetupModal from './PaymentSetupModal';

interface Payment {
  id: string;
  projectName: string;
  studentName?: string;
  employerName?: string;
  amount: number;
  deposit?: number;
  status: string;
  date: string;
  dueDate?: string;
}

interface BillingHistory {
  id: string;
  projectName: string;
  studentName?: string;
  employerName?: string;
  amount: number;
  date: string;
  status: string;
}

interface SharedBillingDashboardProps {
  role: 'student' | 'employer';
}

const SharedBillingDashboard: React.FC<SharedBillingDashboardProps> = ({ role }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const [pendingPayments] = useState<Payment[]>(
    role === 'employer' ? [
      {
        id: '1',
        projectName: 'E-commerce Website Development',
        studentName: 'Alex Johnson',
        amount: 2500,
        deposit: 250,
        status: 'pending',
        date: '2024-01-15',
        dueDate: '2024-01-25'
      },
      {
        id: '2',
        projectName: 'Mobile App Design',
        studentName: 'Sarah Wilson',
        amount: 1800,
        deposit: 180,
        status: 'pending',
        date: '2024-01-18',
        dueDate: '2024-01-28'
      }
    ] : [
      {
        id: '1',
        projectName: 'E-commerce Website Development',
        employerName: 'TechCorp Inc.',
        amount: 2500,
        status: 'confirmed',
        date: '2024-01-25'
      },
      {
        id: '2',
        projectName: 'Mobile App Design',
        employerName: 'DesignStudio',
        amount: 1800,
        status: 'pending',
        date: '2024-01-28'
      }
    ]
  );

  const [activePayments] = useState<Payment[]>(
    role === 'employer' ? [
      {
        id: '3',
        projectName: 'Data Analysis Project',
        studentName: 'Mike Chen',
        amount: 3200,
        deposit: 320,
        status: 'secured',
        date: '2024-01-10',
        dueDate: '2024-02-10'
      },
      {
        id: '4',
        projectName: 'Content Writing',
        studentName: 'Emily Davis',
        amount: 1200,
        deposit: 120,
        status: 'released',
        date: '2024-01-05',
        dueDate: '2024-01-15'
      }
    ] : [
      {
        id: '1',
        projectName: 'Data Analysis Project',
        employerName: 'DataTech Solutions',
        amount: 3200,
        status: 'processing',
        date: '2024-01-10'
      },
      {
        id: '2',
        projectName: 'Content Writing',
        employerName: 'ContentPro',
        amount: 1200,
        status: 'processing',
        date: '2024-01-15'
      }
    ]
  );

  const [billingHistory] = useState<BillingHistory[]>(
    role === 'employer' ? [
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
    ] : [
      {
        id: 'TXN-001',
        projectName: 'Logo Design',
        employerName: 'StartupXYZ',
        amount: 800,
        date: '2024-01-20',
        status: 'completed'
      },
      {
        id: 'TXN-002',
        projectName: 'Social Media Management',
        employerName: 'MarketingPro',
        amount: 1500,
        date: '2024-01-18',
        status: 'completed'
      }
    ]
  );

  const handleCompletePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = (paymentData: any) => {
    console.log('Payment confirmed:', paymentData);
    router.push(`/billing/checkout?projectId=${selectedPayment?.id}&amount=${paymentData.salary}&deposit=${paymentData.deposit}`);
  };

  const handleManagePayments = (projectId: string) => {
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);
    });
    
    const basePath = role === 'employer' ? '/employer_portal/workspace' : '/student_portal/workspace';
    router.push(`${basePath}/projects/${projectId}`);
  };

  const handleProjectClick = (projectId: string) => {
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);
    });
    
    const basePath = role === 'employer' ? '/employer_portal/workspace' : '/student_portal/workspace';
    router.push(`${basePath}/projects/${projectId}`);
  };

  const filteredPendingPayments = pendingPayments.filter(payment =>
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role === 'employer' ? payment.studentName : payment.employerName)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivePayments = activePayments.filter(payment =>
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role === 'employer' ? payment.studentName : payment.employerName)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBillingHistory = billingHistory.filter(item =>
    item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role === 'employer' ? item.studentName : item.employerName)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals for students
  const totalEarnings = role === 'student' ? billingHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0) : 0;

  const upcomingEarnings = role === 'student' ? pendingPayments
    .filter(payment => payment.status === 'confirmed')
    .reduce((sum, payment) => sum + payment.amount, 0) : 0;

  const getTabConfig = () => {
    if (role === 'employer') {
      return [
        { id: 'pending', label: 'Pending Payments', count: pendingPayments.length },
        { id: 'active', label: 'Active Payments', count: activePayments.length },
        { id: 'history', label: 'Billing History', count: billingHistory.length }
      ];
    } else {
      return [
        { id: 'pending', label: 'Upcoming Payments', count: pendingPayments.length },
        { id: 'active', label: 'Active Services', count: activePayments.length },
        { id: 'history', label: 'Payment History', count: billingHistory.length }
      ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {role === 'employer' ? 'Billing & Payments' : 'Your Earnings & Payments'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {role === 'employer' 
              ? 'Manage your project payments and billing history'
              : 'Track your earnings, upcoming payments, and payment history'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards for Students */}
      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Total Earnings"
            subtitle={`$${totalEarnings.toLocaleString()}`}
            icon={DollarSign}
          >
            <div className="text-center text-gray-600 dark:text-gray-400">
              Total amount earned from completed projects
            </div>
          </Card>

          <Card
            title="Upcoming Earnings"
            subtitle={`$${upcomingEarnings.toLocaleString()}`}
            icon={TrendingUp}
          >
            <div className="text-center text-gray-600 dark:text-gray-400">
              Expected payments from confirmed projects
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search projects or ${role === 'employer' ? 'students' : 'employers'}...`}
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
          {getTabConfig().map((tab) => (
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
        {/* Pending/Upcoming Payments */}
        {activeTab === 'pending' && (
          <Card
            title={role === 'employer' ? 'Pending Payments' : 'Upcoming Payments'}
            subtitle={role === 'employer' 
              ? 'Complete payments for projects to secure deposits'
              : 'Payments scheduled to be received'
            }
            icon={Clock}
            headerAction={role === 'employer' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Setup Payment
              </Button>
            ) : undefined}
          >
            <PaymentList
              title=""
              subtitle=""
              payments={filteredPendingPayments}
              role={role}
              onActionClick={role === 'employer' ? handleCompletePayment : undefined}
              actionButtonText="Complete Payment"
              showActionButton={role === 'employer'}
              onItemClick={handleProjectClick}
            />
          </Card>
        )}

        {/* Active Payments/Services */}
        {activeTab === 'active' && (
          <Card
            title={role === 'employer' ? 'Active Payments' : 'Active Services'}
            subtitle={role === 'employer' 
              ? 'Secured deposits linked to active projects'
              : 'Projects currently in progress'
            }
            icon={CheckCircle}
          >
            <PaymentList
              title=""
              subtitle=""
              payments={filteredActivePayments}
              role={role}
              onActionClick={role === 'employer' ? handleManagePayments : undefined}
              actionButtonText="Manage Payments"
              actionButtonVariant="outline"
              showActionButton={role === 'employer'}
              onItemClick={handleProjectClick}
            />
          </Card>
        )}

        {/* Billing History */}
        {activeTab === 'history' && (
          <Card
            title="Billing History"
            subtitle={role === 'employer' 
              ? 'Complete history of all transactions'
              : 'Complete history of all received payments'
            }
            icon={DollarSign}
          >
            <BillingHistoryTable
              history={filteredBillingHistory}
              role={role}
              onItemClick={handleProjectClick}
            />
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
          studentName: selectedPayment.studentName || '',
          agreedSalary: selectedPayment.amount
        } : undefined}
      />
    </div>
  );
};

export default SharedBillingDashboard;
