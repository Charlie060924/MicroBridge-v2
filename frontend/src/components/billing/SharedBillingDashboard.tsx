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
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import PaymentList from './PaymentList';
import BillingHistoryTable from './BillingHistoryTable';
import PaymentSetupModal from './PaymentSetupModal';
import PaymentDetailsModal from './PaymentDetailsModal';

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

interface BillingHistory {
  id: string;
  projectName: string;
  studentName?: string;
  employerName?: string;
  amount: number;
  date: string;
  status: string;
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

interface SharedBillingDashboardProps {
  role: 'student' | 'employer';
}

const SharedBillingDashboard: React.FC<SharedBillingDashboardProps> = ({ role }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<Payment | BillingHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Restore navigation state on component mount
  useEffect(() => {
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      const state = NavigationMemory.getState();
      if (state && state.origin === '/billing') {
        if (state.activeTab) {
          setActiveTab(state.activeTab);
        }
        if (state.searchTerm) {
          setSearchTerm(state.searchTerm);
        }
        if (state.scrollPosition) {
          NavigationMemory.restoreScrollPosition(state.scrollPosition);
        }
      }
    });
  }, []);

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
        dueDate: '2024-01-25',
        transactionId: 'TXN-EMP-001',
        paymentMethod: 'Credit Card',
        planName: 'Premium Plan',
        subscriptionType: 'Monthly',
        notes: 'Payment pending for milestone 1 completion'
      },
      {
        id: '2',
        projectName: 'Mobile App Design',
        studentName: 'Sarah Wilson',
        amount: 1800,
        deposit: 180,
        status: 'pending',
        date: '2024-01-18',
        dueDate: '2024-01-28',
        transactionId: 'TXN-EMP-002',
        paymentMethod: 'Bank Transfer',
        planName: 'Standard Plan',
        subscriptionType: 'One-time',
        notes: 'Awaiting project kickoff confirmation'
      }
    ] : [
      {
        id: '1',
        projectName: 'E-commerce Website Development',
        employerName: 'TechCorp Inc.',
        amount: 2500,
        status: 'confirmed',
        date: '2024-01-25',
        transactionId: 'TXN-STU-001',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'PayPal',
          account: 'alex.johnson@email.com',
          estimatedDate: '2024-01-30'
        },
        notes: 'Payment confirmed and secured in escrow'
      },
      {
        id: '2',
        projectName: 'Mobile App Design',
        employerName: 'DesignStudio',
        amount: 1800,
        status: 'pending',
        date: '2024-01-28',
        transactionId: 'TXN-STU-002',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'Bank Transfer',
          account: '****1234',
          estimatedDate: '2024-02-05'
        },
        notes: 'Payment processing - awaiting employer confirmation'
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
        dueDate: '2024-02-10',
        transactionId: 'TXN-EMP-003',
        paymentMethod: 'Credit Card',
        planName: 'Premium Plan',
        subscriptionType: 'Monthly',
        notes: 'Deposit secured - project in progress'
      },
      {
        id: '4',
        projectName: 'Content Writing',
        studentName: 'Emily Davis',
        amount: 1200,
        deposit: 120,
        status: 'released',
        date: '2024-01-05',
        dueDate: '2024-01-15',
        transactionId: 'TXN-EMP-004',
        paymentMethod: 'Bank Transfer',
        planName: 'Standard Plan',
        subscriptionType: 'One-time',
        notes: 'Payment released upon project completion'
      }
    ] : [
      {
        id: '1',
        projectName: 'Data Analysis Project',
        employerName: 'DataTech Solutions',
        amount: 3200,
        status: 'processing',
        date: '2024-01-10',
        transactionId: 'TXN-STU-003',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'PayPal',
          account: 'mike.chen@email.com',
          estimatedDate: '2024-01-20'
        },
        notes: 'Payment processing - project milestone completed'
      },
      {
        id: '2',
        projectName: 'Content Writing',
        employerName: 'ContentPro',
        amount: 1200,
        status: 'processing',
        date: '2024-01-15',
        transactionId: 'TXN-STU-004',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'Bank Transfer',
          account: '****5678',
          estimatedDate: '2024-01-25'
        },
        notes: 'Payment processing - content review in progress'
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
        status: 'completed',
        transactionId: 'TXN-EMP-005',
        paymentMethod: 'Credit Card',
        planName: 'Basic Plan',
        subscriptionType: 'One-time',
        notes: 'Logo design project completed successfully'
      },
      {
        id: 'INV-002',
        projectName: 'Social Media Management',
        studentName: 'Lisa Brown',
        amount: 1500,
        date: '2024-01-18',
        status: 'completed',
        transactionId: 'TXN-EMP-006',
        paymentMethod: 'Bank Transfer',
        planName: 'Premium Plan',
        subscriptionType: 'Monthly',
        notes: 'Monthly social media management service'
      }
    ] : [
      {
        id: 'TXN-001',
        projectName: 'Logo Design',
        employerName: 'StartupXYZ',
        amount: 800,
        date: '2024-01-20',
        status: 'completed',
        transactionId: 'TXN-STU-005',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'PayPal',
          account: 'john.smith@email.com',
          estimatedDate: '2024-01-22'
        },
        notes: 'Logo design project payment received'
      },
      {
        id: 'TXN-002',
        projectName: 'Social Media Management',
        employerName: 'MarketingPro',
        amount: 1500,
        date: '2024-01-18',
        status: 'completed',
        transactionId: 'TXN-STU-006',
        paymentMethod: 'Platform Escrow',
        payoutDetails: {
          method: 'Bank Transfer',
          account: '****9012',
          estimatedDate: '2024-01-20'
        },
        notes: 'Monthly social media management payment'
      }
    ]
  );

  const handleCompletePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirm = (paymentData: any) => {
    console.log('Payment confirmed:', paymentData);
    
    // Navigate to the unified payment page with salary payment context
    const paymentUrl = new URLSearchParams({
      type: 'salary',
      candidateName: selectedPayment?.studentName || selectedPayment?.employerName || 'Unknown',
      jobTitle: selectedPayment?.projectName || 'Project Work',
      startDate: new Date().toISOString().split('T')[0],
      duration: '3 months',
      amount: paymentData.salary.toString()
    });
    
    router.push(`/billing/payment?${paymentUrl.toString()}`);
  };

  const handleManagePayments = (payment: Payment) => {
    import('@/utils/navigationMemory').then(({ NavigationMemory }) => {
      NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);
    });
    
    const basePath = role === 'employer' ? '/employer_portal/workspace' : '/student_portal/workspace';
    router.push(`${basePath}/projects/${payment.id}`);
  };

  const handlePaymentDetailsClick = (payment: Payment | BillingHistory) => {
    setSelectedPaymentForDetails(payment);
    setIsPaymentDetailsModalOpen(true);
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
              onItemClick={handlePaymentDetailsClick}
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
              onItemClick={handlePaymentDetailsClick}
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
              onItemClick={handlePaymentDetailsClick}
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

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={isPaymentDetailsModalOpen}
        onClose={() => setIsPaymentDetailsModalOpen(false)}
        payment={selectedPaymentForDetails}
        role={role}
      />
    </div>
  );
};

export default SharedBillingDashboard;
