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
  const [isStudentPortal, setIsStudentPortal] = useState(false);

  // Handle client-side routing to prevent hydration mismatch
  useEffect(() => {
    setIsStudentPortal(pathname?.startsWith('/student_portal') || false);
  }, [pathname]);

  return (
    <>
      {!isStudentPortal && <Header />}
      <ToasterContext />
      {children}
    </>
  );
}