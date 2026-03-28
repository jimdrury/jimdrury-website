import "server-only";
import type { FC } from "react";
import { cn } from "@/lib/utils";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import { BlokRenderer } from "@/storyblok/renderer";

type VerticalSpacingSize = "xs" | "sm" | "md" | "lg" | "xl";

type VerticalSpacingBlokData = SbBlokData & {
  size?: VerticalSpacingSize;
  body?: SbBlokData[];
};

type VerticalSpacingBlokProps = {
  blok: VerticalSpacingBlokData;
};

const spacerHeightClasses: Record<VerticalSpacingSize, string> = {
  xs: "h-2",
  sm: "h-4",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
};

export const VerticalSpacingBlok: FC<VerticalSpacingBlokProps> = ({ blok }) => {
  const size = blok.size ?? "md";
  const hasBody = (blok.body?.length ?? 0) > 0;

  if (!hasBody) {
    return (
      <div
        {...storyblokEditable(blok)}
        className={cn("w-full", spacerHeightClasses[size])}
        aria-hidden="true"
      />
    );
  }

  return (
    <section {...storyblokEditable(blok)} className={cn("w-full space-y-4")}>
      <div className={spacerHeightClasses[size]} aria-hidden="true" />
      {blok.body?.map((nestedBlok) => (
        <BlokRenderer blok={nestedBlok} key={nestedBlok._uid} />
      ))}
      <div className={spacerHeightClasses[size]} aria-hidden="true" />
    </section>
  );
};
