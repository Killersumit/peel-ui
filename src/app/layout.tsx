import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const siteConfig = {
  name: "Peel UI",
  title: "Peel UI — Tactile Motion Primitives for React",
  description:
    "Tactile, hardware-grade motion primitives for React and Tailwind CSS. Damped kinematic spring physics, magnetic detents, and real-time audio FFT telemetry.",
  url: "https://peelui.com",
  ogImage: "https://peelui.com/og.png",
  twitterHandle: "@Sumit1476136",
  creator: "Sumit (@Killersumit)",
};

// Vercel Web Guidelines: Dedicated Viewport Export
export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Never disable user zoom
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Sumit", url: "https://x.com/Sumit1476136" }],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  keywords: [
    "React motion primitives",
    "Tailwind CSS components",
    "shadcn registry",
    "kinematic spring physics",
    "hardware UI",
    "tactile components",
    "Web Audio visualizer",
    "Voice Pill React",
    "Peel Card React",
    "Next.js 15 UI library",
  ],
  alternates: {
    canonical: siteConfig.url,
    types: {
      "text/plain": `${siteConfig.url}/llms.txt`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Peel UI — Tactile Motion Primitives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/peeluiicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/peeluiicon.svg",
    apple: "/peeluiicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <JsonLd type="website" />
      </head>
      <body className="min-h-screen bg-[#08090a] text-[#f5f5f7] selection:bg-[#84ff00] selection:text-black">
        {/* Skip to Content Link (Vercel Accessibility Guideline) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#84ff00] focus:text-black focus:font-mono focus:text-xs"
        >
          Skip to content
        </a>

        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
