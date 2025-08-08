"use client";
import { lazy, Suspense, useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/common/Common/SectionHeader";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Only lazy load the SingleTestimonial component
const SingleTestimonial = lazy(() => import("./SingleTestimonial"));

// Import testimonial data normally
import { testimonialData } from "./testimonialData";

// 5. Intersection Observer wrapper component
const TestimonialLoader = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={ref} className="testimonial-observer">
      {isVisible && children}
    </div>
  );
};

const Testimonial = () => {
  // 6. Memoized configuration objects
  const swiperConfig = useMemo(() => ({
    spaceBetween: 50,
    slidesPerView: 2,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    }
  }), []);

  // 7. Virtualized rendering fallback for large datasets
  const renderTestimonials = useMemo(() => {
    return (data: typeof testimonialData) => (
      <Swiper
        {...swiperConfig}
        modules={[Autoplay, Pagination]}
      >
        {data.map((review) => (
          <SwiperSlide key={review?.id}>
            <Suspense fallback={<TestimonialSkeleton />}>
              <SingleTestimonial review={review} />
            </Suspense>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }, [swiperConfig]);

  return (
    <section>
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <div className="animate_top mx-auto text-center">
          <SectionHeader
            headerInfo={{
              title: `TESTIMONIALS`,
              subtitle: `Client's Testimonials`,
              description: `Hear from students who landed dream roles and startups that found perfect matches through our micro-internships. These testimonials show how we turn opportunities into success stories.`,
            }}
          />
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top mx-auto mt-15 max-w-c-1235 px-4 md:px-8 xl:mt-20 xl:px-0"
      >
        <div className="swiper testimonial-01 mb-20 pb-22.5">
          <TestimonialLoader>
            <Swiper
              {...swiperConfig}
              modules={[Autoplay, Pagination]}
            >
              {testimonialData.map((review) => (
                <SwiperSlide key={review?.id}>
                  <Suspense fallback={<TestimonialSkeleton />}>
                    <SingleTestimonial review={review} />
                  </Suspense>
                </SwiperSlide>
              ))}
            </Swiper>
          </TestimonialLoader>
        </div>
      </motion.div>
    </section>
  );
};

// 8. Optimized skeleton loading component
const TestimonialSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full max-w-[500px] p-6 border rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonial;