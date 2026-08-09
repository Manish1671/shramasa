import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Outfit } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Shramasa | Premium Skincare & Haircare",
    template: "%s | Shramasa",
  },
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
    type: "website",
    locale: "en_IN",
    siteName: "Shramasa",
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
      className={`${outfit.variable} ${cormorant.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AnnouncementBar />
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <ConditionalFooter>
          <Footer />
        </ConditionalFooter>
      </body>
    </html>
  );
}
