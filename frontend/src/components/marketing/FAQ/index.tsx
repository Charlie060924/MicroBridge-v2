"use client";
import { useState } from "react";
import FAQItem from "./FAQItem";
import faqData from "./faqData";

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(1);

  const handleFaqToggle = (id: number) => {
    setActiveFaq(activeFaq === id ? 0 : id);
  };

  return (
    <section 
      className="relative overflow-hidden pb-20 lg:pb-25 xl:pb-30"
      style={{ scrollMarginTop: '100px' }} // Prevents header overlap when jumping to this section
      id="faq"
    >
      {/* Add negative margin and positive padding to control spacing */}
      <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 -mt-10 pt-10">
        <div className="flex flex-wrap gap-8 md:flex-nowrap md:items-center xl:gap-32.5">
          {/* Left Content */}
          <div className="md:w-2/5 lg:w-1/2">
            <span className="font-medium uppercase text-black dark:text-white">
              OUR FAQS
            </span>
            <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
              Frequently Asked
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg2 dark:before:bg-titlebgdark">
                Questions
              </span>
            </h2>

            <a
              href="/faqs"
              className="group mt-7.5 inline-flex items-center gap-2.5 text-black hover:text-primary dark:text-white dark:hover:text-primary"
            >
              <span className="duration-300 group-hover:pr-2">Know More</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>

          {/* Right Content - FAQ Items */}
          <div className="md:w-3/5 lg:w-1/2">
            <div className="rounded-lg bg-white shadow-solid-8 dark:border dark:border-strokedark dark:bg-blacksection">
              {faqData.slice(0, 3).map((faq) => (
                <FAQItem
                  key={faq.id}
                  faqData={{ ...faq, activeFaq, handleFaqToggle }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;