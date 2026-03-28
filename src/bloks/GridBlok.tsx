import "server-only";
import type { FC } from "react";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type GridGap = "none" | "sm" | "md" | "lg" | "xl";

type GridBlokData = SbBlokData & {
  items?: SbBlokData[];
  columns?: SbBlokData[];
  gap?: GridGap;
};

type GridBlokProps = {
  blok: GridBlokData;
};

const gapValues: Record<GridGap, string> = {
  none: "0",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

export const GridBlok: FC<GridBlokProps> = ({ blok }) => {
  const items = blok.items ?? blok.columns ?? [];
  const gap = blok.gap ?? "md";

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      {...storyblokEditable(blok)}
      className="grid grid-cols-12"
      style={{ gap: gapValues[gap] }}
    >
      {items.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};
