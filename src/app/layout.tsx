import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FarmPulse — Smart Agri-Weather Dashboard",
  description: "Real-time weather intelligence and AI-powered farm analytics for modern agriculture",
  keywords: ["agriculture", "weather", "farming", "AI", "dashboard"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmPulse",
  },
};

export const viewport: Viewport = {
  themeColor: "#2d8a50",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
