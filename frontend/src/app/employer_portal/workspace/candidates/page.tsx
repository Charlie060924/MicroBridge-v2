"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the Candidates component
const Candidates = lazy(() => import("@/components/dashboard/employer_portal/workspace/Candidates").catch(() => ({ default: () => <div>Error loading Candidates</div> })));

export default function CandidatesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Candidates />
    </Suspense>
  );
}
