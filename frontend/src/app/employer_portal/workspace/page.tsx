"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerHomepage component
const EmployerHomepage = lazy(() => import("@/components/dashboard/employer_portal/workspace/EmployerHomepage").catch(() => ({ default: () => <div>Error loading Employer Dashboard</div> })));

export default function EmployerPortalWorkspacePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerHomepage />
    </Suspense>
  );
}
