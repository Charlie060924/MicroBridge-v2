"use client";

import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Dynamically import the EmployerInfoForm component
const EmployerInfoForm = lazy(() => import("@/components/dashboard/Employers/EmployerInfoForm").catch(() => ({ default: () => <div>Error loading Company Info Form</div> })));

export default function CompanyInfoPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EmployerInfoForm />
    </Suspense>
  );
}
