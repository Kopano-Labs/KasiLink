import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KasiLink — Township Gigs & Opportunities",
    template: "%s | KasiLink",
  },
  description:
    "Connecting unemployed youth and job seekers in South African townships (especially Cape Town) with nearby gigs — car washes, tutoring, cleaning, repairs, deliveries, handyman work.",
  keywords: [
    "kasilink",
    "township jobs",
    "gauteng gigs",
    "south africa jobs",
    "informal economy",
    "kasi",
  ],
  authors: [{ name: "KasiLink" }],
  creator: "KasiLink",
  metadataBase: new URL("https://kasilink.com"),
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://kasilink.com",
    siteName: "KasiLink",
    title: "KasiLink — Township Gigs & Opportunities",
    description:
      "Find nearby gigs and connect with job seekers in your township. South Africa's community-first job platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KasiLink",
    description: "Township gigs and opportunities in South Africa.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KasiLink",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark" suppressHydrationWarning>
        <body className="bg-background text-on-background font-body antialiased">
          <GoogleAnalytics />
          <ThemeProvider>
            <ServiceWorkerRegistration />
            <Navbar />
            <main className="page-content">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
