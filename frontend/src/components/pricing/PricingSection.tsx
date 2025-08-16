"use client";
import React from 'react';
import { Briefcase, GraduationCap, CalendarDays, MessageSquare, Shield, Users, Star, TrendingUp } from 'lucide-react';
import PricingCard, { PricingPlan } from './PricingCard';
import SectionHeader from '@/components/common/Common/SectionHeader';

interface PricingSectionProps {
  variant?: 'student' | 'employer' | 'general';
  showHeader?: boolean;
  className?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  variant = 'general',
  showHeader = true,
  className = ''
}) => {
  
  // Student pricing plans (free access)
  const studentPlans: PricingPlan[] = [
    {
      id: 'student-free',
      name: 'Student Access',
      price: 0,
      billingPeriod: 'month',
      description: 'Complete access to opportunities and career development tools.',
      features: [
        'Unlimited job applications',
        'Profile visibility to employers',
        'Set your availability calendar',
        'Direct messaging with employers',
        'Skill development tracking',
        'Portfolio showcase',
        'Interview scheduling',
        'Career progress insights',
        'Community support'
      ],
      isFree: true,
      ctaText: 'Get Started Free',
      ctaLink: '/auth/signup',
      icon: 'graduation-cap',
      audience: 'student'
    }
  ];

  // Employer pricing plans
  const employerPlans: PricingPlan[] = [
    {
      id: 'employer-starter',
      name: 'Starter',
      price: 49,
      billingPeriod: 'month',
      description: 'Perfect for small businesses and startups looking to hire talent.',
      features: [
        '3 job posts per month',
        'Basic candidate search & filtering',
        'View candidate profiles',
        'Email support',
        'Standard analytics',
        'Secure payment processing'
      ],
      ctaText: 'Start Free Trial',
      ctaAction: () => window.location.href = '/auth/employer-signup',
      icon: 'zap',
      audience: 'employer'
    },
    {
      id: 'employer-growth',
      name: 'Growth',
      price: 99,
      billingPeriod: 'month',
      description: 'Ideal for growing companies with regular hiring needs.',
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
      isPopular: true,
      ctaText: 'Subscribe Now',
      ctaAction: () => window.location.href = '/subscription',
      icon: 'star',
      audience: 'employer'
    },
    {
      id: 'employer-pro',
      name: 'Professional',
      price: 199,
      billingPeriod: 'month',
      description: 'Complete solution for enterprises and recruitment agencies.',
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
      isRecommended: true,
      ctaText: 'Contact Sales',
      ctaAction: () => window.location.href = '/contact',
      icon: 'crown',
      audience: 'employer'
    }
  ];

  // General pricing plans (student-focused for main landing page)
  const generalPlans: PricingPlan[] = [
    studentPlans[0]  // Only show student plan on general landing pages
  ];

  const getPlansForVariant = () => {
    switch (variant) {
      case 'student':
        return studentPlans;
      case 'employer':
        return employerPlans;
      case 'general':
      default:
        return generalPlans;
    }
  };

  const getHeaderConfig = () => {
    switch (variant) {
      case 'student':
        return {
          title: 'FREE FOR STUDENTS',
          subtitle: 'Student Access',
          description: 'Apply to opportunities, set your availability, and grow your experience at no cost. MicroBridge is completely free for students in Hong Kong.',
        };
      case 'employer':
        return {
          title: 'PLANS FOR EMPLOYERS',
          subtitle: 'Flexible Pricing',
          description: 'Choose the plan that fits your hiring needs. From startups to enterprises, we have the right solution for your recruitment goals.',
        };
      case 'general':
      default:
        return {
          title: 'FREE FOR STUDENTS',
          subtitle: 'Student-First Platform',
          description: 'Join Hong Kong\'s leading student-employer platform completely free. Access unlimited opportunities and grow your career at no cost.',
        };
    }
  };

  const plans = getPlansForVariant();
  const headerConfig = getHeaderConfig();

  return (
    <section className={`overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30 ${className}`}>
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        
        {/* Header */}
        {showHeader && (
          <div className="mx-auto text-center mt-10">
            <SectionHeader headerInfo={headerConfig} />
          </div>
        )}

        {/* Special Student Message */}
        {(variant === 'student' || variant === 'general') && (
          <div className="mx-auto max-w-4xl text-center mb-12">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8">
              <div className="flex justify-center mb-4">
                <GraduationCap className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
                Free for Students – No Subscription Required
              </h3>
              <p className="text-green-700 dark:text-green-400 text-lg">
                As a student-first platform, we believe education and career opportunities should be accessible to everyone. 
                That's why MicroBridge is completely free for all students in Hong Kong.
              </p>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className={`grid gap-8 ${
            variant === 'student' || variant === 'general'
              ? 'grid-cols-1 max-w-md mx-auto' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {plans.map((plan) => (
              <PricingCard 
                key={plan.id} 
                plan={plan}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Additional Features Section for Employers */}
        {variant === 'employer' && (
          <div className="mx-auto max-w-4xl mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose MicroBridge?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                More than just a job board - we're your complete hiring solution
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Calendar Integration
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seamless scheduling with students' availability
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Secure Messaging
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built-in communication platform
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Secure Payments
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Escrow protection for all transactions
                </p>
              </div>
              
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Hong Kong Focused
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Local talent, local opportunities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Student Benefits Section */}
        {(variant === 'student' || variant === 'general') && (
          <div className="mx-auto max-w-4xl mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need to Succeed
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build your career with Hong Kong's leading student-employer platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Quality Opportunities
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Curated jobs and projects from verified Hong Kong employers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Direct Employer Contact
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect directly with hiring managers and decision makers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Secure Environment
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Safe, verified platform with payment protection
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Career Growth
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Build experience and develop skills with real projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
