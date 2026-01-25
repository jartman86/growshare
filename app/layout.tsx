import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/lib/theme-context'
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://growshare.co'),
  title: "GrowShare - Agricultural Engagement Ecosystem",
  description: "Transform land into opportunity. Connect landowners with growers, build community, and grow food together.",
  keywords: ["agriculture", "land rental", "farming", "community garden", "sustainable agriculture", "local food"],
  authors: [{ name: "GrowShare" }],
  icons: {
    icon: "/growshare-logo.png",
    shortcut: "/growshare-logo.png",
    apple: "/growshare-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "GrowShare",
    title: "GrowShare - Agricultural Engagement Ecosystem",
    description: "Connect landowners with growers and build thriving food communities",
    images: ["/growshare-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
