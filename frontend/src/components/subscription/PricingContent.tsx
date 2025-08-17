"use client";
import React from 'react';
import { CalendarDays, MessageSquare, Shield, TrendingUp, Star, Users } from 'lucide-react';

const PricingContent: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Why Choose MicroBridge?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          More than just a job board - we're your complete hiring solution for connecting with Hong Kong's top student talent.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Calendar Integration
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seamless scheduling with students' availability
          </p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Secure Messaging
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built-in communication platform
          </p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Secure Payments
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Escrow protection for all transactions
          </p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Hong Kong Focused
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Local talent, local opportunities
          </p>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Build your team with Hong Kong's leading student-employer platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Star className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quality Talent
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Access verified students from top Hong Kong universities
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Direct Student Contact
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Connect directly with motivated student talent
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-blue-500" />
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
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Business Growth
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Scale your operations with flexible talent solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Benefits
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Discover how MicroBridge streamlines your hiring process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Smart Matching
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our algorithm quickly matches projects to students with the right skills
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payments
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All payments handled securely through Stripe Connect with escrow protection
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Collaboration Tools
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built-in messaging and file-sharing to keep project communication organized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingContent;
