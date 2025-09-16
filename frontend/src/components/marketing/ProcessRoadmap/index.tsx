"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export type UserType = "student" | "employer";

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
  userType: UserType | "both";
};

export type ProcessRoadmapData = {
  student: ProcessStep[];
  employer: ProcessStep[];
};

interface ProcessRoadmapProps {
  userType: UserType;
}

const ProcessRoadmap = ({ userType }: ProcessRoadmapProps) => {

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

  const roadmapData: ProcessRoadmapData = {
    student: [
      {
        number: "01",
        title: "Discover Opportunities",
        description: "Browse real projects from vetted startups and companies. Filter by skills, interests, and availability to find the perfect match.",
        icon: "/images/how-it-works/discover.svg",
        userType: "student"
      },
      {
        number: "02",
        title: "Smart Matching & Application",
        description: "Our algorithm matches you with relevant projects. Apply with confidence using our streamlined application process.",
        icon: "/images/how-it-works/match.svg",
        userType: "student"
      },
      {
        number: "03",
        title: "Collaborate & Deliver",
        description: "Work with companies using our integrated tools. Track progress, communicate effectively, and deliver real business value.",
        icon: "/images/how-it-works/collaborate.svg",
        userType: "student"
      },
      {
        number: "04",
        title: "Build Experience & Network",
        description: "Gain real-world experience and portfolio projects. Build your professional network and discover career opportunities.",
        icon: "/images/how-it-works/grow.svg",
        userType: "student"
      }
    ],
    employer: [
      {
        number: "01",
        title: "Post Projects",
        description: "Share your real business challenges and projects. Define scope, skills needed, and project requirements clearly.",
        icon: "/images/how-it-works/post.svg",
        userType: "employer"
      },
      {
        number: "02",
        title: "Smart Matching & Review",
        description: "Our algorithm matches you with skilled students. Review applications and select the best candidates for your project.",
        icon: "/images/how-it-works/match.svg",
        userType: "employer"
      },
      {
        number: "03",
        title: "Collaborate & Manage",
        description: "Work with students using our integrated project management tools. Track deliverables and provide guidance.",
        icon: "/images/how-it-works/collaborate.svg",
        userType: "employer"
      },
      {
        number: "04",
        title: "Access Fresh Talent",
        description: "Discover emerging talent and fresh perspectives. Build relationships with promising students for future opportunities.",
        icon: "/images/how-it-works/grow.svg",
        userType: "employer"
      }
    ]
  };

  const currentSteps = roadmapData[userType];

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
            A simple step-by-step process connecting {userType === 'student' ? 'students with real-world opportunities' : 'companies with fresh talent and innovative perspectives'}.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {currentSteps.map((step, index) => (
            <motion.div
              key={`${userType}-${step.number}`}
              variants={itemVariants}
              className="relative"
            >
              {/* Step Card */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
                {/* Step Number & User Type Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userType === 'student'
                      ? 'bg-secondary text-white'
                      : 'bg-warning text-black'
                  }`}>
                    {userType === 'student' ? 'For Students' : 'For Companies'}
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
              {index < currentSteps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-6 w-12 h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-[-3px] w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ProcessRoadmap;