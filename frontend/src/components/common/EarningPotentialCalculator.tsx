'use client';
import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Target, Info } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/Tooltip';

interface CalculatorInputs {
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  fieldOfStudy: string;
  yearOfStudy: string;
  hoursPerWeek: number;
  preferredType: 'hourly' | 'project' | 'both';
  location: 'remote' | 'hybrid' | 'onsite';
}

interface EarningData {
  hourlyMin: number;
  hourlyMax: number;
  projectMin: number;
  projectMax: number;
  weeklyMin: number;
  weeklyMax: number;
  monthlyMin: number;
  monthlyMax: number;
  yearlyMin: number;
  yearlyMax: number;
}

interface EarningPotentialCalculatorProps {
  className?: string;
  initialInputs?: Partial<CalculatorInputs>;
  onCalculate?: (inputs: CalculatorInputs, earnings: EarningData) => void;
}

// Earning potential data based on field and skill level (in HKD)
const EARNING_MULTIPLIERS = {
  fieldMultipliers: {
    'computer_science': 1.3,
    'data_science': 1.4,
    'software_engineering': 1.3,
    'artificial_intelligence': 1.5,
    'cybersecurity': 1.4,
    'finance': 1.2,
    'marketing': 1.0,
    'business_administration': 1.1,
    'graphic_design': 0.9,
    'ux_ui_design': 1.2,
    'default': 1.0
  },
  skillMultipliers: {
    'beginner': 0.7,
    'intermediate': 1.0,
    'advanced': 1.4,
    'expert': 1.8
  },
  yearMultipliers: {
    'year_1': 0.8,
    'year_2': 0.9,
    'year_3': 1.0,
    'year_4': 1.1,
    'masters': 1.2,
    'phd': 1.3,
    'recent_graduate': 1.1
  },
  locationMultipliers: {
    'remote': 1.0,
    'hybrid': 1.1,
    'onsite': 1.2
  }
};

const BASE_RATES = {
  hourlyMin: 80,
  hourlyMax: 150,
  projectMin: 3000,
  projectMax: 8000
};

export const EarningPotentialCalculator: React.FC<EarningPotentialCalculatorProps> = ({
  className = '',
  initialInputs = {},
  onCalculate
}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    skillLevel: 'intermediate',
    fieldOfStudy: '',
    yearOfStudy: '',
    hoursPerWeek: 15,
    preferredType: 'both',
    location: 'remote',
    ...initialInputs
  });

  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculatedEarnings = useMemo((): EarningData => {
    const fieldMultiplier = EARNING_MULTIPLIERS.fieldMultipliers[inputs.fieldOfStudy as keyof typeof EARNING_MULTIPLIERS.fieldMultipliers] || EARNING_MULTIPLIERS.fieldMultipliers.default;
    const skillMultiplier = EARNING_MULTIPLIERS.skillMultipliers[inputs.skillLevel];
    const yearMultiplier = EARNING_MULTIPLIERS.yearMultipliers[inputs.yearOfStudy as keyof typeof EARNING_MULTIPLIERS.yearMultipliers] || 1.0;
    const locationMultiplier = EARNING_MULTIPLIERS.locationMultipliers[inputs.location];

    const totalMultiplier = fieldMultiplier * skillMultiplier * yearMultiplier * locationMultiplier;

    const hourlyMin = Math.round(BASE_RATES.hourlyMin * totalMultiplier);
    const hourlyMax = Math.round(BASE_RATES.hourlyMax * totalMultiplier);
    const projectMin = Math.round(BASE_RATES.projectMin * totalMultiplier);
    const projectMax = Math.round(BASE_RATES.projectMax * totalMultiplier);

    const weeklyMin = hourlyMin * inputs.hoursPerWeek;
    const weeklyMax = hourlyMax * inputs.hoursPerWeek;
    const monthlyMin = weeklyMin * 4.33; // Average weeks per month
    const monthlyMax = weeklyMax * 4.33;
    const yearlyMin = monthlyMin * 12;
    const yearlyMax = monthlyMax * 12;

    return {
      hourlyMin,
      hourlyMax,
      projectMin,
      projectMax,
      weeklyMin: Math.round(weeklyMin),
      weeklyMax: Math.round(weeklyMax),
      monthlyMin: Math.round(monthlyMin),
      monthlyMax: Math.round(monthlyMax),
      yearlyMin: Math.round(yearlyMin),
      yearlyMax: Math.round(yearlyMax)
    };
  }, [inputs]);

  React.useEffect(() => {
    onCalculate?.(inputs, calculatedEarnings);
  }, [inputs, calculatedEarnings, onCalculate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/20 rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Earning Potential Calculator
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estimate your potential earnings based on your profile
          </p>
        </div>
        <HelpTooltip 
          content="This calculator provides estimates based on market data for Hong Kong students. Actual earnings may vary based on project complexity, client budget, and negotiation." 
          position="left"
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skill Level
          </label>
          <select
            value={inputs.skillLevel}
            onChange={(e) => updateInput('skillLevel', e.target.value as CalculatorInputs['skillLevel'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="beginner">Beginner (Learning basics)</option>
            <option value="intermediate">Intermediate (Some experience)</option>
            <option value="advanced">Advanced (Strong skills)</option>
            <option value="expert">Expert (Industry level)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hours per Week
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={inputs.hoursPerWeek}
              onChange={(e) => updateInput('hoursPerWeek', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
              {inputs.hoursPerWeek}h
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Work Preference
          </label>
          <select
            value={inputs.location}
            onChange={(e) => updateInput('location', e.target.value as CalculatorInputs['location'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="remote">Remote Work</option>
            <option value="hybrid">Hybrid (Office + Remote)</option>
            <option value="onsite">On-site Work</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Type
          </label>
          <select
            value={inputs.preferredType}
            onChange={(e) => updateInput('preferredType', e.target.value as CalculatorInputs['preferredType'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="both">Both Hourly & Project</option>
            <option value="hourly">Hourly Only</option>
            <option value="project">Project Only</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Primary Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputs.preferredType !== 'project' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Hourly Rate</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(calculatedEarnings.hourlyMin)} - {formatCurrency(calculatedEarnings.hourlyMax)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">per hour</div>
            </div>
          )}

          {inputs.preferredType !== 'hourly' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Project Rate</span>
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(calculatedEarnings.projectMin)} - {formatCurrency(calculatedEarnings.projectMax)}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">per project</div>
            </div>
          )}

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Weekly Potential</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(calculatedEarnings.weeklyMin)} - {formatCurrency(calculatedEarnings.weeklyMax)}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              {inputs.hoursPerWeek} hours/week
            </div>
          </div>
        </div>

        {/* Extended Projections */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>{showBreakdown ? 'Hide' : 'Show'} Extended Projections</span>
          </button>

          {showBreakdown && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(calculatedEarnings.monthlyMin)} - {formatCurrency(calculatedEarnings.monthlyMax)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Potential</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(calculatedEarnings.yearlyMin)} - {formatCurrency(calculatedEarnings.yearlyMax)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Yearly Potential</div>
              </div>

              <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                  {Math.round(calculatedEarnings.yearlyMin / 12 / 1000)}K - {Math.round(calculatedEarnings.yearlyMax / 12 / 1000)}K
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">Monthly Average (HKD)</div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Disclaimer:</strong> These are estimated earnings based on market data for Hong Kong students. 
            Actual earnings depend on project complexity, client budgets, your negotiation skills, and market conditions. 
            Use as a general guideline for setting expectations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EarningPotentialCalculator;