import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "ArenaStream — Watch Live Sports Anywhere",
  description:
    "Stream live football, basketball, tennis, MMA, F1, and more. Never miss a match with ArenaStream.",
  keywords: ["sports streaming", "live sports", "football", "basketball", "MMA", "F1"],
  openGraph: {
    title: "ArenaStream — Watch Live Sports Anywhere",
    description: "Stream live football, basketball, tennis, MMA, F1, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}