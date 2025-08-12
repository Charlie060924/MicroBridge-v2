"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the Applications component
const Applications = lazy(() => import("@/components/dashboard/employer_portal/workspace/Applications").catch(() => ({ default: () => <div>Error loading Applications</div> })));

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Applications />
    </Suspense>
  );
}
