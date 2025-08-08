"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the StudentHomepage component
const StudentHomepage = lazy(() => import("@/components/dashboard/student_portal/workspace/StudentHomepage").catch(() => ({ default: () => <div>Error loading Student Dashboard</div> })));

export default function StudentPortalWorkspacePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StudentHomepage />
    </Suspense>
  );
}
