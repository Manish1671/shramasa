import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shramasa | Premium Skincare & Haircare",
  description:
    "Discover premium skincare, haircare, and personal care products crafted with high-quality ingredients for healthy skin and beautiful hair.",
  applicationName: "Shramasa",
  keywords: [
    "Skincare",
    "Haircare",
    "Cosmetics",
    "Face Wash",
    "Serum",
    "Sunscreen",
    "Hair Oil",
    "Shampoo",
    "Moisturizer",
    "India",
  ],
  authors: [{ name: "Shramasa" }],
  robots: "index, follow",
  openGraph: {
    title: "Shramasa | Premium Skincare & Haircare",
    description:
      "Discover premium skincare, haircare, and personal care products crafted with high-quality ingredients for healthy skin and beautiful hair.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shramasa | Premium Skincare & Haircare",
    description:
      "Discover premium skincare, haircare, and personal care products crafted with high-quality ingredients for healthy skin and beautiful hair.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnnouncementBar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
