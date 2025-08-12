"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerSettings component
const EmployerSettings = lazy(() => import("@/components/dashboard/employer_portal/workspace/EmployerSettings").catch(() => ({ default: () => <div>Error loading Employer Settings</div> })));

export default function EmployerSettingsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerSettings />
    </Suspense>
  );
}
