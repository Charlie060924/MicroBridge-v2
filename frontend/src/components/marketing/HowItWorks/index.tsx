"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Students Discover Opportunities",
      description: "Browse real projects from vetted startups and companies. Filter by skills, interests, and availability to find the perfect match.",
      icon: "/images/how-it-works/discover.svg",
      userType: "student"
    },
    {
      number: "02", 
      title: "Companies Post Projects",
      description: "Share your real business challenges and projects. Get matched with skilled students ready to contribute and learn.",
      icon: "/images/how-it-works/post.svg",
      userType: "employer"
    },
    {
      number: "03",
      title: "Smart Matching & Application",
      description: "Our algorithm matches students with relevant projects. Apply with confidence using our streamlined application process.",
      icon: "/images/how-it-works/match.svg", 
      userType: "both"
    },
    {
      number: "04",
      title: "Collaborate & Deliver",
      description: "Work together using our integrated tools. Track progress, communicate effectively, and deliver real business value.",
      icon: "/images/how-it-works/collaborate.svg",
      userType: "both"
    },
    {
      number: "05",
      title: "Build Experience & Network",
      description: "Students gain real-world experience and portfolio projects. Companies discover emerging talent and fresh perspectives.",
      icon: "/images/how-it-works/grow.svg",
      userType: "both"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-neutral-light">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-12 lg:mb-16"
        >
          <h2 className="font-bold text-3xl xl:text-sectiontitle2 text-black mb-4">
            How MicroBridge Works
          </h2>
          <p className="text-lg text-waterloo max-w-3xl mx-auto">
            A simple 5-step process connecting students with real-world opportunities 
            and helping companies access fresh talent and innovative perspectives.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className={`relative ${
                index === 2 || index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Step Card */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
                {/* Step Number & Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* User Type Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.userType === 'student' 
                      ? 'bg-secondary text-white' 
                      : step.userType === 'employer'
                        ? 'bg-warning text-black'
                        : 'bg-info text-white'
                  }`}>
                    {step.userType === 'both' ? 'Students & Companies' : 
                     step.userType === 'student' ? 'For Students' : 'For Companies'}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-xl text-black mb-4">
                  {step.title}
                </h3>
                <p className="text-waterloo leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connection Line (visible on larger screens) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-6 w-12 h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-[-3px] w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="btn-primary inline-flex items-center justify-center"
            >
              Get Started as Student
            </a>
            <a
              href="/auth/employer-signup"  
              className="btn-secondary inline-flex items-center justify-center"
            >
              Post Your First Project
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;