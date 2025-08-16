"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerPricingPage component
const EmployerPricingPage = lazy(() => import("@/components/pricing/EmployerPricingPage").catch(() => ({ default: () => <div>Error loading Pricing Page</div> })));

export default function EmployerPricingPortalPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerPricingPage showBackButton={true} />
    </Suspense>
  );
}
