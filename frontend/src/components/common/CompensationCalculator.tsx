import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Info } from 'lucide-react';

interface CompensationCalculatorProps {
  selectedInterests: string[];
  selectedIndustries: string[];
  onExpectationChange: (expectation: CompensationExpectation) => void;
  disabled?: boolean;
  value?: CompensationExpectation;
}

export interface CompensationExpectation {
  hourlyMin: number;
  hourlyMax: number;
  projectMin: number;
  projectMax: number;
  preferredType: 'hourly' | 'project' | 'both';
}

const COMPENSATION_RANGES = {
  // Base ranges by career interest (HKD hourly)
  interests: {
    'software_development': { min: 120, max: 300 },
    'web_development': { min: 100, max: 250 },
    'mobile_development': { min: 130, max: 320 },
    'data_science': { min: 140, max: 350 },
    'machine_learning': { min: 150, max: 400 },
    'artificial_intelligence': { min: 160, max: 450 },
    'cybersecurity': { min: 140, max: 380 },
    'cloud_computing': { min: 130, max: 280 },
    'devops': { min: 120, max: 270 },
    'blockchain': { min: 150, max: 400 },
    'game_development': { min: 110, max: 280 },
    'ux_ui_design': { min: 90, max: 220 },
    'graphic_design': { min: 70, max: 180 },
    'motion_graphics': { min: 80, max: 200 },
    'product_design': { min: 100, max: 240 },
    'product_management': { min: 120, max: 280 },
    'project_management': { min: 100, max: 200 },
    'business_operations': { min: 80, max: 160 },
    'digital_marketing': { min: 70, max: 150 },
    'content_marketing': { min: 60, max: 130 },
    'social_media': { min: 50, max: 120 },
    'seo_sem': { min: 70, max: 140 },
    'business_analysis': { min: 90, max: 180 },
    'data_analysis': { min: 100, max: 200 },
    'financial_analysis': { min: 110, max: 220 },
    'market_research': { min: 80, max: 160 },
    'consulting': { min: 120, max: 250 },
    'strategy': { min: 100, max: 200 },
    'sales': { min: 60, max: 150 },
    'customer_success': { min: 70, max: 140 },
    'hr_recruiting': { min: 60, max: 130 },
    'content_writing': { min: 50, max: 120 },
    'video_production': { min: 80, max: 180 },
    'photography': { min: 60, max: 150 },
    'quality_assurance': { min: 70, max: 140 },
    'legal_tech': { min: 90, max: 200 }
  },
  // Industry multipliers
  industries: {
    'fintech': 1.3,
    'healthtech': 1.2,
    'ai_ml': 1.4,
    'blockchain': 1.3,
    'edtech': 1.0,
    'ecommerce': 1.1,
    'gaming': 1.1,
    'climate_tech': 1.2,
    'consulting': 1.2,
    'government': 0.9
  }
} as const;

const CompensationCalculator: React.FC<CompensationCalculatorProps> = ({
  selectedInterests,
  selectedIndustries,
  onExpectationChange,
  disabled = false,
  value
}) => {
  const [expectation, setExpectation] = useState<CompensationExpectation>(
    value || {
      hourlyMin: 80,
      hourlyMax: 150,
      projectMin: 3000,
      projectMax: 8000,
      preferredType: 'both'
    }
  );

  const calculateSuggestedRange = () => {
    if (selectedInterests.length === 0) {
      return { min: 60, max: 200 };
    }

    // Calculate base range from interests
    const interestRanges = selectedInterests
      .map(interest => COMPENSATION_RANGES.interests[interest as keyof typeof COMPENSATION_RANGES.interests])
      .filter(Boolean);
    
    if (interestRanges.length === 0) {
      return { min: 60, max: 200 };
    }

    const avgMin = interestRanges.reduce((sum, range) => sum + range.min, 0) / interestRanges.length;
    const avgMax = interestRanges.reduce((sum, range) => sum + range.max, 0) / interestRanges.length;

    // Apply industry multipliers
    const industryMultiplier = selectedIndustries.length > 0 
      ? selectedIndustries.reduce((avg, industry) => {
          const multiplier = COMPENSATION_RANGES.industries[industry as keyof typeof COMPENSATION_RANGES.industries];
          return avg + (multiplier || 1.0);
        }, 0) / selectedIndustries.length
      : 1.0;

    return {
      min: Math.round(avgMin * industryMultiplier),
      max: Math.round(avgMax * industryMultiplier)
    };
  };

  const suggestedRange = calculateSuggestedRange();

  useEffect(() => {
    onExpectationChange(expectation);
  }, [expectation, onExpectationChange]);

  const handleRangeChange = (type: 'hourlyMin' | 'hourlyMax' | 'projectMin' | 'projectMax', value: number) => {
    setExpectation(prev => ({ ...prev, [type]: value }));
  };

  const handleTypeChange = (type: CompensationExpectation['preferredType']) => {
    setExpectation(prev => ({ ...prev, preferredType: type }));
  };

  const applySuggested = () => {
    setExpectation(prev => ({
      ...prev,
      hourlyMin: suggestedRange.min,
      hourlyMax: suggestedRange.max,
      projectMin: suggestedRange.min * 40, // ~40 hours
      projectMax: suggestedRange.max * 80  // ~80 hours
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Compensation Expectations
          </h4>
        </div>
        {selectedInterests.length > 0 && (
          <button
            onClick={applySuggested}
            disabled={disabled}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Apply Suggested</span>
          </button>
        )}
      </div>

      {/* Suggested Range Display */}
      {selectedInterests.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Suggested Range Based on Your Interests
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                HKD ${suggestedRange.min}-${suggestedRange.max}/hour
                {selectedIndustries.length > 0 && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                    (Adjusted for {selectedIndustries.length} selected {selectedIndustries.length === 1 ? 'industry' : 'industries'})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Type Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preferred Payment Structure
        </label>
        <div className="flex space-x-2">
          {[
            { value: 'hourly' as const, label: 'Hourly Rate' },
            { value: 'project' as const, label: 'Project-based' },
            { value: 'both' as const, label: 'Both' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleTypeChange(value)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                expectation.preferredType === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Rate Range */}
      {(expectation.preferredType === 'hourly' || expectation.preferredType === 'both') && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hourly Rate Range (HKD)
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minimum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="30"
                  max="1000"
                  value={expectation.hourlyMin}
                  onChange={(e) => handleRangeChange('hourlyMin', Number(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Maximum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min={expectation.hourlyMin}
                  max="1000"
                  value={expectation.hourlyMax}
                  onChange={(e) => handleRangeChange('hourlyMax', Number(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project-based Range */}
      {(expectation.preferredType === 'project' || expectation.preferredType === 'both') && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Rate Range (HKD)
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minimum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="500"
                  max="50000"
                  step="500"
                  value={expectation.projectMin}
                  onChange={(e) => handleRangeChange('projectMin', Number(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Maximum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min={expectation.projectMin}
                  max="50000"
                  step="500"
                  value={expectation.projectMax}
                  onChange={(e) => handleRangeChange('projectMax', Number(e.target.value))}
                  disabled={disabled}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Range Visualization */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Your Compensation Range
        </h5>
        <div className="space-y-2">
          {(expectation.preferredType === 'hourly' || expectation.preferredType === 'both') && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Hourly:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                HKD ${expectation.hourlyMin} - ${expectation.hourlyMax}/hour
              </span>
            </div>
          )}
          {(expectation.preferredType === 'project' || expectation.preferredType === 'both') && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Project:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                HKD ${expectation.projectMin.toLocaleString()} - ${expectation.projectMax.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompensationCalculator;