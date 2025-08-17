"use client";

import { Suspense, lazy } from "react";
import { ReportsSkeleton } from "@/components/skeletons/EmployerSkeletons";

// Dynamically import the Reports component with performance monitoring
const Reports = lazy(() => 
  import("@/components/dashboard/employer_portal/workspace/Reports")
    .then(mod => ({ default: mod.default }))
    .catch(() => ({ default: () => <div>Error loading Reports</div> }))
);

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <Reports />
    </Suspense>
  );
}
