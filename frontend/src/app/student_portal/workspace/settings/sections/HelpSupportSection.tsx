import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ExternalLink, FileText, Shield, MessageCircle, BookOpen, Phone, Mail } from 'lucide-react';
import SettingCard from '../components/SettingCard';
import Button from '@/components/common/ui/Button';
import ContactSupportModal from '@/components/common/ContactSupportModal';

interface HelpSupportSectionProps {
  onSaveAll?: () => Promise<void>;
  isSaving?: boolean;
  hasChanges?: boolean;
}

const HelpSupportSection: React.FC<HelpSupportSectionProps> = ({ 
  onSaveAll, 
  isSaving = false, 
  hasChanges = false 
}) => {
  const [showContactModal, setShowContactModal] = useState(false);

  const helpResources = [
    {
      icon: HelpCircle,
      title: "Help Centre",
      description: "Find answers to common questions and get step-by-step guides",
      href: "/help",
      color: "blue"
    },
    {
      icon: BookOpen,
      title: "Student Guide",
      description: "Learn how to create an amazing profile and find micro-internships",
      href: "/help?category=student-guide",
      color: "green"
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Get personalized help from our support team",
      onClick: () => setShowContactModal(true),
      color: "purple"
    }
  ];

  const quickActions = [
    {
      icon: FileText,
      title: "How to Apply for Micro-Internships",
      href: "/help?q=how-to-apply"
    },
    {
      icon: BookOpen,
      title: "Profile Optimization Tips",
      href: "/help?q=profile-tips"
    },
    {
      icon: HelpCircle,
      title: "Payment & Billing FAQ",
      href: "/help?q=payment"
    }
  ];

  const policies = [
    {
      title: "Terms of Service",
      href: "/terms_of_services",
      description: "Our terms and conditions for using MicroBridge"
    },
    {
      title: "Privacy Policy",
      href: "/privacy",
      description: "How we protect and handle your personal data"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30",
      green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30",
      purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <>
      <SettingCard
        icon={HelpCircle}
        title="Help & Support"
        description="Get help, learn about our policies, and contact support"
      >
        <div className="space-y-8">
          {/* Help Resources */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Need Help?
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {helpResources.map((resource) => {
                const IconComponent = resource.icon;
                const content = (
                  <div className={`p-4 rounded-lg border transition-colors cursor-pointer ${getColorClasses(resource.color)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {resource.title}
                        </p>
                        <p className="text-sm mt-1">
                          {resource.description}
                        </p>
                      </div>
                      {resource.href && (
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  </div>
                );

                return resource.href ? (
                  <Link key={resource.title} href={resource.href}>
                    {content}
                  </Link>
                ) : (
                  <button key={resource.title} onClick={resource.onClick}>
                    {content}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Popular Help Topics
            </h4>
            
            <div className="space-y-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900 dark:text-orange-100">
                  Urgent Support
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  For urgent issues related to payments or account access, contact us immediately.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <Mail className="w-4 h-4 inline mr-1" />
                    support@microbridge.hk
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <Phone className="w-4 h-4 inline mr-1" />
                    +852 3000 0000 (Mon-Fri, 9AM-6PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              About MicroBridge
            </h4>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                For Hong Kong Students
              </h5>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                MicroBridge connects university students in Hong Kong with short-term, 
                paid project opportunities at startups and growing companies. Build your 
                skills, gain experience, and earn money while studying.
              </p>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Legal & Policies Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Legal & Policies
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <Link
              key={policy.title}
              href={policy.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {policy.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {policy.description}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © 2024 MicroBridge. All rights reserved. 
            <br />
            Questions? Contact us at{' '}
            <a href="mailto:support@microbridge.hk" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@microbridge.hk
            </a>
          </p>
        </div>
      </div>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        userRole="student"
      />
    </>
  );
};

export default HelpSupportSection;
