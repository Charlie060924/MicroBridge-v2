"use client";

import Header from "@/components/common/Header/index";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudentPortal = pathname?.startsWith('/student_portal');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          {!isStudentPortal && <Header />}
          <ToasterContext />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}