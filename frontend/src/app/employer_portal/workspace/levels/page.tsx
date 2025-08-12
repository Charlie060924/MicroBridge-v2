"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerLevels component
const EmployerLevels = lazy(() => import("@/components/dashboard/employer_portal/workspace/EmployerLevels").catch(() => ({ default: () => <div>Error loading Employer Levels</div> })));

export default function EmployerLevelsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerLevels />
    </Suspense>
  );
}
