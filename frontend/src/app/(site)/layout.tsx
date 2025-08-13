"use client";

import Header from "../../components/common/Header";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";
import ToasterContext from "../context/ToastContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldShowHeader = useHeaderVisibility();

  return (
    <>
      {shouldShowHeader && <Header />}
      <ToasterContext />
      {children}
    </>
  );
}
