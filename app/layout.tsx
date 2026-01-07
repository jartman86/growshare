import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowShare - Agricultural Engagement Ecosystem",
  description: "Transform land into opportunity. Connect landowners with growers, build community, and grow food together.",
  keywords: ["agriculture", "land rental", "farming", "community garden", "sustainable agriculture", "local food"],
  authors: [{ name: "GrowShare" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "GrowShare",
    title: "GrowShare - Agricultural Engagement Ecosystem",
    description: "Connect landowners with growers and build thriving food communities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
