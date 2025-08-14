import { Metadata } from "next";
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LandingLayout from "../landing-layout";

export const metadata: Metadata = {
  title: "MicroBridge - For Students",
  description: "Connect with Hong Kong startups for real-world micro-internship opportunities",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://microbridge.com/student',
    siteName: 'MicroBridge',
    images: [
      {
        url: 'https://microbridge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MicroBridge for Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroBridge - For Students',
    description: 'Connect with Hong Kong startups for real-world micro-internship opportunities',
    images: ['https://microbridge.com/og-image.jpg'],
  },
};

// Dynamically import all components with loading states and error handling
const Hero = lazy(() => import("@/components/marketing/home/Hero/index").catch(() => ({ default: () => <div>Error loading Hero</div> })));
const Brands = lazy(() => import("@/components/marketing/Brands/index").catch(() => ({ default: () => <div>Error loading Brands</div> })));
const Features = lazy(() => import("@/components/marketing/home/Features/index").catch(() => ({ default: () => <div>Error loading Features</div> })));
const FeaturesTab = lazy(() => import("@/components/marketing/home/FeaturesTab/index").catch(() => ({ default: () => <div>Error loading FeaturesTab</div> })));
const Testimonial = lazy(() => import("@/components/marketing/Testimonial/index").catch(() => ({ default: () => <div>Error loading Testimonial</div> })));
const Pricing = lazy(() => import("@/components/marketing/Pricing/index").catch(() => ({ default: () => <div>Error loading Pricing</div> })));
const FAQ = lazy(() => import("@/components/marketing/FAQ/index").catch(() => ({ default: () => <div>Error loading FAQ</div> })));
const Contact = lazy(() => import("@/components/marketing/Contact/index").catch(() => ({ default: () => <div>Error loading Contact</div> })));
const Footer = lazy(() => import("@/components/common/Footer/index").catch(() => ({ default: () => <div>Error loading Footer</div> })));

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

export default function StudentHomePage() {
  return (
    <LandingLayout>
      <main className="bg-white dark:bg-black">
        {/* Above-the-fold components */}
        <LazyLoadComponent>
          <Hero variant="student" />
        </LazyLoadComponent>
        
        <LazyLoadComponent>
          <Brands />
        </LazyLoadComponent>
        
        <LazyLoadComponent>
          <Features variant="student" />
        </LazyLoadComponent>
        
        <LazyLoadComponent>
          <FeaturesTab variant="student" />
        </LazyLoadComponent>
        
        {/* Below-the-fold components (less critical) */}
        <NonCriticalSection>
          <Testimonial />
        </NonCriticalSection>
        
        <NonCriticalSection>
          <Pricing />
        </NonCriticalSection>
        
        <NonCriticalSection>
          <FAQ />
        </NonCriticalSection>
        
        <NonCriticalSection>
          <Contact />
        </NonCriticalSection>
        
        <NonCriticalSection>
          <Footer />
        </NonCriticalSection>
      </main>
    </LandingLayout>
  );
}
