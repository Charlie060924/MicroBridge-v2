"use client";

import Header from "../../components/common/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ToasterContext from "../context/ToastContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [shouldShowHeader, setShouldShowHeader] = useState(false);

  useEffect(() => {
    // Paths where header should be hidden
    const noHeaderPaths = [
      "/auth",          // covers /auth, /auth/login, /auth/register, etc.
      "/onboarding",
      "/students_info",
      "/student_portal"
    ];

    // Hide header if the current path starts with any of the above
    const hideHeader = noHeaderPaths.some(path =>
      pathname?.startsWith(path)
    );

    setShouldShowHeader(!hideHeader);
  }, [pathname]);

  return (
    <>
      {shouldShowHeader && <Header />}
      <ToasterContext />
      {children}
    </>
  );
}
