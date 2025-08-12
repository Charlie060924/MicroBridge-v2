"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerProfile component
const EmployerProfile = lazy(() => import("@/components/dashboard/employer_portal/workspace/EmployerProfile").catch(() => ({ default: () => <div>Error loading Employer Profile</div> })));

export default function EmployerProfilePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerProfile />
    </Suspense>
  );
}
