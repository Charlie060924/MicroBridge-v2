"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  MapPin, 
  Calendar,
  TrendingUp,
  Briefcase,
  Award,
  ExternalLink
} from 'lucide-react';

interface SuccessStory {
  id: string;
  user: {
    name: string;
    avatar?: string;
    title: string;
    previousTitle?: string;
    location: string;
    university?: string;
  };
  company: {
    name: string;
    logo?: string;
    industry: string;
    size: string;
  };
  job: {
    title: string;
    category: string;
    salaryIncrease?: number;
    isRemote: boolean;
  };
  story: {
    quote: string;
    challenge: string;
    solution: string;
    outcome: string;
    timeline: string;
    tags: string[];
  };
  metrics: {
    applicationToHire: string;
    timeToHire: string;
    salaryGrowth: string;
    satisfactionScore: number;
  };
  featured: boolean;
  publishedAt: Date;
  category: 'career_change' | 'first_job' | 'promotion' | 'remote_transition' | 'startup_success';
}

interface SuccessStoryShowcaseProps {
  maxStories?: number;
  autoPlay?: boolean;
  showFilters?: boolean;
  showMetrics?: boolean;
  variant?: 'carousel' | 'grid' | 'list';
  className?: string;
}

const SuccessStoryShowcase: React.FC<SuccessStoryShowcaseProps> = ({
  maxStories = 6,
  autoPlay = true,
  showFilters = true,
  showMetrics = true,
  variant = 'carousel',
  className = ''
}) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock success stories data
  useEffect(() => {
    const mockStories: SuccessStory[] = [
      {
        id: 'story-1',
        user: {
          name: 'Sarah Chen',
          title: 'Senior Software Engineer',
          previousTitle: 'Junior Developer',
          location: 'San Francisco, CA',
          university: 'UC Berkeley'
        },
        company: {
          name: 'TechFlow Systems',
          industry: 'Software',
          size: '50-200 employees'
        },
        job: {
          title: 'Senior Software Engineer',
          category: 'Engineering',
          salaryIncrease: 65,
          isRemote: false
        },
        story: {
          quote: "MicroBridge helped me transition from a junior role to senior engineer in just 8 months. The personalized job matching was incredible.",
          challenge: "Felt stuck in junior role with limited growth opportunities",
          solution: "Used MicroBridge's skill assessment and targeted applications",
          outcome: "Landed senior role with 65% salary increase at a top tech company",
          timeline: "3 weeks from application to offer",
          tags: ['career-growth', 'skill-development', 'tech']
        },
        metrics: {
          applicationToHire: '1 of 3 applications',
          timeToHire: '3 weeks',
          salaryGrowth: '+65%',
          satisfactionScore: 5.0
        },
        featured: true,
        publishedAt: new Date('2024-01-15'),
        category: 'promotion'
      },
      {
        id: 'story-2',
        user: {
          name: 'Marcus Johnson',
          title: 'Product Manager',
          location: 'Remote, USA',
          university: 'Stanford'
        },
        company: {
          name: 'InnovateLabs',
          industry: 'Healthcare Tech',
          size: '10-50 employees'
        },
        job: {
          title: 'Senior Product Manager',
          category: 'Product',
          salaryIncrease: 40,
          isRemote: true
        },
        story: {
          quote: "The remote job matching was perfect. Found an amazing startup that values work-life balance and pays competitively.",
          challenge: "Wanted to transition to remote work without salary cut",
          solution: "Leveraged MicroBridge's remote job filters and company insights",
          outcome: "Secured remote product role at fast-growing healthtech startup",
          timeline: "5 weeks from search to start",
          tags: ['remote-work', 'product-management', 'startup']
        },
        metrics: {
          applicationToHire: '2 of 5 applications',
          timeToHire: '5 weeks',
          salaryGrowth: '+40%',
          satisfactionScore: 4.8
        },
        featured: true,
        publishedAt: new Date('2024-02-01'),
        category: 'remote_transition'
      },
      {
        id: 'story-3',
        user: {
          name: 'Elena Rodriguez',
          title: 'UX Designer',
          location: 'Austin, TX',
          university: 'UT Austin'
        },
        company: {
          name: 'DesignCo',
          industry: 'Design Agency',
          size: '200+ employees'
        },
        job: {
          title: 'Senior UX Designer',
          category: 'Design',
          isRemote: true
        },
        story: {
          quote: "As a recent graduate, MicroBridge's mentorship program and portfolio feedback were game-changers for landing my dream job.",
          challenge: "Recent graduate competing against experienced designers",
          solution: "Built strong portfolio with MicroBridge guidance and mentorship",
          outcome: "Landed first job at top design agency with strong onboarding",
          timeline: '6 weeks from graduation to offer',
          tags: ['first-job', 'design', 'portfolio']
        },
        metrics: {
          applicationToHire: '3 of 8 applications',
          timeToHire: '6 weeks',
          salaryGrowth: 'N/A (First Job)',
          satisfactionScore: 4.9
        },
        featured: false,
        publishedAt: new Date('2024-01-20'),
        category: 'first_job'
      },
      {
        id: 'story-4',
        user: {
          name: 'David Kim',
          title: 'Data Scientist',
          previousTitle: 'Marketing Analyst',
          location: 'Seattle, WA',
          university: 'University of Washington'
        },
        company: {
          name: 'DataVentures',
          industry: 'AI/ML',
          size: '50-200 employees'
        },
        job: {
          title: 'Senior Data Scientist',
          category: 'Data Science',
          salaryIncrease: 80,
          isRemote: true
        },
        story: {
          quote: "Successfully pivoted from marketing to data science. The career transition resources and skill matching were invaluable.",
          challenge: "Career change from marketing to data science",
          solution: "Used MicroBridge's career transition tools and skill gap analysis",
          outcome: "Successfully transitioned with 80% salary increase",
          timeline: '4 months from decision to hire',
          tags: ['career-change', 'data-science', 'upskilling']
        },
        metrics: {
          applicationToHire: '1 of 4 applications',
          timeToHire: '4 weeks',
          salaryGrowth: '+80%',
          satisfactionScore: 5.0
        },
        featured: true,
        publishedAt: new Date('2024-02-10'),
        category: 'career_change'
      }
    ];

    setStories(mockStories);
    setFilteredStories(mockStories);
    setLoading(false);
  }, []);

  // Filter stories by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredStories(stories);
    } else {
      setFilteredStories(stories.filter(story => story.category === activeCategory));
    }
    setCurrentIndex(0);
  }, [stories, activeCategory]);

  // Auto-play carousel
  useEffect(() => {
    if (autoPlay && variant === 'carousel' && filteredStories.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredStories.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, variant, filteredStories.length]);

  const categoryOptions = [
    { id: 'all', label: 'All Stories', count: stories.length },
    { id: 'career_change', label: 'Career Change', count: stories.filter(s => s.category === 'career_change').length },
    { id: 'first_job', label: 'First Job', count: stories.filter(s => s.category === 'first_job').length },
    { id: 'promotion', label: 'Promotion', count: stories.filter(s => s.category === 'promotion').length },
    { id: 'remote_transition', label: 'Remote Work', count: stories.filter(s => s.category === 'remote_transition').length }
  ];

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const renderStoryCard = (story: SuccessStory, index?: number) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.1 : 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {story.featured && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium px-3 py-1 text-center">
          ⭐ Featured Success Story
        </div>
      )}
      
      <div className="p-6">
        {/* Quote Section */}
        <div className="relative mb-6">
          <Quote className="w-6 h-6 text-blue-200 absolute -top-2 -left-1" />
          <p className="text-gray-700 italic text-lg leading-relaxed pl-6">
            "{story.story.quote}"
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {story.user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{story.user.name}</h4>
            <div className="text-sm text-gray-600">
              {story.user.previousTitle && (
                <span>{story.user.previousTitle} → </span>
              )}
              <span className="font-medium">{story.user.title}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{story.user.location}</span>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">{story.company.name}</h5>
              <p className="text-sm text-gray-600">{story.company.industry}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{story.job.title}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Briefcase className="w-3 h-3" />
                <span>{story.company.size}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-green-600 font-semibold text-sm">Success Rate</div>
              <div className="text-lg font-bold text-green-700">{story.metrics.applicationToHire}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-blue-600 font-semibold text-sm">Time to Hire</div>
              <div className="text-lg font-bold text-blue-700">{story.metrics.timeToHire}</div>
            </div>
            {story.metrics.salaryGrowth !== 'N/A (First Job)' && (
              <div className="bg-purple-50 rounded-lg p-3 text-center col-span-2">
                <div className="text-purple-600 font-semibold text-sm">Salary Growth</div>
                <div className="text-xl font-bold text-purple-700">{story.metrics.salaryGrowth}</div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.story.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(story.metrics.satisfactionScore)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              {story.metrics.satisfactionScore.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{story.publishedAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h2>
        <p className="text-gray-600">Real stories from our community members who found their dream jobs</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryOptions.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{label}</span>
              <span className="text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {variant === 'carousel' && (
        <div className="relative">
          <AnimatePresence mode="wait">
            {filteredStories.length > 0 && renderStoryCard(filteredStories[currentIndex])}
          </AnimatePresence>
          
          {filteredStories.length > 1 && (
            <>
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex justify-center space-x-2 mt-4">
                {filteredStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {variant === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.slice(0, maxStories).map((story, index) => 
            renderStoryCard(story, index)
          )}
        </div>
      )}

      {variant === 'list' && (
        <div className="space-y-6">
          {filteredStories.slice(0, maxStories).map((story, index) => 
            renderStoryCard(story, index)
          )}
        </div>
      )}

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stories Found</h3>
          <p className="text-gray-600">Try selecting a different category to see more success stories.</p>
        </div>
      )}
    </div>
  );
};

export default SuccessStoryShowcase;