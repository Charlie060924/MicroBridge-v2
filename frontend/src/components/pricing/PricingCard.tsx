"use client";
import React from 'react';
import { Check, Star, Crown, Zap, Briefcase, GraduationCap, CalendarDays, MessageSquare, Shield } from 'lucide-react';
import Button from '@/components/common/ui/Button';
import Badge from '@/components/common/ui/Badge';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  isFree?: boolean;
  ctaText: string;
  ctaLink?: string;
  ctaAction?: () => void;
  icon?: 'zap' | 'star' | 'crown' | 'briefcase' | 'graduation-cap';
  audience: 'student' | 'employer';
}

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
  showBadge?: boolean;
}

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'zap':
      return Zap;
    case 'star':
      return Star;
    case 'crown':
      return Crown;
    case 'briefcase':
      return Briefcase;
    case 'graduation-cap':
      return GraduationCap;
    default:
      return Star;
  }
};

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  className = '',
  showBadge = true 
}) => {
  const Icon = getIcon(plan.icon);
  
  const handleCTA = () => {
    if (plan.ctaAction) {
      plan.ctaAction();
    } else if (plan.ctaLink) {
      window.location.href = plan.ctaLink;
    }
  };

  return (
    <div className={`group relative rounded-xl border-2 bg-white dark:bg-gray-800 p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
      plan.isPopular 
        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
        : plan.isFree && plan.audience === 'student'
        ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
    } ${className}`}>
      
      {/* Badge */}
      {showBadge && (plan.isPopular || plan.isRecommended || (plan.isFree && plan.audience === 'student')) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          {plan.isPopular && (
            <Badge variant="default" className="bg-blue-500 text-white">
              Most Popular
            </Badge>
          )}
          {plan.isRecommended && (
            <Badge variant="default" className="bg-purple-500 text-white">
              Recommended
            </Badge>
          )}
          {plan.isFree && plan.audience === 'student' && (
            <Badge variant="completed" className="bg-green-500 text-white">
              Free Forever
            </Badge>
          )}
        </div>
      )}

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className={`p-4 rounded-2xl ${
          plan.audience === 'student' 
            ? 'bg-green-100 dark:bg-green-900/20' 
            : 'bg-blue-100 dark:bg-blue-900/20'
        }`}>
          <Icon className={`h-8 w-8 ${
            plan.audience === 'student' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-blue-600 dark:text-blue-400'
          }`} />
        </div>
      </div>

      {/* Plan Name & Price */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        
        <div className="mb-4">
          {plan.isFree ? (
            <div>
              <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                Free
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                Forever
              </span>
            </div>
          ) : (
            <div>
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                /{plan.billingPeriod}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          {plan.description}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
              plan.audience === 'student' 
                ? 'text-green-500' 
                : 'text-blue-500'
            }`} />
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={plan.isFree ? 'outline' : 'primary'}
        size="lg"
        className={`w-full ${
          plan.audience === 'student' && plan.isFree
            ? 'border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20'
            : plan.audience === 'student'
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : ''
        }`}
        onClick={handleCTA}
      >
        {plan.ctaText}
      </Button>

      {/* Secure Payment Note for Employers */}
      {plan.audience === 'employer' && !plan.isFree && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Includes secure salary payments & escrow protection
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCard;
