import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZJ Store - Buy & Sell Anything",
  description:
    "Premium marketplace to buy and sell anything. Secure, fast, and quality assured by ZJ Tech Solutions. Find products, services, and more.",
  keywords: [
    "ZJ Store",
    "marketplace",
    "buy",
    "sell",
    "e-commerce",
    "ZJ Tech Solutions",
    "online shopping",
    "Pakistan",
    "products",
    "services",
  ],
  authors: [{ name: "ZJ Tech Solutions", url: "https://zjtech.com" }],
  creator: "ZJ Tech Solutions",
  openGraph: {
    title: "ZJ Store - Buy & Sell Anything",
    description:
      "Premium marketplace to buy and sell anything. Secure, fast, and quality assured by ZJ Tech Solutions.",
    type: "website",
    siteName: "ZJ Store",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZJ Store - Buy & Sell Anything",
    description:
      "Premium marketplace to buy and sell anything. Secure, fast, and quality assured.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#06001a] text-white`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#120033",
              border: "1px solid rgba(167, 139, 250, 0.35)",
              color: "#ffffff",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.15)",
            },
          }}
        />
      </body>
    </html>
  );
}
