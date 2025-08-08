// /app/pricing/page.tsx
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const Pricing = lazy(() => import("@/components/marketing/Pricing/index").catch(() => ({ default: () => <div>Error loading Pricing</div> })));

export default function PricingPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Pricing />
    </Suspense>
  );
}