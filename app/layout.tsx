import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { JsonLd } from "@/components/shared/json-ld";
import { THEME_STORAGE_KEY } from "@/lib/registry";
import Script from "next/script";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  siteJsonLd,
} from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "وایب‌فارسی",
    "VibeFarsi",
    "کامپوننت فارسی",
    "راست‌چین",
    "RTL",
    "React",
    "Next.js",
    "تقویم شمسی",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  manifest: "/icons/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

// Applies a saved design system before first paint (see Next.js "preventing flash" guide).
// Full-page previews (/preview/*, /sandbox) also get data-ds, so the whole design
// language applies there; elsewhere the site chrome only takes the colors.
const themeScript = `(function(){try{var d=document.documentElement;if(/^\\/(preview|sandbox)(\\/|$)/.test(location.pathname))d.setAttribute("data-ds","");var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t&&t!=="graphite")d.setAttribute("data-theme",t);else d.removeAttribute("data-theme")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fontVariables} h-full max-w-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full w-full max-w-full flex-col bg-background font-sans text-foreground">
        <JsonLd data={siteJsonLd()} />
        {children}
        <Script
          src="https://didbanam.neda1.paasta.app/js/script.js"
          data-site="82mhz2ku62"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
