import type { Metadata, Viewport } from "next";
import { Source_Serif_4, DM_Sans, Lexend } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KasiLink",
  description: "Find local gigs and services in your kasi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KasiLink",
  },
};

export const viewport: Viewport = {
  themeColor: "#000f1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${sourceSerif.variable} ${dmSans.variable} ${lexend.variable}`}
      >
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />
        </head>
        <body className="min-h-screen bg-background text-foreground font-body antialiased">
          <Navbar />
          <main className="pt-16 pb-24">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
