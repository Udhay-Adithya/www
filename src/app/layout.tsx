import type { Metadata } from "next";
import { Inter, Petemoss } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/homepage/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const petemoss = Petemoss({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-petemoss",
});


export const metadata: Metadata = {
  title: "ua.me/",
  description: "my personal website",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192'
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${petemoss.variable}`}>
      <body className={`antialiased flex min-h-dvh flex-col ${inter.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
