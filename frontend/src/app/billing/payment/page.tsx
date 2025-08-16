"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  CreditCard, 
  Building, 
  User, 
  DollarSign, 
  Shield, 
  Check,
  ChevronRight,
  Download,
  QrCode,
  Smartphone,
  Lock,
  Star,
  AlertCircle,
  Clock
} from 'lucide-react';

interface PaymentData {
  type: 'salary' | 'subscription';
  candidateName?: string;
  jobTitle?: string;
  startDate?: string;
  duration?: string;
  baseSalary?: number;
  platformFee?: number;
  planName?: string;
  planDuration?: string;
  taxes?: number;
  totalAmount: number;
}

interface PaymentMethod {
  id: string;
  type: 'alipay' | 'payme' | 'card' | 'saved';
  name: string;
  description: string;
  icon: React.ReactNode;
  saved?: boolean;
  last4?: string;
}

const UnifiedPaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Progress steps
  const [currentStep, setCurrentStep] = useState(2); // Start at payment step
  const steps = [
    { id: 1, name: 'Details', completed: true },
    { id: 2, name: 'Payment', completed: false },
    { id: 3, name: 'Confirmation', completed: false }
  ];

  // Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  
  // Form data
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });
  
  const [paymeData, setPaymeData] = useState({
    mobileNumber: '',
    amount: 0
  });

  // Get payment data from URL params
  const getPaymentData = (): PaymentData => {
    const type = searchParams.get('type') as 'salary' | 'subscription' || 'salary';
    const amount = parseFloat(searchParams.get('amount') || '0');
    
    if (type === 'salary') {
      return {
        type: 'salary',
        candidateName: searchParams.get('candidateName') || 'John Doe',
        jobTitle: searchParams.get('jobTitle') || 'Frontend Developer',
        startDate: searchParams.get('startDate') || '2024-02-01',
        duration: searchParams.get('duration') || '3 months',
        baseSalary: amount,
        platformFee: Math.round(amount * 0.05), // 5% platform fee
        totalAmount: amount + Math.round(amount * 0.05)
      };
    } else {
      return {
        type: 'subscription',
        planName: searchParams.get('planName') || 'Growth Plan',
        planDuration: searchParams.get('planDuration') || 'Monthly',
        platformFee: amount,
        taxes: Math.round(amount * 0.1), // 10% tax
        totalAmount: amount + Math.round(amount * 0.1)
      };
    }
  };

  const [paymentData] = useState<PaymentData>(getPaymentData());

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'alipay',
      type: 'alipay',
      name: 'Alipay',
      description: 'Pay with QR code or redirect',
      icon: <QrCode className="h-5 w-5" />
    },
    {
      id: 'payme',
      type: 'payme',
      name: 'PayMe',
      description: 'Hong Kong mobile payment',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'card',
      type: 'card',
      name: 'Credit / Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'saved-card-1',
      type: 'saved',
      name: 'Visa ending in 4242',
      description: 'Expires 12/26',
      icon: <CreditCard className="h-5 w-5" />,
      saved: true,
      last4: '4242'
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while auth is loading
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const handleBack = () => {
    router.push('/billing');
  };

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');
    setCurrentStep(3);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPaymentStatus('success');
      steps[2].completed = true;
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step.id === currentStep
              ? 'border-blue-600 bg-blue-600 text-white'
              : step.completed
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 bg-white text-gray-400 dark:bg-gray-800 dark:border-gray-600'
          }`}>
            {step.completed ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="text-sm font-medium">{step.id}</span>
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            step.id === currentStep
              ? 'text-blue-600'
              : step.completed
              ? 'text-green-600'
              : 'text-gray-400'
          }`}>
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-4 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );

  const renderPaymentSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Payment Summary
      </h3>
      
      {paymentData.type === 'salary' ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Candidate:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.candidateName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Job Title:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.jobTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Base Salary:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${paymentData.baseSalary?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Platform Fee (5%):</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${paymentData.platformFee?.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Plan:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-medium text-gray-900 dark:text-white">{paymentData.planDuration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Plan Cost:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${paymentData.platformFee?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Taxes (10%):</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${paymentData.taxes?.toLocaleString()}
            </span>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Amount Due:
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${paymentData.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Hint */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {paymentData.type === 'salary' 
              ? 'Salary will be credited immediately after payment confirmation'
              : 'Subscription activates instantly upon successful payment'
            }
          </p>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Payment Method
      </h3>
      
      {/* Payment Method Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(method.id)}
            className={`flex items-center p-4 border-2 rounded-lg text-left transition-all ${
              selectedPaymentMethod === method.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${
                selectedPaymentMethod === method.id
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {method.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {method.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {method.description}
                </div>
              </div>
            </div>
            {method.saved && (
              <div className="ml-auto">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Payment Method Forms */}
      {selectedPaymentMethod === 'card' && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData({...cardData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="1234 5678 9012 3456"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="123"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              checked={cardData.saveCard}
              onChange={(e) => setCardData({...cardData, saveCard: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Save this card for future payments
            </label>
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'payme' && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={paymeData.mobileNumber}
              onChange={(e) => setPaymeData({...paymeData, mobileNumber: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              placeholder="+852 9xxx xxxx"
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You will be redirected to PayMe to complete the payment of ${paymentData.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'alipay' && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click "Pay Now" to generate QR code or redirect to Alipay
          </p>
        </div>
      )}

      {selectedPaymentMethod.startsWith('saved-') && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Using saved payment method: Visa ending in 4242
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      {paymentStatus === 'processing' && (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Processing Payment...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we process your payment. Do not close this window.
          </p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="space-y-4">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {paymentData.type === 'salary' 
              ? `Payment of $${paymentData.totalAmount.toLocaleString()} has been processed successfully. The candidate will be notified.`
              : `Your ${paymentData.planName} subscription is now active. You have access to all premium features.`
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {/* Download receipt logic */}}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Billing
            </button>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="space-y-4">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment could not be processed. Please try again or use a different payment method.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setCurrentStep(2);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Complete Payment
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
              {paymentData.type === 'salary' 
                ? `Salary Payment for ${paymentData.candidateName}`
                : `Subscription Payment – ${paymentData.planName}`
              }
            </p>
          </div>

          {/* Progress Indicator */}
          {renderProgressIndicator()}
        </div>

        {currentStep === 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                {renderPaymentMethods()}
              </div>
            </div>

            {/* Payment Summary - Sticky Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {renderPaymentSummary()}
                
                {/* Security Indicators */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          SSL Encrypted
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Privacy Protected
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          We don't store card info unless opted in
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Star className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Trusted Platform
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Trusted by 1000+ students and employers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Pay ${paymentData.totalAmount.toLocaleString()}
                    </>
                  )}
                </button>

                <button
                  onClick={handleBack}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              {renderConfirmationStep()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPaymentPage;

