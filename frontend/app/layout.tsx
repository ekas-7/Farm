import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AgriGet — Fresh Crops Direct from Punjab Farmers",
  description: "AgriGet connects Punjab farmers with businesses and consumers. Buy fresh produce in bulk for your MSME or order retail. No middlemen, always fresh.",
  icons: {
    icon: "/agriget-logo.png",
  },
  openGraph: {
    title: "AgriGet — Fresh Crops Direct from Punjab Farmers",
    description: "Buy farm-fresh produce directly from Punjab farmers. Bulk orders for MSMEs, retail for everyone. No middlemen, best prices, WhatsApp enabled.",
    url: "https://agriget.vercel.app",
    siteName: "AgriGet",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80&fit=crop",
        width: 1200,
        height: 630,
        alt: "AgriGet — Fresh farm produce from Punjab",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriGet — Fresh Crops Direct from Punjab Farmers",
    description: "Buy farm-fresh produce directly from Punjab farmers. Bulk orders for MSMEs, retail for everyone. No middlemen, best prices.",
    images: ["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80&fit=crop"],
  },
  metadataBase: new URL("https://agriget.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
