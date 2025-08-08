import { Metadata } from "next";
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export const metadata: Metadata = {
  title: "MicroBridge - For Employers",
  description: "Hire Hong Kong's top student talent for your startup projects",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://microbridge.com/employer',
    siteName: 'MicroBridge',
    images: [
      {
        url: 'https://microbridge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MicroBridge for Employers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroBridge - For Employers',
    description: 'Hire Hong Kong\'s top student talent for your startup projects',
    images: ['https://microbridge.com/og-image.jpg'],
  },
};

// Dynamically import all components with loading states and error handling
const Hero = lazy(() => import("@/components/marketing/home/Hero/index").catch(() => ({ default: () => <div>Error loading Hero</div> })));
const Brands = lazy(() => import("@/components/marketing/Brands/index").catch(() => ({ default: () => <div>Error loading Brands</div> })));
const Features = lazy(() => import("@/components/marketing/home/Features/index").catch(() => ({ default: () => <div>Error loading Features</div> })));
const FeaturesTab = lazy(() => import("@/components/marketing/home/FeaturesTab/index").catch(() => ({ default: () => <div>Error loading FeaturesTab</div> })));
const Pricing = lazy(() => import("@/components/marketing/Pricing/index").catch(() => ({ default: () => <div>Error loading Pricing</div> })));
const FAQ = lazy(() => import("@/components/marketing/FAQ/index").catch(() => ({ default: () => <div>Error loading FAQ</div> })));
const Contact = lazy(() => import("@/components/marketing/Contact/index").catch(() => ({ default: () => <div>Error loading Contact</div> })));

// Create intersection observer components for critical/non-critical sections
const LazyLoadComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {children}
    </Suspense>
  );
};

const NonCriticalSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}> {/* Don't block render for non-critical sections */}
      {children}
    </Suspense>
  );
};

export default function EmployerHomePage() {
  return (
    <main className="bg-white dark:bg-black">
      {/* Above-the-fold components */}
      <LazyLoadComponent>
        <Hero variant="employer" />
      </LazyLoadComponent>
      
      <LazyLoadComponent>
        <Brands />
      </LazyLoadComponent>
      
      <LazyLoadComponent>
        <Features variant="employer" />
      </LazyLoadComponent>
      
      <LazyLoadComponent>
        <FeaturesTab variant="employer" />
      </LazyLoadComponent>
      
      {/* Below-the-fold components (less critical) */}
      <NonCriticalSection>
        <Pricing />
      </NonCriticalSection>
      
      <NonCriticalSection>
        <FAQ />
      </NonCriticalSection>
      
      <NonCriticalSection>
        <Contact />
      </NonCriticalSection>
    </main>
  );
}
