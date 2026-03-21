import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import {
  Header,
  HeaderLogo,
  HeaderLogoBadge,
  HeaderNav,
  HeaderNavLinks,
} from "@/components/header";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/seo";
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
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Header>
          <HeaderLogo asChild>
            <Link href="/">
              <HeaderLogoBadge>jd</HeaderLogoBadge>
              <span className="text-base font-semibold">jimdrury</span>
            </Link>
          </HeaderLogo>
          <HeaderNav>
            <Suspense>
              <HeaderNavLinks />
            </Suspense>
          </HeaderNav>
        </Header>
        <div className="-mt-16">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
