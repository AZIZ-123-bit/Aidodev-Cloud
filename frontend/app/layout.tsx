import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartTravelAI — AI-Powered Trip Planner",
  description:
    "Plan, organize, and optimize your travels with artificial intelligence. Personalized itineraries, smart recommendations, and real-time assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white min-h-screen grain`}
      >
        {children}
      </body>
    </html>
  );
}
