"use client";

import { useState, useEffect } from 'react';
import { HelpCircle, User, Building2, Settings, FileText, DollarSign, Briefcase, Calendar, Shield, Globe, Phone, Mail, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import HelpSearch from '@/components/common/HelpSearch';
import FAQAccordion, { FAQItem } from '@/components/common/FAQAccordion';
import ContactSupportModal from '@/components/common/ContactSupportModal';

// Types
interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  faqs: FAQItem[];
}

// FAQ Data
const studentFAQs: Category[] = [
  {
    id: 'account-profile',
    title: 'Account & Profile',
    icon: <User className="w-6 h-6" />,
    description: 'Manage your account settings and profile information',
    faqs: [
      {
        id: 'create-account',
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button on the homepage and fill in your details. You can sign up using your email or Google account. Make sure to select "Student" as your role.',
        category: 'account-profile',
        tags: ['signup', 'registration', 'account']
      },
      {
        id: 'edit-profile',
        question: 'How do I edit my profile information?',
        answer: 'Go to your profile page and click the "Edit" button. You can update your personal information, skills, education, and experience. Remember to save your changes.',
        category: 'account-profile',
        tags: ['profile', 'edit', 'update']
      },
      {
        id: 'security-password',
        question: 'How do I manage security and password?',
        answer: 'In your settings, you can change your password, enable two-factor authentication, and manage your account security settings.',
        category: 'account-profile',
        tags: ['security', 'password', '2fa']
      },
      {
        id: 'contact-details',
        question: 'How do I update my contact details?',
        answer: 'Navigate to your profile settings and update your email, phone number, and other contact information. These details are used for job communications.',
        category: 'account-profile',
        tags: ['contact', 'email', 'phone']
      },
      {
        id: 'delete-account',
        question: 'How do I delete my account?',
        answer: 'Go to your account settings and scroll to the bottom. Click "Delete Account" and follow the confirmation process. Note that this action cannot be undone.',
        category: 'account-profile',
        tags: ['delete', 'account', 'remove']
      }
    ]
  },
  {
    id: 'finding-jobs',
    title: 'Finding & Applying for Jobs',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Discover and apply for micro-internship opportunities',
    faqs: [
      {
        id: 'browse-jobs',
        question: 'How do I browse available jobs?',
        answer: 'Use the job search page to view all available micro-internships. You can filter by category, duration, salary, and location to find opportunities that match your interests.',
        category: 'finding-jobs',
        tags: ['browse', 'search', 'jobs']
      },
      {
        id: 'filters-search',
        question: 'How do I use filters and search?',
        answer: 'Use the search bar to find specific keywords, and use filters to narrow down by job type, salary range, duration, and required skills.',
        category: 'finding-jobs',
        tags: ['filters', 'search', 'keywords']
      },
      {
        id: 'upload-resume',
        question: 'How do I upload a resume/CV?',
        answer: 'Go to your profile page and click "Upload Resume". Supported formats are PDF and DOCX with a maximum file size of 5MB.',
        category: 'finding-jobs',
        tags: ['resume', 'cv', 'upload']
      },
      {
        id: 'auto-fill-profile',
        question: 'How does auto-fill from profile work when applying?',
        answer: 'When you apply for a job, your profile information (name, contact details, skills, experience) will automatically populate the application form.',
        category: 'finding-jobs',
        tags: ['auto-fill', 'application', 'profile']
      },
      {
        id: 'job-statuses',
        question: 'What do the different job statuses mean?',
        answer: 'Applied: Your application has been submitted. Reviewed: The employer has viewed your application. Shortlisted: You\'ve been selected for the next round.',
        category: 'finding-jobs',
        tags: ['status', 'applied', 'reviewed', 'shortlisted']
      }
    ]
  },
  {
    id: 'application-process',
    title: 'Application Process',
    icon: <FileText className="w-6 h-6" />,
    description: 'Track and manage your job applications',
    faqs: [
      {
        id: 'track-application',
        question: 'How do I track my application?',
        answer: 'Go to your dashboard and click on "My Applications" to see the status of all your submitted applications and any updates from employers.',
        category: 'application-process',
        tags: ['track', 'status', 'applications']
      },
      {
        id: 'edit-withdraw',
        question: 'Can I edit or withdraw my application?',
        answer: 'You can edit your application within 24 hours of submission. To withdraw, go to your applications page and click "Withdraw Application".',
        category: 'application-process',
        tags: ['edit', 'withdraw', 'application']
      },
      {
        id: 'after-shortlisted',
        question: 'What happens after being shortlisted?',
        answer: 'You\'ll receive a notification and the employer may contact you to schedule an interview or discuss the project details further.',
        category: 'application-process',
        tags: ['shortlisted', 'interview', 'next-steps']
      },
      {
        id: 'interview-scheduling',
        question: 'How does interview scheduling work?',
        answer: 'Employers can schedule interviews through the platform. You\'ll receive calendar invites and can accept or request alternative times.',
        category: 'application-process',
        tags: ['interview', 'scheduling', 'calendar']
      }
    ]
  },
  {
    id: 'payments-rewards',
    title: 'Payments & Rewards',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Understand payment processes and the level system',
    faqs: [
      {
        id: 'salary-payment',
        question: 'How does the salary payment process work?',
        answer: 'Employers fund the project upfront. Once you complete the work and it\'s approved, payment is released to your connected Stripe account within 3-5 business days.',
        category: 'payments-rewards',
        tags: ['payment', 'salary', 'stripe']
      },
      {
        id: 'level-system',
        question: 'How does the level system and Career Coins work?',
        answer: 'Complete projects to earn XP and level up. Higher levels unlock more opportunities and Career Coins can be used for platform features and rewards.',
        category: 'payments-rewards',
        tags: ['levels', 'xp', 'career-coins']
      }
    ]
  },
  {
    id: 'technical-help',
    title: 'Technical Help',
    icon: <Settings className="w-6 h-6" />,
    description: 'Resolve technical issues and browser problems',
    faqs: [
      {
        id: 'clear-cache',
        question: 'How do I clear cache if pages aren\'t loading?',
        answer: 'Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac) to open browser settings. Clear browsing data including cache and cookies.',
        category: 'technical-help',
        tags: ['cache', 'loading', 'browser']
      },
      {
        id: 'login-issues',
        question: 'I\'m having trouble logging in. What should I do?',
        answer: 'Try resetting your password using the "Forgot Password" link. If that doesn\'t work, clear your browser cache or try a different browser.',
        category: 'technical-help',
        tags: ['login', 'password', 'reset']
      },
      {
        id: 'broken-buttons',
        question: 'Buttons or pages are unresponsive. How do I fix this?',
        answer: 'Refresh the page and try again. If the issue persists, clear your browser cache or try using a different browser or device.',
        category: 'technical-help',
        tags: ['buttons', 'unresponsive', 'refresh']
      },
      {
        id: 'browser-compatibility',
        question: 'Which browsers and devices are supported?',
        answer: 'We support Chrome, Firefox, Safari, and Edge on desktop and mobile devices. For the best experience, use the latest version of your browser.',
        category: 'technical-help',
        tags: ['browser', 'compatibility', 'devices']
      }
    ]
  }
];

const employerFAQs: Category[] = [
  {
    id: 'account-profile',
    title: 'Account & Profile',
    icon: <User className="w-6 h-6" />,
    description: 'Manage your company account and profile information',
    faqs: [
      {
        id: 'create-account',
        question: 'How do I create an employer account?',
        answer: 'Click "Sign Up" and select "Employer" as your role. Fill in your company details and verify your email address to get started.',
        category: 'account-profile',
        tags: ['signup', 'employer', 'company']
      },
      {
        id: 'edit-profile',
        question: 'How do I edit my company profile?',
        answer: 'Go to your company profile page and click "Edit". You can update company information, description, industry, and contact details.',
        category: 'account-profile',
        tags: ['profile', 'company', 'edit']
      },
      {
        id: 'security-password',
        question: 'How do I manage account security?',
        answer: 'In your settings, you can change passwords, enable two-factor authentication, and manage who has access to your company account.',
        category: 'account-profile',
        tags: ['security', 'password', 'access']
      },
      {
        id: 'contact-details',
        question: 'How do I update company contact details?',
        answer: 'Navigate to your company profile settings to update contact information, address, and communication preferences.',
        category: 'account-profile',
        tags: ['contact', 'company', 'details']
      },
      {
        id: 'delete-account',
        question: 'How do I delete my company account?',
        answer: 'Go to account settings and click "Delete Account". Note that this will remove all job postings and application data permanently.',
        category: 'account-profile',
        tags: ['delete', 'account', 'company']
      }
    ]
  },
  {
    id: 'posting-jobs',
    title: 'Posting Jobs',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Create and manage job postings',
    faqs: [
      {
        id: 'create-job',
        question: 'How do I create and publish a job post?',
        answer: 'Click "Post a Job" and fill in the required details including title, description, requirements, duration, and salary. Review and publish.',
        category: 'posting-jobs',
        tags: ['create', 'post', 'job']
      },
      {
        id: 'edit-job',
        question: 'Can I edit or remove a job post?',
        answer: 'Yes, go to your job postings dashboard and click "Edit" or "Remove". Note that editing may affect existing applications.',
        category: 'posting-jobs',
        tags: ['edit', 'remove', 'job']
      },
      {
        id: 'salary-requirements',
        question: 'How do I add salary and requirements?',
        answer: 'When creating a job post, you can specify salary range, required skills, experience level, and other requirements in the respective fields.',
        category: 'posting-jobs',
        tags: ['salary', 'requirements', 'skills']
      },
      {
        id: 'auto-fill-employer',
        question: 'How does auto-fill employer info work?',
        answer: 'Your company profile information automatically populates job posting forms, saving you time and ensuring consistency.',
        category: 'posting-jobs',
        tags: ['auto-fill', 'company', 'profile']
      }
    ]
  },
  {
    id: 'managing-applications',
    title: 'Managing Applications',
    icon: <FileText className="w-6 h-6" />,
    description: 'Review and manage candidate applications',
    faqs: [
      {
        id: 'view-profiles',
        question: 'How do I view candidate profiles?',
        answer: 'Click on any application to view the candidate\'s full profile, including their resume, skills, experience, and portfolio.',
        category: 'managing-applications',
        tags: ['profiles', 'candidates', 'view']
      },
      {
        id: 'shortlist-candidates',
        question: 'How do I shortlist candidates?',
        answer: 'Review applications and click "Shortlist" for candidates you want to consider further. You can also add notes for your team.',
        category: 'managing-applications',
        tags: ['shortlist', 'candidates', 'review']
      },
      {
        id: 'schedule-interviews',
        question: 'How do I schedule interviews?',
        answer: 'Use the interview scheduling tool to send calendar invites to shortlisted candidates. You can set up video calls or in-person meetings.',
        category: 'managing-applications',
        tags: ['interview', 'schedule', 'calendar']
      },
      {
        id: 'communicate-candidates',
        question: 'How can I communicate with candidates?',
        answer: 'Use the built-in messaging system to communicate with candidates about their applications, interviews, and project details.',
        category: 'managing-applications',
        tags: ['communication', 'messaging', 'candidates']
      }
    ]
  },
  {
    id: 'payments-invoicing',
    title: 'Payments & Invoicing',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Manage payments and view billing information',
    faqs: [
      {
        id: 'pay-salaries',
        question: 'How do I pay student salaries via the platform?',
        answer: 'Fund projects upfront when posting jobs. Once work is completed and approved, payments are automatically released to students.',
        category: 'payments-invoicing',
        tags: ['payment', 'salary', 'fund']
      },
      {
        id: 'subscriptions-billing',
        question: 'How do subscriptions and billing plans work?',
        answer: 'Choose a subscription plan based on your hiring needs. Plans include different numbers of job postings and premium features.',
        category: 'payments-invoicing',
        tags: ['subscription', 'billing', 'plans']
      },
      {
        id: 'view-invoices',
        question: 'How do I view past invoices?',
        answer: 'Go to your billing dashboard to view and download past invoices, payment history, and subscription details.',
        category: 'payments-invoicing',
        tags: ['invoices', 'billing', 'history']
      }
    ]
  },
  {
    id: 'technical-help',
    title: 'Technical Help',
    icon: <Settings className="w-6 h-6" />,
    description: 'Resolve technical issues and browser problems',
    faqs: [
      {
        id: 'clear-cache',
        question: 'How do I clear cache if pages aren\'t loading?',
        answer: 'Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac) to open browser settings. Clear browsing data including cache and cookies.',
        category: 'technical-help',
        tags: ['cache', 'loading', 'browser']
      },
      {
        id: 'login-issues',
        question: 'I\'m having trouble logging in. What should I do?',
        answer: 'Try resetting your password using the "Forgot Password" link. If that doesn\'t work, clear your browser cache or try a different browser.',
        category: 'technical-help',
        tags: ['login', 'password', 'reset']
      },
      {
        id: 'broken-buttons',
        question: 'Buttons or pages are unresponsive. How do I fix this?',
        answer: 'Refresh the page and try again. If the issue persists, clear your browser cache or try using a different browser or device.',
        category: 'technical-help',
        tags: ['buttons', 'unresponsive', 'refresh']
      },
      {
        id: 'browser-compatibility',
        question: 'Which browsers and devices are supported?',
        answer: 'We support Chrome, Firefox, Safari, and Edge on desktop and mobile devices. For the best experience, use the latest version of your browser.',
        category: 'technical-help',
        tags: ['browser', 'compatibility', 'devices']
      }
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Determine user role from auth context
  const userRole = user?.role === 'employer' ? 'employer' : 'student';

  const faqData = userRole === 'student' ? studentFAQs : employerFAQs;

  // Filter FAQs based on search query
  const filteredCategories = faqData.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })).filter(category => category.faqs.length > 0);

  // Get selected category data
  const selectedCategoryData = selectedCategory 
    ? faqData.find(cat => cat.id === selectedCategory)
    : null;

  // Get most popular FAQs (first 3 from each category)
  const popularFAQs = faqData.flatMap(category => 
    category.faqs.slice(0, 3)
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Auto-select first category with results if no category is selected
    if (!selectedCategory && query) {
      const firstCategoryWithResults = filteredCategories[0];
      if (firstCategoryWithResults) {
        setSelectedCategory(firstCategoryWithResults.id);
      }
    }
  };

  // Get search results across all categories
  const searchResults = searchQuery ? faqData.flatMap(category => 
    category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  ) : [];

  const handleContactSupport = () => {
    setShowContactModal(true);
  };

  const quickLinks = userRole === 'student' 
    ? [
        { title: 'Browse Jobs', href: '/student_portal/workspace/jobs', icon: <Briefcase className="w-4 h-4" /> },
        { title: 'Update Profile', href: '/student_portal/workspace/profile', icon: <User className="w-4 h-4" /> },
        { title: 'Payment Settings', href: '/student_portal/workspace/settings', icon: <DollarSign className="w-4 h-4" /> }
      ]
    : [
        { title: 'Post a Job', href: '/employer_portal/workspace/jobs/create', icon: <Briefcase className="w-4 h-4" /> },
        { title: 'Update Profile', href: '/employer_portal/workspace/profile', icon: <User className="w-4 h-4" /> },
        { title: 'Payment Settings', href: '/employer_portal/workspace/billing', icon: <DollarSign className="w-4 h-4" /> }
      ];

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading help center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Help Center
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions and get support for {userRole === 'student' ? 'students' : 'employers'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <HelpSearch
                  placeholder="Search help articles..."
                  onSearch={handleSearch}
                  initialValue={searchQuery}
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  Categories
                </h3>
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-600 dark:text-gray-400">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {category.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.faqs.length} articles
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {link.icon}
                      <span className="font-medium">{link.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Still need help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <button
                  onClick={handleContactSupport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - FAQ Details */}
          <div className="lg:col-span-3">
            {searchQuery && searchResults.length > 0 ? (
              // Search Results View
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Search Results
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
                <FAQAccordion items={searchResults} />
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              // No Search Results View
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We couldn't find any help articles matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear search and browse all articles
                </button>
              </div>
            ) : selectedCategoryData ? (
              // Category View
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-blue-600 dark:text-blue-400">
                      {selectedCategoryData.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCategoryData.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCategoryData.description}
                  </p>
                </div>
                <FAQAccordion items={selectedCategoryData.faqs} />
              </div>
            ) : (
              // Default View - Most Popular
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Most Popular Help Articles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start here to find answers to the most common questions
                  </p>
                </div>
                <FAQAccordion items={popularFAQs} />
                
                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Browse our categories or use the search bar to find specific help articles.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faqData.slice(0, 3).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        userRole={userRole}
      />
    </div>
  );
}