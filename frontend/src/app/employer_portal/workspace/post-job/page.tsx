"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the PostJobForm component
const PostJobForm = lazy(() => import("@/components/dashboard/employer_portal/workspace/PostJobForm").catch(() => ({ default: () => <div>Error loading Post Job Form</div> })));

export default function PostJobPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostJobForm />
    </Suspense>
  );
}
