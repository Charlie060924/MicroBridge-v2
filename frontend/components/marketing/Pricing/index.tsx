"use client";
import Image from "next/image";
import SectionHeader from "@/components/common/Common/SectionHeader";
import Link from "next/link";

const Pricing = () => {
  return (
    <>
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="mx-auto text-center mt-10">
            <SectionHeader
              headerInfo={{
                title: `PLANS FOR EVERY NEED`,
                subtitle: `Flexible Pricing`,
                description: `Choose the plan that fits your requirements. Employees get free access, while employers can start for free or upgrade for more capacity.`,
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="absolute -bottom-15 -z-1 h-full w-full">
            <Image
              fill
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-7.5 lg:flex-nowrap xl:gap-12.5">
            {/* Employee Plan */}
            <div className="group relative rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none md:w-[45%] lg:w-1/3 xl:p-12.5">
              <h3 className="mb-7.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                $0{" "}
                <span className="text-regular text-waterloo dark:text-manatee">/month</span>
              </h3>
              <h4 className="mb-2.5 text-para2 font-medium text-black dark:text-white">
                Employee Plan
              </h4>
              <p>Perfect for job seekers looking for opportunities.</p>
              <div className="mt-9 border-t border-stroke pb-12.5 pt-9 dark:border-strokedark">
                <ul>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Free forever</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Unlimited job applications</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Profile visibility to employers</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Basic job search filters</li>
                </ul>
              </div>

              <Link
                href="/auth/signup"
                aria-label="Get Started button"
                className="group/btn inline-flex items-center gap-2.5 font-medium text-primary transition-all duration-300 dark:text-white dark:hover:text-primary"
              >
                <span className="duration-300 group-hover/btn:pr-2">Get Started</span>
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            {/* Employer Starter Plan */}
            <div className="group relative rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none md:w-[45%] lg:w-1/3 xl:p-12.5">
              <div className="absolute -right-3.5 top-7.5 -rotate-90 rounded-bl-full rounded-tl-full bg-primary px-4.5 py-1.5 text-metatitle font-medium uppercase text-white">
                popular
              </div>

              <h3 className="mb-7.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                $0{" "}
                <span className="text-regular text-waterloo dark:text-manatee">/month</span>
              </h3>
              <h4 className="mb-2.5 text-para2 font-medium text-black dark:text-white">
                Employer Starter
              </h4>
              <p>Try our platform with basic posting capabilities.</p>

              <div className="mt-9 border-t border-stroke pb-12.5 pt-9 dark:border-strokedark">
                <ul>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">1 job posting per month</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Access to candidate pool</li>
                  <li className="mb-4 text-black opacity-40 last:mb-0 dark:text-manatee">
                    Advanced candidate filtering
                  </li>
                  <li className="mb-4 text-black opacity-40 last:mb-0 dark:text-manatee">Priority support</li>
                </ul>
              </div>

              <button
                aria-label="Try for Free button"
                className="group/btn inline-flex items-center gap-2.5 font-medium text-primary transition-all duration-300 dark:text-white dark:hover:text-primary"
              >
                <span className="duration-300 group-hover/btn:pr-2">Try for Free</span>
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            {/* Employer Pro Plan */}
            <div className="group relative rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none md:w-[45%] lg:w-1/3 xl:p-12.5">
              <h3 className="mb-7.5 text-3xl font-bold text-black dark:text-white xl:text-sectiontitle3">
                $399{" "}
                <span className="text-regular text-waterloo dark:text-manatee">/month</span>
              </h3>
              <h4 className="mb-2.5 text-para2 font-medium text-black dark:text-white">
                Employer Pro
              </h4>
              <p>Full access for growing businesses and recruiters.</p>

              <div className="mt-9 border-t border-stroke pb-12.5 pt-9 dark:border-strokedark">
                <ul>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">5 job postings per month</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Unlimited candidate access</li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">
                    Advanced filtering and analytics
                  </li>
                  <li className="mb-4 text-black last:mb-0 dark:text-manatee">Priority 24/7 support</li>
                </ul>
              </div>

              <button
                aria-label="Get Premium button"
                className="group/btn inline-flex items-center gap-2.5 font-medium text-primary transition-all duration-300 dark:text-white dark:hover:text-primary"
              >
                <span className="duration-300 group-hover/btn:pr-2">Get Premium</span>
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
