"use client";

import { FC } from "react";
import SingleFeature from "./SingleFeature";
import SectionHeader from "@/components/common/Common/SectionHeader";

import studentFeaturesData from "./featuresData/studentFeaturesData";
import employerFeaturesData from "./featuresData/employerFeaturesData";

interface FeatureProps {
  variant?: "student" | "employer";
}

const Feature: FC<FeatureProps> = ({ variant = "student" }) => {
  const featuresData =
    variant === "employer" ? employerFeaturesData : studentFeaturesData;

  return (
    <section id="features" className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <SectionHeader
          headerInfo={{
            title: "PLATFORM FEATURES",
            subtitle:
              variant === "employer"
                ? "What Makes MicroBridge Work for Employers"
                : "Why Students Love MicroBridge",
            description:
              variant === "employer"
                ? `MicroBridge simplifies how startups and students collaborate. From smart matching to secure payments and built-in communication tools, we've built everything you need to complete projects efficiently and confidently.`
                : `Students use MicroBridge to gain real-world experience, build portfolios, and work flexibly while studying. Explore how the platform empowers your career.`,
          }}
        />
        <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
          {featuresData.map((feature, key) => (
            <SingleFeature feature={feature} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
