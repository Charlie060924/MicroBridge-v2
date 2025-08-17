"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from "next-themes";
import { LevelProvider } from "./context/LevelContext";
import { MockAccountProvider } from "@/context/MockAccountContext";
import ScrollToTop from "@/components/common/ScrollToTop";
import AchievementPopup from "@/components/common/Level/AchievementPopup";
import UserRoleSwitcher from "@/components/common/UserRoleSwitcher";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
