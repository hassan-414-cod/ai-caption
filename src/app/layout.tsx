import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import { MouseGlow, AnimatedDivider } from "../components/animations";
import Link from 'next/link';

const dosis = Dosis({ 
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-dosis',
});

export const metadata: Metadata = {
  title: "CaptionAI",
  description: "AI-Powered Social Media Caption Generator",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={dosis.variable}>
      <body suppressHydrationWarning className={`${dosis.className} min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative w-full`}>
        <Providers>
          <MouseGlow />
          <Navigation />
          
          <main className="flex-1 flex flex-col items-center w-full">
            {children}
          </main>
          
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
