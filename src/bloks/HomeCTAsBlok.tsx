import "server-only";
import Link from "next/link";
import type { FC } from "react";
import { Button } from "@/components/button";
import { getSafeHref } from "@/lib/assert-safe-href";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

const DEFAULT_PRIMARY_URL = "/blog";
const DEFAULT_SECONDARY_URL = "/about";

type HomeCTAsBlokData = SbBlokData & {
  primary_label?: string;
  primary_url?: string;
  secondary_label?: string;
  secondary_url?: string;
};

type HomeCTAsBlokProps = {
  blok: HomeCTAsBlokData;
};

export const HomeCTAsBlok: FC<HomeCTAsBlokProps> = ({ blok }) => {
  const primaryLabel = blok.primary_label || "Read the blog";
  const primaryUrl = getSafeHref(blok.primary_url) ?? DEFAULT_PRIMARY_URL;
  const secondaryLabel = blok.secondary_label || "About";
  const secondaryUrl = getSafeHref(blok.secondary_url) ?? DEFAULT_SECONDARY_URL;

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-[var(--bg-primary)] py-8 md:py-10"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <div className="flex flex-wrap gap-4">
          <Button variant="highlight" asChild>
            <Link href={primaryUrl}>{primaryLabel}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={secondaryUrl}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
