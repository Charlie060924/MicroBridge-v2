"use client";//landing page layout

import Header from "@/components/common/Header";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { LevelProvider } from "./context/LevelContext";
import AchievementPopup from "@/components/common/Level/AchievementPopup";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudentPortal = pathname?.startsWith('/student_portal');
  const shouldShowHeader = useHeaderVisibility();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <LevelProvider>
            {!isStudentPortal && shouldShowHeader && <Header />}
            {children}
            <ScrollToTop />
            <AchievementPopup achievement={null} />
          </LevelProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 