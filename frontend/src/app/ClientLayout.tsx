"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudentPortal = pathname?.startsWith('/student_portal');

  return (
    <>
      {!isStudentPortal && <Header />}
      {children}
    </>
  );
}
