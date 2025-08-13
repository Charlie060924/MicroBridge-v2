"use client";

import Header from "../../components/common/Header";
import ToasterContext from "../context/ToastContext";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ToasterContext />
      {children}
    </>
  );
}
