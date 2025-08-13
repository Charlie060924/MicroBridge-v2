"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Award } from "lucide-react";
import {
  paymentTypes,
  projectSalaryRanges,
  currencies,
} from "@/components/dashboard/Students/Student_Info_Constant";

interface CompensationSectionProps {
  userData: {
    paymentType: string;
    salaryRange?: string;
    customAmount?: string;
    flexibleNegotiation: boolean;
    currency: string;
  };
  onUpdate: (data: Partial<{
    paymentType: string;
    salaryRange?: string;
    customAmount?: string;
    flexibleNegotiation: boolean;
    currency: string;
  }>) => void;
  isOnboarding?: boolean;
  currentStep?: number;
  errors?: Record<string, string>;
}

export default function CompensationSection({ 
  userData, 
  onUpdate, 
  isOnboarding = false, 
  currentStep = 1,
  errors = {}
}: CompensationSectionProps) {
  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [formData, setFormData] = useState({
    paymentType: userData.paymentType,
    salaryRange: userData.salaryRange,
    customAmount: userData.customAmount,
    flexibleNegotiation: userData.flexibleNegotiation,
    currency: userData.currency,
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      paymentType: userData.paymentType,
      salaryRange: userData.salaryRange,
      customAmount: userData.customAmount,
      flexibleNegotiation: userData.flexibleNegotiation,
      currency: userData.currency,
    });
  }, [userData]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      paymentType: userData.paymentType,
      salaryRange: userData.salaryRange,
      customAmount: userData.customAmount,
      flexibleNegotiation: userData.flexibleNegotiation,
      currency: userData.currency,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding) {
      onUpdate({ [field]: value });
    }
  };

  const setPaymentType = (type: string) => {
    const updatedFormData = {
      ...formData,
      paymentType: type,
      salaryRange: type === "project_based" ? formData.salaryRange : undefined,
      customAmount: type === "project_based" ? formData.customAmount : undefined,
    };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding) {
      onUpdate(updatedFormData);
    }
  };

  const setSalaryRange = (value?: string) => {
    const updatedFormData = {
      ...formData,
      salaryRange: value,
      customAmount: value === "custom" ? formData.customAmount : undefined,
    };
    setFormData(updatedFormData);
    
    // In onboarding mode, automatically save to parent component
    if (isOnboarding) {
      onUpdate(updatedFormData);
    }
  };

  const isCurrentStep = isOnboarding && currentStep === 6;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border transition-all duration-300 ${
      isCurrentStep 
        ? "border-blue-300 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20" 
        : "border-gray-200 dark:border-gray-800"
    }`}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Compensation Preferences
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment preferences and expectations
              </p>
            </div>
          </div>
          {!isOnboarding && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Edit
            </button>
          )}
        </div>

        {(isEditing || isOnboarding) ? (
          <div className="space-y-8">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <DollarSign className="mr-2 text-gray-500" /> Preferred Payment Structure *
              </label>
              {errors.paymentType && <p className="text-sm text-red-600 mb-2">{errors.paymentType}</p>}
              <div className="grid gap-4 md:grid-cols-2">
                {paymentTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setPaymentType(type.value)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.paymentType === type.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project-Based Options */}
            {formData.paymentType === "project_based" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <DollarSign className="mr-2 text-gray-500" /> Expected Project Fee Range *
                  </label>
                  <select
                    value={formData.salaryRange ?? ""}
                    onChange={(e) => setSalaryRange(e.target.value || undefined)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                      errors.salaryRange ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select range
                    </option>
                    {projectSalaryRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  {errors.salaryRange && <p className="text-sm text-red-600 mt-1">{errors.salaryRange}</p>}
                </div>

                {formData.salaryRange === "custom" && (
                  <div>
                    <label className="block mb-2 text-sm font-medium">Custom Amount *</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      >
                        {currencies.map((curr) => (
                          <option key={curr.value} value={curr.value}>
                            {curr.value}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={formData.customAmount ?? ""}
                        onChange={(e) => handleInputChange('customAmount', e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      />
                    </div>
                    {errors.customAmount && <p className="text-sm text-red-600 mt-1">{errors.customAmount}</p>}
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="flexibleNegotiation"
                    checked={formData.flexibleNegotiation}
                    onChange={(e) => handleInputChange('flexibleNegotiation', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="flexibleNegotiation" className="ml-2 text-sm">
                    Open to negotiation based on project scope
                  </label>
                </div>
              </div>
            )}

            {!isOnboarding && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {paymentTypes.find(type => type.value === userData.paymentType)?.label || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {userData.paymentType === "project_based" && userData.salaryRange && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expected Range</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {projectSalaryRanges.find(range => range.value === userData.salaryRange)?.label || "Not specified"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
