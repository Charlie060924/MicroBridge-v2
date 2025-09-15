"use client";
import React from 'react';
import { ArrowLeft, CheckCircle, Star, Crown, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import PricingSection from './PricingSection';
import Link from 'next/link';

interface EmployerPricingPageProps {
  showBackButton?: boolean;
  fromSubscriptionPage?: boolean;
}

const EmployerPricingPage: React.FC<EmployerPricingPageProps> = ({ 
  showBackButton = false,
  fromSubscriptionPage = false 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/employer_portal/workspace');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowLeft}
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Employer Pricing Plans
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Choose the perfect plan for your hiring needs
                </p>
              </div>
            </div>
            
            {/* Quick Access to Subscription Management */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/subscription">
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PricingSection 
          variant="employer" 
          showHeader={false}
        />
        
        {/* Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Compare All Features
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See exactly what's included in each plan
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Starter</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        $49/month
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center space-x-2">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span>Growth</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        $99/month
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center space-x-2">
                        <Crown className="h-4 w-4 text-purple-500" />
                        <span>Professional</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        $199/month
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Job Posting Features */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Job Posts per Month
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">3</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Unlimited</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Unlimited</span>
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Featured Job Listings
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  {/* Candidate Access */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Candidate Profile Access
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Advanced Filtering
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">Basic</td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Candidate Shortlisting
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  {/* Communication Features */}
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      In-Platform Messaging
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Calendar Scheduling
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  {/* Payment & Security */}
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Secure Payment Processing
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-green-500">
                      <CheckCircle className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                  
                  {/* Support */}
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      Support Level
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Email</td>
                    <td className="px-6 py-4 text-center text-blue-600 dark:text-blue-400">Priority Email</td>
                    <td className="px-6 py-4 text-center text-purple-600 dark:text-purple-400">Phone + Dedicated Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Can I change my plan anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We accept all major credit cards, bank transfers, and digital payment methods popular in Hong Kong.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Is there a free trial?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, we offer a 14-day free trial for all paid plans. No credit card required to start.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                How secure are payments?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All payments are processed through our secure escrow system, ensuring protection for both employers and students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPricingPage;
