import "server-only";

import type { FC, ReactNode } from "react";

import {
  ContentBandBodyRegion,
  type ContentBandContentLayout,
  ContentBandHeaderRow,
  ContentBandInner,
  ContentBandSurface,
} from "@/components/content-band";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type Background =
  | "none"
  | "primary"
  | "secondary"
  | "accent_yellow"
  | "accent_orange"
  | "accent_pink"
  | "accent_purple"
  | "accent_blue"
  | "accent_green";

type ContentBandBlokData = SbBlokData & {
  background?: Background;
  heading?: SbBlokData[];
  aside?: SbBlokData[];
  content_layout?: ContentBandContentLayout;
  body?: SbBlokData[];
};

type ContentBandBlokProps = {
  blok: ContentBandBlokData;
};

const backgroundStyles: Record<
  Background,
  { backgroundColor?: string; color?: string }
> = {
  none: {},
  primary: { backgroundColor: "var(--bg-primary)", color: "var(--fg-primary)" },
  secondary: {
    backgroundColor: "var(--bg-secondary)",
    color: "var(--fg-primary)",
  },
  accent_yellow: {
    backgroundColor: "var(--bg-accent-yellow)",
    color: "var(--fg-primary)",
  },
  accent_orange: {
    backgroundColor: "var(--bg-accent-orange)",
    color: "var(--fg-primary)",
  },
  accent_pink: {
    backgroundColor: "var(--bg-accent-pink)",
    color: "var(--fg-primary)",
  },
  accent_purple: {
    backgroundColor: "var(--bg-accent-purple)",
    color: "var(--fg-primary)",
  },
  accent_blue: {
    backgroundColor: "var(--bg-accent-blue)",
    color: "var(--fg-primary)",
  },
  accent_green: {
    backgroundColor: "var(--bg-accent-green)",
    color: "var(--fg-primary)",
  },
};

const mapBloks = (items: SbBlokData[] | undefined): ReactNode => {
  if (!items?.length) {
    return null;
  }

  return items.map((nestedBlok) => (
    <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
  ));
};

export const ContentBandBlok: FC<ContentBandBlokProps> = ({ blok }) => {
  const headingNodes = mapBloks(blok.heading);
  const asideNodes = mapBloks(blok.aside);
  const bodyItems = blok.body ?? [];

  const hasHeader = Boolean(
    (blok.heading?.length ?? 0) > 0 || (blok.aside?.length ?? 0) > 0,
  );
  const hasBody = bodyItems.length > 0;

  if (!hasHeader && !hasBody) {
    return null;
  }

  const background = blok.background ?? "none";
  const contentLayout = blok.content_layout ?? "stack";

  return (
    <ContentBandSurface
      {...storyblokEditable(blok)}
      className="py-[48px] lg:py-[80px]"
      style={backgroundStyles[background]}
    >
      <ContentBandInner>
        <ContentBandHeaderRow heading={headingNodes} aside={asideNodes} />
        {hasBody ? (
          <ContentBandBodyRegion contentLayout={contentLayout}>
            {bodyItems.map((nestedBlok) => (
              <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </ContentBandBodyRegion>
        ) : null}
      </ContentBandInner>
    </ContentBandSurface>
  );
};
