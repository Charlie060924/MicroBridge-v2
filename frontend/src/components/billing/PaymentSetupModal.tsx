"use client";
import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Shield } from 'lucide-react';

interface PaymentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: PaymentData) => void;
  projectData?: {
    projectName: string;
    studentName: string;
    agreedSalary: number;
  };
}

interface PaymentData {
  salary: number;
  deposit: number;
  paymentMethod: 'card' | 'bank';
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

const PaymentSetupModal: React.FC<PaymentSetupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectData
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    salary: projectData?.agreedSalary || 0,
    deposit: Math.round((projectData?.agreedSalary || 0) * 0.1), // 10% deposit
    paymentMethod: 'card',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: ''
    }
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (field: keyof PaymentData, value: any) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardDetailChange = (field: 'number' | 'expiry' | 'cvv', value: string) => {
    setPaymentData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails!,
        [field]: value
      }
    }));
  };

  const handleConfirm = () => {
    onConfirm(paymentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment Setup
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {projectData && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Project Details
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Project:</strong> {projectData.projectName}</p>
              <p><strong>Student:</strong> {projectData.studentName}</p>
              <p><strong>Agreed Salary:</strong> ${projectData.agreedSalary}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Step 1: Payment Amounts */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Salary
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={paymentData.salary}
                    onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deposit Amount (10%)
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={paymentData.deposit}
                    onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Payment Method
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentData.paymentMethod === 'bank'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="mr-3"
                    />
                    <div className="h-5 w-5 bg-green-600 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">$</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {paymentData.paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardDetails?.number}
                      onChange={(e) => handleCardDetailChange('number', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardDetails?.expiry}
                        onChange={(e) => handleCardDetailChange('expiry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardDetails?.cvv}
                        onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSetupModal;
