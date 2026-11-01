import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig, siteUrl } from "@/data/site";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteUrl()}feed.xml` },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — Portfolio`,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.tagline,
    images: [{ url: "/og/site.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.tagline,
    images: ["/og/site.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080F" },
    { media: "(prefers-color-scheme: light)", color: "#F5F6FB" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      description: siteConfig.tagline,
      url: siteConfig.url,
      email: `mailto:${siteConfig.email}`,
      sameAs: siteConfig.socials.map((social) => social.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: `${siteConfig.name} — Portfolio`,
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body>
        {/* Liquid-glass backdrop: vivid drifting mesh the glass refracts */}
        <div aria-hidden className="bg-mesh" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <PageTransition>
            <main id="main">{children}</main>
            <Footer />
          </PageTransition>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
