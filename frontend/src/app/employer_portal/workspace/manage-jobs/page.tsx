"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the ManageJobs component
const ManageJobs = lazy(() => import("@/components/dashboard/employer_portal/workspace/ManageJobs").catch(() => ({ default: () => <div>Error loading Manage Jobs</div> })));

export default function ManageJobsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ManageJobs />
    </Suspense>
  );
}
