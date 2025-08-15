"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the ApplicationCalendar component
const ApplicationCalendar = lazy(() => import("@/components/dashboard/student_portal/workspace/ApplicationCalendar").catch(() => ({ default: () => <div>Error loading Application Calendar</div> })));

export default function CalendarPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ApplicationCalendar />
    </Suspense>
  );
}