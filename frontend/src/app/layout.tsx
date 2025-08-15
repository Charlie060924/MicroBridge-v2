"use client";//landing page layout

import ScrollToTop from "@/components/common/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { LevelProvider } from "./context/LevelContext";
import { MockAccountProvider } from "@/context/MockAccountContext";
import AchievementPopup from "@/components/common/Level/AchievementPopup";
import UserRoleSwitcher from "@/components/common/UserRoleSwitcher";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <MockAccountProvider>
            <LevelProvider>
              {children}
              <ScrollToTop />
              <AchievementPopup achievement={null} />
              <UserRoleSwitcher />
            </LevelProvider>
          </MockAccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 