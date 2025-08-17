"use client";

import { Suspense, lazy } from "react";
import { CalendarSkeleton } from "@/components/skeletons/EmployerSkeletons";

// Dynamically import the EmployerCalendar component with performance monitoring
const EmployerCalendar = lazy(() => 
  import("@/components/dashboard/employer_portal/workspace/EmployerCalendar")
    .then(mod => ({ default: mod.default }))
    .catch(() => ({ default: () => <div>Error loading Calendar</div> }))
);

export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <EmployerCalendar />
    </Suspense>
  );
}
