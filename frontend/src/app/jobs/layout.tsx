"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ToasterContext from "../context/ToastContext";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [shouldShowHeader, setShouldShowHeader] = useState(false);

  useEffect(() => {
    // For job pages, we generally want to hide the header for a cleaner experience
    // Only show header for the main jobs listing page if needed
    const showHeaderPaths = [
      "/jobs"  // Only show header on the main jobs listing page
    ];

    // Show header only if the current path exactly matches one of the above
    const showHeader = showHeaderPaths.some(path =>
      pathname === path
    );

    setShouldShowHeader(showHeader);
  }, [pathname]);

  return (
    <>
      {/* No header for job pages - they have their own clean layout */}
      <ToasterContext />
      {children}
    </>
  );
}
