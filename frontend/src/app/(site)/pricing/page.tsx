// /app/pricing/page.tsx
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LandingLayout from "../landing-layout";

const PricingSection = lazy(() => import("@/components/pricing/PricingSection").catch(() => ({ default: () => <div>Error loading Pricing</div> })));

export default function PricingPage() {
  return (
    <LandingLayout>
      <Suspense fallback={<LoadingSkeleton />}>
        <PricingSection variant="student" />
      </Suspense>
    </LandingLayout>
  );
}