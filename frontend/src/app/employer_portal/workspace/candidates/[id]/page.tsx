"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the CandidateProfile component
const CandidateProfile = lazy(() => import("@/components/dashboard/employer_portal/workspace/CandidateProfile").catch(() => ({ default: () => <div>Error loading Candidate Profile</div> })));

export default function CandidateProfilePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CandidateProfile />
    </Suspense>
  );
}
