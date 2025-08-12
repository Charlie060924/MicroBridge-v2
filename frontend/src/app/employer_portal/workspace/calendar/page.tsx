"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerCalendar component
const EmployerCalendar = lazy(() => import("@/components/dashboard/employer_portal/workspace/EmployerCalendar").catch(() => ({ default: () => <div>Error loading Calendar</div> })));

export default function CalendarPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerCalendar />
    </Suspense>
  );
}
