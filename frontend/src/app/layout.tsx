import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'MicroBridge - Micro-Internship Platform',
    template: '%s | MicroBridge'
  },
  description: 'Connect students with micro-internship opportunities. Find short-term projects that match your skills and help you gain real-world experience.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
} 