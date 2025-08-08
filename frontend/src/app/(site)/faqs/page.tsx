import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const FAQ = lazy(() => import("@/components/marketing/FAQ/index").catch(() => ({ default: () => <div>Error loading FAQ</div> })));

export default function FAQPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FAQ />
    </Suspense>
  );
}