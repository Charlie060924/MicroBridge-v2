"use client";

const About = () => {
  return (
    <section className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <div className="flex flex-wrap gap-8 md:flex-nowrap md:items-center xl:gap-32.5">
          {/* Left Content */}
          <div className="md:w-1/2">
            <span className="font-medium uppercase text-black dark:text-white">
              ABOUT MICROBRIDGE
            </span>
            <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
              Connecting Hong Kong's
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg2 dark:before:bg-titlebgdark">
                Future Talent
              </span>
            </h2>
            <p className="mb-8 text-base leading-relaxed text-black dark:text-white">
              MicroBridge is a bilingual platform that connects Hong Kong university students with startups and SMEs through short-term, paid micro-internships. We bridge the gap between academic learning and real-world experience.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 text-center font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
              >
                Get Started
              </a>
              <a
                href="/employer"
                className="inline-flex items-center justify-center rounded-full border border-stroke px-7 py-3 text-center font-medium text-black transition duration-300 ease-in-out hover:border-primary hover:text-primary dark:border-strokedark dark:text-manatee dark:hover:border-primary dark:hover:text-primary"
              >
                For Employers
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">🎓</div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Student-Startup Collaboration Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
