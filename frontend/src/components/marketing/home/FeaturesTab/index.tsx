"use client";
import { useState } from "react";
import FeaturesTabItem from "./FeaturesTabItem";
import featuresTabData from "./featuresTabData";
import { motion } from "framer-motion";

interface FeaturesTabProps {
  variant?: "student" | "employer";
}

const FeaturesTab = ({ variant = "student" }: FeaturesTabProps) => {
  const [currentTab, setCurrentTab] = useState("tabOne");

  const data = featuresTabData[variant];

  return (
    <>
      <section className="relative pb-20 pt-18.5 lg:pb-22.5">
        <div className="relative mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* Tab Menus */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top mb-15 flex flex-wrap justify-center rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 md:flex-nowrap md:items-center lg:gap-7.5 xl:mb-21.5 xl:gap-12.5"
          >
            {data.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setCurrentTab(feature.id)}
                className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-6 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-13.5 xl:py-5 ${
                  currentTab === feature.id ? "active" : ""
                }`}
              >
                <div className="flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                  <p className="text-metatitle3 font-medium text-black dark:text-white">
                    {feature.id === "tabOne"
                      ? "01"
                      : feature.id === "tabTwo"
                      ? "02"
                      : "03"}
                  </p>
                </div>
                <div className="md:w-3/5 lg:w-auto">
                  <button className="text-sm font-medium text-black dark:text-white xl:text-regular">
                    {feature.title}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="animate_top mx-auto max-w-c-1154"
          >
            {data.map((feature) => (
              <div
                className={feature.id === currentTab ? "block" : "hidden"}
                key={feature.id}
              >
                <FeaturesTabItem featureTab={feature} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FeaturesTab;
