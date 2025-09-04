"use client";
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Star,
  CreditCard,
  Calendar,
  AlertTriangle,
  ChevronRight,
  LucideIcon,
  Shield
} from 'lucide-react';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

interface CurrentSubscription {
  planId: string;
  planName: string;
  price: number;
  nextBillingDate: string;
  status: 'active' | 'cancelled' | 'past_due';
}

interface BillingHistory {
  id: string;
  plan: string;
  amount: number;
  date: string;
  status: 'paid' | 'failed' | 'pending';
}

const SubscriptionManagement: React.FC = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'upgrade' | 'downgrade' | 'cancel' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Mock data - replace with API calls
  const [currentSubscription] = useState<CurrentSubscription>({
    planId: 'growth',
    planName: 'Growth',
    price: 49,
    nextBillingDate: '2024-02-15',
    status: 'active'
  });

  const [plans] = useState<Plan[]>([
    {
      id: 'starter',
      name: 'Starter',
      price: 49,
      features: [
        '3 job posts per month',
        'Basic candidate search & filtering',
        'View candidate profiles',
        'Email support',
        'Standard analytics',
        'Secure payment processing'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 99,
      features: [
        'Unlimited job posts',
        'Advanced candidate filtering',
        'Priority candidate access',
        'Featured job listings',
        'Calendar scheduling integration',
        'In-platform messaging',
        'Enhanced analytics & reporting',
        'Priority email support',
        'Custom company branding',
        'Secure salary payments'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 199,
      features: [
        'Everything in Growth',
        'Unlimited team members',
        'Advanced analytics dashboard',
        'Candidate shortlisting tools',
        'Priority phone support',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'Advanced security features',
        'Bulk payment processing'
      ],
      recommended: true
    }
  ]);

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: 'INV-001',
      plan: 'Growth',
      amount: 49,
      date: '2024-01-15',
      status: 'paid'
    },
    {
      id: 'INV-002',
      plan: 'Growth',
      amount: 49,
      date: '2023-12-15',
      status: 'paid'
    }
  ]);

  const handlePlanAction = (action: 'upgrade' | 'downgrade' | 'cancel', plan?: Plan) => {
    setSelectedAction(action);
    setSelectedPlan(plan || null);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmAction = () => {
    // Handle subscription change
    console.log('Subscription action:', selectedAction, selectedPlan);
    
    if (selectedAction === 'upgrade' || selectedAction === 'downgrade') {
      // Navigate to unified payment page for subscription payment
      const paymentUrl = new URLSearchParams({
        type: 'subscription',
        planName: selectedPlan?.name || 'Unknown Plan',
        planDuration: 'Monthly',
        amount: selectedPlan?.price.toString() || '0'
      });
      
      window.location.href = `/billing/payment?${paymentUrl.toString()}`;
    }
    
    setIsConfirmationModalOpen(false);
    setSelectedAction(null);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planName: string): LucideIcon => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return Zap;
      case 'growth':
        return Star;
      case 'pro':
        return Crown;
      default:
        return Star;
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Your Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your subscription plan and billing
          </p>
          <div className="mt-3 flex items-center">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-md mr-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              All payments secured with Hong Kong banking standards
            </span>
          </div>
        </div>
      </div>

      {/* Current Plan Card */}
      <Card
        title={`${currentSubscription.planName} Plan`}
        subtitle={`$${currentSubscription.price}/month`}
        icon={getPlanIcon(currentSubscription.planName)}
        headerAction={
          <div className="flex items-center space-x-2">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Next billing</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
            {currentSubscription.planName !== 'Pro' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePlanAction('upgrade', plans.find(p => p.id === 'pro'))}
              >
                Upgrade
              </Button>
            )}
            {currentSubscription.planName !== 'Starter' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePlanAction('downgrade', plans.find(p => p.id === 'starter'))}
              >
                Downgrade
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handlePlanAction('cancel')}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="text-center text-gray-600 dark:text-gray-400">
          Your current subscription is active and will be billed on {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
        </div>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 p-6 ${
                plan.id === currentSubscription.planId
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  {(() => {
                    const IconComponent = getPlanIcon(plan.name);
                    return <IconComponent className="h-6 w-6" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                {plan.id === currentSubscription.planId ? (
                  <div className="w-full py-2 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                    Current Plan
                  </div>
                ) : (
                  <>
                    {plan.price > currentSubscription.price ? (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handlePlanAction('upgrade', plan)}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePlanAction('downgrade', plan)}
                      >
                        Downgrade to {plan.name}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card
        title="Billing History"
        subtitle="Complete history of all subscription payments"
        icon={CreditCard}
      >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Plan
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
                {billingHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {item.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${item.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={item.status === 'paid' ? 'completed' : item.status === 'failed' ? 'failed' : 'pending'}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm {selectedAction ? selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1) : ''}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedAction === 'upgrade' && selectedPlan && (
                `Are you sure you want to upgrade to the ${selectedPlan.name} plan for $${selectedPlan.price}/month?`
              )}
              {selectedAction === 'downgrade' && selectedPlan && (
                `Are you sure you want to downgrade to the ${selectedPlan.name} plan for $${selectedPlan.price}/month?`
              )}
              {selectedAction === 'cancel' && (
                'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.'
              )}
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={selectedAction === 'cancel' ? 'danger' : 'primary'}
                className="flex-1"
                onClick={handleConfirmAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
