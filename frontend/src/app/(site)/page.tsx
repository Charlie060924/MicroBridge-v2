import { Metadata } from "next";
import { Suspense, lazy } from "react";

export const metadata: Metadata = {
  title: "Next.js Starter Template for SaaS Startups - Solid SaaS Boilerplate",
  description: "This is Home for Solid Pro",
  // Enhanced metadata for better SEO
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: 'Solid SaaS Boilerplate',
    images: [
      {
        url: 'https://yoursite.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solid SaaS Boilerplate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Starter Template for SaaS Startups',
    description: 'This is Home for Solid Pro',
    images: ['https://yoursite.com/og-image.jpg'],
  },
};

// Dynamic imports with loading states
const Hero = lazy(() => import("@/components/marketing/home/Hero")
  .then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div>Error loading Hero</div> })));

const Brands = lazy(() => import("@/components/marketing/Brands")
  .then(module => ({ default: module.default })));

const Feature = lazy(() => import("@/components/marketing/home/Features")
  .then(module => ({ default: module.default })));

const About = lazy(() => import("@/components/marketing/About")
  .then(module => ({ default: module.default })));

const FeaturesTab = lazy(() => import("@/components/marketing/home/FeaturesTab")
  .then(module => ({ default: module.default })));

const Testimonial = lazy(() => import("@/components/marketing/Testimonial")
  .then(module => ({ default: module.default })));

const Pricing = lazy(() => import("@/components/marketing/Pricing")
  .then(module => ({ default: module.default })));

const FAQ = lazy(() => import("@/components/marketing/FAQ")
  .then(module => ({ default: module.default })));

const Contact = lazy(() => import("@/components/marketing/Contact")
  .then(module => ({ default: module.default })));

const Blog = lazy(() => import("@/components/marketing/Blog")
  .then(module => ({ default: module.default })));

const Footer = lazy(() => import("@/components/common/Footer/index")
  .then(module => ({ default: module.default })));

// Loading skeleton components
const HeroSkeleton = () => (
  <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
);

const GenericSkeleton = ({ height = 'h-96' }: { height?: string }) => (
  <div className={`w-full ${height} bg-gray-100 dark:bg-gray-800 animate-pulse my-4 rounded-lg`}></div>
);

export default function Home() {
  return (
    <main>
      {/* Above-the-fold components */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<GenericSkeleton height="h-40" />}>
        <Brands />
      </Suspense>

      <Suspense fallback={<GenericSkeleton />}>
        <Feature />
      </Suspense>

      {/* Main content */}
      <Suspense fallback={<GenericSkeleton />}>
        <About />
      </Suspense>

      <Suspense fallback={<GenericSkeleton />}>
        <FeaturesTab />
      </Suspense>

      {/* Below-the-fold components */}
      <Suspense fallback={<GenericSkeleton height="h-[500px]" />}>
        <Testimonial />
      </Suspense>

      <Suspense fallback={<GenericSkeleton />}>
        <Pricing />
      </Suspense>

      <Suspense fallback={<GenericSkeleton height="h-[400px]" />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<GenericSkeleton />}>
        <Contact />
      </Suspense>

      <Suspense fallback={null}> {/* Footer can load in background */}
        <Footer />
      </Suspense>
    </main>
  );
}