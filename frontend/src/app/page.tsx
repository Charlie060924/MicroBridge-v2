import { Metadata } from "next";
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LandingLayout from "./(site)/landing-layout";

export const metadata: Metadata = {
  title: "MicroBridge - Student-Startup Collaboration Platform",
  description: "Connect students with startups for real-world projects and experience",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://microbridge.com',
    siteName: 'MicroBridge',
    images: [
      {
        url: 'https://microbridge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MicroBridge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroBridge - Student-Startup Collaboration Platform',
    description: 'Connect students with startups for real-world projects and experience',
    images: ['https://microbridge.com/og-image.jpg'],
  },
};

// Dynamically import all components with loading states and error handling
const Hero = lazy(() => import("@/components/marketing/home/Hero/index").catch(() => ({ default: () => <div>Error loading Hero</div> })));
const Brands = lazy(() => import("@/components/marketing/Brands/index").catch(() => ({ default: () => <div>Error loading Brands</div> })));
const Feature = lazy(() => import("@/components/marketing/home/Features/index").catch(() => ({ default: () => <div>Error loading Features</div> })));
const FeaturesTab = lazy(() => import("@/components/marketing/home/FeaturesTab/index").catch(() => ({ default: () => <div>Error loading FeaturesTab</div> })));
const Testimonial = lazy(() => import("@/components/marketing/Testimonial/index").catch(() => ({ default: () => <div>Error loading Testimonial</div> })));
const Pricing = lazy(() => import("@/components/marketing/Pricing/index").catch(() => ({ default: () => <div>Error loading Pricing</div> })));
const HowItWorks = lazy(() => import("@/components/marketing/HowItWorks/index").catch(() => ({ default: () => <div>Error loading HowItWorks</div> })));
const TrustSignals = lazy(() => import("@/components/marketing/TrustSignals/index").catch(() => ({ default: () => <div>Error loading TrustSignals</div> })));
const FAQ = lazy(() => import("@/components/marketing/FAQ/index").catch(() => ({ default: () => <div>Error loading FAQ</div> })));
const Contact = lazy(() => import("@/components/marketing/Contact/index").catch(() => ({ default: () => <div>Error loading Contact</div> })));
const Blog = lazy(() => import("@/components/marketing/Blog/index"));
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

export default function Home() {
  // console.log("Home component rendering");
  
  return (
    <LandingLayout>
      <main>
        {/* Above-the-fold components */}
        <LazyLoadComponent>
          <Hero />
        </LazyLoadComponent>

        {/* How It Works - Before Features as per UX recommendations */}
        <LazyLoadComponent>
          <HowItWorks />
        </LazyLoadComponent>

        {/* Main features */}
        <LazyLoadComponent>
          <Feature />
        </LazyLoadComponent>

        <LazyLoadComponent>
          <FeaturesTab />
        </LazyLoadComponent>

        {/* Below-the-fold components (less critical) */}
        <NonCriticalSection>
          <Testimonial />
        </NonCriticalSection>

        {/* Trust Signals - After Testimonials as per UX recommendations */}
        <NonCriticalSection>
          <TrustSignals />
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