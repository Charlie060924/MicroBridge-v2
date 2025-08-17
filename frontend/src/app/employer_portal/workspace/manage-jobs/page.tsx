"use client";

import { Suspense, lazy } from "react";
import { JobsSkeleton } from "@/components/skeletons/EmployerSkeletons";

// Dynamically import the ManageJobs component with performance monitoring
const ManageJobs = lazy(() => 
  import("@/components/dashboard/employer_portal/workspace/ManageJobs")
    .then(mod => ({ default: mod.default }))
    .catch(() => ({ default: () => <div>Error loading Manage Jobs</div> }))
);

export default function ManageJobsPage() {
  return (
    <Suspense fallback={<JobsSkeleton />}>
      <ManageJobs />
    </Suspense>
  );
}
