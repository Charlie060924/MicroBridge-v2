"use client";

import Header from "../../components/common/Header";
import LandingNavigation from "../../components/common/LandingNavigation";
import ToasterContext from "../context/ToastContext";
import { PreviewModeProvider } from "../../context/PreviewModeContext";
import PreviewBanner from "../../components/common/PreviewBanner";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreviewModeProvider>
      <Header />
      <LandingNavigation />
      <PreviewBanner />
      <ToasterContext />
      {children}
    </PreviewModeProvider>
  );
}
