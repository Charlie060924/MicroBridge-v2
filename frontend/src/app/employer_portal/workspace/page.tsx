"use client";

import { Suspense, lazy } from "react";
import { DashboardSkeleton } from "@/components/skeletons/EmployerSkeletons";

// Dynamically import the EmployerHomepage component with performance monitoring
const EmployerHomepage = lazy(() => 
  import("@/components/dashboard/employer_portal/workspace/EmployerHomepage")
    .then(mod => ({ default: mod.default }))
    .catch(() => ({ default: () => <div>Error loading Employer Dashboard</div> }))
);

export default function EmployerPortalWorkspacePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EmployerHomepage />
    </Suspense>
  );
}
