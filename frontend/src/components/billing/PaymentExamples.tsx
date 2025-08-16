"use client";
import React from 'react';
import { usePaymentNavigation } from './PaymentNavigation';
import { DollarSign, Crown, User, Building } from 'lucide-react';

/**
 * Example component demonstrating how to use the unified payment page
 * for different payment scenarios
 */
const PaymentExamples: React.FC = () => {
  const { navigateToSalaryPayment, navigateToSubscriptionPayment } = usePaymentNavigation();

  // Example salary payment data
  const handleSalaryPayment = () => {
    navigateToSalaryPayment({
      candidateName: 'Alice Chen',
      jobTitle: 'Frontend Developer',
      startDate: '2024-02-01',
      duration: '3 months',
      amount: 15000
    });
  };

  // Example subscription payment data
  const handleSubscriptionPayment = (planName: string, amount: number) => {
    navigateToSubscriptionPayment({
      planName,
      planDuration: 'Monthly',
      amount
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Unified Payment System
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstration of the unified payment page for salary and subscription payments
        </p>
      </div>

      {/* Salary Payment Example */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Salary Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Pay a candidate for project work
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Candidate:</span>
            <span className="font-medium text-gray-900 dark:text-white">Alice Chen</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Position:</span>
            <span className="font-medium text-gray-900 dark:text-white">Frontend Developer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-medium text-gray-900 dark:text-white">3 months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-bold text-green-600">$15,000</span>
          </div>
        </div>

        <button
          onClick={handleSalaryPayment}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Process Salary Payment
        </button>
      </div>

      {/* Subscription Payment Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Starter Plan
              </h3>
              <p className="text-2xl font-bold text-blue-600">$29/mo</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <li>• 5 job posts per month</li>
            <li>• Basic candidate search</li>
            <li>• Email support</li>
          </ul>

          <button
            onClick={() => handleSubscriptionPayment('Starter Plan', 29)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade to Starter
          </button>
        </div>

        {/* Growth Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-500 p-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </span>
          </div>

          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-3">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Growth Plan
              </h3>
              <p className="text-2xl font-bold text-purple-600">$49/mo</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <li>• Unlimited job posts</li>
            <li>• Advanced filtering</li>
            <li>• Featured listings</li>
            <li>• Priority support</li>
          </ul>

          <button
            onClick={() => handleSubscriptionPayment('Growth Plan', 49)}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upgrade to Growth
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mr-3">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pro Plan
              </h3>
              <p className="text-2xl font-bold text-yellow-600">$99/mo</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <li>• Everything in Growth</li>
            <li>• Advanced analytics</li>
            <li>• Phone support</li>
            <li>• Custom integrations</li>
          </ul>

          <button
            onClick={() => handleSubscriptionPayment('Pro Plan', 99)}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Unified Payment Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-green-600 font-semibold">Multiple Payment Methods</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Alipay, PayMe, Credit Cards
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-blue-600 font-semibold">Secure Processing</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SSL encryption & PCI compliance
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-purple-600 font-semibold">Real-time Status</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Live payment tracking
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-yellow-600 font-semibold">Instant Receipts</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download & email confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentExamples;

