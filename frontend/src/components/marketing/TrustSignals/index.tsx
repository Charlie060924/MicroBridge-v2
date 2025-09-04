"use client";

import { motion } from "framer-motion";
import { Shield, Award, Users, Star, Lock, CheckCircle } from "lucide-react";

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "SSL encrypted & PCI compliant"
    },
    {
      icon: CheckCircle,
      title: "Verified Companies",
      description: "All employers pre-screened"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "100% satisfaction or refund"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "GDPR & CCPA compliant"
    }
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Students Connected",
      color: "text-secondary"
    },
    {
      number: "500+", 
      label: "Partner Companies",
      color: "text-primary"
    },
    {
      number: "95%",
      label: "Success Rate",
      color: "text-success"
    },
    {
      number: "4.9★",
      label: "Platform Rating",
      color: "text-warning"
    }
  ];

  const mediaLogos = [
    { name: "TechCrunch", logo: "/images/media/techcrunch.svg" },
    { name: "Forbes", logo: "/images/media/forbes.svg" },
    { name: "Wired", logo: "/images/media/wired.svg" },
    { name: "VentureBeat", logo: "/images/media/venturebeat.svg" }
  ];

  return (
    <section className="py-12 lg:py-16 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div 
                key={index}
                className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm text-black mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs text-waterloo">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-b border-gray-100 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-sm text-waterloo">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Media Mentions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-waterloo mb-6">
            As featured in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60">
            {mediaLogos.map((media, index) => (
              <div key={index} className="flex items-center h-8">
                <span className="text-gray-400 font-medium text-sm">
                  {media.name}
                </span>
                {/* In a real implementation, you'd use proper logos */}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-neutral-light rounded-lg text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary mr-2" />
            <span className="font-semibold text-black">
              Payment Protection Guarantee
            </span>
          </div>
          <p className="text-sm text-waterloo max-w-2xl mx-auto">
            All transactions are protected by our secure payment system. Students receive payment 
            milestone-based completion, and companies are protected against unsatisfactory work.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;