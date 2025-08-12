"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the Reports component
const Reports = lazy(() => import("@/components/dashboard/employer_portal/workspace/Reports").catch(() => ({ default: () => <div>Error loading Reports</div> })));

export default function ReportsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Reports />
    </Suspense>
  );
}
