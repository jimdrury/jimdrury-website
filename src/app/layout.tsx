import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  Anton,
  Geist,
  Geist_Mono,
  Inter,
  Patrick_Hand,
} from "next/font/google";
import { draftMode } from "next/headers";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { DraftModeRefresh } from "@/components/draft-mode-refresh";
import { SiteFooter } from "@/components/footer";
import {
  Header,
  HeaderLogo,
  HeaderNav,
  HeaderNavLinks,
} from "@/components/header";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  weight: "400",
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

const getCurrentYear = async () => {
  "use cache";
  return new Date().getUTCFullYear();
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [draftState] = await Promise.all([draftMode()]);
  const { isEnabled } = draftState;
  const currentYear = await getCurrentYear();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Header>
          <HeaderLogo asChild>
            <Link href="/">JIMDRURY.</Link>
          </HeaderLogo>
          <HeaderNav>
            <Suspense>
              <HeaderNavLinks />
            </Suspense>
          </HeaderNav>
        </Header>
        <main className="flex-1">{children}</main>
        <SiteFooter currentYear={currentYear} />
        <DraftModeRefresh isEnabled={isEnabled} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
